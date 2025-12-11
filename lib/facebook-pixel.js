/**
 * Facebook Pixel Event Tracking Utility
 * 
 * This utility provides helper functions to track custom events
 * with Facebook Pixel throughout the application.
 */

/**
 * Check if Facebook Pixel is loaded and available
 */
export const isPixelLoaded = () => {
    return typeof window !== 'undefined' && typeof window.fbq === 'function'
}

/**
 * Track a custom event
 * @param {string} eventName - The name of the event to track
 * @param {object} eventData - Optional event parameters
 */
export const trackEvent = (eventName, eventData = {}) => {
    if (!isPixelLoaded()) {
        console.warn('Facebook Pixel is not loaded. Event not tracked:', eventName)
        return
    }

    try {
        window.fbq('track', eventName, eventData)
        console.log('Facebook Pixel event tracked:', eventName, eventData)
    } catch (error) {
        console.error('Error tracking Facebook Pixel event:', error)
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
 * Track page view
 */
export const trackPageView = () => {
    trackEvent('PageView')
}

/**
 * Track when a user views content
 * @param {string} contentName - Name of the content
 * @param {string} contentCategory - Category of the content
 */
export const trackViewContent = (contentName, contentCategory = '') => {
    trackEvent('ViewContent', {
        content_name: contentName,
        content_category: contentCategory,
    })
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
 * Track when a user completes registration
 * @param {string} registrationMethod - Method of registration (e.g., 'email', 'google')
 */
export const trackCompleteRegistration = (registrationMethod = 'email') => {
    trackEvent('CompleteRegistration', {
        status: true,
        method: registrationMethod,
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
 * Track when a user leads (form submission, etc.)
 * @param {object} leadData - Lead information
 */
export const trackLead = (leadData = {}) => {
    trackEvent('Lead', {
        content_name: leadData.content_name || 'Lead Form',
        value: leadData.value || 0,
        currency: leadData.currency || 'USD',
    })
}

/**
 * Track when a user contacts you
 */
export const trackContact = () => {
    trackEvent('Contact')
}

/**
 * Track when a user subscribes
 * @param {string} subscriptionType - Type of subscription
 */
export const trackSubscribe = (subscriptionType = 'newsletter') => {
    trackEvent('Subscribe', {
        content_name: subscriptionType,
    })
}

/**
 * Track when a user creates a card
 * @param {object} cardData - Card information
 */
export const trackCardCreated = (cardData) => {
    trackCustom('CardCreated', {
        card_id: cardData.id,
        card_type: cardData.type || 'standard',
    })
}

/**
 * Track when a user views a card
 * @param {string} cardId - Card ID
 */
export const trackCardViewed = (cardId) => {
    trackCustom('CardViewed', {
        card_id: cardId,
    })
}

/**
 * Track when a user shares a card
 * @param {string} cardId - Card ID
 * @param {string} shareMethod - Method of sharing (e.g., 'facebook', 'twitter', 'whatsapp')
 */
export const trackCardShared = (cardId, shareMethod) => {
    trackCustom('CardShared', {
        card_id: cardId,
        share_method: shareMethod,
    })
}

/**
 * Track when a user books an appointment
 * @param {object} appointmentData - Appointment information
 */
export const trackAppointmentBooked = (appointmentData) => {
    trackCustom('AppointmentBooked', {
        card_id: appointmentData.card_id,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time,
    })
}

