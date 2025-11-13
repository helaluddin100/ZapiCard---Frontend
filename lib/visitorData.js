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

    // Get Browser Fingerprint (async)
    try {
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()

        data.fingerprint = {
            visitorId: result.visitorId,
            confidence: result.confidence.score,
            components: result.components,
        }
    } catch (error) {
        console.warn('FingerprintJS error:', error)
        data.fingerprint = {
            error: 'Failed to generate fingerprint',
        }
    }

    return data
}

/**
 * Get simplified visitor data for API (only essential fields)
 */
export async function getVisitorDataForAPI() {
    const fullData = await collectVisitorData()

    return {
        // Essential browser/device info
        user_agent: fullData.userAgent,
        browser: fullData.parsedUA.browser.name,
        browser_version: fullData.parsedUA.browser.version,
        engine: fullData.parsedUA.engine.name,
        engine_version: fullData.parsedUA.engine.version,
        os: fullData.parsedUA.os.name,
        os_version: fullData.parsedUA.os.version,
        device_type: fullData.parsedUA.device.type || 'desktop',
        device_model: fullData.parsedUA.device.model,
        device_vendor: fullData.parsedUA.device.vendor,
        cpu_architecture: fullData.parsedUA.cpu.architecture,

        // Screen and viewport
        screen_width: fullData.screenWidth,
        screen_height: fullData.screenHeight,
        screen_color_depth: fullData.screenColorDepth,
        viewport_width: fullData.viewportWidth,
        viewport_height: fullData.viewportHeight,
        screen_orientation: fullData.screenOrientation,

        // Location and timezone
        timezone: fullData.timezone,
        timezone_offset: fullData.timezoneOffset,
        language: fullData.language,
        languages: fullData.languages.join(','),

        // Connection
        connection_type: fullData.connectionType,
        connection_downlink: fullData.connectionDownlink,
        connection_rtt: fullData.connectionRtt,

        // Hardware
        hardware_concurrency: fullData.hardwareConcurrency,
        device_memory: fullData.deviceMemory,
        max_touch_points: fullData.maxTouchPoints,

        // Privacy and settings
        cookie_enabled: fullData.cookieEnabled,
        do_not_track: fullData.doNotTrack,

        // Navigation
        referrer: fullData.referrer,
        url: fullData.url,
        hostname: fullData.hostname,
        pathname: fullData.pathname,

        // Fingerprint
        visitor_id: fullData.fingerprint?.visitorId || null,
        fingerprint_confidence: fullData.fingerprint?.confidence || null,

        // Additional data (stored as JSON)
        additional_data: {
            full_ua_parsed: fullData.parsedUA,
            fingerprint_components: fullData.fingerprint?.components || null,
        },
    }
}

