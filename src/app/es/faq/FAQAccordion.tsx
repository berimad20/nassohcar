'use client'

import { useState } from 'react'
import { ChevronDown, MapPin, Calendar, CreditCard, Shield, Clock, FileText, Users, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface FAQItem {
  id: number
  icon: LucideIcon
  question: string
  answer: string[]
  gradient: string
}

const faqs: FAQItem[] = [
  {
    id: 1,
    icon: MapPin,
    question: '¿Dónde puedo alquilar un coche en Tánger con Nassoh Car?',
    answer: [
      'Puede alquilar un coche con Nassoh Car en el centro de Tánger, en el Aeropuerto de Tánger Ibn Battouta, en el Puerto Tánger Med y en la estación de tren de Tánger Ville.',
      'También entregamos vehículos en su hotel o dirección en Tánger, así como en ciudades cercanas como Tetuán.',
    ],
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    id: 2,
    icon: Calendar,
    question: '¿Cómo reservo en el Aeropuerto de Tánger o Puerto Tánger Med?',
    answer: [
      'Reservar es sencillo: en línea a través de nuestro sitio web, por WhatsApp o por teléfono.',
      'Ofrecemos un servicio de bienvenida en el Aeropuerto de Tánger Ibn Battouta, Puerto Tánger Med y Aeropuerto de Tetuán para que pueda recoger su vehículo a su llegada.',
    ],
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 3,
    icon: CreditCard,
    question: '¿Cuáles son las mejores tarifas de alquiler en Tánger?',
    answer: [
      'Ofrecemos alquileres asequibles en Tánger, desde 200 MAD (~€20) por día para modelos compactos como Dacia Logan o Peugeot 208.',
      'Para alquileres mensuales, ofrecemos tarifas preferenciales y precios competitivos para vehículos nuevos, SUVs y coches premium.',
    ],
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    id: 4,
    icon: Shield,
    question: '¿Puedo alquilar un coche en el Aeropuerto de Tánger sin fianza?',
    answer: [
      'Por razones de seguridad, requerimos un depósito de seguridad reembolsable de 5,000 MAD, pagadero en efectivo o bloqueado en una tarjeta bancaria.',
      'Esta política nos permite mantener precios competitivos. Estamos entre las agencias mejor valoradas en el Aeropuerto de Tánger por transparencia y calidad de servicio.',
    ],
    gradient: 'from-red-500 to-pink-600',
  },
  {
    id: 5,
    icon: Clock,
    question: '¿Ofrecen alquileres a largo plazo en Tánger o Tetuán?',
    answer: [
      'Sí. Nos especializamos en alquileres a largo plazo en Tánger, Tetuán y la zona del Puerto Tánger Med.',
      'Muchos expatriados y profesionales en las zonas industriales de Tánger eligen nuestros planes mensuales para vehículos como Dacia Logan, Toyota Yaris, Peugeot 208 y SUVs.',
    ],
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 6,
    icon: FileText,
    question: '¿Qué documentos se requieren para alquilar un coche en Tánger?',
    answer: [
      'Debe presentar una licencia de conducir válida, un pasaporte (o documento nacional de identidad para marroquíes) y una tarjeta bancaria.',
      'Se recomienda a los visitantes extranjeros llevar un Permiso Internacional de Conducir (IDP) además de su licencia nacional.',
    ],
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 7,
    icon: Users,
    question: '¿Cuál es la edad mínima para alquilar un coche en Marruecos?',
    answer: ['La edad mínima requerida es de 21 años.'],
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 8,
    icon: Shield,
    question: '¿Está incluido el seguro en los alquileres de Nassoh Car?',
    answer: [
      'Sí. Todos nuestros alquileres incluyen seguro básico. Se requiere un depósito de seguridad reembolsable de €500 (o equivalente en MAD) al inicio del alquiler.',
      'El seguro cubre solo daños resultantes de una colisión entre dos vehículos y por encima del umbral de €500. Los daños a objetos fijos (como un muro o poste) no están cubiertos.',
      'Opciones de seguro adicionales están disponibles para protección extra.',
    ],
    gradient: 'from-red-500 to-orange-600',
  },
  {
    id: 9,
    icon: MapPin,
    question: '¿Cómo puedo alquilar un coche en Tetuán o en el Aeropuerto de Tetuán?',
    answer: [
      'Ofrecemos entrega directa en Tetuán, en el centro de la ciudad o en el Aeropuerto de Tetuán, previa solicitud.',
      'Este servicio es apreciado por los viajeros que llegan al norte de Marruecos vía Ryanair o Air Arabia.',
    ],
    gradient: 'from-teal-500 to-green-600',
  },
  {
    id: 10,
    icon: Star,
    question: '¿Por qué elegir Nassoh Car para alquilar un coche en Tánger?',
    answer: [
      'Nassoh Car es reconocida como una de las mejores agencias de alquiler de coches en Tánger gracias a precios transparentes, vehículos bien mantenidos, entrega rápida en el aeropuerto y un servicio al cliente receptivo y amable.',
    ],
    gradient: 'from-yellow-500 to-amber-600',
  },
]

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const IconComponent = faq.icon
        const isOpen = openId === faq.id
        return (
          <div key={faq.id} className="group">
            <div className={`relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-amber-400/50 shadow-2xl shadow-amber-400/10' : 'border-white/20 hover:border-amber-400/30'}`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${faq.gradient} transition-opacity duration-500 ${isOpen ? 'opacity-10' : 'opacity-0 group-hover:opacity-5'}`}></div>

              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="relative w-full p-6 md:p-8 flex items-center text-left"
                aria-expanded={isOpen}
              >
                <div className="flex-shrink-0 mr-5">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${faq.gradient} rounded-2xl blur-lg opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-75' : 'group-hover:opacity-60'}`}></div>
                    <div className={`relative p-3 bg-gradient-to-r ${faq.gradient} rounded-2xl shadow-xl`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 bg-gradient-to-r ${faq.gradient} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg mt-0.5`}>
                      {faq.id}
                    </span>
                    <h3 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isOpen ? 'text-amber-400' : 'text-white group-hover:text-amber-400'}`}>
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <ChevronDown className={`flex-shrink-0 ml-4 h-6 w-6 text-amber-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="relative px-6 md:px-8 pb-6 md:pb-8 pl-16 md:pl-24">
                  <div className="text-gray-300 space-y-3 text-base md:text-lg leading-relaxed">
                    {faq.answer.map((line, lineIndex) => (
                      <p key={lineIndex}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
