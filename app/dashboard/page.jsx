'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import {
  Plus,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Phone,
  Mail,
  Eye,
  CreditCard
} from 'lucide-react'

export default function DashboardPage() {
  // Mock data for analytics
  const cards = [
    { id: 1, views: 245 },
    { id: 2, views: 189 },
    { id: 3, views: 312 }
  ]

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

      </div>
    </DashboardLayout>
  )
}

