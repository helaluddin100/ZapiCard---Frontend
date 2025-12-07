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

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
            'confirmed': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
            'processing': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
            'shipped': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
            'delivered': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
            'cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
            'refunded': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
        }
        return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }

    const getPaymentStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
            'processing': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
            'completed': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
            'failed': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
            'refunded': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
            'cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }
        return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Orders</h1>
                    <p className="text-gray-600 dark:text-gray-400">View and manage all your orders</p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Order Status Filter */}
                        <div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                        <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No orders found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">You haven&apos;t placed any orders yet.</p>
                        <Link
                            href="/dashboard/products"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition font-medium shadow-lg hover:shadow-xl"
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
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                        {order.order_number}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                                                        {order.order_status}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                                        {order.payment_status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">{order.product_name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {order.quantity}</p>
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                {order.currency_symbol}{parseFloat(order.total_amount).toFixed(2)}
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Payment: {order.payment_method}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/dashboard/orders/${order.id}/confirmation`}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition font-medium shadow-lg hover:shadow-xl"
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

