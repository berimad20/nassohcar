import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, Phone, Mail, MessageCircle, Calendar } from 'lucide-react'
import FAQAccordion from './FAQAccordion'

export const metadata: Metadata = {
  title: 'FAQ Location Voiture Tanger 2025 | Questions Fréquentes Nassoh Car',
  description: 'FAQ complète location de voiture Tanger : prix, documents, assurance, aéroport Ibn Battouta, port Tanger Med. Réponses d\'experts pour louer une voiture au Maroc avec Nassoh Car.',
  keywords: 'location voiture tanger faq, location voiture tanger aéroport, location voiture tanger port med, questions location voiture maroc, nassoh car faq, location auto tanger, prix location voiture tanger, documents location voiture maroc, assurance location voiture tanger, location voiture tanger pas cher, location voiture tanger centre ville, location voiture tanger port, location voiture tanger med, location voiture tanger boukhalef, location voiture tanger ville, location voiture tanger economique, location voiture tanger longue duree, location voiture tanger sans caution, location voiture tanger 24h, location voiture tanger livraison disponible',
  alternates: {
    canonical: 'https://www.nassohcar.com/faq'
  }
}


const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Luxury background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-400/5 to-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-400/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <span className="text-amber-400 font-semibold text-lg tracking-wider uppercase">Support Économique</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent leading-tight">
              Questions Fréquentes - Location Voiture Tanger
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Trouvez toutes les réponses à vos questions sur la location de voiture à Tanger, à l'aéroport Ibn Battouta et au port Tanger Med. Service professionnel 24h/24.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="bg-amber-400/10 backdrop-blur-sm border border-amber-400/30 rounded-full px-6 py-3">
                <span className="text-amber-400 font-medium">Service Économique Garanti</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FAQAccordion />

        {/* Section Contact */}
        <div className="mt-20">
          <div className="relative bg-gradient-to-r from-amber-400/20 to-yellow-300/20 backdrop-blur-xl rounded-3xl border border-amber-400/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-yellow-300/10"></div>
            <div className="relative p-10 md:p-12">
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative p-5 bg-gradient-to-r from-amber-400/30 to-yellow-300/30 rounded-full backdrop-blur-sm border border-amber-400/50">
                      <MessageCircle className="h-12 w-12 text-amber-400" />
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  Vous avez encore des questions sur la location à Tanger ?
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Notre équipe de support économique est disponible 24h/24 pour vous aider avec votre location de voiture à Tanger
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group">
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/20">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                          <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                            <Mail className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-white text-lg mb-2">Support Email</h3>
                          <span className="text-amber-400 font-medium text-lg">contact@nassohcar.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/20">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                          <div className="relative p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                            <Phone className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-white text-lg mb-2">Support Téléphone</h3>
                          <span className="text-amber-400 font-medium text-lg">+212 631 63 00 13</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/20">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                          <div className="relative p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full">
                            <Globe className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-white text-lg mb-2">Site Web</h3>
                          <span className="text-amber-400 font-medium text-lg">www.nassohcar.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl border border-green-400/30 p-8 hover:border-green-400/50 transition-all duration-300 text-center">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-2xl">Prêt à Réserver ?</h3>
                  <p className="text-gray-300 text-lg">Réservez votre véhicule familial à Tanger aujourd'hui</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Link href="/fleet" className="inline-flex bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                  Réserver Maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ