'use client'

import { useState, useEffect } from 'react'
import { X, Car, Calendar, MapPin, User, Users, Settings, Fuel, Clock, Plane } from 'lucide-react'
import Image from 'next/image'
import { api, getAuthToken } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useBooking } from '@/contexts/BookingContext'
import BookingConfirmationPopup from './BookingConfirmationPopup'
import PhoneInput from './PhoneInput'
import { calculateTotalPriceForRange } from '@/lib/pricing'

interface Car {
  id: string
  name: string
  brand: string
  model: string
  pricePerDay: number
  shortTermPricePerDay?: number | null
  category: string
  transmission: string
  fuelType: string
  seats: number
  image?: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  car: Car | null
  lang?: 'fr' | 'en' | 'es'
}

const AIRPORT_LOCATIONS = ['tangier-airport']
const LOCATION_CONDITIONS: Record<string, { minDays: number; extraFeePerTrip?: number; message: Record<string, string> }> = {
  'tangier-airport': {
    minDays: 5,
    message: {
      fr: 'La location à l\'Aéroport de Tanger nécessite un minimum de 5 jours.',
      en: 'Rental at Tangier Airport requires a minimum of 5 days.',
      es: 'El alquiler en el Aeropuerto de Tánger requiere un mínimo de 5 días.'
    }
  },
  'tangier-med': {
    minDays: 10,
    extraFeePerTrip: 300,
    message: {
      fr: 'La location au Port Tanger Med nécessite un minimum de 10 jours. Veuillez sélectionner au moins 10 jours.',
      en: 'Rental at Tanger Med Port requires a minimum of 10 days. Please select at least 10 days.',
      es: 'El alquiler en el Puerto Tanger Med requiere un mínimo de 10 días. Por favor, seleccione al menos 10 días.'
    }
  },
  'tetouan': {
    minDays: 10,
    extraFeePerTrip: 400,
    message: {
      fr: 'La location à Tétouan nécessite un minimum de 10 jours. Veuillez sélectionner au moins 10 jours.',
      en: 'Rental in Tetouan requires a minimum of 10 days. Please select at least 10 days.',
      es: 'El alquiler en Tetuán requiere un mínimo de 10 días. Por favor, seleccione al menos 10 días.'
    }
  }
}

export default function BookingModal({ isOpen, onClose, car, lang = 'fr' }: BookingModalProps) {
  const { user } = useAuth()
  const { bookingData } = useBooking()
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    startDate: '',
    startTime: '10:00',
    endDate: '',
    endTime: '10:00',
    additionalNotes: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    childSeatOption: '',
    flightNumber: ''
  })
  const [bookingMode, setBookingMode] = useState<'auth' | 'guest'>('auth')

  // Pre-fill form with saved booking data
  useEffect(() => {
    if (bookingData.pickupLocation || bookingData.startDate || bookingData.endDate) {
      setFormData(prev => ({
        ...prev,
        pickupLocation: bookingData.pickupLocation || prev.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation || prev.dropoffLocation,
        startDate: bookingData.startDate || prev.startDate,
        endDate: bookingData.endDate || prev.endDate
      }))
    }
  }, [bookingData])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [confirmationData, setConfirmationData] = useState<{ bookingId: string; totalPrice: number } | null>(null)
  const [suggestedCars, setSuggestedCars] = useState<Car[]>([])
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const locations = {
    fr: [
      { value: 'tangier-airport', label: 'Aéroport de Tanger Ibn Battouta' },
      { value: 'tangier-port', label: 'Port de Tanger Ville' },
      { value: 'tangier-med', label: 'Port Tanger Med' },
      { value: 'tangier-train', label: 'Gare de Tanger' },
      { value: 'tetouan', label: 'Centre-ville de Tétouan' },
      { value: 'nassoh-agency', label: 'Agence Nassoh Car' },
      { value: 'hotel-delivery', label: "Livraison à l'hôtel" }
    ],
    en: [
      { value: 'tangier-airport', label: 'Tangier Ibn Battouta Airport' },
      { value: 'tangier-port', label: 'Tangier City Port' },
      { value: 'tangier-med', label: 'Tanger Med Port' },
      { value: 'tangier-train', label: 'Tangier Train Station' },
      { value: 'tetouan', label: 'Tetouan City Center' },
      { value: 'nassoh-agency', label: 'Nassoh Car Agency' },
      { value: 'hotel-delivery', label: 'Hotel Delivery' }
    ],
    es: [
      { value: 'tangier-airport', label: 'Aeropuerto de Tánger Ibn Battouta' },
      { value: 'tangier-port', label: 'Puerto de Tánger Ville' },
      { value: 'tangier-med', label: 'Puerto Tanger Med' },
      { value: 'tangier-train', label: 'Estación de tren de Tánger' },
      { value: 'tetouan', label: 'Centro de la ciudad de Tetuán' },
      { value: 'nassoh-agency', label: 'Agencia Nassoh Car' },
      { value: 'hotel-delivery', label: 'Entrega en el hotel' }
    ]
  }[lang]

  const translations = {
    fr: {
      title: 'Réservez Votre Voiture',
      subtitle: 'Complétez les détails de votre réservation',
      from: 'à partir de',
      perDay: 'par jour',
      seats: 'Places',
      rentalDuration: 'Location',
      day: 'jour',
      days: 'jours',
      tripSurcharge: 'Supplément trajet',
      estimatedTotal: 'Total Estimé',
      chooseOption: 'Choisissez votre option de réservation',
      loginPrompt: 'Connectez-vous pour des réservations plus rapides ou continuez en tant qu\'invité.',
      loginBtn: 'Connexion',
      registerBtn: 'S\'inscrire',
      or: 'ou',
      guestBtn: 'Continuer en tant qu\'invité',
      pickupDate: 'Date & Heure de Prise en Charge',
      dropoffDate: 'Date & Heure de Retour',
      pickupLoc: 'Lieu de Prise en Charge',
      selectLoc: 'Sélectionner un lieu',
      dropoffLoc: 'Lieu de Retour (Optionnel)',
      sameLoc: 'Même lieu que la prise en charge',
      flightNum: 'Numéro de Vol (Optionnel)',
      flightPlaceholder: 'Ex: AT 101',
      guestInfo: 'Informations Invité',
      backToLogin: '← Retour aux options de connexion',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      phone: 'Numéro de téléphone',
      phonePlaceholder: 'Entrez votre numéro de téléphone',
      childSeat: 'Siège Enfant (Optionnel)',
      noSeat: 'Aucun siège enfant',
      infantSeat: 'Siège enfant 1 an (cosy / siège bébé)',
      childSeatOpt: 'Siège enfant 3 ans (siège auto)',
      boosterSeat: 'Réhausseur (enfant plus grand)',
      additionalNotes: 'Notes Supplémentaires (Optionnel)',
      cancelBtn: 'Annuler',
      confirmBtn: 'Confirmer la Réservation',
      confirmingBtn: 'Confirmation...',
      errLoginRequired: 'Veuillez vous connecter pour effectuer une réservation.',
      errGuestInfo: 'Veuillez remplir tous les champs d\'informations invité.',
      errMissingCar: 'Les informations de la voiture sont manquantes.',
      errMissingDates: 'Veuillez sélectionner les dates de début et de fin.',
      errInvalidDates: 'La date de fin doit être après la date de début.',
      errBookingFailed: 'Échec de la réservation. Veuillez réessayer.',
      errAuthRequired: 'Authentification requise. Veuillez vous reconnecter.',
      surchargeMessage: 'Supplément de {fee} DH par trajet pour {loc}.',
      carNotAvailable: 'Cette voiture n\'est pas disponible pour les dates sélectionnées.',
      suggestedCars: 'Voitures disponibles suggérées :',
      bookThisCar: 'Réserver cette voiture',
      searchingAvailability: 'Recherche de véhicules disponibles...',
      noAvailableCars: 'Aucun autre véhicule n\'est disponible pour ces dates. Veuillez sélectionner d\'autres dates.'
    },
    en: {
      title: 'Book Your Car',
      subtitle: 'Complete your booking details',
      from: 'from',
      perDay: 'per day',
      seats: 'Seats',
      rentalDuration: 'Rental',
      day: 'day',
      days: 'days',
      tripSurcharge: 'Trip surcharge',
      estimatedTotal: 'Estimated Total',
      chooseOption: 'Choose your booking option',
      loginPrompt: 'Log in for faster booking or continue as a guest.',
      loginBtn: 'Log In',
      registerBtn: 'Sign Up',
      or: 'or',
      guestBtn: 'Continue as Guest',
      pickupDate: 'Pickup Date & Time',
      dropoffDate: 'Drop-off Date & Time',
      pickupLoc: 'Pickup Location',
      selectLoc: 'Select a location',
      dropoffLoc: 'Drop-off Location (Optional)',
      sameLoc: 'Same as pickup location',
      flightNum: 'Flight Number (Optional)',
      flightPlaceholder: 'Ex: AT 101',
      guestInfo: 'Guest Information',
      backToLogin: '← Back to login options',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      childSeat: 'Child Seat (Optional)',
      noSeat: 'No child seat',
      infantSeat: 'Infant seat (1 year old)',
      childSeatOpt: 'Child seat (3 years old)',
      boosterSeat: 'Booster seat (older child)',
      additionalNotes: 'Additional Notes (Optional)',
      cancelBtn: 'Cancel',
      confirmBtn: 'Confirm Booking',
      confirmingBtn: 'Confirming...',
      errLoginRequired: 'Please log in to make a booking.',
      errGuestInfo: 'Please fill in all guest information fields.',
      errMissingCar: 'Car information is missing.',
      errMissingDates: 'Please select start and end dates.',
      errInvalidDates: 'End date must be after start date.',
      errBookingFailed: 'Booking failed. Please try again.',
      errAuthRequired: 'Authentication required. Please log in again.',
      surchargeMessage: 'Surcharge of {fee} DH per trip for {loc}.',
      carNotAvailable: 'This car is not available for the selected dates.',
      suggestedCars: 'Suggested available cars:',
      bookThisCar: 'Book this car',
      searchingAvailability: 'Searching for available vehicles...',
      noAvailableCars: 'No other vehicles are available for these dates. Please select different dates.'
    },
    es: {
      title: 'Reserva Tu Coche',
      subtitle: 'Completa los detalles de tu reserva',
      from: 'desde',
      perDay: 'por día',
      seats: 'Plazas',
      rentalDuration: 'Alquiler',
      day: 'día',
      days: 'días',
      tripSurcharge: 'Recargo por trayecto',
      estimatedTotal: 'Total Estimado',
      chooseOption: 'Elige tu opción de reserva',
      loginPrompt: 'Inicia sesión para reservas más rápidas o continúa como invitado.',
      loginBtn: 'Iniciar Sesión',
      registerBtn: 'Registrarse',
      or: 'o',
      guestBtn: 'Continuar como Invitado',
      pickupDate: 'Fecha y Hora de Recogida',
      dropoffDate: 'Fecha y Hora de Devolución',
      pickupLoc: 'Lugar de Recogida',
      selectLoc: 'Selecciona un lugar',
      dropoffLoc: 'Lugar de Devolución (Opcional)',
      sameLoc: 'Mismo lugar que la recogida',
      flightNum: 'Número de Vuelo (Opcional)',
      flightPlaceholder: 'Ej: AT 101',
      guestInfo: 'Información del Invitado',
      backToLogin: '← Volver a opciones de inicio de sesión',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Número de teléfono',
      phonePlaceholder: 'Introduce tu número de teléfono',
      childSeat: 'Asiento Infantil (Opcional)',
      noSeat: 'Sin asiento infantil',
      infantSeat: 'Silla de bebé (1 año)',
      childSeatOpt: 'Silla infantil (3 años)',
      boosterSeat: 'Asiento elevador (niño mayor)',
      additionalNotes: 'Notas Adicionales (Opcional)',
      cancelBtn: 'Cancelar',
      confirmBtn: 'Confirmar Reserva',
      confirmingBtn: 'Confirmando...',
      errLoginRequired: 'Por favor, inicia sesión para realizar una reserva.',
      errGuestInfo: 'Por favor, completa todos los campos de información del invitado.',
      errMissingCar: 'Falta información del coche.',
      errMissingDates: 'Por favor, selecciona las fechas de inicio y fin.',
      errInvalidDates: 'La fecha de fin debe ser posterior a la fecha de inicio.',
      errBookingFailed: 'Error en la reserva. Por favor, inténtalo de nuevo.',
      errAuthRequired: 'Autenticación requerida. Por favor, inicia sesión de nuevo.',
      surchargeMessage: 'Recargo de {fee} DH por trayecto para {loc}.',
      carNotAvailable: 'Este coche no está disponible para las fechas seleccionadas.',
      suggestedCars: 'Coches disponibles sugeridos:',
      bookThisCar: 'Reservar este coche',
      searchingAvailability: 'Buscando vehículos disponibles...',
      noAvailableCars: 'No hay otros vehículos disponibles para estas fechas. Por favor, seleccione otras fechas.'
    }
  }

  const t = translations[lang]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Reset suggestions if dates change
    if (name === 'startDate' || name === 'endDate') {
      setSuggestedCars([])
      setShowSuggestions(false)
      setSubmitStatus(null)
    }
  }

  // Determine if flight number field should show
  const showFlightNumber = AIRPORT_LOCATIONS.includes(formData.pickupLocation) || AIRPORT_LOCATIONS.includes(formData.dropoffLocation)

  // Get active location condition for pickup
  const activePickupCondition = LOCATION_CONDITIONS[formData.pickupLocation]

  // Calculate total price based on dates and car
  const calculateTotalPrice = async () => {
    if (!car || !formData.startDate || !formData.endDate) return 0

    const start = new Date(`${formData.startDate}T${formData.startTime}`)
    const end = new Date(`${formData.endDate}T${formData.endTime}`)

    if (start >= end) return 0

    let basePrice = 0
    try {
      basePrice = await calculateTotalPriceForRange(
        car.id,
        start,
        end,
        car.pricePerDay,
        car.shortTermPricePerDay ?? undefined
      )
    } catch (error) {
      console.error('Error calculating price:', error)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      basePrice = days * car.pricePerDay
    }

    return basePrice
  }

  const selectedDays = (() => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(`${formData.startDate}T${formData.startTime}`)
    const end = new Date(`${formData.endDate}T${formData.endTime}`)
    if (start >= end) return 0
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  })()

  // Calculate trip surcharge in DH
  // effectiveDropoff: if no return location is selected, the car is returned to the pickup location (2 agent trips)
  const effectiveDropoffLocation = formData.dropoffLocation || formData.pickupLocation
  const tripSurchargeInDH = (() => {
    let surcharge = 0
    // Trip 1: agent delivers car to pickup location
    if (activePickupCondition?.extraFeePerTrip && selectedDays >= activePickupCondition.minDays) {
      surcharge += activePickupCondition.extraFeePerTrip
    }
    // Trip 2: agent collects car from return location (same as pickup when not explicitly set)
    const dropoffCondition = LOCATION_CONDITIONS[effectiveDropoffLocation]
    if (dropoffCondition?.extraFeePerTrip && selectedDays >= dropoffCondition.minDays) {
      surcharge += dropoffCondition.extraFeePerTrip
    }
    return surcharge
  })()

  const [totalPrice, setTotalPrice] = useState(0)

  const effectivePricePerDay = (() => {
    if (selectedDays > 0 && totalPrice > 0) {
      return Math.round((totalPrice / selectedDays) * 100) / 100
    }
    return car?.pricePerDay ?? 0
  })()

  // Validate location conditions
  const getLocationWarning = (): { text: string; blocking: boolean }[] => {
    const warnings: { text: string; blocking: boolean }[] = []
    const sameReturnLocation = effectiveDropoffLocation === formData.pickupLocation

    const addFeeWarning = (condition: typeof activePickupCondition, locValue: string, trips: number) => {
      if (!condition || !selectedDays) return
      const locLabel = locations.find(l => l.value === locValue)?.label || ''
      if (selectedDays < condition.minDays) {
        warnings.push({ text: condition.message[lang] || condition.message.fr, blocking: true })
      } else if (condition.extraFeePerTrip) {
        const feePerTrip = condition.extraFeePerTrip
        const feePerTripEur = feePerTrip / 10
        const totalDH = feePerTrip * trips
        const totalEur = totalDH / 10
        const info = trips > 1 ? {
          fr: `Un supplément de ${feePerTrip} DH (${feePerTripEur}€) × ${trips} trajets (aller-retour) s'applique pour ${locLabel}. Total : ${totalDH} DH (${totalEur}€).`,
          en: `A surcharge of ${feePerTrip} DH (€${feePerTripEur}) × ${trips} trips (round trip) applies for ${locLabel}. Total: ${totalDH} DH (€${totalEur}).`,
          es: `Se aplica un recargo de ${feePerTrip} DH (${feePerTripEur}€) × ${trips} trayectos (ida y vuelta) para ${locLabel}. Total: ${totalDH} DH (${totalEur}€).`
        } : {
          fr: `Un supplément de ${feePerTrip} DH (${feePerTripEur}€) par trajet s'applique pour ${locLabel}.`,
          en: `A surcharge of ${feePerTrip} DH (€${feePerTripEur}) per trip applies for ${locLabel}.`,
          es: `Se aplica un recargo de ${feePerTrip} DH (${feePerTripEur}€) por trayecto para ${locLabel}.`
        }
        warnings.push({ text: info[lang] || info.fr, blocking: false })
      }
    }

    if (sameReturnLocation) {
      // Pickup and return at the same location — 2 agent trips to that location
      addFeeWarning(activePickupCondition, formData.pickupLocation, 2)
    } else {
      // Different pickup and return locations — check each separately
      addFeeWarning(activePickupCondition, formData.pickupLocation, 1)
      if (formData.dropoffLocation) {
        addFeeWarning(LOCATION_CONDITIONS[formData.dropoffLocation], formData.dropoffLocation, 1)
      }
    }

    return warnings
  }

  const locationWarnings = getLocationWarning()

  // Update total price dependencies
  useEffect(() => {
    const updatePrice = async () => {
      const price = await calculateTotalPrice()
      setTotalPrice(price)
    }
    updatePrice()
  }, [formData.startDate, formData.startTime, formData.endDate, formData.endTime, car, formData.pickupLocation, formData.dropoffLocation, tripSurchargeInDH])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user && bookingMode === 'auth') {
      setSubmitStatus({ type: 'error', message: t.errLoginRequired })
      return
    }

    if (!user && bookingMode === 'guest') {
      if (!formData.guestName || !formData.guestEmail || !formData.guestPhone) {
        setSubmitStatus({ type: 'error', message: t.errGuestInfo })
        return
      }
    }

    if (!car) {
      setSubmitStatus({ type: 'error', message: t.errMissingCar })
      return
    }

    if (!formData.startDate || !formData.endDate) {
      setSubmitStatus({ type: 'error', message: t.errMissingDates })
      return
    }

    const start = new Date(`${formData.startDate}T${formData.startTime}`)
    const end = new Date(`${formData.endDate}T${formData.endTime}`)

    if (start >= end) {
      setSubmitStatus({ type: 'error', message: t.errInvalidDates })
      return
    }

    // Validate location conditions — block if under minimum days
    if (activePickupCondition && selectedDays < activePickupCondition.minDays) {
      setSubmitStatus({ type: 'error', message: activePickupCondition.message[lang] || activePickupCondition.message.fr })
      return
    }

    if (formData.dropoffLocation) {
      const dropoffCondition = LOCATION_CONDITIONS[formData.dropoffLocation]
      if (dropoffCondition && selectedDays < dropoffCondition.minDays) {
        setSubmitStatus({ type: 'error', message: dropoffCondition.message[lang] || dropoffCondition.message.fr })
        return
      }
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const notesParts: string[] = []
      if (formData.additionalNotes?.trim()) notesParts.push(formData.additionalNotes.trim())
      if (formData.childSeatOption) {
        const seatLabels: Record<string, string> = {
          'infant': 'Siège enfant 1 an demandé',
          'child': 'Siège enfant 3 ans demandé',
          'booster': 'Réhausseur demandé'
        }
        notesParts.push(seatLabels[formData.childSeatOption] || formData.childSeatOption)
      }
      const combinedNotes = notesParts.join(' | ')

      // Start fetching suggestions in parallel with the booking attempt
      const suggestionsPromise = fetch('/api/cars/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: start.toISOString(), endDate: end.toISOString() })
      })

      let response
      if (user) {
        const token = getAuthToken()
        if (!token) {
          setSubmitStatus({ type: 'error', message: t.errAuthRequired })
          return
        }

        const bookingPayload = {
          carId: selectedCarForBookingId || car.id,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation || formData.pickupLocation,
          additionalNotes: combinedNotes || undefined,
          flightNumber: formData.flightNumber?.trim() || undefined
        }

        response = await api.createBooking(bookingPayload, token)
      } else {
        const guestBookingPayload = {
          carId: selectedCarForBookingId || car.id,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation || formData.pickupLocation,
          additionalNotes: combinedNotes || undefined,
          flightNumber: formData.flightNumber?.trim() || undefined,
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone
        }

        response = await api.createGuestBooking(guestBookingPayload)
      }

      if (response.error) {
        const isUnavailable = response.error === 'Car not available' || response.error.includes('pas disponible') || response.error.includes('not available')
        if (isUnavailable) {
          setSubmitStatus({ type: 'error', message: response.error })
          setShowSuggestions(true)
          setIsCheckingAvailability(true)
          setSuggestedCars([])
          // Suggestions already in flight — just await the result
          suggestionsPromise.then(r => r.json()).then(data => {
            const available: Car[] = (data.cars || []).filter((c: Car) => c.id !== car?.id)
            if (car) {
              available.sort((a, b) => {
                const diff = (a.category === car.category ? 0 : 1) - (b.category === car.category ? 0 : 1)
                return diff !== 0 ? diff : Math.abs(a.pricePerDay - car.pricePerDay) - Math.abs(b.pricePerDay - car.pricePerDay)
              })
            }
            setSuggestedCars(available.slice(0, 3))
            setIsCheckingAvailability(false)
          }).catch(() => setIsCheckingAvailability(false))
        } else {
          setShowSuggestions(false)
          setSubmitStatus({ type: 'error', message: response.error })
        }
      } else {
        setConfirmationData({
          bookingId: response.id,
          totalPrice: response.totalPrice
        })
        setShowConfirmationPopup(true)
        setSubmitStatus(null)
      }
    } catch {
      setSubmitStatus({ type: 'error', message: t.errBookingFailed })
    } finally {
      setIsSubmitting(false)
    }
  }

  const [selectedCarForBookingId, setSelectedCarForBookingId] = useState<string | null>(null);

  const handleConfirmationClose = () => {
    setShowConfirmationPopup(false)
    setConfirmationData(null)
    setFormData({
      pickupLocation: '',
      dropoffLocation: '',
      startDate: '',
      startTime: '10:00',
      endDate: '',
      endTime: '10:00',
      additionalNotes: '',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      childSeatOption: '',
      flightNumber: ''
    })
    setBookingMode('auth')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] sm:max-h-[95vh] h-[90vh] sm:h-auto overflow-hidden sm:overflow-y-auto transform transition-all duration-300 scale-100 opacity-100 flex flex-col sm:block">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white sticky top-0 z-10 sm:static sm:top-auto">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-3 sm:p-4 rounded-xl shadow-md">
              <Car className="h-6 w-6 sm:h-7 sm:w-7 text-black" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t.title}</h2>
              <p className="text-sm sm:text-base text-gray-600">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.cancelBtn}
            className="p-3 sm:p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden">

          {/* Car Info */}
          {car && (
            <div className="p-6 sm:p-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                  {car.image ? (
                    <Image src={car.image} alt={car.name} width={112} height={112} className="rounded-2xl object-cover" />
                  ) : (
                    <Car className="h-12 w-12 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{car.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">{car.brand} {car.model}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-gray-700">
                    <span className="flex items-center"><Car className="h-4 w-4 mr-1 text-yellow-600" /> {car.category}</span>
                    <span className="flex items-center"><Users className="h-4 w-4 mr-1 text-yellow-600" /> {car.seats} {t.seats}</span>
                    <span className="flex items-center"><Settings className="h-4 w-4 mr-1 text-yellow-600" /> {car.transmission}</span>
                    <span className="flex items-center"><Fuel className="h-4 w-4 mr-1 text-yellow-600" /> {car.fuelType}</span>
                  </div>
                </div>
                <div className="text-center sm:text-right mt-4 sm:mt-0">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {selectedDays > 0 ? (
                      <>{t.from} €{effectivePricePerDay.toFixed(2)}</>
                    ) : (
                      <>{t.from} €{car.pricePerDay.toFixed(2)}</>
                    )}
                  </div>
                  <div className="text-base text-gray-600">{t.perDay}</div>
                </div>
              </div>
              {totalPrice > 0 && (() => {
                const surchargeEur = tripSurchargeInDH / 10
                const grandTotal = totalPrice + surchargeEur
                return (
                  <div className="mt-6 p-4 sm:p-5 bg-white rounded-xl border border-yellow-200 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">{t.rentalDuration} ({selectedDays} {selectedDays > 1 ? t.days : t.day}):</span>
                      <span className="text-base font-semibold text-gray-800">€{totalPrice.toFixed(2)}</span>
                    </div>
                    {surchargeEur > 0 && (
                      <div className="flex justify-between items-center text-orange-700">
                        <span className="text-base">{t.tripSurcharge}:</span>
                        <span className="text-base font-semibold">+ €{surchargeEur.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-yellow-200">
                      <span className="text-lg sm:text-xl text-gray-700 font-semibold">{t.estimatedTotal}:</span>
                      <span className="text-2xl sm:text-3xl font-bold text-green-600">€{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Form */}
          <div className="p-6 sm:p-8">

            {!user && bookingMode === 'auth' ? (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 sm:p-8 shadow-inner">
                  <User className="h-14 w-14 sm:h-16 sm:w-16 text-yellow-600 mx-auto mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t.chooseOption}</h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-6">{t.loginPrompt}</p>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                      <a href="/login" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105">
                        {t.loginBtn}
                      </a>
                      <a href="/register" className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300">
                        {t.registerBtn}
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-yellow-50 text-gray-500">{t.or}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setBookingMode('guest')}
                      className="w-full bg-white border-2 border-yellow-400 text-yellow-600 font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105"
                    >
                      {t.guestBtn}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

                {/* Date & Time Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">{t.pickupDate}</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          lang={lang}
                          required
                          className="mt-1 block w-full pl-9 pr-2 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm text-gray-900"
                        />
                      </div>
                      <div className="relative w-28">
                        <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-8 pr-2 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">{t.dropoffDate}</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          lang={lang}
                          required
                          className="mt-1 block w-full pl-9 pr-2 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm text-gray-900"
                        />
                      </div>
                      <div className="relative w-28">
                        <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-8 pr-2 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">{t.pickupLoc}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-base text-gray-900"
                      >
                        <option value="">{t.selectLoc}</option>
                        {locations.map(loc => (
                          <option key={loc.value} value={loc.value}>{loc.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">{t.dropoffLoc}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-base text-gray-900"
                      >
                        <option value="">{t.sameLoc}</option>
                        {locations.map(loc => (
                          <option key={loc.value} value={loc.value}>{loc.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location condition warnings */}
                {locationWarnings.length > 0 && (
                  <div className="space-y-2">
                    {locationWarnings.map((warning, i) => (
                      <div key={i} className={`p-3 rounded-lg text-sm font-medium border ${warning.blocking ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {warning.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Flight Number - only for airport */}
                {showFlightNumber && (
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      <Plane className="inline h-4 w-4 mr-1 text-yellow-600" />
                      {t.flightNum}
                    </label>
                    <input
                      type="text"
                      name="flightNumber"
                      value={formData.flightNumber}
                      onChange={handleInputChange}
                      placeholder={t.flightPlaceholder}
                      className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-base text-gray-900"
                    />
                  </div>
                )}

                {/* Guest Information */}
                {!user && bookingMode === 'guest' && (
                  <div className="space-y-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{t.guestInfo}</h4>
                      <button
                        type="button"
                        onClick={() => setBookingMode('auth')}
                        className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                      >
                        {t.backToLogin}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">{t.fullName}</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="guestName"
                            value={formData.guestName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-base text-gray-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">{t.email}</label>
                        <input
                          type="email"
                          name="guestEmail"
                          value={formData.guestEmail}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">{t.phone}</label>
                      <PhoneInput
                        name="guestPhone"
                        value={formData.guestPhone}
                        onChange={(value) => setFormData(prev => ({ ...prev, guestPhone: value }))}
                        placeholder={t.phonePlaceholder}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Child Seat Options */}
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">{t.childSeat}</h4>
                  <div className="space-y-2">
                    {[
                      { value: '', label: t.noSeat },
                      { value: 'infant', label: t.infantSeat },
                      { value: 'child', label: t.childSeatOpt },
                      { value: 'booster', label: t.boosterSeat }
                    ].map(option => (
                      <label key={option.value} className="flex items-center space-x-3 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="childSeatOption"
                          value={option.value}
                          checked={formData.childSeatOption === option.value}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="text-gray-800 text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">{t.additionalNotes}</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-base resize-y"
                  ></textarea>
                </div>

                {/* Submit status */}
                {submitStatus && (
                  <div className={`mb-4 p-4 sm:p-5 rounded-xl shadow-md ${
                    submitStatus.type === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    <p className="text-sm sm:text-base font-medium">{submitStatus.message}</p>
                    
                    {/* Suggested Cars Section */}
                    {showSuggestions && (
                      <div className="mt-4 pt-4 border-t border-red-200">
                        {isCheckingAvailability ? (
                          <div className="flex items-center justify-center space-x-2 text-red-700">
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">{t.searchingAvailability}</span>
                          </div>
                        ) : suggestedCars.length > 0 ? (
                          <div>
                            <p className="text-sm font-semibold text-red-800 mb-3">{t.suggestedCars}</p>
                            <div className="grid grid-cols-1 gap-3">
                              {suggestedCars.map(suggestedCar => (
                                <div key={suggestedCar.id} className="bg-white rounded-lg p-3 border border-red-100 flex items-center justify-between hover:border-yellow-400 transition-colors shadow-sm">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                      {suggestedCar.image ? (
                                        <Image src={suggestedCar.image} alt={suggestedCar.name} width={48} height={48} className="object-cover w-full h-full" />
                                      ) : (
                                        <Car className="w-6 h-6 text-gray-400 m-3" />
                                      )}
                                    </div>
                                    <div>
                                      <h5 className="font-semibold text-gray-900 text-sm">{suggestedCar.name}</h5>
                                      <p className="text-xs text-gray-500">{suggestedCar.category} • €{suggestedCar.pricePerDay}/{t.day}</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCarForBookingId(suggestedCar.id);
                                      // Create synthetic event to trigger form submission with new car
                                      const event = { preventDefault: () => {} } as React.FormEvent;
                                      handleSubmit(event);
                                    }}
                                    className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-md hover:bg-yellow-600 transition-colors"
                                  >
                                    {t.bookThisCar}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-red-700 italic">{t.noAvailableCars}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row-reverse justify-end space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse pt-4 sm:pt-6 border-t border-gray-100 mt-6 sm:mt-8 sticky bottom-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-4 sm:static sm:bg-transparent sm:p-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? t.confirmingBtn : `${t.confirmBtn} • €${(totalPrice + tripSurchargeInDH / 10).toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {confirmationData && (
        <BookingConfirmationPopup
          isOpen={showConfirmationPopup}
          onClose={handleConfirmationClose}
          bookingId={confirmationData.bookingId}
          totalPrice={confirmationData.totalPrice}
        />
      )}
    </div>
  )
}
