'use client'

import { motion } from 'framer-motion'
import { Minus, Plus, Calculator } from 'lucide-react'

export default function QuantitySelector({ quantity, setQuantity, price, currencySymbol, inStock }) {
    if (!inStock) return null

    // Ensure price is a number
    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0
    const totalPrice = numPrice * quantity

    const handleDecrease = () => {
        setQuantity(Math.max(1, quantity - 1))
    }

    const handleIncrease = () => {
        setQuantity(quantity + 1)
    }

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1
        setQuantity(Math.max(1, value))
    }

    return (
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-blue-600" />
                <label className="text-lg font-semibold text-gray-900">Quantity</label>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 border-2 border-gray-200">
                    <motion.button
                        onClick={handleDecrease}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center font-bold text-gray-700 hover:text-blue-600"
                    >
                        <Minus className="w-4 h-4" />
                    </motion.button>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleInputChange}
                        className="w-20 text-center text-xl font-bold text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none"
                    />

                    <motion.button
                        onClick={handleIncrease}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center font-bold text-gray-700 hover:text-blue-600"
                    >
                        <Plus className="w-4 h-4" />
                    </motion.button>
                </div>

                <div className="flex-1 ml-auto">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-100">
                        <div className="text-sm text-gray-600 mb-1 font-medium">Total Amount</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {currencySymbol}{totalPrice.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

