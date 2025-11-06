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
  ChevronRight
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
      text: 'Zapi Card transformed how I network. The NFC feature is a game-changer at events! I can share my contact information instantly with just a tap.',
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
      text: 'As a startup founder, networking is crucial. Zapi Card makes it so easy to share my information. The analytics feature helps me track who views my card.',
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
      text: 'I use Zapi Card at every event. The NFC feature is perfect for networking events - no more fumbling with business cards. Clients love the modern approach!',
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
      text: 'Professional appearance is crucial in finance. Zapi Card gives me that edge. The NFC card quality is excellent and makes a great impression.',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who are networking smarter with Zapi Card
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900 ml-2">
                4.9/5
              </span>
              <span className="text-gray-600 ml-2">
                ({allTestimonials.length} reviews)
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Rating Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={ratingFilter}
                  onChange={(e) => {
                    setRatingFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {paginatedTestimonials.length} of {filteredTestimonials.length} testimonials
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid/List */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {paginatedTestimonials.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg">
              <p className="text-xl text-gray-600">No testimonials found matching your criteria.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTestimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl shadow-lg p-6 card-hover"
                >
                  <div className="flex items-start mb-4">
                    <Quote className="w-8 h-8 text-blue-200 flex-shrink-0" />
                    <div className="flex-1 ml-2">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                              }`}
                          />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <span className="text-xs text-green-600 font-medium">✓ Verified Purchase</span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 italic line-clamp-4">
                    &quot;{testimonial.text}&quot;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    {new Date(testimonial.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedTestimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl shadow-lg p-6 card-hover"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                            {testimonial.verified && (
                              <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic mb-3">
                        &quot;{testimonial.text}&quot;
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(testimonial.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-500">...</span>
                }
                return null
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join These Happy Users?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Create your smart visiting card today and start networking smarter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                Get Started Free
              </Link>
              <Link href="/" className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition inline-block">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

