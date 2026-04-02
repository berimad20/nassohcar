'use client'

import { usePathname } from 'next/navigation'
import { generateHreflangLinks } from '@/lib/hreflang-utils'

export default function HreflangTags() {
  const pathname = usePathname()
  
  // If pathname is null (e.g. during initial render on server sometimes), return null
  if (!pathname) return null

  const links = generateHreflangLinks(pathname)
  
  return (
    <>
      {Object.entries(links).map(([hreflang, href]) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
    </>
  )
}
