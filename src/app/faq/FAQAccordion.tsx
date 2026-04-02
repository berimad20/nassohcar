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
    question: "Où puis-je louer une voiture à Tanger avec Nassoh Car ?",
    answer: [
      "Vous pouvez louer une voiture avec Nassoh Car au centre-ville de Tanger, à l'aéroport de Tanger-Ibn Battouta, au port Tanger-Med et à la gare de Tanger Ville.",
      "Nous proposons également la livraison du véhicule à votre hôtel ou à l'adresse de votre choix à Tanger, ainsi que dans des villes voisines comme Tétouan."
    ],
    gradient: "from-amber-500 to-yellow-600"
  },
  {
    id: 2,
    icon: Calendar,
    question: "Comment réserver une location de voiture à l'aéroport de Tanger ou au port Tanger-Med ?",
    answer: [
      "La réservation est simple : en ligne sur notre site web, par WhatsApp ou par téléphone.",
      "Nous assurons un service 'meet-and-greet' à l'aéroport de Tanger-Ibn Battouta, au port Tanger-Med et à l'aéroport de Tétouan, pour récupérer votre véhicule dès votre arrivée."
    ],
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    id: 3,
    icon: CreditCard,
    question: "Quels sont les meilleurs tarifs de location de voiture à Tanger ?",
    answer: [
      "Nous proposons des locations de voiture abordables à Tanger, à partir de 200 MAD (~20€) par jour pour des modèles compacts comme la Dacia Logan ou la Peugeot 208.",
      "Pour les locations mensuelles, nous offrons des tarifs préférentiels et des prix compétitifs pour des véhicules neufs, des SUV ou des voitures haut de gamme."
    ],
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: 4,
    icon: Shield,
    question: "Puis-je trouver une location de voiture pas chère à l'aéroport de Tanger sans dépôt de garantie ?",
    answer: [
      "Pour des raisons de sécurité, nous demandons un dépôt de garantie remboursable de 5 000 MAD, payable en espèces ou bloqué sur carte bancaire.",
      "Cette politique nous permet de maintenir des prix compétitifs. Nous faisons partie des agences les mieux notées à l'aéroport de Tanger pour notre transparence et qualité de service."
    ],
    gradient: "from-red-500 to-pink-600"
  },
  {
    id: 5,
    icon: Clock,
    question: "Proposez-vous des locations de voiture longue durée à Tanger ou à Tétouan ?",
    answer: [
      "Oui. Nous sommes spécialisés dans la location longue durée à Tanger, Tétouan et dans la zone du port Tanger-Med.",
      "De nombreux expatriés et professionnels des zones industrielles de Tanger choisissent nos formules mensuelles pour des véhicules tels que la Dacia Logan, la Toyota Yaris, la Peugeot 208, et des SUV."
    ],
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: 6,
    icon: FileText,
    question: "Quels documents sont nécessaires pour louer une voiture à Tanger ?",
    answer: [
      "Vous devez présenter un permis de conduire valide, un passeport (ou une carte d'identité nationale pour les Marocains) ainsi qu'une carte bancaire.",
      "Les visiteurs étrangers sont encouragés à se munir d'un permis de conduire international (IDP) en complément de leur permis national."
    ],
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    id: 7,
    icon: Users,
    question: "Quel est l'âge minimum requis pour louer une voiture au Maroc ?",
    answer: [
      "L'âge minimum requis est de 21 ans."
    ],
    gradient: "from-pink-500 to-rose-600"
  },
  {
    id: 8,
    icon: Shield,
    question: "L'assurance est-elle incluse dans les locations Nassoh Car ?",
    answer: [
      "Oui. Toutes nos locations incluent une assurance de base. Un dépôt de garantie remboursable de 500 € (ou équivalent en MAD) est requis au début de la location.",
      "L'assurance couvre uniquement les dommages résultant d'une collision entre deux véhicules et au-delà du seuil de 500 €. Les dommages causés à des objets fixes (comme un mur ou un poteau) ne sont pas couverts.",
      "Des options d'assurance complémentaire sont disponibles pour une protection accrue."
    ],
    gradient: "from-red-500 to-orange-600"
  },
  {
    id: 9,
    icon: MapPin,
    question: "Comment puis-je louer une voiture à Tétouan ou à l'aéroport de Tétouan ?",
    answer: [
      "Nous proposons la livraison directe des véhicules à Tétouan, que ce soit en centre-ville ou à l'aéroport de Tétouan, sur simple demande.",
      "Ce service est particulièrement apprécié par les voyageurs arrivant dans le nord du Maroc via Ryanair ou Air Arabia."
    ],
    gradient: "from-teal-500 to-green-600"
  },
  {
    id: 10,
    icon: Star,
    question: "Pourquoi choisir Nassoh Car pour votre location de voiture à Tanger ?",
    answer: [
      "Nassoh Car est reconnue comme l'une des meilleures agences de location de voiture à Tanger, grâce à ses tarifs transparents, ses véhicules bien entretenus, sa livraison rapide à l'aéroport et son service client réactif et convivial."
    ],
    gradient: "from-yellow-500 to-amber-600"
  }
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
