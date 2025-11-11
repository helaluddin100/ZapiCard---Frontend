'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Calendar, FileText, Activity, User, Clock, Stethoscope, Pill, TestTube, AlertCircle, ChevronDown, ChevronUp, Edit2, Eye } from 'lucide-react'
import { healthCardAPI } from '@/lib/api'
import { useToast } from '@/lib/toast'

export default function HealthDashboardPage() {
  const { error: showError } = useToast()
  const [healthCards, setHealthCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCardId, setExpandedCardId] = useState(null)
  const [cardEntries, setCardEntries] = useState({})
  const [stats, setStats] = useState({
    totalCards: 0,
    totalEntries: 0,
    lastUpdated: null
  })

  useEffect(() => {
    loadHealthCards()
  }, [])

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
            <h1 className="text-3xl font-bold text-gray-900">My Health Cards</h1>
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 gradient-primary rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Cards</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.lastUpdated ? formatDate(stats.lastUpdated) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Selector Dropdown */}
          {healthCards.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Card to View
              </label>
              <select
                value={selectedCard?.id || ''}
                onChange={(e) => {
                  const cardId = e.target.value
                  const card = healthCards.find(c => c.id == cardId)
                  setSelectedCard(card || null)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-1">Error Loading Health Cards</h3>
                  <p className="text-red-600 text-sm mb-4">{error}</p>
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
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Health Cards Grid */}
          {!loading && !error && healthCards.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Health Cards Yet</h3>
              <p className="text-gray-600 mb-6">Create your first health card to get started</p>
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
                <div
                  key={card.id}
                  className="group relative bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedCard(card)}
                >
                  {/* Action Buttons on Hover */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleCardEntries(card.id)
                      }}
                      className="p-2 gradient-primary text-white rounded-full hover:shadow-lg transition-all"
                      title="View Entries"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <Link
                      href={`/health-dashboard/card/${card.id}/entry`}
                      className="p-2 gradient-primary text-white rounded-full hover:shadow-lg transition-all"
                      onClick={(e) => e.stopPropagation()}
                      title="Add New Entry"
                    >
                      <Plus className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Person Photo */}
                  <div className="mb-4">
                    {card.person_photo ? (
                      <div className="w-24 h-24 rounded-full mx-auto p-0.5 gradient-primary">
                        <img
                          src={card.person_photo}
                          alt={card.person_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full gradient-primary mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {card.person_name?.charAt(0) || 'H'}
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{card.person_name}</h3>
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-700 border border-blue-200 text-sm font-semibold rounded-full mb-2">
                      {getCardTypeLabel(card.card_type)}
                    </span>
                    <p className="text-sm text-gray-600">
                      Created: {formatDate(card.created_at)}
                    </p>
                    {card.entries && card.entries.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {card.entries.length} {card.entries.length === 1 ? 'entry' : 'entries'}
                      </p>
                    )}
                  </div>

                  {/* Entries Accordion */}
                  {expandedCardId === card.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Health Entries</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCardEntries(card.id)
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {expandedCardId === card.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {cardEntries[card.id] && cardEntries[card.id].length > 0 ? (
                          cardEntries[card.id].map((entry, index) => (
                            <div
                              key={entry.id || index}
                              className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    Entry Date: {formatDate(entry.entry_date || entry.created_at)}
                                  </p>
                                  {entry.doctor_name && (
                                    <p className="text-sm text-gray-600">
                                      Dr. {entry.doctor_name}
                                      {entry.doctor_specialty && ` - ${entry.doctor_specialty}`}
                                    </p>
                                  )}
                                </div>
                                <Link
                                  href={`/health-dashboard/card/${card.id}/entry/${entry.id}/edit`}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Link>
                              </div>

                              {/* Medicines */}
                              {entry.medicines && entry.medicines.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-semibold text-gray-700 mb-1">Medicines ({entry.medicines.length}):</p>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.medicines.slice(0, 3).map((med, idx) => (
                                      <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                        {med.name}
                                      </span>
                                    ))}
                                    {entry.medicines.length > 3 && (
                                      <span className="text-xs text-gray-500">+{entry.medicines.length - 3} more</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Tests */}
                              {entry.tests && entry.tests.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-semibold text-gray-700 mb-1">Tests ({entry.tests.length}):</p>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.tests.slice(0, 3).map((test, idx) => (
                                      <span key={idx} className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">
                                        {test.name}
                                      </span>
                                    ))}
                                    {entry.tests.length > 3 && (
                                      <span className="text-xs text-gray-500">+{entry.tests.length - 3} more</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Prescription Images */}
                              {entry.prescription_image && (
                                <div className="mt-2">
                                  <p className="text-xs font-semibold text-gray-700">Prescription Available</p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Analysis: {selectedCard.person_name}
                </h2>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Pregnancy Progress */}
              {selectedCard.card_type === 'pregnant' && selectedCard.expected_delivery_date && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
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
                          <p className="text-sm text-gray-600">of 40 weeks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Health Timeline Chart */}
              {selectedCard.entries && selectedCard.entries.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Timeline & Sickness Indicator</h3>
                  <p className="text-sm text-gray-600 mb-4">Shows health entries with severity based on medicines and tests</p>
                  <canvas id={`health-chart-${selectedCard.id}`} height="120"></canvas>
                </div>
              )}

              {/* Summary Stats */}
              {(() => {
                const cardStats = getCardStats(selectedCard)
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Stethoscope className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Doctors</p>
                          <p className="text-2xl font-bold text-gray-900">{cardStats.doctors}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-3">
                        <TestTube className="w-8 h-8 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Tests</p>
                          <p className="text-2xl font-bold text-gray-900">{cardStats.tests}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-3">
                        <Pill className="w-8 h-8 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Medicines</p>
                          <p className="text-2xl font-bold text-gray-900">{cardStats.medicines}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}

