import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma, BookingStatus } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Helper function to verify admin access
async function verifyAdminAccess(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return { error: 'No token provided', status: 401 }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string }
    
    if (!decoded || !decoded.userId) {
      return { error: 'Invalid token', status: 401 }
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return { error: 'Admin access required', status: 403 }
    }

    return { user }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return { error: 'Invalid token', status: 401, message: message }
  }
}

// GET /api/admin/bookings - Get all bookings with filters
export async function GET(request: NextRequest) {
  const verification = await verifyAdminAccess(request)
  if (verification.error) {
    return NextResponse.json({ error: verification.error }, { status: verification.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')
    const status = statusParam && Object.values(BookingStatus).includes(statusParam as BookingStatus) ? (statusParam as BookingStatus) : undefined
    const userId = searchParams.get('userId')
    const carId = searchParams.get('carId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const archived = searchParams.get('archived')
    const startDateFrom = searchParams.get('startDateFrom')
    const startDateTo = searchParams.get('startDateTo')
    const pickupLocation = searchParams.get('pickupLocation')

    const now = new Date()
    const and: Prisma.BookingWhereInput[] = []

    // Tab condition — scoped by status + date when status dropdown is also active
    if (archived === 'true') {
      if (status === 'CANCELLED') {
        and.push({ status: 'CANCELLED' })
      } else if (status === 'COMPLETED') {
        and.push({ OR: [{ status: 'COMPLETED' }, { status: 'CONFIRMED', endDate: { lt: now } }] })
      } else {
        and.push({ OR: [{ status: { in: ['COMPLETED', 'CANCELLED'] } }, { status: 'CONFIRMED', endDate: { lt: now } }] })
      }
    } else if (archived === 'false') {
      if (status === 'PENDING') {
        and.push({ status: 'PENDING' })
      } else if (status === 'CONFIRMED') {
        and.push({ status: 'CONFIRMED', endDate: { gte: now } })
      } else {
        and.push({ OR: [{ status: 'PENDING' }, { status: 'CONFIRMED', endDate: { gte: now } }] })
      }
    } else if (status) {
      and.push({ status: status as BookingStatus })
    }

    if (userId) and.push({ userId })
    if (carId) and.push({ carId })
    if (pickupLocation) and.push({ pickupLocation })
    if (startDateFrom || startDateTo) {
      and.push({
        startDate: {
          ...(startDateFrom ? { gte: new Date(startDateFrom) } : {}),
          ...(startDateTo ? { lte: new Date(startDateTo + 'T23:59:59') } : {})
        }
      })
    }
    if (search) {
      and.push({
        OR: [
          { guestName: { contains: search, mode: 'insensitive' } },
          { guestEmail: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { car: { brand: { contains: search, mode: 'insensitive' } } },
          { car: { model: { contains: search, mode: 'insensitive' } } }
        ]
      })
    }

    const where: Prisma.BookingWhereInput = and.length > 0 ? { AND: and } : {}

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          car: {
            select: {
              id: true,
              brand: true,  // Changed from 'make' to 'brand'
              model: true,
              year: true,
              image: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ])

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching bookings:', err)
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch bookings', message: message },
      { status: 500 }
    )
  }
}