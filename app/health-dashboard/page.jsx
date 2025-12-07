'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Calendar, FileText, Activity, User, Clock, Stethoscope, Pill, TestTube, AlertCircle, ChevronDown, ChevronUp, Edit2, Eye, ExternalLink, Download, QrCode as QrCodeIcon, Trash2, Loader2, X, AlertTriangle } from 'lucide-react'
import { healthCardAPI } from '@/lib/api'
import { useToast } from '@/lib/toast'
import QRCodeLib from 'qrcode'

export default function HealthDashboardPage() {
  const { success, error: showError } = useToast()
  const [healthCards, setHealthCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCardId, setExpandedCardId] = useState(null)
  const [cardEntries, setCardEntries] = useState({})
  const [qrCodes, setQrCodes] = useState({})
  const [deletingEntryId, setDeletingEntryId] = useState(null)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null) // { cardId, entryId, entry }
  const [stats, setStats] = useState({
    totalCards: 0,
    totalEntries: 0,
    lastUpdated: null
  })

  useEffect(() => {
    loadHealthCards()
  }, [])

  // Generate QR codes for all cards
  useEffect(() => {
    if (healthCards.length > 0) {
      generateQRCodes()
    }
  }, [healthCards])

  const generateQRCodes = async () => {
    if (typeof window === 'undefined') return

    const newQrCodes = {}
    for (const card of healthCards) {
      if (card.username && card.slug) {
        try {
          const viewUrl = `${window.location.origin}/health-card/${card.username}/${card.slug}`
          const qrDataUrl = await QRCodeLib.toDataURL(viewUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: '#10b981',
              light: '#ffffff'
            }
          })
          newQrCodes[card.id] = qrDataUrl
        } catch (error) {
          console.error(`Error generating QR code for card ${card.id}:`, error)
        }
      }
    }
    setQrCodes(newQrCodes)
  }

  const downloadQRCode = async (card) => {
    if (!card.username || !card.slug || typeof window === 'undefined') return

    try {
      const viewUrl = `${window.location.origin}/health-card/${card.username}/${card.slug}`
      // Generate high resolution QR code (1000x1000)
      const qrDataUrl = await QRCodeLib.toDataURL(viewUrl, {
        width: 1000,
        margin: 3,
        color: {
          dark: '#10b981',
          light: '#ffffff'
        }
      })

      // Create download link
      const link = document.createElement('a')
      link.href = qrDataUrl
      link.download = `${card.person_name || 'health-card'}-qr-code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      success('QR code downloaded successfully!')
    } catch (error) {
      console.error('Error downloading QR code:', error)
      showError('Failed to download QR code')
    }
  }

  // Initialize chart when selectedCard changes
  useEffect(() => {
    if (!selectedCard || !selectedCard.entries || selectedCard.entries.length === 0) return

    const initChart = () => {
      if (typeof window === 'undefined' || typeof Chart === 'undefined') {
        // Retry after a short delay if Chart.js is not loaded yet
        setTimeout(initChart, 100)
        return
      }

      const ctx = document.getElementById(`health-chart-${selectedCard.id}`)
      if (!ctx) {
        setTimeout(initChart, 100)
        return
      }

      // Destroy existing chart if it exists
      const chartKey = `healthChart_${selectedCard.id}`
      if (window[chartKey]) {
        window[chartKey].destroy()
      }

      const entries = selectedCard.entries

      // Sort entries by date
      const sortedEntries = [...entries].sort((a, b) => {
        return new Date(a.entry_date || a.created_at) - new Date(b.entry_date || b.created_at)
      })

      // Prepare data
      const labels = sortedEntries.map(e => {
        const date = new Date(e.entry_date || e.created_at)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return date.getDate() + ' ' + months[date.getMonth()]
      })

      // Calculate severity score: medicines (weight: 3) + tests (weight: 2) + doctor visit (weight: 1)
      const severityData = sortedEntries.map(e => {
        const medicinesCount = (e.medicines && Array.isArray(e.medicines)) ? e.medicines.length : 0
        const testsCount = (e.tests && Array.isArray(e.tests)) ? e.tests.length : 0
        const hasDoctor = e.doctor_name ? 1 : 0
        return (medicinesCount * 3) + (testsCount * 2) + hasDoctor
      })

      // Medicines count
      const medicinesData = sortedEntries.map(e => {
        return (e.medicines && Array.isArray(e.medicines)) ? e.medicines.length : 0
      })

      // Tests count
      const testsData = sortedEntries.map(e => {
        return (e.tests && Array.isArray(e.tests)) ? e.tests.length : 0
      })

      // Determine color based on severity
      const backgroundColors = severityData.map(score => {
        if (score >= 10) return 'rgba(239, 68, 68, 0.7)' // Red - High severity
        if (score >= 5) return 'rgba(245, 158, 11, 0.7)' // Orange - Medium severity
        if (score >= 1) return 'rgba(59, 130, 246, 0.7)' // Blue - Low severity
        return 'rgba(156, 163, 175, 0.5)' // Gray - No data
      })

      const borderColors = severityData.map(score => {
        if (score >= 10) return 'rgb(239, 68, 68)'
        if (score >= 5) return 'rgb(245, 158, 11)'
        if (score >= 1) return 'rgb(59, 130, 246)'
        return 'rgb(156, 163, 175)'
      })

      window[chartKey] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Severity Score',
              data: severityData,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 2,
              borderRadius: 6,
              borderSkipped: false,
            },
            {
              label: 'Medicines',
              data: medicinesData,
              type: 'line',
              borderColor: 'rgb(139, 92, 246)',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4,
              fill: false,
              pointRadius: 4,
              pointHoverRadius: 6,
              yAxisID: 'y1'
            },
            {
              label: 'Tests',
              data: testsData,
              type: 'line',
              borderColor: 'rgb(236, 72, 153)',
              backgroundColor: 'rgba(236, 72, 153, 0.1)',
              tension: 0.4,
              fill: false,
              pointRadius: 4,
              pointHoverRadius: 6,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 15,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || ''
                  if (label) {
                    label += ': '
                  }
                  if (context.datasetIndex === 0) {
                    const entry = sortedEntries[context.dataIndex]
                    const medicinesCount = (entry.medicines && Array.isArray(entry.medicines)) ? entry.medicines.length : 0
                    const testsCount = (entry.tests && Array.isArray(entry.tests)) ? entry.tests.length : 0
                    label += context.parsed.y + ' (Medicines: ' + medicinesCount + ', Tests: ' + testsCount + ')'
                  } else {
                    label += context.parsed.y
                  }
                  return label
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Severity Score',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              ticks: {
                stepSize: 1
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count (Medicines/Tests)',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                stepSize: 1
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            }
          }
        }
      })
    }

    // Start initialization
    initChart()

    // Cleanup function
    return () => {
      const chartKey = `healthChart_${selectedCard.id}`
      if (window[chartKey]) {
        window[chartKey].destroy()
        delete window[chartKey]
      }
    }
  }, [selectedCard])

  const loadHealthCards = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await healthCardAPI.getHealthCards()

      if (response.status === 'success') {
        const cards = response.data || []
        setHealthCards(cards)
        calculateStats(cards)
        console.log('Health cards loaded:', cards)
      } else {
        throw new Error(response.message || 'Failed to load health cards')
      }
    } catch (error) {
      console.error('Error loading health cards:', error)
      const errorMessage = error.message || 'Failed to load health cards. Please try again.'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (cards) => {
    let totalEntries = 0
    let lastUpdated = null

    cards.forEach(card => {
      if (card.entries) {
        totalEntries += card.entries.length
        card.entries.forEach(entry => {
          const entryDate = new Date(entry.created_at)
          if (!lastUpdated || entryDate > lastUpdated) {
            lastUpdated = entryDate
          }
        })
      }
    })

    setStats({
      totalCards: cards.length,
      totalEntries,
      lastUpdated
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const getCardTypeLabel = (type) => {
    const types = {
      'pregnant': 'Pregnant',
      'child': 'Child',
      'adult': 'Adult',
      'senior': 'Senior'
    }
    return types[type] || type
  }

  const calculatePregnancyWeeks = (expectedDeliveryDate) => {
    if (!expectedDeliveryDate) return null
    const delivery = new Date(expectedDeliveryDate)
    const today = new Date()
    const totalDays = Math.floor((delivery - today) / (1000 * 60 * 60 * 24))
    const weeks = Math.floor((280 - totalDays) / 7)
    return Math.max(0, Math.min(40, weeks))
  }

  const getCardStats = (card) => {
    if (!card.entries) return { doctors: 0, tests: 0, medicines: 0 }

    const doctors = new Set()
    let tests = 0
    let medicines = 0

    card.entries.forEach(entry => {
      if (entry.doctor_name) doctors.add(entry.doctor_name)
      if (entry.tests) tests += entry.tests.length
      if (entry.medicines) medicines += entry.medicines.length
    })

    return {
      doctors: doctors.size,
      tests,
      medicines
    }
  }

  const toggleCardEntries = async (cardId) => {
    if (expandedCardId === cardId) {
      setExpandedCardId(null)
    } else {
      setExpandedCardId(cardId)
      // Load entries if not already loaded
      if (!cardEntries[cardId]) {
        try {
          const response = await healthCardAPI.getEntries(cardId)
          if (response.status === 'success') {
            setCardEntries(prev => ({
              ...prev,
              [cardId]: response.data || []
            }))
          }
        } catch (error) {
          console.error('Error loading entries:', error)
          showError('Failed to load entries')
        }
      }
    }
  }

  const handleDeleteEntry = async () => {
    if (!deleteConfirmModal) return

    const { cardId, entryId } = deleteConfirmModal

    try {
      setDeletingEntryId(entryId)
      const response = await healthCardAPI.deleteEntry(cardId, entryId)
      
      if (response.status === 'success') {
        success('Entry deleted successfully!')
        // Remove entry from local state
        setCardEntries(prev => ({
          ...prev,
          [cardId]: (prev[cardId] || []).filter(entry => entry.id !== entryId)
        }))
        // Close modal
        setDeleteConfirmModal(null)
        // Reload cards to update stats
        loadHealthCards()
      } else {
        throw new Error(response.message || 'Failed to delete entry')
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      showError(error.message || 'Failed to delete entry. Please try again.')
    } finally {
      setDeletingEntryId(null)
    }
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Chart.js loaded, charts will initialize via useEffect
          console.log('Chart.js loaded')
        }}
      />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Health Cards</h1>
            <Link
              href="/health-dashboard/create"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create New Health Card
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 gradient-primary rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Cards</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCards}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalEntries}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stats.lastUpdated ? formatDate(stats.lastUpdated) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Selector Dropdown */}
          {healthCards.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Card to View
              </label>
              <select
                value={selectedCard?.id || ''}
                onChange={(e) => {
                  const cardId = e.target.value
                  const card = healthCards.find(c => c.id == cardId)
                  setSelectedCard(card || null)
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">-- Select a card --</option>
                {healthCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.person_name} ({getCardTypeLabel(card.card_type)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-800 dark:text-red-300 font-semibold mb-1">Error Loading Health Cards</h3>
                  <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
                  <button
                    onClick={loadHealthCards}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Health Cards Grid */}
          {!loading && !error && healthCards.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Health Cards Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first health card to get started</p>
              <Link
                href="/health-dashboard/create"
                className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create New Health Card
              </Link>
            </div>
          )}

          {!loading && !error && healthCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthCards.map(card => (
                <div key={card.id} className="col-span-1">
                  <div
                    className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:scale-[1.02]"
                    onClick={() => setSelectedCard(card)}
                    style={{
                      // aspectRatio: '3.5 / 2',
                      minHeight: '280px'
                    }}
                  >
                    {/* Background Image with Gradient Overlay */}
                    <div className="absolute inset-0">
                      {card.person_photo ? (
                        <>
                          <img
                            src={card.person_photo}
                            alt={card.person_name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-purple-600/80 to-pink-600/80"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full gradient-primary"></div>
                      )}
                    </div>

                    {/* Action Buttons on Hover */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                      <Link
                        href={`/health-card/${card.username}/${card.slug}`}
                        target="_blank"
                        className="flex items-center justify-center p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all"
                        onClick={(e) => e.stopPropagation()}
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/health-dashboard/card/${card.id}/edit`}
                        className="flex items-center justify-center p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all"
                        onClick={(e) => e.stopPropagation()}
                        title="Edit Card"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCardEntries(card.id)
                        }}
                        className="flex items-center justify-center p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all"
                        title="View Entries"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/health-dashboard/card/${card.id}/entry`}
                        className="flex items-center justify-center p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all"
                        onClick={(e) => e.stopPropagation()}
                        title="Add New Entry"
                      >
                        <Plus className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Card Content */}
                    <div className="relative h-full flex flex-col p-6 text-white z-10">
                      {/* Top Section - Person Photo & QR Code */}
                      <div className="flex items-start justify-between mb-4">
                        {/* Person Photo */}
                        <div className="flex-shrink-0">
                          {card.person_photo ? (
                            <div className="w-20 h-20 rounded-full border-4 border-white/90 shadow-xl overflow-hidden">
                              <img
                                src={card.person_photo}
                                alt={card.person_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-full border-4 border-white/90 shadow-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                              {card.person_name?.charAt(0) || 'H'}
                            </div>
                          )}
                        </div>

                        {/* QR Code */}
                        <div className="flex-shrink-0 relative">
                          {qrCodes[card.id] ? (
                            <div className="w-20 h-20 rounded-lg bg-white p-1.5 shadow-xl">
                              <img
                                src={qrCodes[card.id]}
                                alt="QR Code"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                              <QrCodeIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 animate-pulse" />
                            </div>
                          )}
                          {/* Download QR Button - Position Absolute */}
                          {qrCodes[card.id] && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadQRCode(card)
                              }}
                              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all opacity-0 group-hover:opacity-100 z-10 whitespace-nowrap"
                              title="Download QR Code"
                            >
                              <Download className="w-3 h-3 inline mr-1" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Middle Section - Person Name & Type */}
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{card.person_name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                            {getCardTypeLabel(card.card_type)}
                          </span>
                          {card.blood_group && (
                            <span className="px-3 py-1 bg-red-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                              {card.blood_group}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Section - Stats & Info */}
                      <div className="mt-auto pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            <span className="font-medium">
                              {card.entries && card.entries.length > 0 ? card.entries.length : 0} {card.entries && card.entries.length === 1 ? 'Entry' : 'Entries'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">{formatDate(card.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Entries Accordion - Outside Card */}
                  {expandedCardId === card.id && (
                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Health Entries</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCardEntries(card.id)
                          }}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {expandedCardId === card.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {cardEntries[card.id] && cardEntries[card.id].length > 0 ? (
                          cardEntries[card.id].map((entry, index) => (
                            <div
                              key={entry.id || index}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                                    Entry Date: {formatDate(entry.entry_date || entry.created_at)}
                                  </p>
                                  {entry.doctor_name && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Dr. {entry.doctor_name}
                                      {entry.doctor_specialty && ` - ${entry.doctor_specialty}`}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/health-dashboard/card/${card.id}/entry/${entry.id}/edit`}
                                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                    onClick={(e) => e.stopPropagation()}
                                    title="Edit Entry"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDeleteConfirmModal({ cardId: card.id, entryId: entry.id, entry })
                                    }}
                                    disabled={deletingEntryId === entry.id}
                                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                                    title="Delete Entry"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Medicines */}
                              {entry.medicines && entry.medicines.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Medicines ({entry.medicines.length}):</p>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.medicines.slice(0, 3).map((med, idx) => (
                                      <span key={idx} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                                        {med.name}
                                      </span>
                                    ))}
                                    {entry.medicines.length > 3 && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">+{entry.medicines.length - 3} more</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Tests */}
                              {entry.tests && entry.tests.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tests ({entry.tests.length}):</p>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.tests.slice(0, 3).map((test, idx) => (
                                      <span key={idx} className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded">
                                        {test.name}
                                      </span>
                                    ))}
                                    {entry.tests.length > 3 && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">+{entry.tests.length - 3} more</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Prescription Images */}
                              {entry.prescription_image && (
                                <div className="mt-2">
                                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Prescription Available</p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                            No entries found. Click + to add an entry.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Analysis Section */}
          {selectedCard && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Analysis: {selectedCard.person_name}
                </h2>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Pregnancy Progress */}
              {selectedCard.card_type === 'pregnant' && selectedCard.expected_delivery_date && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg className="transform -rotate-90 w-48 h-48">
                        <defs>
                          <linearGradient id="pregnancyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="#e5e7eb"
                          strokeWidth="16"
                          fill="none"
                          className="dark:stroke-gray-700"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="url(#pregnancyGradient)"
                          strokeWidth="16"
                          fill="none"
                          strokeDasharray={`${(calculatePregnancyWeeks(selectedCard.expected_delivery_date) / 40) * 552} 552`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                            {calculatePregnancyWeeks(selectedCard.expected_delivery_date)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">of 40 weeks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Health Timeline Chart */}
              {selectedCard.entries && selectedCard.entries.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Health Timeline & Sickness Indicator</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Shows health entries with severity based on medicines and tests</p>
                  <canvas id={`health-chart-${selectedCard.id}`} height="120"></canvas>
                </div>
              )}

              {/* Summary Stats */}
              {(() => {
                const cardStats = getCardStats(selectedCard)
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3">
                        <Stethoscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Doctors</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{cardStats.doctors}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3">
                        <TestTube className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{cardStats.tests}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <Pill className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Medicines</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{cardStats.medicines}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {deleteConfirmModal && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDeleteConfirmModal(null)}
                  className="fixed inset-0 bg-black bg-opacity-50 z-50"
                />

                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Delete Entry
                          </h3>
                        </div>
                        <button
                          onClick={() => setDeleteConfirmModal(null)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
                          disabled={deletingEntryId !== null}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                          <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                            Warning: This action cannot be undone
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-400">
                            Are you sure you want to delete this health entry? All associated data including medicines, tests, and prescription will be permanently removed.
                          </p>
                        </div>

                        {/* Entry Details */}
                        {deleteConfirmModal.entry && (
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Entry Date</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {formatDate(deleteConfirmModal.entry.entry_date || deleteConfirmModal.entry.created_at)}
                            </p>
                            {deleteConfirmModal.entry.doctor_name && (
                              <>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-1">Doctor</p>
                                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                  Dr. {deleteConfirmModal.entry.doctor_name}
                                  {deleteConfirmModal.entry.doctor_specialty && ` - ${deleteConfirmModal.entry.doctor_specialty}`}
                                </p>
                              </>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => setDeleteConfirmModal(null)}
                            disabled={deletingEntryId !== null}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                          <motion.button
                            onClick={handleDeleteEntry}
                            disabled={deletingEntryId !== null}
                            whileHover={{ scale: deletingEntryId === null ? 1.02 : 1 }}
                            whileTap={{ scale: deletingEntryId === null ? 0.98 : 1 }}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingEntryId === deleteConfirmModal?.entryId ? (
                              <>
                                <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 inline mr-2" />
                                Delete Entry
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </DashboardLayout >
    </>
  )
}

