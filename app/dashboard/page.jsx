'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import {
  Plus,
  QrCode,
  Radio,
  Eye,
  Edit,
  Trash2,
  Grid3x3,
  List,
  Search,
  Filter,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  User,
  Phone,
  Mail
} from 'lucide-react'

export default function MyCardsPage() {
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for cards
  const cards = [
    {
      id: 1,
      name: 'John Doe',
      title: 'Marketing Director',
      company: 'TechCorp',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zapicard.com/card/1',
      nfcEnabled: true,
      views: 245,
      createdAt: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      title: 'Product Manager',
      company: 'StartupXYZ',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zapicard.com/card/2',
      nfcEnabled: false,
      views: 189,
      createdAt: '2024-01-20',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Mike Chen',
      title: 'Sales Executive',
      company: 'Global Sales',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zapicard.com/card/3',
      nfcEnabled: true,
      views: 312,
      createdAt: '2024-02-01',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    }
  ]

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Mock analytics data
  const analytics = {
    totalViews: 1245,
    todayViews: 45,
    viewsChange: 12.5,
    totalAppointments: 89,
    todayAppointments: 5,
    appointmentsChange: 8.3,
    totalCards: cards.length,
    activeCards: cards.filter(c => c.views > 0).length
  }

  // Daily visitor data (last 7 days)
  const dailyVisitors = [
    { day: 'Mon', visitors: 32 },
    { day: 'Tue', visitors: 45 },
    { day: 'Wed', visitors: 38 },
    { day: 'Thu', visitors: 52 },
    { day: 'Fri', visitors: 48 },
    { day: 'Sat', visitors: 35 },
    { day: 'Sun', visitors: 28 }
  ]

  // Daily appointments data (last 7 days)
  const dailyAppointments = [
    { day: 'Mon', appointments: 3 },
    { day: 'Tue', appointments: 5 },
    { day: 'Wed', appointments: 4 },
    { day: 'Thu', appointments: 6 },
    { day: 'Fri', appointments: 5 },
    { day: 'Sat', appointments: 2 },
    { day: 'Sun', appointments: 1 }
  ]

  // Last 3 days appointments
  const recentAppointments = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-8900',
      date: '2024-03-15',
      time: '10:00 AM',
      cardId: 1,
      cardName: 'John Doe'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 234-567-8901',
      date: '2024-03-15',
      time: '2:30 PM',
      cardId: 1,
      cardName: 'John Doe'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      phone: '+1 234-567-8902',
      date: '2024-03-14',
      time: '11:00 AM',
      cardId: 2,
      cardName: 'Sarah Johnson'
    },
    {
      id: 4,
      name: 'David Thompson',
      email: 'david@example.com',
      phone: '+1 234-567-8903',
      date: '2024-03-14',
      time: '3:00 PM',
      cardId: 1,
      cardName: 'John Doe'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '+1 234-567-8904',
      date: '2024-03-13',
      time: '9:30 AM',
      cardId: 3,
      cardName: 'Mike Chen'
    }
  ]

  const maxVisitors = Math.max(...dailyVisitors.map(d => d.visitors))
  const maxAppointments = Math.max(...dailyAppointments.map(d => d.appointments))

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your cards</p>
            </div>
            <Link href="/dashboard/create" className="btn-primary flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Create New Card
            </Link>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Views */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${analytics.viewsChange > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {analytics.viewsChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(analytics.viewsChange)}%
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{analytics.todayViews} today</p>
            </div>
          </motion.div>

          {/* Total Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${analytics.appointmentsChange > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {analytics.appointmentsChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(analytics.appointmentsChange)}%
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalAppointments}</p>
              <p className="text-xs text-gray-500 mt-1">{analytics.todayAppointments} today</p>
            </div>
          </motion.div>

          {/* Total Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Cards</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalCards}</p>
              <p className="text-xs text-gray-500 mt-1">{analytics.activeCards} active</p>
            </div>
          </motion.div>

          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">892</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Visitors Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Daily Visitors</h3>
                <p className="text-sm text-gray-600">Last 7 days</p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-end justify-between gap-2 h-48">
              {dailyVisitors.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.visitors / maxVisitors) * 100}%` }}
                      transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg mb-2 min-h-[4px]"
                    />
                    <span className="text-xs text-gray-600 font-medium">{day.visitors}</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Daily Appointments Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Daily Appointments</h3>
                <p className="text-sm text-gray-600">Last 7 days</p>
              </div>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex items-end justify-between gap-2 h-48">
              {dailyAppointments.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.appointments / maxAppointments) * 100}%` }}
                      transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg mb-2 min-h-[4px]"
                    />
                    <span className="text-xs text-gray-600 font-medium">{day.appointments}</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Appointments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Appointments</h3>
              <p className="text-sm text-gray-600">Last 3 days</p>
            </div>
            <Link href="/dashboard/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentAppointments.map((appointment, idx) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {appointment.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{appointment.name}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {appointment.cardName}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {appointment.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {appointment.phone}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {appointment.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* My Cards Section Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">My Cards</h2>
              <p className="text-gray-600 mt-1">Manage and organize your visiting cards</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="btn-outline flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid/List */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <CreditCard className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards found</h3>
            <p className="text-gray-600 mb-6">Create your first smart visiting card to get started</p>
            <Link href="/dashboard/create" className="btn-primary inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Card
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={card.qrCode}
                      alt="QR Code"
                      className="w-32 h-32 bg-white p-2 rounded-lg shadow-lg"
                    />
                  </div>
                  {card.nfcEnabled && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <Radio className="w-3 h-3 mr-1" />
                      NFC
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{card.name}</h3>
                  <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                  <p className="text-gray-500 text-sm mb-4">{card.company}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {card.views} views
                    </span>
                    <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/card/${card.id}`}
                      className="flex-1 btn-outline text-center py-2 text-sm"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/edit/${card.id}`}
                      className="flex-1 btn-outline text-center py-2 text-sm"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </Link>
                    <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {filteredCards.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-b border-gray-200 last:border-0 p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
                      {card.nfcEnabled && (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center">
                          <Radio className="w-3 h-3 mr-1" />
                          NFC
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{card.title} at {card.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {card.views} views
                      </span>
                      <span>Created {new Date(card.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/card/${card.id}`}
                      className="btn-outline text-sm py-2 px-4"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/edit/${card.id}`}
                      className="btn-outline text-sm py-2 px-4"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </Link>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

