'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({ children }) {
    const pathname = usePathname()

    // Pages where we don't want Header/Footer (dashboard has its own layout)
    const excludePaths = ['/dashboard', '/admin']
    const shouldShowLayout = !excludePaths.some(path => pathname.startsWith(path))

    return (
        <>
            {shouldShowLayout && <Header />}
            {children}
            {shouldShowLayout && <Footer />}
        </>
    )
}

