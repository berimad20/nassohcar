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
    question: 'Where can I rent a car in Tangier with Nassoh Car?',
    answer: [
      'You can rent a car with Nassoh Car in Tangier city center, at Tangier Ibn Battouta Airport, at Tangier Med Port and at Tangier Ville train station.',
      'We also deliver vehicles to your hotel or address in Tangier, as well as nearby cities such as Tetouan.',
    ],
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    id: 2,
    icon: Calendar,
    question: 'How do I book at Tangier Airport or Tangier Med Port?',
    answer: [
      'Booking is simple: online via our website, by WhatsApp or by phone.',
      'We provide a meet-and-greet service at Tangier Ibn Battouta Airport, Tangier Med Port and Tetouan Airport so you can collect your vehicle upon arrival.',
    ],
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 3,
    icon: CreditCard,
    question: 'What are the best car rental rates in Tangier?',
    answer: [
      'We offer affordable rentals in Tangier, starting from 200 MAD (~€20) per day for compact models such as Dacia Logan or Peugeot 208.',
      'For monthly rentals, we offer preferential rates and competitive prices for new vehicles, SUVs and premium cars.',
    ],
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    id: 4,
    icon: Shield,
    question: 'Can I rent a car at Tangier Airport without a security deposit?',
    answer: [
      'For security reasons, we require a refundable security deposit of 5,000 MAD, payable in cash or blocked on a bank card.',
      'This policy allows us to maintain competitive prices. We are among the highest rated agencies at Tangier Airport for transparency and service quality.',
    ],
    gradient: 'from-red-500 to-pink-600',
  },
  {
    id: 5,
    icon: Clock,
    question: 'Do you offer long-term rentals in Tangier or Tetouan?',
    answer: [
      'Yes. We specialize in long-term rentals in Tangier, Tetouan and the Tangier Med Port area.',
      'Many expatriates and professionals in Tangier\'s industrial zones choose our monthly plans for vehicles such as Dacia Logan, Toyota Yaris, Peugeot 208, and SUVs.',
    ],
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 6,
    icon: FileText,
    question: 'Which documents are required to rent a car in Tangier?',
    answer: [
      'You must present a valid driving license, a passport (or national ID for Moroccans) and a bank card.',
      'Foreign visitors are encouraged to carry an International Driving Permit (IDP) in addition to their national license.',
    ],
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 7,
    icon: Users,
    question: 'What is the minimum age to rent a car in Morocco?',
    answer: ['The minimum required age is 21 years.'],
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 8,
    icon: Shield,
    question: 'Is insurance included in Nassoh Car rentals?',
    answer: [
      'Yes. All our rentals include basic insurance. A refundable security deposit of €500 (or MAD equivalent) is required at the start of the rental.',
      'Insurance covers only damage resulting from a collision between two vehicles and above the €500 threshold. Damage to fixed objects (like a wall or pole) is not covered.',
      'Additional insurance options are available for extra protection.',
    ],
    gradient: 'from-red-500 to-orange-600',
  },
  {
    id: 9,
    icon: MapPin,
    question: 'How can I rent a car in Tetouan or at Tetouan Airport?',
    answer: [
      'We offer direct delivery to Tetouan, in the city center or at Tetouan Airport, upon request.',
      'This service is appreciated by travelers arriving in northern Morocco via Ryanair or Air Arabia.',
    ],
    gradient: 'from-teal-500 to-green-600',
  },
  {
    id: 10,
    icon: Star,
    question: 'Why choose Nassoh Car for car rental in Tangier?',
    answer: [
      'Nassoh Car is recognized as one of the best car rental agencies in Tangier thanks to transparent pricing, well-maintained vehicles, fast airport delivery and responsive, friendly customer service.',
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
