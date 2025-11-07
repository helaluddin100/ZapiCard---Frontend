'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function CustomQRCode({
    value,
    size = 200,
    fgColor = '#000000',
    bgColor = '#ffffff',
    shape = 'square',
    corner = 'square',
    logo = null
}) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // Clear canvas
        ctx.clearRect(0, 0, size, size)

        // Draw background
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, size, size)

        // Generate QR code data
        QRCode.toCanvas(canvas, value, {
            width: size,
            margin: 2,
            color: {
                dark: fgColor,
                light: bgColor
            },
            errorCorrectionLevel: 'H'
        }, (error) => {
            if (error) {
                console.error('QR Code generation error:', error)
                return
            }

            // Get QR code module size
            const qrSize = size - 4 // Account for margin
            const moduleSize = qrSize / 25 // Standard QR code has 25x25 modules (with margin)

            // Redraw with custom shapes
            redrawWithCustomShapes(ctx, canvas, size, moduleSize, fgColor, bgColor, shape, corner, logo)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, size, fgColor, bgColor, shape, corner, logo])

    const redrawWithCustomShapes = (ctx, canvas, size, moduleSize, fgColor, bgColor, shape, corner, logo) => {
        // Get image data from canvas
        const imageData = ctx.getImageData(0, 0, size, size)
        const data = imageData.data

        // Clear and redraw background
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, size, size)

        const margin = 2
        const qrSize = size - (margin * 2)
        const modules = 25 // Standard QR code modules

        // Draw QR code modules with custom shapes
        for (let row = 0; row < modules; row++) {
            for (let col = 0; col < modules; col++) {
                const x = margin + (col * moduleSize)
                const y = margin + (row * moduleSize)

                // Check if this module should be dark
                const pixelX = Math.floor(x + moduleSize / 2)
                const pixelY = Math.floor(y + moduleSize / 2)
                const index = (pixelY * size + pixelX) * 4

                if (index < data.length) {
                    const r = data[index]
                    const isDark = r < 128

                    if (isDark) {
                        ctx.fillStyle = fgColor

                        // Check if this is a corner module (finder pattern)
                        const isCorner = (
                            (row < 7 && col < 7) || // Top-left
                            (row < 7 && col >= modules - 7) || // Top-right
                            (row >= modules - 7 && col < 7) // Bottom-left
                        )

                        if (isCorner) {
                            drawCornerModule(ctx, x, y, moduleSize, corner, fgColor)
                        } else {
                            drawShapeModule(ctx, x, y, moduleSize, shape, fgColor)
                        }
                    }
                }
            }
        }

        // Draw center logo if provided
        if (logo) {
            const logoSize = size * 0.2
            const logoX = (size - logoSize) / 2
            const logoY = (size - logoSize) / 2

            ctx.fillStyle = bgColor
            ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8)

            if (typeof logo === 'string' && logo.startsWith('data:')) {
                const img = new Image()
                img.onload = () => {
                    ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
                }
                img.src = logo
            }
        }
    }

    const roundRect = (ctx, x, y, width, height, radius) => {
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
    }

    const drawShapeModule = (ctx, x, y, size, shape, color) => {
        ctx.fillStyle = color

        switch (shape) {
            case 'square':
                ctx.fillRect(x, y, size, size)
                break
            case 'rounded':
                roundRect(ctx, x, y, size, size, size * 0.2)
                ctx.fill()
                break
            case 'circle':
                ctx.beginPath()
                ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
                ctx.fill()
                break
            case 'dot':
                ctx.beginPath()
                ctx.arc(x + size / 2, y + size / 2, size * 0.3, 0, Math.PI * 2)
                ctx.fill()
                break
            case 'organic':
                ctx.beginPath()
                ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
                ctx.fill()
                break
            case 'rounded-square':
                roundRect(ctx, x, y, size, size, size * 0.15)
                ctx.fill()
                break
            default:
                ctx.fillRect(x, y, size, size)
        }
    }

    const drawCornerModule = (ctx, x, y, size, corner, color) => {
        ctx.fillStyle = color

        switch (corner) {
            case 'square':
                ctx.fillRect(x, y, size, size)
                break
            case 'rounded':
                roundRect(ctx, x, y, size, size, size * 0.25)
                ctx.fill()
                break
            case 'circle':
                ctx.beginPath()
                ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
                ctx.fill()
                break
            case 'extra-rounded':
                roundRect(ctx, x, y, size, size, size * 0.4)
                ctx.fill()
                break
            case 'dot':
                ctx.beginPath()
                ctx.arc(x + size / 2, y + size / 2, size * 0.4, 0, Math.PI * 2)
                ctx.fill()
                break
            case 'classy':
                // Square with inner square
                ctx.fillRect(x, y, size, size)
                ctx.fillStyle = bgColor
                ctx.fillRect(x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6)
                ctx.fillStyle = color
                break
            case 'classy-rounded':
                roundRect(ctx, x, y, size, size, size * 0.2)
                ctx.fill()
                ctx.fillStyle = bgColor
                roundRect(ctx, x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6, size * 0.15)
                ctx.fill()
                ctx.fillStyle = color
                break
            case 'smooth':
                roundRect(ctx, x, y, size, size, size * 0.3)
                ctx.fill()
                break
            case 'smooth-rounded':
                roundRect(ctx, x, y, size, size, size * 0.35)
                ctx.fill()
                break
            case 'cut':
            case 'diamond':
                // Diamond shape
                ctx.beginPath()
                ctx.moveTo(x + size / 2, y)
                ctx.lineTo(x + size, y + size / 2)
                ctx.lineTo(x + size / 2, y + size)
                ctx.lineTo(x, y + size / 2)
                ctx.closePath()
                ctx.fill()
                break
            case 'pointed':
            case 'pointed-smooth':
            case 'pointed-edge':
                roundRect(ctx, x, y, size, size, size * 0.2)
                ctx.fill()
                break
            case 'pointed-inverted':
                roundRect(ctx, x, y, size, size, size * 0.2)
                ctx.fill()
                break
            default:
                ctx.fillRect(x, y, size, size)
        }
    }

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{ maxWidth: '100%', height: 'auto' }}
        />
    )
}

