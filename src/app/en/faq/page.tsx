import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, Phone, Mail, MessageCircle, Calendar } from 'lucide-react'
import FAQAccordion from './FAQAccordion'

export const metadata: Metadata = {
  title: 'FAQ Car Rental Tangier 2025 | Nassoh Car Frequently Asked Questions',
  description: 'Complete FAQ for car rental in Tangier: prices, documents, insurance, Ibn Battouta Airport, Tangier Med Port. Expert answers for renting a car in Morocco with Nassoh Car.',
  keywords: 'tangier car rental faq, tangier airport car rental, tangier med port car rental, morocco car rental questions, nassoh car faq, tangier car hire prices, documents required morocco rental, insurance tangier car rental',
  alternates: { canonical: 'https://www.nassohcar.com/en/faq' },
}

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-400/5 to-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-400/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <span className="text-amber-400 font-semibold text-lg tracking-wider uppercase">Economy Support</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent leading-tight">Frequently Asked Questions – Car Rental Tangier</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Find answers about car rental in Tangier, at Ibn Battouta Airport and Tangier Med Port. Professional service 24/7.</p>
            <div className="mt-8 flex justify-center"><div className="bg-amber-400/10 backdrop-blur-sm border border-amber-400/30 rounded-full px-6 py-3"><span className="text-amber-400 font-medium">Economy Service Guaranteed</span></div></div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FAQAccordion />

        <div className="mt-20">
          <div className="relative bg-gradient-to-r from-amber-400/20 to-yellow-300/20 backdrop-blur-xl rounded-3xl border border-amber-400/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-yellow-300/10"></div>
            <div className="relative p-10 md:p-12">
              <div className="text-center">
                <div className="flex justify-center mb-8"><div className="relative"><div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full blur-xl opacity-50 animate-pulse"></div><div className="relative p-5 bg-gradient-to-r from-amber-400/30 to-yellow-300/30 rounded-full backdrop-blur-sm border border-amber-400/50"><MessageCircle className="h-12 w-12 text-amber-400" /></div></div></div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Still have questions about renting in Tangier?</h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Our economy support team is available 24/7 to help with your car rental in Tangier</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group"><div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/20"><div className="flex flex-col items-center space-y-4"><div className="relative"><div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div><div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"><Mail className="h-8 w-8 text-white" /></div></div><div className="text-center"><h3 className="font-bold text-white text-lg mb-2">Email Support</h3><span className="text-amber-400 font-medium text-lg">contact@nassohcar.com</span></div></div></div></div>
                  <div className="group"><div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/20"><div className="flex flex-col items-center space-y-4"><div className="relative"><div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div><div className="relative p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"><Phone className="h-8 w-8 text-white" /></div></div><div className="text-center"><h3 className="font-bold text-white text-lg mb-2">Phone Support</h3><span className="text-amber-400 font-medium text-lg">+212 631 63 00 13</span></div></div></div></div>
                  <div className="group"><div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/20"><div className="flex flex-col items-center space-y-4"><div className="relative"><div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div><div className="relative p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"><Globe className="h-8 w-8 text-white" /></div></div><div className="text-center"><h3 className="font-bold text-white text-lg mb-2">Website</h3><span className="text-amber-400 font-medium text-lg">www.nassohcar.com</span></div></div></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl border border-green-400/30 p-8 hover:border-green-400/50 transition-all duration-300 text-center">
              <div className="flex flex-col items-center gap-4 mb-6"><div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"><Calendar className="h-8 w-8 text-white" /></div><div><h3 className="font-bold text-white text-2xl">Ready to Book?</h3><p className="text-gray-300 text-lg">Book your family vehicle in Tangier today</p></div></div>
              <div className="flex justify-center"><Link href="/en/fleet" className="inline-flex bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">Book Now</Link></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
