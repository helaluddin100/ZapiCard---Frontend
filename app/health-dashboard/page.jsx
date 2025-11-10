'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Calendar, FileText, Activity, User, Clock, Stethoscope, Pill, TestTube } from 'lucide-react'
import Script from 'next/script'

export default function HealthDashboardPage() {
  const [healthCards, setHealthCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCards: 0,
    totalEntries: 0,
    lastUpdated: null
  })

  useEffect(() => {
    loadHealthCards()
  }, [])

  const loadHealthCards = async () => {
    try {
      setLoading(true)
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(`${apiBase}/api/health-cards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === 'success') {
          setHealthCards(data.data || [])
          calculateStats(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error loading health cards:', error)
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

  const formatBanglaDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                   'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const getCardTypeLabel = (type) => {
    const types = {
      'pregnant': 'গর্ভবতী',
      'child': 'শিশু',
      'adult': 'প্রাপ্তবয়স্ক',
      'senior': 'বয়স্ক'
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

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer />
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" />
      
      <DashboardLayout>
        <div x-data="{ selectedCardId: null }" className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">My Health Cards</h1>
            <Link
              href="/health-dashboard/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white font-semibold rounded-lg hover:bg-[#059669] transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create New Health Card
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-[#10b981]" />
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
                    {stats.lastUpdated ? formatBanglaDate(stats.lastUpdated) : 'N/A'}
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
                x-model="selectedCardId"
                onChange={(e) => {
                  const cardId = e.target.value
                  const card = healthCards.find(c => c.id == cardId)
                  setSelectedCard(card || null)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
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
          {!loading && healthCards.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Health Cards Yet</h3>
              <p className="text-gray-600 mb-6">Create your first health card to get started</p>
              <Link
                href="/health-dashboard/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white font-semibold rounded-lg hover:bg-[#059669] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create New Health Card
              </Link>
            </div>
          )}

          {!loading && healthCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthCards.map(card => (
                <div
                  key={card.id}
                  className="group relative bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedCard(card)}
                >
                  {/* Add Entry Button on Hover */}
                  <Link
                    href={`/health-dashboard/card/${card.id}/entry`}
                    className="absolute top-4 right-4 p-2 bg-[#10b981] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#059669] z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus className="w-5 h-5" />
                  </Link>

                  {/* Person Photo */}
                  <div className="mb-4">
                    {card.person_photo ? (
                      <img
                        src={card.person_photo}
                        alt={card.person_name}
                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#10b981]"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#10b981] mx-auto flex items-center justify-center text-white text-2xl font-bold">
                        {card.person_name?.charAt(0) || 'H'}
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{card.person_name}</h3>
                    <span className="inline-block px-3 py-1 bg-green-100 text-[#10b981] text-sm font-semibold rounded-full mb-2">
                      {getCardTypeLabel(card.card_type)}
                    </span>
                    <p className="text-sm text-gray-600">
                      Created: {formatBanglaDate(card.created_at)}
                    </p>
                  </div>
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
                          stroke="#10b981"
                          strokeWidth="16"
                          fill="none"
                          strokeDasharray={`${(calculatePregnancyWeeks(selectedCard.expected_delivery_date) / 40) * 552} 552`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-[#10b981]">
                            {calculatePregnancyWeeks(selectedCard.expected_delivery_date)}
                          </p>
                          <p className="text-sm text-gray-600">of 40 weeks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Line Chart */}
              {selectedCard.entries && selectedCard.entries.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Entries Over Time</h3>
                  <canvas id={`chart-${selectedCard.id}`} height="100"></canvas>
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
                        <Pill className="w-8 h-8 text-[#10b981]" />
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

      {/* Chart Script */}
      {selectedCard && selectedCard.entries && selectedCard.entries.length > 0 && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                if (typeof Chart !== 'undefined') {
                  const ctx = document.getElementById('chart-${selectedCard.id}');
                  if (ctx) {
                    const entries = ${JSON.stringify(selectedCard.entries)};
                    const labels = entries.map(e => {
                      const date = new Date(e.created_at);
                      const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                                     'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
                      return date.getDate() + ' ' + months[date.getMonth()];
                    });
                    const data = entries.map((e, i) => i + 1);
                    
                    new Chart(ctx, {
                      type: 'line',
                      data: {
                        labels: labels,
                        datasets: [{
                          label: 'Entries',
                          data: data,
                          borderColor: '#10b981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          tension: 0.4,
                          fill: true
                        }]
                      },
                      options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }
                    });
                  }
                }
              });
            `
          }}
        />
      )}
    </>
  )
}

