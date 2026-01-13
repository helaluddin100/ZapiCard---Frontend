/**
 * Facebook Pixel Event Tracking Utility
 * 
 * This utility provides helper functions to track custom events
 * with Facebook Pixel throughout the application.
 * 
 * Now includes both client-side (browser) and server-side tracking
 */

import * as serverTracking from './facebook-server-tracking'

/**
 * Check if Facebook Pixel is loaded and available
 */
export const isPixelLoaded = () => {
    return typeof window !== 'undefined' && typeof window.fbq === 'function'
}

/**
 * Get user data from various sources (localStorage, auth context, etc.)
 */
const getUserDataFromStorage = async () => {
    if (typeof window === 'undefined') return {}
    
    const userData = {}
    
    // Try to get from localStorage
    try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            const user = JSON.parse(userStr)
            if (user.email) userData.email = user.email
            if (user.phone) userData.phone = user.phone
            if (user.name) userData.name = user.name
        }
    } catch (error) {
        // Ignore localStorage errors
    }
    
    // Try to get from auth API if available
    try {
        const { authAPI } = await import('./api')
        const response = await authAPI.getCurrentUser()
        const user = response.data || response
        
        if (user?.email && !userData.email) userData.email = user.email
        if (user?.phone && !userData.phone) userData.phone = user.phone
        if (user?.name && !userData.name) userData.name = user.name
    } catch (error) {
        // User not authenticated or API call failed
        // This is fine, we'll just use what we have
    }
    
    return userData
}

/**
 * Track a custom event (both client-side and server-side)
 * @param {string} eventName - The name of the event to track
 * @param {object} eventData - Optional event parameters (custom_data for client-side)
 * @param {object} userData - Optional user data for server-side tracking
 */
export const trackEvent = async (eventName, eventData = {}, userData = {}) => {
    // Merge user data from storage if available (async)
    const storedUserData = await getUserDataFromStorage()
    const mergedUserData = { ...storedUserData, ...userData }
    
    // Client-side tracking with custom data
    if (isPixelLoaded()) {
        try {
            // Send event with custom data
            window.fbq('track', eventName, eventData)
            console.log('✅ Facebook Pixel (client-side) event tracked:', eventName, eventData)
        } catch (error) {
            console.error('Error tracking Facebook Pixel (client-side) event:', error)
        }
    }

    // Server-side tracking (sends to backend which forwards to Facebook Conversions API)
    try {
        await serverTracking.trackServerEvent(eventName, {}, mergedUserData, eventData)
    } catch (error) {
        console.error('Error tracking Facebook Pixel (server-side) event:', error)
    }
}

/**
 * Track a custom event with custom parameters
 * @param {string} eventName - The name of the event to track
 * @param {object} eventData - Event parameters
 * @param {object} customData - Custom data object
 */
export const trackCustom = (eventName, eventData = {}, customData = {}) => {
    if (!isPixelLoaded()) {
        console.warn('Facebook Pixel is not loaded. Custom event not tracked:', eventName)
        return
    }

    try {
        window.fbq('trackCustom', eventName, eventData, customData)
        console.log('Facebook Pixel custom event tracked:', eventName, eventData, customData)
    } catch (error) {
        console.error('Error tracking Facebook Pixel custom event:', error)
    }
}

/**
 * Track page view (both client-side and server-side)
 */
export const trackPageView = async (userData = {}) => {
    await trackEvent('PageView', {}, userData)
    // Also track server-side separately for better tracking
    await serverTracking.trackServerPageView(null, userData)
}

/**
 * Track when a user views content (both client-side and server-side)
 * @param {string} contentName - Name of the content
 * @param {string} contentCategory - Category of the content
 * @param {object} userData - Optional user data for server-side tracking
 */
export const trackViewContent = async (contentName, contentCategory = '', userData = {}) => {
    await trackEvent('ViewContent', {
        content_name: contentName,
        content_category: contentCategory,
    }, userData)
    // Also track server-side separately
    await serverTracking.trackServerViewContent(contentName, contentCategory, userData)
}

/**
 * Track when a user searches
 * @param {string} searchString - The search query
 */
export const trackSearch = (searchString) => {
    trackEvent('Search', {
        search_string: searchString,
    })
}

/**
 * Track when a user adds to cart
 * @param {object} productData - Product information
 */
export const trackAddToCart = (productData) => {
    trackEvent('AddToCart', {
        content_name: productData.name,
        content_ids: [productData.id],
        content_type: 'product',
        value: productData.value || productData.price,
        currency: productData.currency || 'BDT', // ✅ BDT, not USD
    })
}

/**
 * Track when a user initiates checkout
 * @param {object} checkoutData - Checkout information
 */
export const trackInitiateCheckout = (checkoutData) => {
    trackEvent('InitiateCheckout', {
        content_name: checkoutData.name,
        content_ids: checkoutData.ids || [],
        content_type: 'product',
        value: checkoutData.value || checkoutData.total,
        currency: checkoutData.currency || 'BDT', // ✅ BDT, not USD
        num_items: checkoutData.num_items || 1,
    })
}

/**
 * Track when a purchase is completed
 * @param {object} purchaseData - Purchase information
 */
export const trackPurchase = (purchaseData) => {
    trackEvent('Purchase', {
        content_name: purchaseData.name,
        content_ids: purchaseData.ids || [],
        content_type: 'product',
        value: purchaseData.value || purchaseData.total,
        currency: purchaseData.currency || 'BDT', // ✅ BDT, not USD
        num_items: purchaseData.num_items || 1,
    })
}

/**
 * Track when a user completes registration (both client-side and server-side)
 * @param {string} registrationMethod - Method of registration (e.g., 'email', 'google')
 * @param {object} userData - User data (email, phone, etc.) for server-side tracking
 */
export const trackCompleteRegistration = async (registrationMethod = 'email', userData = {}) => {
    await trackEvent('CompleteRegistration', {
        status: true,
        method: registrationMethod,
    }, userData)
    // Also track server-side separately
    await serverTracking.trackServerCompleteRegistration(userData, {
        method: registrationMethod
    })
}

/**
 * Track when a user starts registration
 * @param {string} registrationMethod - Method of registration
 */
export const trackStartTrial = (registrationMethod = 'email') => {
    trackEvent('StartTrial', {
        method: registrationMethod,
    })
}

/**
 * Track when a user leads (form submission, etc.) (both client-side and server-side)
 * @param {object} leadData - Lead information
 * @param {object} userData - User data for server-side tracking
 */
export const trackLead = async (leadData = {}, userData = {}) => {
    const storedUserData = await getUserDataFromStorage()
    const mergedUserData = { ...storedUserData, ...userData }
    
    await trackEvent('Lead', {
        content_name: leadData.content_name || 'Lead Form',
        value: leadData.value || 0,
        currency: leadData.currency || 'BDT', // ✅ BDT, not USD
    }, mergedUserData)
    // Also track server-side separately
    await serverTracking.trackServerLead(mergedUserData, {
        content_name: leadData.content_name || 'Lead Form',
        value: leadData.value || 0,
        currency: leadData.currency || 'BDT',
    })
}

/**
 * Track when a user contacts you (both client-side and server-side)
 * @param {object} userData - User data for server-side tracking
 */
export const trackContact = async (userData = {}) => {
    await trackEvent('Contact', {}, userData)
    // Also track server-side separately
    await serverTracking.trackServerContact(userData)
}

/**
 * Track when a user subscribes (both client-side and server-side)
 * @param {string} subscriptionType - Type of subscription
 * @param {object} userData - User data for server-side tracking
 */
export const trackSubscribe = async (subscriptionType = 'newsletter', userData = {}) => {
    await trackEvent('Subscribe', {
        content_name: subscriptionType,
    }, userData)
    // Also track server-side separately
    await serverTracking.trackServerSubscribe(userData, {
        content_name: subscriptionType
    })
}

/**
 * Track when a user creates a card (both client-side and server-side)
 * Sends comprehensive data matching server-side tracking
 * @param {object} cardData - Card information (from API response)
 * @param {object} userData - User data for server-side tracking
 */
export const trackCardCreated = async (cardData, userData = {}) => {
    // Get user data from storage and merge (async)
    const storedUserData = await getUserDataFromStorage()
    const mergedUserData = { ...storedUserData, ...userData }
    
    // Prepare comprehensive custom data matching server-side
    const customData = {
        card_id: cardData.id,
        card_name: cardData.name,
        card_slug: cardData.slug,
        card_url: cardData.card_url || null,
        content_name: cardData.name,
        content_category: 'Digital Card',
        content_type: 'digital_card',
        content_ids: [String(cardData.id)],
        value: 1,
        currency: 'BDT', // ✅ BDT, not USD
    }
    
    // Add card details if available
    if (cardData.title) customData.card_title = cardData.title
    if (cardData.company) customData.card_company = cardData.company
    if (cardData.email) customData.card_email = cardData.email
    if (cardData.phone) customData.card_phone = cardData.phone
    
    // Client-side tracking with comprehensive data
    if (isPixelLoaded()) {
        try {
            // Track as custom event with all data
            window.fbq('trackCustom', 'CardCreated', customData)
            console.log('✅ Facebook Pixel (client-side) CardCreated tracked:', customData)
        } catch (error) {
            console.error('Error tracking Facebook Pixel (client-side) CardCreated:', error)
        }
    }
    
    // Server-side tracking (already handled by backend automatically, but also send from frontend for redundancy)
    await serverTracking.trackServerCardCreated(cardData, mergedUserData)
}

/**
 * Track when a user views a card (both client-side and server-side)
 * Sends comprehensive data matching server-side tracking
 * @param {string|object} cardIdOrData - Card ID or full card data object
 * @param {string} cardSlug - Card slug (optional)
 * @param {object} userData - User data for server-side tracking
 */
export const trackCardViewed = async (cardIdOrData, cardSlug = null, userData = {}) => {
    // Handle both card ID and card data object
    const cardId = typeof cardIdOrData === 'object' ? cardIdOrData.id : cardIdOrData
    const cardData = typeof cardIdOrData === 'object' ? cardIdOrData : null
    
    // Prepare comprehensive custom data matching server-side
    const customData = {
        card_id: cardId,
        content_name: cardData?.name || 'Card',
        content_category: 'Digital Card',
        content_type: 'digital_card',
        content_ids: [String(cardId)],
    }
    
    if (cardSlug) customData.card_slug = cardSlug
    if (cardData?.slug) customData.card_slug = cardData.slug
    if (cardData?.name) customData.card_name = cardData.name
    if (cardData?.card_url) customData.card_url = cardData.card_url
    
    // Client-side tracking
    if (isPixelLoaded()) {
        try {
            window.fbq('track', 'ViewContent', customData)
            window.fbq('trackCustom', 'CardViewed', customData)
            console.log('✅ Facebook Pixel (client-side) CardViewed tracked:', customData)
        } catch (error) {
            console.error('Error tracking Facebook Pixel (client-side) CardViewed:', error)
        }
    }
    
    // Server-side tracking
    await serverTracking.trackServerCardViewed(cardId, cardSlug || cardData?.slug, userData)
}

/**
 * Track when a user shares a card (both client-side and server-side)
 * @param {string} cardId - Card ID
 * @param {string} shareMethod - Method of sharing (e.g., 'facebook', 'twitter', 'whatsapp')
 * @param {object} userData - User data for server-side tracking
 */
export const trackCardShared = async (cardId, shareMethod, userData = {}) => {
    trackCustom('CardShared', {
        card_id: cardId,
        share_method: shareMethod,
    })
    // Also track server-side
    await serverTracking.trackServerCardShared(cardId, shareMethod, userData)
}

/**
 * Track when a user books an appointment (both client-side and server-side)
 * @param {object} appointmentData - Appointment information
 * @param {object} userData - User data for server-side tracking
 */
export const trackAppointmentBooked = async (appointmentData, userData = {}) => {
    trackCustom('AppointmentBooked', {
        card_id: appointmentData.card_id,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time,
    })
    // Also track server-side
    await serverTracking.trackServerAppointmentBooked(appointmentData, userData)
}

/**
 * Track when a user creates a health card (both client-side and server-side)
 * Sends comprehensive data matching server-side tracking
 * @param {object} healthCardData - Health card information (from API response)
 * @param {object} userData - User data for server-side tracking
 */
export const trackHealthCardCreated = async (healthCardData, userData = {}) => {
    // Get user data from storage and merge (async)
    const storedUserData = await getUserDataFromStorage()
    const mergedUserData = { ...storedUserData, ...userData }
    
    // Prepare comprehensive custom data matching server-side
    const customData = {
        health_card_id: healthCardData.id,
        person_name: healthCardData.person_name,
        card_slug: healthCardData.slug,
        card_type: healthCardData.card_type,
        content_name: healthCardData.person_name,
        content_category: 'Health Card',
        content_type: 'health_card',
        content_ids: [String(healthCardData.id)],
        value: 1,
        currency: 'BDT', // ✅ BDT, not USD
    }
    
    // Add health card details if available
    if (healthCardData.blood_group) customData.blood_group = healthCardData.blood_group
    if (healthCardData.date_of_birth) customData.date_of_birth = healthCardData.date_of_birth
    if (healthCardData.gender) customData.gender = healthCardData.gender
    if (healthCardData.expected_delivery_date) customData.expected_delivery_date = healthCardData.expected_delivery_date
    if (healthCardData.emergency_contact) customData.has_emergency_contact = true
    if (healthCardData.allergies) customData.has_allergies = true
    
    // Client-side tracking with comprehensive data
    if (isPixelLoaded()) {
        try {
            window.fbq('trackCustom', 'HealthCardCreated', customData)
            console.log('✅ Facebook Pixel (client-side) HealthCardCreated tracked:', customData)
        } catch (error) {
            console.error('Error tracking Facebook Pixel (client-side) HealthCardCreated:', error)
        }
    }
    
    // Server-side tracking (already handled by backend automatically, but also send from frontend for redundancy)
    await serverTracking.trackServerHealthCardCreated(healthCardData, mergedUserData)
}

