/**
 * Facebook Server-Side Tracking Utility
 * 
 * This utility sends events to the backend which then forwards them
 * to Facebook Conversions API for server-side tracking.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * Get Facebook cookies (fbp and fbc) from browser
 */
const getFacebookCookies = () => {
    if (typeof window === 'undefined') return {}

    const cookies = {}
    const cookieString = document.cookie

    // Get _fbp cookie
    const fbpMatch = cookieString.match(/_fbp=([^;]+)/)
    if (fbpMatch) {
        cookies.fbp = fbpMatch[1]
    }

    // Get _fbc cookie
    const fbcMatch = cookieString.match(/_fbc=([^;]+)/)
    if (fbcMatch) {
        cookies.fbc = fbcMatch[1]
    }

    return cookies
}

/**
 * Get user data from various sources
 */
const getUserData = (additionalData = {}) => {
    const fbCookies = getFacebookCookies()

    return {
        ...fbCookies,
        ...additionalData
    }
}

/**
 * Send event to backend for server-side tracking
 * 
 * @param {string} eventName - Event name (PageView, ViewContent, Lead, etc.)
 * @param {object} eventData - Event data
 * @param {object} userData - User data (email, phone, etc.)
 * @param {object} customData - Custom event data
 */
export const trackServerEvent = async (eventName, eventData = {}, userData = {}, customData = {}) => {
    try {
        // Get Facebook cookies
        const fbCookies = getFacebookCookies()
        const mergedUserData = {
            ...getUserData(userData),
            ...fbCookies
        }

        const response = await fetch(`${API_BASE_URL}/facebook/track-event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                event_name: eventName,
                user_data: mergedUserData,
                event_data: eventData,
                custom_data: customData
            })
        })

        const data = await response.json()

        if (data.status === 'success') {
            console.log('✅ Facebook Server-Side Event tracked:', eventName, {
                events_received: data.data?.events_received,
                messages: data.data?.messages
            })
            return { success: true, data }
        } else {
            console.error('❌ Facebook Server-Side Event failed:', eventName, {
                message: data.message,
                error: data.data
            })
            return { success: false, data }
        }
    } catch (error) {
        console.error('Error tracking Facebook Server-Side event:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Track PageView event (server-side)
 */
export const trackServerPageView = async (pageUrl = null, userData = {}) => {
    if (typeof window === 'undefined') return

    const url = pageUrl || window.location.href

    return trackServerEvent('PageView', {
        event_source_url: url
    }, userData)
}

/**
 * Track ViewContent event (server-side)
 */
export const trackServerViewContent = async (contentName, contentCategory = '', userData = {}, customData = {}) => {
    return trackServerEvent('ViewContent', {}, userData, {
        content_name: contentName,
        content_category: contentCategory,
        ...customData
    })
}

/**
 * Track Lead event (server-side)
 */
export const trackServerLead = async (userData = {}, customData = {}) => {
    return trackServerEvent('Lead', {}, userData, customData)
}

/**
 * Track CompleteRegistration event (server-side)
 */
export const trackServerCompleteRegistration = async (userData = {}, customData = {}) => {
    return trackServerEvent('CompleteRegistration', {}, userData, customData)
}

/**
 * Track Purchase event (server-side)
 */
export const trackServerPurchase = async (value, currency = 'BDT', userData = {}, customData = {}) => {
    return trackServerEvent('Purchase', {}, userData, {
        value,
        currency,
        ...customData
    })
}

/**
 * Track InitiateCheckout event (server-side)
 */
export const trackServerInitiateCheckout = async (value, currency = 'BDT', userData = {}, customData = {}) => {
    return trackServerEvent('InitiateCheckout', {}, userData, {
        value,
        currency,
        ...customData
    })
}

/**
 * Track AddToCart event (server-side)
 */
export const trackServerAddToCart = async (value, currency = 'BDT', userData = {}, customData = {}) => {
    return trackServerEvent('AddToCart', {}, userData, {
        value,
        currency,
        ...customData
    })
}

/**
 * Track Search event (server-side)
 */
export const trackServerSearch = async (searchString, userData = {}, customData = {}) => {
    return trackServerEvent('Search', {}, userData, {
        search_string: searchString,
        ...customData
    })
}

/**
 * Track Contact event (server-side)
 */
export const trackServerContact = async (userData = {}, customData = {}) => {
    return trackServerEvent('Contact', {}, userData, customData)
}

/**
 * Track Subscribe event (server-side)
 */
export const trackServerSubscribe = async (userData = {}, customData = {}) => {
    return trackServerEvent('Subscribe', {}, userData, customData)
}

/**
 * Track custom event (server-side)
 */
export const trackServerCustomEvent = async (eventName, userData = {}, customData = {}) => {
    return trackServerEvent(eventName, {}, userData, customData)
}

/**
 * Track Card Created event (server-side)
 * Sends comprehensive data matching backend implementation
 */
export const trackServerCardCreated = async (cardData, userData = {}) => {
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
        currency: 'BDT',
    }

    // Add card details if available
    if (cardData.title) customData.card_title = cardData.title
    if (cardData.company) customData.card_company = cardData.company
    if (cardData.email) customData.card_email = cardData.email
    if (cardData.phone) customData.card_phone = cardData.phone

    return trackServerCustomEvent('CardCreated', userData, customData)
}

/**
 * Track Card Viewed event (server-side)
 * Sends comprehensive data matching backend implementation
 */
export const trackServerCardViewed = async (cardId, cardSlug = null, userData = {}) => {
    const customData = {
        card_id: cardId,
        content_name: 'Card',
        content_category: 'Digital Card',
        content_type: 'digital_card',
        content_ids: [String(cardId)],
    }

    if (cardSlug) customData.card_slug = cardSlug

    return trackServerCustomEvent('CardViewed', userData, customData)
}

/**
 * Track Card Shared event (server-side)
 */
export const trackServerCardShared = async (cardId, shareMethod, userData = {}) => {
    return trackServerCustomEvent('CardShared', userData, {
        card_id: cardId,
        share_method: shareMethod
    })
}

/**
 * Track Appointment Booked event (server-side)
 */
export const trackServerAppointmentBooked = async (appointmentData, userData = {}) => {
    return trackServerCustomEvent('AppointmentBooked', userData, {
        card_id: appointmentData.card_id,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time
    })
}

/**
 * Track button/link click (server-side)
 */
export const trackServerClick = async (elementName, elementType = 'button', userData = {}, customData = {}) => {
    return trackServerCustomEvent('Click', userData, {
        element_name: elementName,
        element_type: elementType,
        ...customData
    })
}

/**
 * Track form submission (server-side)
 */
export const trackServerFormSubmit = async (formName, userData = {}, customData = {}) => {
    return trackServerCustomEvent('FormSubmit', userData, {
        form_name: formName,
        ...customData
    })
}

/**
 * Track scroll depth (server-side)
 */
export const trackServerScrollDepth = async (depth, userData = {}, customData = {}) => {
    return trackServerCustomEvent('ScrollDepth', userData, {
        scroll_depth: depth,
        ...customData
    })
}

/**
 * Track time on page (server-side)
 */
export const trackServerTimeOnPage = async (timeInSeconds, userData = {}, customData = {}) => {
    return trackServerCustomEvent('TimeOnPage', userData, {
        time_on_page: timeInSeconds,
        ...customData
    })
}

/**
 * Track Health Card Created event (server-side)
 * Sends comprehensive data matching backend implementation
 */
export const trackServerHealthCardCreated = async (healthCardData, userData = {}) => {
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
        currency: 'BDT',
    }

    // Add health card details if available
    if (healthCardData.blood_group) customData.blood_group = healthCardData.blood_group
    if (healthCardData.date_of_birth) customData.date_of_birth = healthCardData.date_of_birth
    if (healthCardData.gender) customData.gender = healthCardData.gender
    if (healthCardData.expected_delivery_date) customData.expected_delivery_date = healthCardData.expected_delivery_date
    if (healthCardData.emergency_contact) customData.has_emergency_contact = true
    if (healthCardData.allergies) customData.has_allergies = true

    return trackServerCustomEvent('HealthCardCreated', userData, customData)
}

