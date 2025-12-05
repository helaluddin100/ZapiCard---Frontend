'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Star,
  Search,
  Filter,
  Grid3x3,
  List,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function TestimonialsPage() {
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Extended mock testimonials data
  const allTestimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      rating: 5,
      text: 'Zapy Card transformed how I network. The NFC feature is a game-changer at events! I can share my contact information instantly with just a tap.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Sales Manager',
      company: 'Global Sales Inc',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      rating: 5,
      text: 'Professional, modern, and incredibly easy to use. My clients love the digital experience. The QR code customization options are fantastic!',
      date: '2024-01-20',
      verified: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Freelance Designer',
      company: 'Creative Studio',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      rating: 5,
      text: 'The customization options are amazing. I can match my card to my brand perfectly! The appointment booking feature has increased my client bookings significantly.',
      date: '2024-02-01',
      verified: true
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'CEO',
      company: 'StartupHub',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      rating: 5,
      text: 'As a startup founder, networking is crucial. Zapy Card makes it so easy to share my information. The analytics feature helps me track who views my card.',
      date: '2024-02-05',
      verified: true
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      role: 'Real Estate Agent',
      company: 'Prime Properties',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      rating: 5,
      text: 'Perfect for real estate! Clients can save my contact instantly and book viewings directly from my card. The NFC card is a conversation starter at open houses.',
      date: '2024-02-10',
      verified: true
    },
    {
      id: 6,
      name: 'James Wilson',
      role: 'Consultant',
      company: 'Independent',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      rating: 5,
      text: 'The best investment I&apos;ve made for my business. Professional appearance, easy to update, and the QR code works flawlessly. Highly recommend!',
      date: '2024-02-12',
      verified: true
    },
    {
      id: 7,
      name: 'Maria Garcia',
      role: 'Event Planner',
      company: 'Celebrations Co',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
      rating: 5,
      text: 'I use Zapy Card at every event. The NFC feature is perfect for networking events - no more fumbling with business cards. Clients love the modern approach!',
      date: '2024-02-15',
      verified: true
    },
    {
      id: 8,
      name: 'Robert Brown',
      role: 'Photographer',
      company: 'Capture Moments',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      rating: 5,
      text: 'The portfolio integration feature is amazing! Clients can see my work directly from my card. The design options are beautiful and professional.',
      date: '2024-02-18',
      verified: true
    },
    {
      id: 9,
      name: 'Jennifer Lee',
      role: 'Fitness Trainer',
      company: 'FitLife Gym',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654d0b?w=150&h=150&fit=crop',
      rating: 5,
      text: 'My clients can book sessions directly from my card. The appointment feature is seamless and has increased my bookings by 30%. Love it!',
      date: '2024-02-20',
      verified: true
    },
    {
      id: 10,
      name: 'Christopher Taylor',
      role: 'Lawyer',
      company: 'Legal Partners',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      rating: 5,
      text: 'Professional and secure. Perfect for legal professionals who need to maintain a polished image. The vCard download feature is very useful for clients.',
      date: '2024-02-22',
      verified: true
    },
    {
      id: 11,
      name: 'Amanda White',
      role: 'Interior Designer',
      company: 'Design Studio',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      rating: 5,
      text: 'The visual customization is incredible. I can showcase my design style through my card. Clients are always impressed with the modern approach.',
      date: '2024-02-25',
      verified: true
    },
    {
      id: 12,
      name: 'Daniel Martinez',
      role: 'Software Developer',
      company: 'CodeCraft',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
      rating: 5,
      text: 'As a developer, I appreciate the clean API and easy integration. The platform is well-built and the support team is responsive. Great product!',
      date: '2024-02-28',
      verified: true
    },
    {
      id: 13,
      name: 'Rachel Green',
      role: 'Nutritionist',
      company: 'Healthy Living',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop',
      rating: 5,
      text: 'The appointment booking feature is perfect for my practice. Clients can schedule consultations directly, and I can manage my calendar easily.',
      date: '2024-03-01',
      verified: true
    },
    {
      id: 14,
      name: 'Kevin Park',
      role: 'Financial Advisor',
      company: 'Wealth Management',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      rating: 5,
      text: 'Professional appearance is crucial in finance. Zapy Card gives me that edge. The NFC card quality is excellent and makes a great impression.',
      date: '2024-03-03',
      verified: true
    },
    {
      id: 15,
      name: 'Sophie Turner',
      role: 'Life Coach',
      company: 'Transform Coaching',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
      rating: 5,
      text: 'The platform is intuitive and the results speak for themselves. My clients love the modern approach, and it reflects my forward-thinking brand.',
      date: '2024-03-05',
      verified: true
    },
    {
      id: 16,
      name: 'Thomas Anderson',
      role: 'Architect',
      company: 'Design Build',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      rating: 4,
      text: 'Great platform overall. The design options are good, though I&apos;d love to see more architectural templates. The NFC feature works well.',
      date: '2024-03-08',
      verified: true
    },
    {
      id: 17,
      name: 'Olivia Davis',
      role: 'Yoga Instructor',
      company: 'Zen Studio',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
      rating: 5,
      text: 'Perfect for wellness professionals! The calming design options match my brand perfectly. Students can book classes directly from my card.',
      date: '2024-03-10',
      verified: true
    },
    {
      id: 18,
      name: 'William Jackson',
      role: 'Mechanic',
      company: 'AutoCare Plus',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      rating: 5,
      text: 'Even in a traditional industry, the modern approach works! Customers appreciate the convenience. The QR code is great for quick contact sharing.',
      date: '2024-03-12',
      verified: true
    }
  ]

  // Filter testimonials
  const filteredTestimonials = allTestimonials.filter(testimonial => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.text.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRating = ratingFilter === 'all' || testimonial.rating === parseInt(ratingFilter)

    return matchesSearch && matchesRating
  })

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200 dark:border-blue-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Testimonials
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
              What Our Users Say
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Join thousands of professionals who are networking smarter with Zapy Card
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100 ml-2">
                  4.9/5
                </span>
              </div>
              <div className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  {allTestimonials.length}+ Reviews
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 relative">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 dark:bg-blue-900 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 dark:bg-purple-900 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
            <div className="relative glass-effect rounded-3xl p-6 md:p-8 shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                {/* Rating Filter */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <select
                    value={ratingFilter}
                    onChange={(e) => {
                      setRatingFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 font-medium text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setViewMode('grid')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-xl transition-all ${viewMode === 'grid'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setViewMode('list')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-xl transition-all ${viewMode === 'list'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Showing <span className="font-bold text-gray-900 dark:text-gray-100">{paginatedTestimonials.length}</span> of{' '}
                  <span className="font-bold text-gray-900 dark:text-gray-100">{filteredTestimonials.length}</span> testimonials
                </div>
                {filteredTestimonials.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">All verified reviews</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid/List */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 relative">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 dark:bg-purple-900 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400 dark:bg-pink-900 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          {paginatedTestimonials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 glass-effect rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">No testimonials found matching your criteria.</p>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paginatedTestimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group"
                >
                  {/* Decorative gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>

                  <div className="relative glass-effect rounded-2xl p-6 md:p-8 card-hover bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all">
                    {/* Quote Icon */}
                    <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
                      <Quote className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                    </div>

                    <div className="flex items-start mb-4 relative z-10">
                      <div className="flex-1">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 + 0.2 }}
                          className="flex items-center gap-1 mb-3"
                        >
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1 + 0.3 + i * 0.05, type: 'spring' }}
                            >
                              <Star
                                className={`w-4 h-4 ${i < testimonial.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                                  }`}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                        {testimonial.verified && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </motion.span>
                        )}
                      </div>
                    </div>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                      className="text-gray-700 dark:text-gray-300 mb-6 italic text-base leading-relaxed line-clamp-4 relative z-10"
                    >
                      &ldquo;{testimonial.text}&rdquo;
                    </motion.p>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur opacity-50"></div>
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-lg"
                        />
                      </motion.div>
                      <div className="flex-1">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 + 0.4 }}
                          className="font-bold text-gray-900 dark:text-gray-100"
                        >
                          {testimonial.name}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 + 0.5 }}
                          className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                        >
                          {testimonial.role}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 + 0.6 }}
                          className="text-xs text-gray-500 dark:text-gray-500"
                        >
                          {testimonial.company}
                        </motion.div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + 0.7 }}
                      className="mt-4 text-xs text-gray-500 dark:text-gray-500"
                    >
                      {new Date(testimonial.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </motion.div>

                    {/* Decorative bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedTestimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: 'spring' }}
                  whileHover={{ x: 5, scale: 1.01 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
                  <div className="relative glass-effect rounded-2xl p-6 md:p-8 card-hover bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all">
                    <div className="flex flex-col md:flex-row gap-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex-shrink-0 relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur opacity-50"></div>
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="relative w-20 h-20 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-lg"
                        />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{testimonial.name}</h3>
                              {testimonial.verified && (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{testimonial.role} at {testimonial.company}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${i < testimonial.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="relative mb-4">
                          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200 dark:text-blue-800 opacity-50" />
                          <p className="text-gray-700 dark:text-gray-300 italic text-base leading-relaxed pl-6">
                            &ldquo;{testimonial.text}&rdquo;
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(testimonial.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 flex items-center justify-center gap-2"
            >
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                className="p-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <motion.button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${currentPage === page
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {page}
                    </motion.button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-500 dark:text-gray-400">...</span>
                }
                return null
              })}

              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                className="p-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="relative z-10"
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Ready to Join These Happy Users?
                </h2>
                <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
                  Create your smart visiting card today and start networking smarter
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center justify-center"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/"
                    className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-all transform hover:scale-105 border-2 border-white/30 inline-flex items-center justify-center"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

