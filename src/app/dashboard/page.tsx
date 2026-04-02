'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Car, Calendar, User, Settings, CreditCard, Archive, XCircle } from 'lucide-react'

interface Booking {
  id: string
  startDate: string
  endDate: string
  totalPrice: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  pickupLocation: string
  dropoffLocation?: string
  car: {
    brand: string
    model: string
    year: number
  }
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [showArchive, setShowArchive] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings()
    }
  }, [isAuthenticated])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        // Auto-mark confirmed bookings whose end date has passed as COMPLETED (display only)
        const now = new Date()
        const enriched = (data || []).map((b: Booking) => {
          if (b.status === 'CONFIRMED' && new Date(b.endDate) < now) {
            return { ...b, status: 'COMPLETED' as const }
          }
          return b
        })
        setBookings(enriched)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return
    setCancellingId(bookingId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' })
      })
      if (response.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      } else {
        const data = await response.json()
        alert(data.error || "Échec de l'annulation")
      }
    } catch {
      alert("Erreur réseau")
    } finally {
      setCancellingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const activeBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED')
  const archivedBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED')

  const statusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmé'
      case 'COMPLETED': return 'Terminé'
      case 'PENDING': return 'En attente'
      case 'CANCELLED': return 'Annulé'
      default: return status
    }
  }

  const statusClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border border-green-200'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'PENDING': return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'CANCELLED': return 'bg-gray-100 text-gray-600 border border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="border border-gray-200 rounded-lg p-6 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:border-amber-200 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-2">{booking.car.brand} {booking.car.model} ({booking.car.year})</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-amber-500" />
              {new Date(booking.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} → {new Date(booking.endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-gray-600">📍 {booking.pickupLocation}{booking.dropoffLocation && booking.dropoffLocation !== booking.pickupLocation ? ` → ${booking.dropoffLocation}` : ''}</p>
          </div>
        </div>
        <div className="text-right ml-6 flex flex-col items-end gap-2">
          <p className="font-bold text-xl text-gray-900">€{booking.totalPrice}</p>
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusClass(booking.status)}`}>
            {statusLabel(booking.status)}
          </span>
          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
            <button
              onClick={() => handleCancel(booking.id)}
              disabled={cancellingId === booking.id}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
            >
              <XCircle className="h-3 w-3" />
              {cancellingId === booking.id ? 'Annulation...' : 'Annuler'}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Page Title Section */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-4">
              Bon retour, {user?.name} !
            </h1>
            <p className="text-xl text-gray-300">Gérez vos réservations et explorez notre flotte économique</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-300 p-3 rounded-lg shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 font-medium">Total Réservations</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 p-3 rounded-lg shadow-lg">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 font-medium">Locations Actives</p>
                    <p className="text-2xl font-bold text-gray-900">{activeBookings.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-400 p-3 rounded-lg shadow-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 font-medium">Total Dépensé</p>
                    <p className="text-2xl font-bold text-gray-900">
                      €{bookings
                        .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
                        .reduce((sum, b) => sum + b.totalPrice, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Bookings */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Réservations en cours</h2>
              </div>
              <div className="p-6">
                {loadingBookings ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                  </div>
                ) : activeBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-300 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Car className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-gray-600 text-lg mb-4">Aucune réservation active</p>
                    <button
                      onClick={() => router.push('/fleet')}
                      className="px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 font-semibold rounded-lg hover:from-amber-300 hover:to-yellow-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Parcourir Notre Flotte
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                  </div>
                )}
              </div>
            </div>

            {/* Archived Bookings */}
            {archivedBookings.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Archive className="h-5 w-5 text-gray-500" />
                    Archives ({archivedBookings.length})
                  </h2>
                  <button
                    onClick={() => setShowArchive(v => !v)}
                    className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                  >
                    {showArchive ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
                {showArchive && (
                  <div className="p-6">
                    <div className="space-y-4">
                      {archivedBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-amber-400 to-yellow-300 p-4 rounded-full shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 text-lg">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  {user?.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="w-full flex items-center justify-center px-4 py-3 border border-amber-200 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:border-amber-300 transition-all duration-300 font-medium text-gray-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                Modifier le Profil
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Actions Rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/fleet')}
                  className="w-full text-left px-4 py-4 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 transition-all duration-300 border border-gray-200 hover:border-amber-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-300 p-2 rounded-lg mr-3">
                      <Car className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Réserver une Voiture</span>
                      <p className="text-xs text-gray-600">Parcourez notre flotte économique</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full text-left px-4 py-4 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border border-gray-200 hover:border-green-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-400 p-2 rounded-lg mr-3">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Contacter le Support</span>
                      <p className="text-xs text-gray-600">Obtenez de l'aide quand vous en avez besoin</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
