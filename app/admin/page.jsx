'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Users, 
  ShoppingCart, 
  BarChart3,
  TrendingUp,
  DollarSign,
  CreditCard,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const stats = [
    { label: 'Total Users', value: '12,543', icon: Users, color: 'from-blue-500 to-blue-600', change: '+12.5%' },
    { label: 'Total Orders', value: '3,247', icon: ShoppingCart, color: 'from-purple-500 to-purple-600', change: '+8.2%' },
    { label: 'Revenue', value: '$45,231', icon: DollarSign, color: 'from-green-500 to-green-600', change: '+15.3%' },
    { label: 'Active Cards', value: '8,912', icon: CreditCard, color: 'from-pink-500 to-pink-600', change: '+22.1%' }
  ]

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', cards: 3, joined: '2024-01-15', status: 'active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', cards: 1, joined: '2024-01-20', status: 'active' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', cards: 5, joined: '2024-02-01', status: 'active' },
    { id: 4, name: 'Emily Rodriguez', email: 'emily@example.com', cards: 2, joined: '2024-02-05', status: 'active' }
  ]

  const recentOrders = [
    { id: 1, user: 'John Doe', product: 'Premium Plastic NFC', amount: '$9.99', status: 'shipped', date: '2024-02-10' },
    { id: 2, user: 'Sarah Johnson', product: 'Metal NFC Card', amount: '$24.99', status: 'processing', date: '2024-02-11' },
    { id: 3, user: 'Mike Chen', product: 'Wooden NFC Card', amount: '$19.99', status: 'delivered', date: '2024-02-08' },
    { id: 4, user: 'Emily Rodriguez', product: 'Premium Plastic NFC', amount: '$9.99', status: 'shipped', date: '2024-02-12' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm">Manage your platform</p>
          </div>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to Site
          </Link>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'orders', label: 'Orders' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-green-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </motion.div>
                  )
                })}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Users</h2>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{user.cards} cards</p>
                          <p className="text-xs text-gray-500">{new Date(user.joined).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/admin?tab=users" className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all users →
                  </Link>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                        <div>
                          <p className="font-semibold text-gray-900">{order.user}</p>
                          <p className="text-sm text-gray-600">{order.product}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{order.amount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/admin?tab=orders" className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all orders →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button className="btn-outline flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cards</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                        <td className="px-4 py-3 text-gray-900">{user.cards}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(user.joined).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Orders</h2>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button className="btn-outline flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                        <td className="px-4 py-3 text-gray-900">{order.user}</td>
                        <td className="px-4 py-3 text-gray-600">{order.product}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{order.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Growth</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">+12.5%</p>
                  <p className="text-sm text-gray-600">Compared to last month</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Growth</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-2">+15.3%</p>
                  <p className="text-sm text-gray-600">Compared to last month</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Placeholder</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <BarChart3 className="w-16 h-16" />
                  <p className="ml-4">Analytics charts would be integrated here</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

