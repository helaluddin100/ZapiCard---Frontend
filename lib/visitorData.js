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

