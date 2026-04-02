'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Calendar,
  Search,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Archive
} from 'lucide-react'

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR') + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

interface Booking {
  id: string
  startDate: string
  endDate: string
  totalPrice: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  pickupLocation: string
  dropoffLocation?: string
  additionalNotes?: string
  flightNumber?: string
  createdAt: string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  user?: {
    id: string
    name: string
    email: string
  } | null
  car: {
    id: string
    brand: string
    model: string
    name: string
    year: number
    image?: string
  }
}

interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
}

function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Détails de la Réservation</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XCircle className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nom du Client</p>
              <p className="text-base font-semibold text-gray-900">{booking.user?.name || booking.guestName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email du Client</p>
              <p className="text-base font-semibold text-gray-900">{booking.user?.email || booking.guestEmail || 'N/A'}</p>
            </div>
            {booking.guestPhone && (
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone du Client</p>
                <p className="text-base font-semibold text-gray-900">{booking.guestPhone}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Type de Réservation</p>
              <p className="text-base font-semibold text-gray-900">{booking.user ? 'Utilisateur Enregistré' : 'Réservation Invité'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Voiture</p>
              <p className="text-base font-semibold text-gray-900">{booking.car.brand} {booking.car.model} ({booking.car.year})</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Prix</p>
              <p className="text-base font-semibold text-gray-900">€{booking.totalPrice}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date de Prise en Charge</p>
              <p className="text-base font-semibold text-gray-900">{formatDateTime(booking.startDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date de Retour</p>
              <p className="text-base font-semibold text-gray-900">{formatDateTime(booking.endDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lieu de Prise en Charge</p>
              <p className="text-base font-semibold text-gray-900">{booking.pickupLocation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lieu de Retour</p>
              <p className="text-base font-semibold text-gray-900">{booking.dropoffLocation || 'Identique à la prise en charge'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <p className="text-base font-semibold text-gray-900">{booking.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Réservé le</p>
              <p className="text-base font-semibold text-gray-900">{new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {booking.flightNumber && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Numéro de Vol</p>
              <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">✈️ {booking.flightNumber}</p>
            </div>
          )}
          {booking.additionalNotes && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Notes Supplémentaires</p>
              <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">{booking.additionalNotes}</p>
            </div>
          )}
          {booking.car.image && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Image de la Voiture</p>
              <Image
                src={booking.car.image || '/placeholder-car.png'}
                alt={booking.car.name}
                width={400}
                height={200}
                className="rounded-lg object-cover w-full"
                unoptimized={booking.car.image?.startsWith('data:')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const LOCATIONS = [
  { value: 'tangier-airport', label: 'Aéroport de Tanger Ibn Battouta' },
  { value: 'tangier-port', label: 'Port de Tanger Ville' },
  { value: 'tangier-med', label: 'Port Tanger Med' },
  { value: 'tangier-train', label: 'Gare de Tanger' },
  { value: 'tetouan', label: 'Centre-ville de Tétouan' },
  { value: 'nassoh-agency', label: 'Agence Nassoh Car' },
  { value: 'hotel-delivery', label: "Livraison à l'hôtel" }
]

interface EditBookingModalProps {
  booking: Booking
  onClose: () => void
  onSave: (updated: Partial<Booking> & { id: string }) => void
}

function EditBookingModal({ booking, onClose, onSave }: EditBookingModalProps) {
  const [form, setForm] = useState({
    status: booking.status,
    carId: booking.car.id,
    startDate: booking.startDate.split('T')[0],
    startTime: booking.startDate.includes('T') ? booking.startDate.split('T')[1].substring(0, 5) : '10:00',
    endDate: booking.endDate.split('T')[0],
    endTime: booking.endDate.includes('T') ? booking.endDate.split('T')[1].substring(0, 5) : '10:00',
    pickupLocation: booking.pickupLocation,
    dropoffLocation: booking.dropoffLocation || '',
    additionalNotes: booking.additionalNotes || '',
    flightNumber: booking.flightNumber || '',
    totalPrice: String(booking.totalPrice)
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [cars, setCars] = useState<{ id: string; brand: string; model: string; name: string; year: number }[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('/api/admin/cars', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setCars(data.cars || []))
      .catch(() => {})
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: form.status,
          carId: form.carId,
          startDate: `${form.startDate}T${form.startTime}:00`,
          endDate: `${form.endDate}T${form.endTime}:00`,
          pickupLocation: form.pickupLocation,
          dropoffLocation: form.dropoffLocation || undefined,
          additionalNotes: form.additionalNotes || undefined,
          flightNumber: form.flightNumber || undefined,
          totalPrice: form.totalPrice
        })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Échec de la mise à jour')
      } else {
        const updated = await res.json()
        onSave(updated)
        onClose()
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2"><Edit className="h-5 w-5 text-blue-600" /> Modifier la Réservation</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><XCircle className="h-6 w-6 text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voiture</label>
              <select name="carId" value={form.carId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Sélectionner une voiture</option>
                {cars.map(car => (
                  <option key={car.id} value={car.id}>{car.brand} {car.model} ({car.year})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="PENDING">En Attente</option>
                <option value="CONFIRMED">Confirmé</option>
                <option value="CANCELLED">Annulé</option>
                <option value="COMPLETED">Terminé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix Total (€)</label>
              <input type="number" name="totalPrice" value={form.totalPrice} onChange={handleChange} step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
            <select name="carId" value={form.carId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {cars.length === 0 && <option value={booking.car.id}>{booking.car.brand} {booking.car.model} ({booking.car.year})</option>}
              {cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} — {c.name} ({c.year})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Début</label>
              <div className="flex gap-1">
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm" />
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="w-24 border border-gray-300 rounded-lg px-2 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Retour</label>
              <div className="flex gap-1">
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm" />
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="w-24 border border-gray-300 rounded-lg px-2 py-2 text-sm" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de Prise en Charge</label>
              <select name="pickupLocation" value={form.pickupLocation} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de Retour</label>
              <select name="dropoffLocation" value={form.dropoffLocation} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Même que prise en charge</option>
                {LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Vol (optionnel)</label>
            <input type="text" name="flightNumber" value={form.flightNumber} onChange={handleChange} placeholder="Ex: AT 101" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y" />
          </div>
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          <div className="flex justify-end gap-3 pt-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminBookingsPage() {
  const {  isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showArchive, setShowArchive] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterStartFrom, setFilterStartFrom] = useState('')
  const [filterStartTo, setFilterStartTo] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBookings, setTotalBookings] = useState(0)

  const hasActiveFilters = !!(searchTerm || filterStatus || filterStartFrom || filterStartTo || filterLocation)

  const resetFilters = () => {
    setSearchTerm('')
    setFilterStatus('')
    setFilterStartFrom('')
    setFilterStartTo('')
    setFilterLocation('')
  }

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isAdmin, isLoading, router])

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchBookings(currentPage, searchTerm, showArchive, filterStatus, filterStartFrom, filterStartTo, filterLocation)
    }
  }, [isAuthenticated, isAdmin, currentPage])

  // Refetch when any filter or tab changes (reset to page 1)
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      setCurrentPage(1)
      fetchBookings(1, searchTerm, showArchive, filterStatus, filterStartFrom, filterStartTo, filterLocation)
    }
  }, [searchTerm, showArchive, filterStatus, filterStartFrom, filterStartTo, filterLocation])

  const fetchBookings = async (
    page = 1,
    search = '',
    archived = false,
    status = '',
    startFrom = '',
    startTo = '',
    location = ''
  ) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({ page: String(page), limit: '10', archived: String(archived) })
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      if (startFrom) params.set('startDateFrom', startFrom)
      if (startTo) params.set('startDateTo', startTo)
      if (location) params.set('pickupLocation', location)
      const response = await fetch(`/api/admin/bookings?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        const now = new Date()
        const enriched = data.bookings.map((b: Booking) => {
          if (b.status === 'CONFIRMED' && new Date(b.endDate) < now) {
            return { ...b, status: 'COMPLETED' as const }
          }
          return b
        })
        setBookings(enriched)
        setTotalPages(data.pagination.pages)
        setTotalBookings(data.pagination.total)
        setCurrentPage(data.pagination.page)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        const updatedBooking = await response.json()
        setBookings(bookings.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        ))
      }
    } catch (error) {
      console.error('Failed to update booking:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filtering is now done server-side; bookings is already filtered
  const filteredBookings = bookings

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  const handleBookingSaved = (updated: Partial<Booking> & { id: string }) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? { ...b, ...updated } : b))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleBookingSaved}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Réservations</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs + Filters */}
        <div className="bg-white rounded-xl shadow-sm border mb-6 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setShowArchive(false)}
              className={`flex-1 py-3 px-6 text-sm font-medium transition-colors ${!showArchive ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Réservations actives
            </button>
            <button
              onClick={() => setShowArchive(true)}
              className={`flex-1 py-3 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${showArchive ? 'bg-gray-50 text-gray-700 border-b-2 border-gray-500' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Archive className="h-4 w-4" />
              Archives (terminées &amp; annulées)
            </button>
          </div>
          {/* Filters */}
          <div className="p-4 space-y-3">
            {/* Row 1: search + status */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={showArchive ? 'Rechercher dans les archives...' : 'Rechercher par client, voiture...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="sm:w-44 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Tous les statuts</option>
                {!showArchive ? (
                  <>
                    <option value="PENDING">En attente</option>
                    <option value="CONFIRMED">Confirmé</option>
                  </>
                ) : (
                  <>
                    <option value="COMPLETED">Terminé</option>
                    <option value="CANCELLED">Annulé</option>
                  </>
                )}
              </select>
            </div>
            {/* Row 2: date range + location + reset */}
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex gap-2 flex-1">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Début du séjour — du</label>
                  <input
                    type="date"
                    value={filterStartFrom}
                    onChange={(e) => setFilterStartFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">au</label>
                  <input
                    type="date"
                    value={filterStartTo}
                    onChange={(e) => setFilterStartTo(e.target.value)}
                    min={filterStartFrom}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div className="sm:w-52">
                <label className="block text-xs text-gray-500 mb-1">Lieu de prise en charge</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Tous les lieux</option>
                  <option value="tangier-airport">Aéroport Ibn Battouta</option>
                  <option value="tangier-port">Port de Tanger Ville</option>
                  <option value="tangier-med">Port Tanger Med</option>
                  <option value="tangier-train">Gare de Tanger</option>
                  <option value="tetouan">Centre-ville Tétouan</option>
                  <option value="nassoh-agency">Agence Nassoh Car</option>
                  <option value="hotel-delivery">Livraison à l&apos;hôtel</option>
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                >
                  Réinitialiser
                </button>
              )}
            </div>
            {hasActiveFilters && (
              <p className="text-xs text-blue-600">
                {totalBookings} résultat{totalBookings !== 1 ? 's' : ''} trouvé{totalBookings !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voiture
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user?.name || booking.guestName || 'N/A'}
                            {!booking.user && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Invité</span>}
                          </div>
                          <div className="text-sm text-gray-500">{booking.user?.email || booking.guestEmail || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {booking.car.image && (
                            <Image
                              src={booking.car.image}
                              alt="Car"
                              width={40}
                              height={40}
                              className="rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.car.brand} {booking.car.model}
                            </div>
                            <div className="text-sm text-gray-500">{booking.car.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{new Date(booking.startDate).toLocaleDateString('fr-FR')} <span className="text-gray-500">{new Date(booking.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span></div>
                          <div>{new Date(booking.endDate).toLocaleDateString('fr-FR')} <span className="text-gray-500">{new Date(booking.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">€{booking.totalPrice}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">
                            {booking.status === 'PENDING' ? 'En attente' :
                             booking.status === 'CONFIRMED' ? 'Confirmé' :
                             booking.status === 'CANCELLED' ? 'Annulé' :
                             booking.status === 'COMPLETED' ? 'Terminé' : booking.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingBooking(booking)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Modifier la réservation"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                                className="text-green-600 hover:text-green-900"
                                title="Confirmer la réservation"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                className="text-red-600 hover:text-red-900"
                                title="Annuler la réservation"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {booking.status === 'CONFIRMED' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                              className="text-red-600 hover:text-red-900"
                              title="Annuler la réservation confirmée"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredBookings.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500">Essayez d'ajuster votre recherche ou vos filtres.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de{' '}
                  <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>
                  {' '}à{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, totalBookings)}
                  </span>
                  {' '}sur{' '}
                  <span className="font-medium">{totalBookings}</span>
                  {' '}résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Précédent</span>
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Suivant</span>
                    <ArrowLeft className="h-5 w-5 transform rotate-180" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}