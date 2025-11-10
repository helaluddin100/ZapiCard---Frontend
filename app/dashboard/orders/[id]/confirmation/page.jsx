'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { useToast } from '@/lib/toast'
import { orderAPI } from '@/lib/api'
import {
    CheckCircle,
    Loader2,
    Package,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    ArrowLeft,
    Download,
    Printer,
    Copy,
    Check
} from 'lucide-react'

export default function OrderConfirmationPage() {
    const params = useParams()
    const router = useRouter()
    const { success, error: showError } = useToast()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (params.id) {
            loadOrder()
        }
    }, [params.id])

    const loadOrder = async () => {
        try {
            setLoading(true)
            const response = await orderAPI.getOrder(params.id)
            if (response.status === 'success') {
                setOrder(response.data)
            } else {
                showError('Order not found')
                router.push('/dashboard/products')
            }
        } catch (err) {
            console.error('Error loading order:', err)
            showError('Failed to load order')
            router.push('/dashboard/products')
        } finally {
            setLoading(false)
        }
    }

    const copyOrderNumber = () => {
        if (order?.order_number) {
            navigator.clipboard.writeText(order.order_number)
            setCopied(true)
            success('Order number copied!')
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const getPaymentMethodName = (method) => {
        const methods = {
            'stripe': 'Credit/Debit Card (Stripe)',
            'nagad': 'Nagad',
            'bkash': 'bKash',
            'rocket': 'Rocket',
            'cash_on_delivery': 'Cash on Delivery',
            'manual': 'Manual Payment'
        }
        return methods[method] || method
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

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            </DashboardLayout>
        )
    }

    if (!order) {
        return null
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
                    >
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-600">
                        Thank you for your order. We've received your order and will begin processing it right away.
                    </p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Details</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Order Number:</span>
                                <span className="font-bold text-gray-900">{order.order_number}</span>
                                <button
                                    onClick={copyOrderNumber}
                                    className="ml-2 p-1 hover:bg-gray-100 rounded transition"
                                    title="Copy order number"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="mb-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                </span>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                    Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="border-t pt-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Product Information</h3>
                        <div className="flex gap-4">
                            {order.product?.images?.[0] && (
                                <img
                                    src={order.product.images[0].image_url || order.product.images[0].thumbnail_url}
                                    alt={order.product_name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                            )}
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{order.product_name}</h4>
                                {order.product_sku && (
                                    <p className="text-sm text-gray-600 mb-2">SKU: {order.product_sku}</p>
                                )}
                                <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Unit Price</p>
                                <p className="font-bold text-gray-900">
                                    {order.currency_symbol}{parseFloat(order.unit_price).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t pt-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{order.currency_symbol}{parseFloat(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>
                                    {parseFloat(order.shipping_cost) > 0
                                        ? `${order.currency_symbol}${parseFloat(order.shipping_cost).toFixed(2)}`
                                        : 'Free'}
                                </span>
                            </div>
                            {parseFloat(order.discount) > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-{order.currency_symbol}{parseFloat(order.discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold pt-2 border-t">
                                <span>Total</span>
                                <span>{order.currency_symbol}{parseFloat(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Shipping Info */}
                    <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <Mail className="w-5 h-5 mr-2" />
                                Customer Information
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-900 font-medium">{order.customer_name}</p>
                                <p className="text-gray-600">{order.customer_email}</p>
                                <p className="text-gray-600 flex items-center">
                                    <Phone className="w-4 h-4 mr-1" />
                                    {order.customer_phone}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Shipping Address
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>{order.shipping_address}</p>
                                {order.shipping_city && <p>{order.shipping_city}</p>}
                                {order.shipping_postal_code && <p>Postal Code: {order.shipping_postal_code}</p>}
                                <p>{order.shipping_country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="border-t pt-6 mt-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" />
                            Payment Information
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium text-gray-900">{getPaymentMethodName(order.payment_method)}</span>
                            </div>
                            {order.payment_transaction_id && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transaction ID:</span>
                                    <span className="font-medium text-gray-900">{order.payment_transaction_id}</span>
                                </div>
                            )}
                            {order.payment_date && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Date:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(order.payment_date).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Date */}
                    <div className="border-t pt-6 mt-6 flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Order placed on {new Date(order.created_at).toLocaleString()}</span>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <Link
                        href="/dashboard/products"
                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Continue Shopping
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                        <Printer className="w-5 h-5 mr-2" />
                        Print Order
                    </button>
                    <Link
                        href={`/dashboard/orders`}
                        className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium"
                    >
                        <Package className="w-5 h-5 mr-2" />
                        View All Orders
                    </Link>
                </motion.div>

                {/* Next Steps */}
                {order.payment_status === 'pending' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mt-6"
                    >
                        <h3 className="font-bold text-gray-900 mb-2">Next Steps</h3>
                        <p className="text-gray-700 mb-4">
                            Your order is pending payment. Please complete the payment to proceed with your order.
                        </p>
                        {order.payment_method === 'manual' && (
                            <p className="text-sm text-gray-600">
                                Please send payment using the method you selected during checkout. After payment, contact us with your transaction ID.
                            </p>
                        )}
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    )
}

