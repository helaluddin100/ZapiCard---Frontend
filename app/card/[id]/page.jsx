'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cardAPI, visitorTrackingAPI } from '@/lib/api'
import { useToast } from '@/lib/toast'
import { getVisitorDataForAPI } from '@/lib/visitorData'
import AppointmentModal from './components/AppointmentModal'
import {
    FaWhatsapp,
    FaTiktok,
    FaXTwitter,
    FaThreads,
    FaMedium,
    FaSnapchat,
    FaDiscord,
    FaPinterest,
    FaBehance,
    FaReddit,
    FaFacebookF,
} from "react-icons/fa6";
import { FaTelegramPlane, FaDribbble, FaMediumM } from "react-icons/fa";
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Download,
    Calendar,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Github,
    QrCode,
    Radio,
    Share2,
    Loader2,
    AlertCircle,
    Link as LinkIcon,
    Moon,
    Sun,
    MessageCircle,
    X
} from 'lucide-react'

// Custom SVG icons for social media platforms
const WhatsAppIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

const TikTokIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);

const SnapchatIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
    </svg>
);

const PinterestIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c5.302 0 9.917-3.158 11.827-7.68-.085-.713-.451-3.483.084-4.97.572-1.547 3.694-10.524 3.694-10.524s-.942-1.27-.942-3.147c0-2.948 1.71-5.15 3.84-5.15 1.812 0 2.687 1.36 2.687 2.987 0 1.82-1.16 4.544-1.756 7.067-.499 2.113 1.056 3.838 3.134 3.838 3.76 0 6.322-3.966 6.322-9.69 0-5.068-3.644-8.618-8.848-8.618C9.697.003 6.585 2.597 5.71 5.788c-.636 2.428.478 4.419 2.212 5.838.248.208.382.116.442-.17.041-.257.276-1.633.362-2.128.059-.23.037-.311-.133-.513-.37-.435-.608-1-1.048-1.796-.6-1.055-.723-1.818-.723-2.623 0-3.447 2.053-6.614 5.91-6.614 3.106 0 5.51 2.263 5.51 5.286 0 3.093-1.95 5.58-4.662 5.58-.913 0-1.774-.474-2.067-1.088l-.563 2.144c-.205.786-.76 1.77-1.132 2.372.852.262 1.752.404 2.68.404 6.624 0 12-5.372 12-12S18.627 0 12 0z" />
    </svg>
);

const BehanceIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 7.5v9c0 .827.673 1.5 1.5 1.5h7.5V6H1.5C.673 6 0 6.673 0 7.5zm12.75 3c-2.481 0-2.75 2.25-2.75 2.25s-.033 2.25 2.75 2.25c2.75 0 2.75-2.25 2.75-2.25s.027-2.25-2.75-2.25zM21 3H9v1.5h12V3zM9.75 15v-3c1.5 0 3 0 3 1.5s-1.5 1.5-3 1.5zM21 10.5h-8v1.5h8v-1.5zm-8 4.5h7.5v1.5H13v-1.5z" />
    </svg>
);

const RedditIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
);

const MediumIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
);

const DiscordIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

const TelegramIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

const DribbbleIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.72C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
    </svg>
);

const FacebookIconSVG = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const ThreadsIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
    </svg>
);

export default function PublicCardPage() {
    const params = useParams()
    const slug = params?.id
    const { success } = useToast()
    const [showQR, setShowQR] = useState(false)
    const [cardData, setCardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showAppointmentModal, setShowAppointmentModal] = useState(false)
    const [trackingId, setTrackingId] = useState(null)
    const [visitStartTime, setVisitStartTime] = useState(null)
    const [darkMode, setDarkMode] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [tilt, setTilt] = useState({ x: 0, y: 0 })
    const isLoadCardDataInProgress = useRef(false)

    // Check for dark mode preference on mount
    useEffect(() => {
        setMounted(true)
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setDarkMode(true)
            document.documentElement.classList.add('dark')
        } else {
            setDarkMode(false)
            document.documentElement.classList.remove('dark')
        }
    }, [])

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)

        if (newDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    // 3D Tilt Effect for mobile
    const handleMouseMove = (e) => {
        if (window.innerWidth < 768) return // Only on desktop

        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = (y - centerY) / 20
        const rotateY = (centerX - x) / 20

        setTilt({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 })
    }

    const loadCardData = useCallback(async () => {
        if (!slug) return

        // Prevent multiple simultaneous calls
        if (isLoadCardDataInProgress.current) {
            console.log('⚠️ Load card data already in progress, skipping...')
            return
        }

        // Check if visitor has visited this card in the last 24 hours
        const storageKey = `card_visit_${slug}`

        try {
            isLoadCardDataInProgress.current = true
            setLoading(true)
            setError(null)
            const currentTime = Date.now()
            const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

            let shouldCountVisit = false

            if (typeof window !== 'undefined') {
                // Get last visit timestamp
                const lastVisitTimeStr = localStorage.getItem(storageKey)

                if (!lastVisitTimeStr) {
                    // First visit - store timestamp IMMEDIATELY before any API calls
                    localStorage.setItem(storageKey, currentTime.toString())
                    shouldCountVisit = true
                    console.log('💾 First visit - timestamp stored:', new Date(currentTime).toISOString())
                } else {
                    const lastVisitTime = parseInt(lastVisitTimeStr)
                    const timeDiff = currentTime - lastVisitTime

                    if (timeDiff >= TWENTY_FOUR_HOURS) {
                        // 24 hours passed - update timestamp and count visit
                        localStorage.setItem(storageKey, currentTime.toString())
                        shouldCountVisit = true
                        const hoursPassed = Math.round(timeDiff / 1000 / 60 / 60)
                        console.log(`💾 24h+ passed (${hoursPassed}h) - timestamp updated:`, new Date(currentTime).toISOString())
                    } else {
                        // Within 24 hours - don't count
                        shouldCountVisit = false
                        const hoursSince = Math.round(timeDiff / 1000 / 60 / 60)
                        const minutesSince = Math.round(timeDiff / 1000 / 60)
                        console.log(`⏱️ Visit within 24h (${hoursSince}h/${minutesSince}m ago) - skipping count`)
                        console.log(`Last visit: ${new Date(lastVisitTime).toISOString()}, Current: ${new Date(currentTime).toISOString()}`)
                    }
                }
            } else {
                // Server-side: always count (this shouldn't happen for client component)
                shouldCountVisit = true
            }

            let cleanedVisitorData = null

            if (shouldCountVisit) {

                // Collect visitor data only if 24 hours have passed since last visit
                console.log('🔄 Starting visitor data collection (first visit or 24h+ since last visit)...')
                const visitorData = await getVisitorDataForAPI()

                // Log collected data for debugging
                console.log('✅ Collected visitor data:', visitorData)

                // Send visitor data via POST body instead of query params to avoid URL length issues
                // Filter out null/undefined values and large objects
                cleanedVisitorData = {}
                Object.keys(visitorData).forEach(key => {
                    const value = visitorData[key]
                    // Skip null/undefined/empty values
                    if (value === null || value === undefined || value === '') {
                        return
                    }
                    // Skip large nested objects (like fingerprint_components) - they're too large
                    if (key === 'additional_data' && typeof value === 'object') {
                        // Only keep essential parts, skip large fingerprint components
                        const cleaned = {}
                        if (value.full_ua_parsed) {
                            cleaned.full_ua_parsed = value.full_ua_parsed
                        }
                        // Skip fingerprint_components as it's too large
                        cleanedVisitorData[key] = cleaned
                    } else {
                        cleanedVisitorData[key] = value
                    }
                })

                console.log('📤 Sending visitor data via POST body (keys:', Object.keys(cleanedVisitorData).length, ')')
            } else {
                // Send minimal data with skip flag to prevent backend from counting
                cleanedVisitorData = {
                    skip_visitor_count: true,
                    _timestamp: currentTime.toString(),
                    _reason: 'visit_within_24h'
                }
                console.log('⏭️ Skipping visitor count - sending skip flag to backend')
            }

            const response = await cardAPI.getCardBySlug(slug, cleanedVisitorData)

            console.log('📥 Response received:', response)

            if (response.status === 'success' && response.data) {
                setCardData(response.data)
                // Store tracking ID if available
                if (response.data.tracking_id) {
                    setTrackingId(response.data.tracking_id)
                }
                // Record visit start time
                setVisitStartTime(Date.now())
            } else {
                setError('Card not found')
            }

        } catch (err) {
            // console.error('Error loading card:', err)
            setError(err.message || 'Failed to load card')
        } finally {
            setLoading(false)
            isLoadCardDataInProgress.current = false
        }
    }, [slug])

    useEffect(() => {
        // Only load if slug exists and component is mounted
        if (slug && mounted) {
            loadCardData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, mounted]) // Only depend on slug and mounted to prevent unnecessary re-runs

    // Set meta title when cardData is loaded
    useEffect(() => {
        if (cardData && cardData.name) {
            document.title = `${cardData.name} - zapycard.com`
        }
    }, [cardData])

    // Track visit duration when component unmounts or page is closed
    useEffect(() => {
        return () => {
            if (trackingId && visitStartTime) {
                const duration = Math.floor((Date.now() - visitStartTime) / 1000) // in seconds
                // Send duration update (optional, can be done via API if needed)
                // For now, we'll track it when contact is saved or appointment is created
            }
        }
    }, [trackingId, visitStartTime])

    const getInitials = (name) => {
        if (!name) return 'JD'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getBackgroundStyle = () => {
        if (!cardData) return { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }

        if (cardData.use_gradient && cardData.gradient_colors) {
            return {
                background: `linear-gradient(135deg, ${cardData.gradient_colors.from || cardData.primary_color || '#3b82f6'} 0%, ${cardData.gradient_colors.to || cardData.button_color || '#8b5cf6'} 100%)`
            }
        }
        return {
            backgroundColor: cardData.primary_color || '#3b82f6'
        }
    }

    const getSocialIcon = (key) => {
        const icons = {
            facebook: FacebookIconSVG,
            twitter: FaXTwitter, // Using X icon from lucide-react for the new X logo
            instagram: Instagram,
            linkedin: Linkedin,
            youtube: Youtube,
            threads: FaThreads,
            github: Github,
            whatsapp: FaWhatsapp,
            tiktok: FaTiktok,
            snapchat: FaSnapchat,
            pinterest: FaPinterest,
            telegram: FaTelegramPlane,
            discord: FaDiscord,
            behance: FaBehance,
            dribbble: FaDribbble,
            medium: FaMediumM,
            reddit: FaReddit,
        }
        // Return icon or fallback to LinkIcon if not found
        const Icon = icons[key.toLowerCase()] || LinkIcon
        return Icon
    }

    const getSocialColor = (key) => {
        const colors = {
            facebook: 'bg-blue-700 hover:bg-blue-800',
            twitter: 'bg-black hover:bg-gray-900',
            instagram: 'bg-gradient-to-br from-purple-600 to-pink-600 hover:opacity-90',
            linkedin: 'bg-blue-600 hover:bg-blue-700',
            youtube: 'bg-red-600 hover:bg-red-700',
            threads: 'bg-black text-white hover:bg-gray-900',
            github: 'bg-black text-white hover:bg-gray-900',
            whatsapp: 'bg-green-500 hover:bg-green-600',
            tiktok: 'bg-black hover:bg-gray-900',
            snapchat: 'bg-yellow-400 hover:bg-yellow-500',
            pinterest: 'bg-red-700 hover:bg-red-800',
            telegram: 'bg-blue-500 hover:bg-blue-600',
            discord: 'bg-indigo-600 hover:bg-indigo-700',
            behance: 'bg-blue-500 hover:bg-blue-600',
            dribbble: 'bg-pink-500 hover:bg-pink-600',
            medium: 'bg-black hover:bg-gray-900',
            reddit: 'bg-orange-500 hover:bg-orange-600',
            threads: 'bg-black hover:bg-gray-900'
        }
        return colors[key] || 'bg-gray-600 hover:bg-gray-700'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Loading card...</p>
                </div>
            </div>
        )
    }

    if (error || !cardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 mx-auto text-red-400 dark:text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Card Not Found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The card you are looking for does not exist or is not active.'}</p>
                    <a
                        href="/"
                        className="btn-primary inline-flex items-center"
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        )
    }

    // Helper function to strip HTML tags from text
    const stripHTML = (html) => {
        if (!html) return ''
        const tmp = document.createElement('DIV')
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ''
    }

    // Helper function to convert image URL to base64
    const imageToBase64 = async (imageUrl) => {
        try {
            // If already a data URL, extract base64 part
            if (imageUrl.startsWith('data:image')) {
                return imageUrl.split(',')[1]
            }

            // Otherwise fetch the image
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    const base64data = reader.result.split(',')[1] // Remove data:image/jpeg;base64, prefix
                    resolve(base64data)
                }
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
        } catch (error) {
            console.error('Error converting image to base64:', error)
            return null
        }
    }

    const handleDownloadVCard = async () => {
        if (!cardData) return

        // Strip HTML from bio
        const cleanBio = stripHTML(cardData.bio || '')

        // Get current page URL
        const pageUrl = typeof window !== 'undefined' ? window.location.href : ''

        // Build vCard content
        let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${(cardData.name || '').replace(/[,;\\]/g, '')}
N:${(cardData.name || '').replace(/[,;\\]/g, '')};;;;`

        // Add organization
        if (cardData.company) {
            vcard += `\nORG:${cardData.company.replace(/[,;\\]/g, '')}`
        }

        // Add title
        if (cardData.title) {
            vcard += `\nTITLE:${cardData.title.replace(/[,;\\]/g, '')}`
        }

        // Add email
        if (cardData.email) {
            vcard += `\nEMAIL:${cardData.email}`
        }

        // Add all phone numbers
        if (cardData.phone) {
            vcard += `\nTEL;TYPE=CELL:${cardData.phone.replace(/[^0-9+]/g, '')}`
        }
        if (cardData.secondary_phone) {
            vcard += `\nTEL;TYPE=HOME:${cardData.secondary_phone.replace(/[^0-9+]/g, '')}`
        }
        if (cardData.whatsapp) {
            vcard += `\nTEL;TYPE=CELL,VOICE:${cardData.whatsapp.replace(/[^0-9+]/g, '')}`
        }

        // Add page URL instead of website
        if (pageUrl) {
            vcard += `\nURL:${pageUrl}`
        }

        // Add address
        if (cardData.address) {
            vcard += `\nADR;TYPE=WORK:;;${cardData.address.replace(/[,;\\]/g, '')};;;;`
        }

        // Add profile photo if available
        if (cardData.profile_photo) {
            try {
                const base64Image = await imageToBase64(cardData.profile_photo)
                if (base64Image) {
                    // Split base64 into 75 character lines as per vCard spec
                    const lines = base64Image.match(/.{1,75}/g) || []
                    vcard += `\nPHOTO;ENCODING=b;TYPE=JPEG:${lines.join('\n ')}`
                }
            } catch (error) {
                console.error('Error adding photo to vCard:', error)
            }
        }

        // Add bio as note (HTML stripped)
        if (cleanBio) {
            // Escape special characters and split long lines
            const escapedBio = cleanBio.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,')
            const bioLines = escapedBio.match(/.{1,75}/g) || []
            vcard += `\nNOTE:${bioLines.join('\n ')}`
        }

        vcard += '\nEND:VCARD'

        const blob = new Blob([vcard], { type: 'text/vcard' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${(cardData.name || 'card').replace(/\s+/g, '_')}.vcf`
        link.click()
        URL.revokeObjectURL(url)

        // Track contact saved
        if (trackingId) {
            try {
                await visitorTrackingAPI.markContactSaved(trackingId)
            } catch (error) {
                console.error('Failed to track contact save:', error)
            }
        }
    }

    const handleShare = async () => {
        if (!cardData) return

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${cardData.name} - ${cardData.title || ''}`,
                    text: `Check out ${cardData.name}'s smart visiting card`,
                    url: window.location.href
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
            success('Link copied to clipboard!')
        }
    }

    // console.log('cardData', cardData.social_links)
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-8 px-3 sm:px-4 lg:px-8">
            <div className="max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto perspective-1000">
                {/* 3D Card Container */}
                <motion.div
                    initial={{ opacity: 1, y: 0, rotateX: 0 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1, 1, 1)`,
                        transformStyle: 'preserve-3d',
                    }}
                    className="relative transform-gpu"
                >
                    {/* Glassmorphic Card with 3D effect */}
                    <div className="rounded-2xl sm:rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 relative"
                    >
                        {/* Header with gradient background - 3D effect */}
                        <div
                            className="relative p-6 sm:p-8 lg:p-12 overflow-hidden"
                            style={getBackgroundStyle()}
                        >
                            {/* Animated background gradient overlay - no blur */}
                            <div className="absolute inset-0 opacity-30 dark:opacity-20">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent"></div>
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/30 rounded-full"></div>
                            </div>

                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2 z-10">
                                <motion.button
                                    onClick={toggleDarkMode}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center p-2.5 sm:p-2 bg-white/30 rounded-full text-white hover:bg-white/40 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                >
                                    {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                                </motion.button>
                                <motion.button
                                    onClick={handleShare}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center p-2.5 sm:p-2 bg-white/30 rounded-full text-white hover:bg-white/40 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    title="Share this card"
                                >
                                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </div>

                            <div className="text-center relative z-10">
                                <motion.div
                                    initial={{ scale: 1, rotateY: 0 }}
                                    animate={{ scale: 1, rotateY: 0 }}
                                    transition={{ duration: 0 }}
                                    className="mb-4 sm:mb-6"
                                >
                                    {cardData.profile_photo ? (
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full mx-auto border-4 border-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                            <Image
                                                src={cardData.profile_photo}
                                                alt={cardData.name}
                                                width={160}
                                                height={160}
                                                className="w-full h-full object-cover relative z-10"
                                                priority
                                                unoptimized={cardData.profile_photo.startsWith('data:')}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full mx-auto border-4 border-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-white/25 flex items-center justify-center relative"
                                        >
                                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white relative z-10">
                                                {getInitials(cardData.name)}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>

                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
                                    {cardData.name || 'Name'}
                                </h1>
                                {cardData.title && (
                                    <p className="text-lg sm:text-xl text-white/95 mb-1 drop-shadow-md">
                                        {cardData.title}
                                    </p>
                                )}
                                {cardData.company && (
                                    <p className="text-base sm:text-lg text-white/85 drop-shadow-sm">
                                        {cardData.company}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Content - 3D effect */}
                        <div
                            className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 relative"
                        >
                            {/* Bio */}
                            {cardData.bio && (
                                <div
                                    className="mb-6 sm:mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 border border-indigo-100/50 dark:border-gray-600/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_2px_8px_rgba(99,102,241,0.1)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_8px_rgba(99,102,241,0.2)]"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">About</h3>
                                    </div>
                                    <div
                                        className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-medium"
                                        dangerouslySetInnerHTML={{ __html: cardData.bio }}
                                    />
                                </div>
                            )}
                            {/* Contact Information */}
                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                {cardData.email && (
                                    <motion.a
                                        href={`mailto:${cardData.email}`}
                                        whileHover={{ scale: 1.02, x: 5, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 group shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_8px_rgba(59,130,246,0.15),0_4px_12px_rgba(59,130,246,0.2)] dark:hover:shadow-[inset_0_2px_8px_rgba(59,130,246,0.25),0_4px_12px_rgba(59,130,246,0.3)] border border-blue-100/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-500/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 mr-4 group-hover:from-blue-200 group-hover:to-blue-300 dark:group-hover:from-blue-800 dark:group-hover:to-blue-700 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Email</div>
                                            <span className="font-semibold text-sm sm:text-base break-all block">{cardData.email}</span>
                                        </div>
                                    </motion.a>
                                )}

                                {cardData.phone && (
                                    <motion.a
                                        href={`tel:${cardData.phone}`}
                                        whileHover={{ scale: 1.02, x: 5, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 group shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_8px_rgba(34,197,94,0.15),0_4px_12px_rgba(34,197,94,0.2)] dark:hover:shadow-[inset_0_2px_8px_rgba(34,197,94,0.25),0_4px_12px_rgba(34,197,94,0.3)] border border-green-100/50 dark:border-gray-600/50 hover:border-green-300 dark:hover:border-green-500/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 mr-4 group-hover:from-green-200 group-hover:to-green-300 dark:group-hover:from-green-800 dark:group-hover:to-green-700 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Phone</div>
                                            <span className="font-semibold text-sm sm:text-base">{cardData.phone}</span>
                                        </div>
                                    </motion.a>
                                )}

                                {cardData.secondary_phone && (
                                    <motion.a
                                        href={`tel:${cardData.secondary_phone}`}
                                        whileHover={{ scale: 1.02, x: 5, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 group shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_8px_rgba(59,130,246,0.15),0_4px_12px_rgba(59,130,246,0.2)] dark:hover:shadow-[inset_0_2px_8px_rgba(59,130,246,0.25),0_4px_12px_rgba(59,130,246,0.3)] border border-blue-100/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-500/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 mr-4 group-hover:from-blue-200 group-hover:to-blue-300 dark:group-hover:from-blue-800 dark:group-hover:to-blue-700 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Secondary Phone</div>
                                            <span className="font-semibold text-sm sm:text-base">{cardData.secondary_phone}</span>
                                        </div>
                                    </motion.a>
                                )}

                                {cardData.whatsapp && (
                                    <motion.a
                                        href={`https://wa.me/${cardData.whatsapp.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02, x: 5, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 group shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_8px_rgba(34,197,94,0.15),0_4px_12px_rgba(34,197,94,0.2)] dark:hover:shadow-[inset_0_2px_8px_rgba(34,197,94,0.25),0_4px_12px_rgba(34,197,94,0.3)] border border-green-100/50 dark:border-gray-600/50 hover:border-green-300 dark:hover:border-green-500/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 mr-4 group-hover:from-green-200 group-hover:to-green-300 dark:group-hover:from-green-800 dark:group-hover:to-green-700 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">WhatsApp</div>
                                            <span className="font-semibold text-sm sm:text-base">{cardData.whatsapp}</span>
                                        </div>
                                    </motion.a>
                                )}

                                {cardData.website && (
                                    <motion.a
                                        href={cardData.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02, x: 5, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 group shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_8px_rgba(168,85,247,0.15),0_4px_12px_rgba(168,85,247,0.2)] dark:hover:shadow-[inset_0_2px_8px_rgba(168,85,247,0.25),0_4px_12px_rgba(168,85,247,0.3)] border border-purple-100/50 dark:border-gray-600/50 hover:border-purple-300 dark:hover:border-purple-500/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 mr-4 group-hover:from-purple-200 group-hover:to-purple-300 dark:group-hover:from-purple-800 dark:group-hover:to-purple-700 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Website</div>
                                            <span className="font-semibold text-sm sm:text-base break-all block">{cardData.website}</span>
                                        </div>
                                    </motion.a>
                                )}

                                {cardData.address && (
                                    <motion.div
                                        whileHover={{ scale: 1.01, y: -2 }}
                                        className="flex items-start p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-orange-100/50 dark:border-gray-600/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 mr-4 flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Address</div>
                                            <span className="font-semibold text-sm sm:text-base">{cardData.address}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>



                            {/* Social Links */}
                            {cardData.social_links && Object.keys(cardData.social_links).length > 0 && (
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Connect</h3>
                                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                                        {Object.entries(cardData.social_links).map(([key, url], index) => {
                                            if (!url) return null
                                            const Icon = getSocialIcon(key)
                                            const colorClass = getSocialColor(key)

                                            // Safety check - ensure Icon is a valid component
                                            if (!Icon || typeof Icon !== 'function') {
                                                console.warn(`Invalid icon for social link: ${key}`)
                                                return null
                                            }

                                            return (
                                                <motion.a
                                                    key={key}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.4 + index * 0.1 }}
                                                    whileHover={{ scale: 1.15, y: -5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${colorClass} text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-2xl`}
                                                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                                                >
                                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </motion.a>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons - Premium Design with Shimmer & Glow */}
                            <div className={`grid gap-4 sm:gap-5 mb-6 sm:mb-8 ${cardData.enable_appointment !== false ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                                {/* Save Contact Button */}
                                <motion.button
                                    onClick={handleDownloadVCard}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98, y: 0 }}
                                    className="group relative overflow-hidden flex items-center justify-center py-4 sm:py-4 px-6 rounded-2xl text-white text-sm sm:text-base font-bold transition-all duration-300"
                                >
                                    {/* Animated gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-600 dark:via-teal-600 dark:to-cyan-600" />

                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                                    </div>

                                    {/* Glow effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 -z-10 scale-110" />

                                    {/* Top shine */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                                    {/* Inner shadow overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                    {/* Icon with bounce animation */}
                                    <motion.div
                                        className="relative z-10 mr-3"
                                        whileHover={{ y: [0, -3, 0] }}
                                        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 0.5 }}
                                    >
                                        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
                                            <Download className="w-5 h-5 sm:w-5 sm:h-5" />
                                        </div>
                                    </motion.div>

                                    {/* Text */}
                                    <span className="relative z-10 tracking-wide">Save Contact</span>

                                    {/* Bottom border glow */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.button>

                                {/* Book Appointment Button */}
                                {cardData.enable_appointment !== false && (
                                    <motion.button
                                        onClick={() => setShowAppointmentModal(true)}
                                        whileHover={{ scale: 1.02, y: -4 }}
                                        whileTap={{ scale: 0.98, y: 0 }}
                                        className="group relative overflow-hidden flex items-center justify-center py-4 sm:py-4 px-6 rounded-2xl text-white text-sm sm:text-base font-bold transition-all duration-300"
                                    >
                                        {/* Animated gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-600 dark:via-purple-600 dark:to-fuchsia-600" />

                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                                        </div>

                                        {/* Glow effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 -z-10 scale-110" />

                                        {/* Top shine */}
                                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                                        {/* Inner shadow overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                        {/* Icon with pulse animation */}
                                        <motion.div
                                            className="relative z-10 mr-3"
                                            whileHover={{ rotate: [0, -10, 10, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.8 }}
                                        >
                                            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
                                                <Calendar className="w-5 h-5 sm:w-5 sm:h-5" />
                                            </div>
                                        </motion.div>

                                        {/* Text */}
                                        <span className="relative z-10 tracking-wide">Book Appointment</span>

                                        {/* Animated ring effect on hover */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-300 group-hover:scale-105 opacity-0 group-hover:opacity-100" />

                                        {/* Bottom border glow */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </motion.button>
                                )}
                            </div>

                            {/* QR Code & NFC */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
                                <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
                                    {cardData.qr_code && (
                                        <div className="text-center w-full">
                                            <motion.button
                                                onClick={() => setShowQR(!showQR)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mb-3 px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 inline-flex items-center gap-2 shadow-sm hover:shadow-md"
                                            >
                                                <QrCode className="w-4 h-4" />
                                                {showQR ? 'Hide' : 'Show'} QR Code
                                            </motion.button>
                                            {showQR && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                                    transition={{ duration: 0.4, type: "spring" }}
                                                    className="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 inline-block"
                                                >
                                                    <Image
                                                        src={cardData.qr_code}
                                                        alt="QR Code"
                                                        width={192}
                                                        height={192}
                                                        className="w-40 h-40 sm:w-48 sm:h-48"
                                                        unoptimized
                                                    />
                                                    <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">Scan to view this card</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <motion.a
                        href="/"
                        whileHover={{ x: -5 }}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center gap-2 font-medium"
                    >
                        <span>←</span>
                        <span>Create your own smart card</span>
                    </motion.a>
                </div>
            </div>

            {/* Appointment Modal */}
            {cardData && (
                <AppointmentModal
                    isOpen={showAppointmentModal}
                    onClose={() => setShowAppointmentModal(false)}
                    cardSlug={slug}
                    cardId={cardData.id}
                    trackingId={trackingId}
                />
            )}
        </div>
    )
}

