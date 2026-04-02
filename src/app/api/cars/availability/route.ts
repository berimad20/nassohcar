import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Check car availability for date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const carId = searchParams.get('carId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!carId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'carId, startDate, and endDate are required' },
        { status: 400 }
      )
    }

    // Get car with its quantity
    const car = await prisma.car.findUnique({
      where: { id: carId }
    })

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }

    if (!car.available) {
      return NextResponse.json({
        available: false,
        availableQuantity: 0,
        totalQuantity: car.quantity,
        reason: 'Car is not available for booking'
      })
    }

    // Count overlapping bookings for the requested date range using sweep-line
    // Apply 3-hour buffer: a car can't be booked until 3h after its previous return
    const threeHoursMs = 3 * 60 * 60 * 1000
    const startMinusBuffer = new Date(new Date(startDate).getTime() - threeHoursMs)
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        carId: carId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        AND: [
          { startDate: { lt: new Date(endDate) } },
          { endDate: { gt: startMinusBuffer } }
        ]
      }
    })

    // Sweep line algorithm to find the maximum concurrent bookings
    let maxConcurrent = 0;
    const events: { time: number, type: number }[] = [];
    
    for (const b of overlappingBookings) {
      events.push({ time: b.startDate.getTime(), type: 1 });  // Car picked up (+1)
      events.push({ time: b.endDate.getTime(), type: -1 });   // Car returned (-1)
    }
    
    // Sort by time; if times match, process returns (-1) before pickups (+1)
    events.sort((a, b) => a.time - b.time || a.type - b.type);
    
    let currentConcurrent = 0;
    for (const event of events) {
      currentConcurrent += event.type;
      if (currentConcurrent > maxConcurrent) {
        maxConcurrent = currentConcurrent;
      }
    }

    const availableQuantity = car.quantity - maxConcurrent
    const isAvailable = availableQuantity > 0

    return NextResponse.json({
      available: isAvailable,
      availableQuantity: Math.max(0, availableQuantity),
      totalQuantity: car.quantity,
      reason: isAvailable ? undefined : 'Car is fully booked for these dates'
    })

  } catch (error) {
    console.error('Car availability check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Check availability for multiple cars
export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate, carIds } = await request.json()

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      )
    }

    // If no specific car IDs provided, check all cars
    const whereClause = carIds && carIds.length > 0 
      ? { id: { in: carIds }, available: true }
      : { available: true }

    // Single query: fetch all cars + all overlapping bookings at once
    const threeHoursMs = 3 * 60 * 60 * 1000
    const startMinusBuffer = new Date(new Date(startDate).getTime() - threeHoursMs)

    const [cars, allOverlappingBookings] = await Promise.all([
      prisma.car.findMany({ where: whereClause, select: { id: true, name: true, brand: true, model: true, year: true, category: true, transmission: true, fuelType: true, seats: true, pricePerDay: true, shortTermPricePerDay: true, image: true, quantity: true, available: true } }),
      prisma.booking.findMany({
        where: {
          status: { in: ['PENDING', 'CONFIRMED'] },
          startDate: { lt: new Date(endDate) },
          endDate: { gt: startMinusBuffer },
          ...(carIds && carIds.length > 0 ? { carId: { in: carIds } } : {})
        },
        select: { carId: true, startDate: true, endDate: true }
      })
    ])

    // Group bookings by carId in memory
    const bookingsByCarId = new Map<string, { startDate: Date; endDate: Date }[]>()
    for (const b of allOverlappingBookings) {
      const list = bookingsByCarId.get(b.carId) ?? []
      list.push({ startDate: b.startDate, endDate: b.endDate })
      bookingsByCarId.set(b.carId, list)
    }

    const carAvailability = cars.map((car) => {
      const bookings = bookingsByCarId.get(car.id) ?? []
      const events: { time: number; type: number }[] = []
      for (const b of bookings) {
        events.push({ time: b.startDate.getTime(), type: 1 })
        events.push({ time: b.endDate.getTime(), type: -1 })
      }
      events.sort((a, b) => a.time - b.time || a.type - b.type)
      let maxConcurrent = 0, current = 0
      for (const e of events) { current += e.type; if (current > maxConcurrent) maxConcurrent = current }
      const availableQuantity = car.quantity - maxConcurrent
      return { ...car, availableQuantity: Math.max(0, availableQuantity), bookedQuantity: maxConcurrent, isAvailable: availableQuantity > 0 }
    })

    // Filter to only return available cars
    const availableCars = carAvailability.filter(car => car.isAvailable)

    return NextResponse.json({
      cars: availableCars,
      totalCars: cars.length,
      availableCars: availableCars.length
    })

  } catch (error) {
    console.error('Multiple cars availability check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}