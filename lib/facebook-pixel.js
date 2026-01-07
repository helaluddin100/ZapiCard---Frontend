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
 * Track a custom event (both client-side and server-side)
 * @param {string} eventName - The name of the event to track
 * @param {object} eventData - Optional event parameters
 * @param {object} userData - Optional user data for server-side tracking
 */
export const trackEvent = async (eventName, eventData = {}, userData = {}) => {
    // Client-side tracking
    if (isPixelLoaded()) {
        try {
            window.fbq('track', eventName, eventData)
            console.log('Facebook Pixel (client-side) event tracked:', eventName, eventData)
        } catch (error) {
            console.error('Error tracking Facebook Pixel (client-side) event:', error)
        }
    }

    // Server-side tracking
    try {
        await serverTracking.trackServerEvent(eventName, eventData, userData)
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
        currency: productData.currency || 'USD',
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
        currency: checkoutData.currency || 'USD',
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
        currency: purchaseData.currency || 'USD',
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
    await trackEvent('Lead', {
        content_name: leadData.content_name || 'Lead Form',
        value: leadData.value || 0,
        currency: leadData.currency || 'USD',
    }, userData)
    // Also track server-side separately
    await serverTracking.trackServerLead(userData, {
        content_name: leadData.content_name || 'Lead Form',
        value: leadData.value || 0,
        currency: leadData.currency || 'USD',
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
 * @param {object} cardData - Card information
 * @param {object} userData - User data for server-side tracking
 */
export const trackCardCreated = async (cardData, userData = {}) => {
    trackCustom('CardCreated', {
        card_id: cardData.id,
        card_type: cardData.type || 'standard',
    })
    // Also track server-side
    await serverTracking.trackServerCardCreated(cardData, userData)
}

/**
 * Track when a user views a card (both client-side and server-side)
 * @param {string} cardId - Card ID
 * @param {string} cardSlug - Card slug (optional)
 * @param {object} userData - User data for server-side tracking
 */
export const trackCardViewed = async (cardId, cardSlug = null, userData = {}) => {
    trackCustom('CardViewed', {
        card_id: cardId,
    })
    // Also track server-side
    await serverTracking.trackServerCardViewed(cardId, cardSlug, userData)
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

