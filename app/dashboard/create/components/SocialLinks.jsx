'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    Instagram,
    Linkedin,
    Youtube,
    Github,
    X,
} from 'lucide-react'
// Using lucide-react icons where available and custom SVGs for others
// Custom SVG icons for social media platforms not available in lucide-react
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

const FacebookIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

// Custom Threads icon component (@ symbol)
const ThreadsIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
    </svg>
);

const socialMediaOptions = [
    {
        key: "facebook",
        label: "Facebook",
        icon: FacebookIcon,
        color: "bg-blue-600",
        hoverColor: "hover:bg-blue-700",
    },
    {
        key: "twitter",
        label: "X (Twitter)",
        icon: X, // Using X icon from lucide-react for the new X logo
        color: "bg-black",
        hoverColor: "hover:bg-gray-900",
    },
    {
        key: "instagram",
        label: "Instagram",
        icon: Instagram,
        color: "bg-gradient-to-br from-purple-600 to-pink-600",
        hoverColor: "hover:opacity-90",
    },
    {
        key: "threads",
        label: "Threads",
        icon: ThreadsIcon,
        color: "bg-black",
        hoverColor: "hover:opacity-90",
    },
    {
        key: "linkedin",
        label: "LinkedIn",
        icon: Linkedin,
        color: "bg-blue-700",
        hoverColor: "hover:bg-blue-800",
    },
    {
        key: "youtube",
        label: "YouTube",
        icon: Youtube,
        color: "bg-red-600",
        hoverColor: "hover:bg-red-700",
    },
    {
        key: "github",
        label: "GitHub",
        icon: Github,
        color: "bg-gray-800",
        hoverColor: "hover:bg-gray-900",
    },
    {
        key: "whatsapp",
        label: "WhatsApp",
        icon: WhatsAppIcon,
        color: "bg-green-500",
        hoverColor: "hover:bg-green-600",
    },
    {
        key: "tiktok",
        label: "TikTok",
        icon: TikTokIcon,
        color: "bg-black",
        hoverColor: "hover:bg-gray-900",
    },
    {
        key: "snapchat",
        label: "Snapchat",
        icon: SnapchatIcon,
        color: "bg-yellow-400",
        hoverColor: "hover:bg-yellow-500",
    },
    {
        key: "pinterest",
        label: "Pinterest",
        icon: PinterestIcon,
        color: "bg-red-700",
        hoverColor: "hover:bg-red-800",
    },
    {
        key: "telegram",
        label: "Telegram",
        icon: TelegramIcon,
        color: "bg-blue-500",
        hoverColor: "hover:bg-blue-600",
    },
    {
        key: "discord",
        label: "Discord",
        icon: DiscordIcon,
        color: "bg-indigo-600",
        hoverColor: "hover:bg-indigo-700",
    },
    {
        key: "behance",
        label: "Behance",
        icon: BehanceIcon,
        color: "bg-blue-500",
        hoverColor: "hover:bg-blue-600",
    },
    {
        key: "dribbble",
        label: "Dribbble",
        icon: DribbbleIcon,
        color: "bg-pink-500",
        hoverColor: "hover:bg-pink-600",
    },
    {
        key: "medium",
        label: "Medium",
        icon: MediumIcon,
        color: "bg-gray-800",
        hoverColor: "hover:bg-gray-900",
    },
    {
        key: "reddit",
        label: "Reddit",
        icon: RedditIcon,
        color: "bg-orange-500",
        hoverColor: "hover:bg-orange-600",
    },
];

export default function SocialLinks({ formData, setFormData, onNext, onBack }) {
    const [activeInput, setActiveInput] = useState(null)

    const handleSocialClick = (key) => {
        setActiveInput(activeInput === key ? null : key)
    }

    const handleInputChange = (key, value) => {
        setFormData({
            ...formData,
            socialLinks: {
                ...formData.socialLinks,
                [key]: value
            }
        })
    }

    const removeSocialLink = (key) => {
        const newSocialLinks = { ...formData.socialLinks }
        delete newSocialLinks[key]
        setFormData({
            ...formData,
            socialLinks: newSocialLinks
        })
        if (activeInput === key) {
            setActiveInput(null)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Social Links</h2>
            <p className="text-gray-600 dark:text-gray-400">Click on any social media icon to add your profile link</p>

            {/* Social Media Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 md:gap-4">
                {socialMediaOptions.map((social) => {
                    const Icon = social.icon
                    const hasValue = formData.socialLinks?.[social.key]
                    const isActive = activeInput === social.key

                    return (
                        <div key={social.key} className="relative">
                            <button
                                type="button"
                                onClick={() => handleSocialClick(social.key)}
                                className={`
                                    w-full aspect-square rounded-lg flex flex-col gap-1 items-center justify-center
                                    transition-all duration-200
                                    ${hasValue
                                        ? `${social.color} text-white shadow-lg scale-105`
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }
                                    ${isActive ? 'ring-2 ring-primary-400 ring-offset-2' : ''}
                                `}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-light md:font-medium">{social.label}</span>
                            </button>
                            {hasValue && !isActive && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeSocialLink(social.key)
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Active Input Field */}
            <AnimatePresence>
                {activeInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {socialMediaOptions.find(s => s.key === activeInput)?.label} URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={formData.socialLinks?.[activeInput] || ''}
                                    onChange={(e) => handleInputChange(activeInput, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder={`https://${activeInput}.com/username`}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setActiveInput(null)}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={onBack} className="btn-outline flex items-center">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <button type="button" onClick={onNext} className="btn-primary flex items-center">
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </motion.div>
    )
}

