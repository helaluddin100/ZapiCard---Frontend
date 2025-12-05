import { UAParser } from 'ua-parser-js'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

/**
 * Collect comprehensive visitor data
 */
export async function collectVisitorData() {
    const data = {
        // Browser and Device Info
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages || [],
        platform: navigator.platform,

        // Screen Info
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        screenColorDepth: window.screen.colorDepth,
        screenPixelDepth: window.screen.pixelDepth,
        screenOrientation: window.screen.orientation?.type || null,

        // Viewport Info
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,

        // Timezone
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),

        // Browser Geolocation (if available and permitted)
        geolocation: null,

        // Connection Info (if available)
        connectionType: navigator.connection?.effectiveType || null,
        connectionDownlink: navigator.connection?.downlink || null,
        connectionRtt: navigator.connection?.rtt || null,

        // Hardware Info
        hardwareConcurrency: navigator.hardwareConcurrency || null,
        deviceMemory: navigator.deviceMemory || null,

        // Media Devices (if available)
        maxTouchPoints: navigator.maxTouchPoints || 0,

        // Cookie Enabled
        cookieEnabled: navigator.cookieEnabled,

        // Do Not Track
        doNotTrack: navigator.doNotTrack || null,

        // Referrer
        referrer: document.referrer || null,

        // URL Info
        url: window.location.href,
        hostname: window.location.hostname,
        pathname: window.location.pathname,

        // Timestamp
        timestamp: new Date().toISOString(),
    }

    // Parse User Agent using UAParser
    const parser = new UAParser()
    const uaResult = parser.getResult()

    data.parsedUA = {
        browser: {
            name: uaResult.browser.name || null,
            version: uaResult.browser.version || null,
        },
        engine: {
            name: uaResult.engine.name || null,
            version: uaResult.engine.version || null,
        },
        os: {
            name: uaResult.os.name || null,
            version: uaResult.os.version || null,
        },
        device: {
            model: uaResult.device.model || null,
            type: uaResult.device.type || null,
            vendor: uaResult.device.vendor || null,
        },
        cpu: {
            architecture: uaResult.cpu.architecture || null,
        },
    }

    // Skip geolocation to avoid permission prompts
    // Geolocation is now optional and won't block the page load
    const geoData = {
        error: 'Geolocation skipped to avoid permission prompts',
        skipped: true,
    }

    if (geoData.latitude && geoData.longitude) {
        data.geolocation = geoData
        console.log('✅ Browser geolocation obtained:', geoData)

        // Get location details (country, city, region) from coordinates using reverse geocoding
        try {
            const locationDetails = await getLocationFromCoordinates(geoData.latitude, geoData.longitude)
            if (locationDetails) {
                data.geolocation = {
                    ...geoData,
                    ...locationDetails
                }
                console.log('✅ Location details from coordinates:', locationDetails)
            }
        } catch (error) {
            console.warn('⚠️ Reverse geocoding failed:', error.message)
        }
    } else {
        console.warn('⚠️ Browser geolocation not available:', geoData.error || 'Unknown error')
        data.geolocation = geoData
    }

    // Try to get country from browser locale/language
    const countryFromLocale = getCountryFromLocale()
    if (countryFromLocale && !data.geolocation?.country) {
        data.geolocation = {
            ...data.geolocation,
            country: countryFromLocale,
        }
        console.log('✅ Country from browser locale:', countryFromLocale)
    }

    // Get Browser Fingerprint (async) - with timeout
    try {
        const fpPromise = FingerprintJS.load({ delayFallback: 50 })
        const fp = await Promise.race([
            fpPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('FingerprintJS timeout')), 3000))
        ])
        const result = await Promise.race([
            fp.get(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('FingerprintJS get timeout')), 3000))
        ])

        data.fingerprint = {
            visitorId: result.visitorId,
            confidence: result.confidence?.score || null,
            components: result.components || null,
        }
    } catch (error) {
        console.warn('FingerprintJS error:', error)
        data.fingerprint = {
            visitorId: null,
            confidence: null,
            error: 'Failed to generate fingerprint',
        }
    }

    return data
}

/**
 * Get location details (country, city, region) from coordinates using reverse geocoding
 */
async function getLocationFromCoordinates(latitude, longitude) {
    try {
        // Try OpenStreetMap Nominatim API (free, no API key required)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'ZapyCard Visitor Tracking',
                    'Accept-Language': navigator.language || 'en',
                }
            }
        )

        if (response.ok) {
            const data = await response.json()

            if (data && data.address) {
                return {
                    country: data.address.country || null,
                    city: data.address.city || data.address.town || data.address.village || data.address.municipality || null,
                    region: data.address.state || data.address.region || data.address.province || null,
                    postal_code: data.address.postcode || null,
                    address: data.display_name || null,
                }
            }
        }
    } catch (error) {
        console.warn('OpenStreetMap reverse geocoding failed:', error)
    }

    // Fallback: Try BigDataCloud API (free tier)
    try {
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${navigator.language || 'en'}`
        )

        if (response.ok) {
            const data = await response.json()

            if (data) {
                return {
                    country: data.countryName || null,
                    city: data.city || data.locality || null,
                    region: data.principalSubdivision || data.administrativeArea || null,
                    postal_code: data.postcode || null,
                    address: data.formatted || null,
                }
            }
        }
    } catch (error) {
        console.warn('BigDataCloud reverse geocoding failed:', error)
    }

    return null
}

/**
 * Get country from browser locale/language
 */
function getCountryFromLocale() {
    try {
        // Try to get country from timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (timezone) {
            // Extract country from timezone (e.g., "Asia/Dhaka" -> "BD")
            const timezoneCountryMap = {
                'Asia/Dhaka': 'Bangladesh',
                'Asia/Kolkata': 'India',
                'America/New_York': 'United States',
                'America/Los_Angeles': 'United States',
                'Europe/London': 'United Kingdom',
                // Add more as needed
            }

            if (timezoneCountryMap[timezone]) {
                return timezoneCountryMap[timezone]
            }
        }

        // Try to get from language
        const lang = navigator.language || navigator.languages?.[0]
        if (lang) {
            const langToCountry = {
                'en-US': 'United States',
                'en-GB': 'United Kingdom',
                'en-BD': 'Bangladesh',
                'bn-BD': 'Bangladesh',
                'bn': 'Bangladesh',
                'en-IN': 'India',
                'hi-IN': 'India',
                // Add more as needed
            }

            if (langToCountry[lang]) {
                return langToCountry[lang]
            }
        }
    } catch (error) {
        console.warn('Failed to get country from locale:', error)
    }

    return null
}

/**
 * Get simplified visitor data for API (only essential fields)
 */
export async function getVisitorDataForAPI() {
    try {
        const fullData = await collectVisitorData()

        // Ensure all values are properly formatted
        const visitorData = {
            // Essential browser/device info
            user_agent: fullData.userAgent || null,
            browser: fullData.parsedUA?.browser?.name || null,
            browser_version: fullData.parsedUA?.browser?.version || null,
            engine: fullData.parsedUA?.engine?.name || null,
            engine_version: fullData.parsedUA?.engine?.version || null,
            os: fullData.parsedUA?.os?.name || null,
            os_version: fullData.parsedUA?.os?.version || null,
            device_type: fullData.parsedUA?.device?.type || 'desktop',
            device_model: fullData.parsedUA?.device?.model || null,
            device_vendor: fullData.parsedUA?.device?.vendor || null,
            cpu_architecture: fullData.parsedUA?.cpu?.architecture || null,

            // Screen and viewport
            screen_width: fullData.screenWidth || null,
            screen_height: fullData.screenHeight || null,
            screen_color_depth: fullData.screenColorDepth || null,
            viewport_width: fullData.viewportWidth || null,
            viewport_height: fullData.viewportHeight || null,
            screen_orientation: fullData.screenOrientation || null,

            // Location and timezone
            timezone: fullData.timezone || null,
            timezone_offset: fullData.timezoneOffset || null,
            language: fullData.language || null,
            languages: (fullData.languages && Array.isArray(fullData.languages)) ? fullData.languages.join(',') : null,

            // Browser Geolocation (if available)
            browser_latitude: fullData.geolocation?.latitude || null,
            browser_longitude: fullData.geolocation?.longitude || null,
            browser_geolocation_accuracy: fullData.geolocation?.accuracy || null,
            browser_geolocation_error: fullData.geolocation?.error || null,

            // Location from browser geolocation (reverse geocoded)
            browser_country: fullData.geolocation?.country || null,
            browser_city: fullData.geolocation?.city || null,
            browser_region: fullData.geolocation?.region || null,

            // Connection
            connection_type: fullData.connectionType || null,
            connection_downlink: fullData.connectionDownlink || null,
            connection_rtt: fullData.connectionRtt || null,

            // Hardware
            hardware_concurrency: fullData.hardwareConcurrency || null,
            device_memory: fullData.deviceMemory || null,
            max_touch_points: fullData.maxTouchPoints || 0,

            // Privacy and settings
            cookie_enabled: fullData.cookieEnabled !== undefined ? fullData.cookieEnabled : null,
            do_not_track: fullData.doNotTrack || null,

            // Navigation
            referrer: fullData.referrer || null,
            url: fullData.url || null,
            hostname: fullData.hostname || null,
            pathname: fullData.pathname || null,

            // Fingerprint
            visitor_id: fullData.fingerprint?.visitorId || null,
            fingerprint_confidence: fullData.fingerprint?.confidence || null,

            // Additional data (stored as JSON)
            additional_data: {
                full_ua_parsed: fullData.parsedUA || null,
                fingerprint_components: fullData.fingerprint?.components || null,
            },
        }

        console.log('Visitor data prepared:', visitorData)
        return visitorData
    } catch (error) {
        console.error('Error collecting visitor data:', error)
        // Return minimal data if collection fails
        return {
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
            device_type: 'desktop',
        }
    }
}

