'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { useToast } from '@/lib/toast'
import { orderAPI } from '@/lib/api'
import {
    Package,
    Loader2,
    Eye,
    Calendar,
    CreditCard,
    Search,
    Filter,
    ArrowRight
} from 'lucide-react'

export default function OrdersPage() {
    const router = useRouter()
    const { error: showError } = useToast()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('all')

    useEffect(() => {
        loadOrders()
    }, [filterStatus, filterPaymentStatus])

    const loadOrders = async () => {
        try {
            setLoading(true)
            const params = {}
            if (filterStatus !== 'all') params.order_status = filterStatus
            if (filterPaymentStatus !== 'all') params.payment_status = filterPaymentStatus
            if (searchTerm) params.search = searchTerm

            const response = await orderAPI.getOrders(params)
            if (response.status === 'success') {
                setOrders(response.data.data || response.data || [])
            }
        } catch (err) {
            console.error('Error loading orders:', err)
            showError('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        loadOrders()
    }

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'processing': 'bg-purple-100 text-purple-800',
            'shipped': 'bg-indigo-100 text-indigo-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'refunded': 'bg-gray-100 text-gray-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const getPaymentStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'failed': 'bg-red-100 text-red-800',
            'refunded': 'bg-gray-100 text-gray-800',
            'cancelled': 'bg-red-100 text-red-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const filteredOrders = orders.filter(order => {
        if (searchTerm) {
            const search = searchTerm.toLowerCase()
            return (
                order.order_number?.toLowerCase().includes(search) ||
                order.customer_name?.toLowerCase().includes(search) ||
                order.customer_email?.toLowerCase().includes(search) ||
                order.product_name?.toLowerCase().includes(search)
            )
        }
        return true
    })

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">View and manage all your orders</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Order Status Filter */}
                        <div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Payment Status Filter */}
                        <div>
                            <select
                                value={filterPaymentStatus}
                                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Payments</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                        <Link
                            href="/dashboard/products"
                            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                        >
                            Browse Products
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {order.order_number}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                                                        {order.order_status}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                                        {order.payment_status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-900 font-medium mb-1">{order.product_name}</p>
                                                <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                {order.currency_symbol}{parseFloat(order.total_amount).toFixed(2)}
                                            </div>
                                            <div className="text-gray-600">
                                                Payment: {order.payment_method}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/dashboard/orders/${order.id}/confirmation`}
                                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Link>
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

