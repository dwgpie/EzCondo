import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { Facebook, LinkedIn, YouTube } from '@mui/icons-material'
import { User, Clipboard, Plug, Bell, Shield, MessageCircle } from 'lucide-react'
import { IconButton } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

const imagesParallax = [
  '/imgs/bg/bgh-1.jpg',
  '/imgs/bg/bgh-2.jpg',
  '/imgs/bg/bgh-3.jpg',
  '/imgs/bg/bgh-4.jpg',
  '/imgs/bg/bgh-5.jpg',
  '/imgs/bg/bgh-6.jpg'
]

//Features Section
const features = [
  {
    title: 'Resident Management',
    icon: <User className='w-14 h-14 text-blue-500 bg-blue-100 p-3 rounded-full shadow-md' />,
    desc: 'Manage resident information, assist with communication, and handle internal requests quickly.'
  },
  {
    title: 'Service Monitoring',
    icon: <Clipboard className='w-14 h-14 text-green-500 bg-green-100 p-3 rounded-full shadow-md' />,
    desc: 'Monitor utility services such as electricity and water bills, and provide transparent feedback to residents.'
  },
  {
    title: 'System Integration',
    icon: <Plug className='w-14 h-14 text-purple-500 bg-purple-100 p-3 rounded-full shadow-md' />,
    desc: 'Integrate with utility management systems and third-party services such as payOS, optimizing operations and enhancing resident experience.'
  },
  {
    title: 'Alerts & Notifications',
    icon: <Bell className='w-14 h-14 text-yellow-500 bg-yellow-100 p-3 rounded-full shadow-md' />,
    desc: 'Send notifications and alerts to residents about maintenance updates, service schedules, and incidents.'
  },
  {
    title: 'Incident Reporting',
    icon: <Shield className='w-14 h-14 text-red-500 bg-red-100 p-3 rounded-full shadow-md' />,
    desc: 'Quickly report incidents to ensure area safety, helping residents and management address security issues promptly.'
  },
  {
    title: 'Chatbot',
    icon: <MessageCircle className='w-14 h-14 text-indigo-500 bg-indigo-100 p-3 rounded-full shadow-md' />,
    desc: 'A chatbot that helps residents quickly resolve issues, answer questions, and assist with various requests in real time.'
  }
]

// Customer Reviews
export const customerReviews = [
  { name: 'John Penycate', comment: 'The app is easy to use — I can book services and make payments within minutes.' },
  { name: 'Sophia Allen', comment: 'The system helps me track bills and management announcements conveniently.' },
  {
    name: 'Chris Walker',
    comment: 'I really like the incident reporting feature – it’s quick and provides clear feedback.'
  },
  { name: 'Diana Thompson', comment: 'No more remembering payment deadlines — the reminders are right on time!' },
  { name: 'Edward Hughes', comment: 'User-friendly interface, even older residents can use it with ease.' },
  { name: 'Fiona Roberts', comment: 'The chatbot responds quickly and answers most of my questions.' },
  { name: 'George Bailey', comment: 'The management handles requests much faster since using this system.' },
  { name: 'Helen Carter', comment: 'A big step forward in digitizing our apartment complex — very impressive!' },
  { name: 'Ivan Mitchell', comment: 'I can view reports and payment history — everything is clear and transparent.' },
  { name: 'Jenny Parker', comment: 'I feel more secure knowing I can monitor security and receive timely alerts.' }
]

export default function LandingPage() {
  const [currentImageParallax] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Scroll to Top Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Parallax Effect
  const parallaxMotion = {
    animate: {
      backgroundPosition: ['0% 0%', '0% 100%'],
      transition: { duration: 15, repeat: Infinity, ease: 'linear' }
    }
  }

  const buttonHover = {
    hover: {
      scale: 1.1,
      boxShadow: '0px 0px 15px rgba(59,130,246,0.8)',
      transition: { yoyo: Infinity, duration: 0.4 }
    }
  }

  //Fade In Animation
  const FadeInSection = ({ children }: { children: React.ReactNode }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
    return (
      <motion.div ref={ref} variants={sectionVariants} initial='hidden' animate={inView ? 'visible' : 'hidden'}>
        {children}
      </motion.div>
    )
  }

  //Slide Left Animation
  const SlideLeftSection = ({ children }: { children: React.ReactNode }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
    return (
      <motion.div ref={ref} variants={slideLeft} initial='hidden' animate={inView ? 'visible' : 'hidden'}>
        {children}
      </motion.div>
    )
  }

  //Slide right animation
  const SlideRightSection = ({ children }: { children: React.ReactNode }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
    return (
      <motion.div ref={ref} variants={slideRight} initial='hidden' animate={inView ? 'visible' : 'hidden'}>
        {children}
      </motion.div>
    )
  }

  // Animation
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const slideLeft = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.2 } }
  }

  const slideRight = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.2 } }
  }

  // Typing Effect Animation
  const typingEffect = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.02
      }
    }
  }

  const letterAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.0001 } }
  }

  const TypingText = ({ text }: { text: string }) => {
    const textArray = text.split('')
    return (
      <motion.div
        variants={typingEffect}
        initial='hidden'
        animate='visible'
        className='p-8 pb-5 rounded-2xl shadow-lg text-center hover:scale-105 transition-transform max-w-[1220px] mx-auto text-lg'
      >
        <div className='flex justify-center'>
          <div className='text-center break-words whitespace-normal max-w-full leading-relaxed'>
            {textArray.map((letter, index) => (
              <motion.span key={index} variants={letterAnimation}>
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className='min-h-screen bg-white text-gray-800 font-[Plus Jakarta Sans]'>
      {/* Header */}
      <header className='shadow-md'>
        <div className='max-w-7xl mx-auto flex justify-between items-center px-4'>
          <h2 className='text-3xl font-extrabold text-[#1976d3] flex items-center'>
            <div className='w-20 h-16 mr-[-8px]'>
              <img src='/imgs/logo/logo-mini.png' className='w-full h-full object-cover' />
            </div>
            <span>EzCondo</span>
          </h2>
          <nav className='flex items-center space-x-8'>
            <ul className='flex items-center space-x-8'>
              <li>
                <a
                  href='#home'
                  className='text-[#1976d3] font-bold text-lg hover:text-blue-800 transition-colors duration-200'
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href='#features'
                  className='text-[#1976d3] font-bold text-lg hover:text-blue-800 transition-colors duration-200'
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href='#modules'
                  className='text-[#1976d3] font-bold text-lg hover:text-blue-800 transition-colors duration-200'
                >
                  Modules
                </a>
              </li>
              <li>
                <a
                  href='#mobile'
                  className='text-[#1976d3] font-bold text-lg hover:text-blue-800 transition-colors duration-200'
                >
                  Mobile
                </a>
              </li>
              <li>
                <a
                  href='#contact'
                  className='text-[#1976d3] font-bold text-lg hover:text-blue-800 transition-colors duration-200'
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className='flex items-center space-x-6'>
            <a
              href='/login'
              className='text-[#1976d3] font-semibold text-lg hover:text-blue-800 transition-colors duration-200'
            >
              Sign In
            </a>
            <a
              href='#signup'
              className='bg-[#1976d3] text-lg text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200'
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        className='h-[100vh] bg-cover bg-center flex flex-col justify-center items-center text-white text-center relative'
        style={{
          backgroundImage: `url(${imagesParallax[currentImageParallax]})`
        }}
        variants={parallaxMotion}
        animate='animate'
      >
        <motion.h1 className='text-5xl font-bold mb-6 drop-shadow-lg'>Live Comfortably, Manage Smartly</motion.h1>{' '}
        <motion.button
          variants={buttonHover}
          whileHover='hover'
          className='bg-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all cursor-pointer'
        >
          Discover Now
        </motion.button>
      </motion.section>

      {/* Typing Effect Section */}
      <section id='features' className='pt-5 mt-10 pb-10 px-8 text-center'>
        <FadeInSection>
          <h4 className='text-4xl font-bold text-[#1976d3]'>EzCondo</h4>
          <TypingText text='EzCondo is a comprehensive solution that simplifies apartment building management. It helps property managers streamline operations and provides residents with easy access to services. This creates a more convenient and efficient living experience for all.' />
        </FadeInSection>
      </section>

      {/* Features Section */}
      <section id='features' className='relative pb-16'>
        <FadeInSection>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-6'>
            {features.map((feature) => (
              <FadeInSection key={feature.title}>
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 h-[270px] p-8 rounded-3xl shadow-xl text-center hover:scale-105 transition-transform'>
                  <div className='flex justify-center mb-6'>{feature.icon}</div>
                  <h4 className='text-xl font-semibold text-blue-700'>{feature.title}</h4>
                  <p className='mt-2 text-gray-600'>{feature.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Image Animation Showcase */}
      <section id='modules' className='py-16 overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 text-center'>
        <SlideLeftSection>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto'>
            <motion.img
              src='/imgs/bg/fix-1.avif'
              alt='Incident Reporting'
              whileHover={{ rotate: 2, scale: 1.05 }}
              className='rounded-xl shadow-xl w-full h-auto object-cover'
            />
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='flex flex-col justify-center'
            >
              <h4 className='text-2xl font-semibold text-blue-800 mb-4'>Incident Reporting and Maintenance</h4>
              <p className='text-gray-700'>
                Residents can easily report incidents and track repair status online, with the option to attach images.
              </p>
            </motion.div>
          </div>
        </SlideLeftSection>
      </section>
      <section className='py-16 overflow-hidden'>
        <SlideRightSection>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto'>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='flex flex-col justify-center'
            >
              <h4 className='text-2xl font-semibold text-blue-800 mb-4'>Service Booking</h4>
              <p className='text-gray-700'>
                Residents can easily book shared services like gym, pool, and community rooms, receiving instant
                confirmations and automated reminders.
              </p>
            </motion.div>
            <motion.img
              src='/imgs/bg/fix-2.jpg'
              alt='Smart Control'
              whileHover={{ rotate: -2, scale: 1.05 }}
              className='rounded-xl shadow-xl w-full h-auto object-cover'
            />
          </div>
        </SlideRightSection>
      </section>
      <section className='py-16 overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 text-center'>
        <SlideLeftSection>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto'>
            <motion.img
              src='/imgs/bg/fix-3.jpg'
              alt='Incident Reporting'
              whileHover={{ rotate: 2, scale: 1.05 }}
              className='rounded-xl shadow-xl w-full h-auto object-cover'
            />
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='flex flex-col justify-center'
            >
              <h4 className='text-2xl font-semibold text-blue-800 mb-4'>Online Payment</h4>
              <p className='text-gray-700'>
                Residents can pay service fees and track payment history quickly and easily.
              </p>
            </motion.div>
          </div>
        </SlideLeftSection>
      </section>
      <section className='py-16 overflow-hidden'>
        <SlideRightSection>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto'>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='flex flex-col justify-center'
            >
              <h4 className='text-2xl font-semibold text-blue-800 mb-4'>Smart Notifications</h4>
              <p className='text-gray-700'>
                Residents and managers receive timely alerts about maintenance updates, community events, and other
                important notifications.
              </p>
            </motion.div>
            <motion.img
              src='/imgs/bg/fix-5.jpg'
              alt='Smart Control'
              whileHover={{ rotate: -2, scale: 1.05 }}
              className='rounded-xl shadow-xl w-full h-auto object-cover'
            />
          </div>
        </SlideRightSection>
      </section>
      <section className='py-16 overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 text-center'>
        <SlideLeftSection>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto'>
            <motion.img
              src='/imgs/bg/fix-6.jpg'
              alt='Centralized Dashboard'
              whileHover={{ rotate: 2, scale: 1.05 }}
              className='rounded-xl shadow-xl w-full h-auto object-cover'
            />
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='flex flex-col justify-center'
            >
              <h4 className='text-2xl font-semibold text-blue-800 mb-4'>Centralized Dashboard for Managers</h4>
              <p className='text-gray-700'>Managers can monitor all reports, service bookings, and residents.</p>
            </motion.div>
          </div>
        </SlideLeftSection>
      </section>

      {/* Section Skew Transition */}
      <div id='mobile' className='-skew-y-3 bg-blue-600 my-16'>
        <div className='skew-y-3 py-24 text-center text-white'>
          <FadeInSection>
            <h2 className='text-4xl font-bold mb-4'>Stay Connected on Mobile</h2>
            <p className='max-w-3xl mx-auto text-lg'>
              Manage your apartment, make payments, receive notifications — all from your phone.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className='relative flex justify-center items-end px-4 pb-16'>
        {/* Left images */}
        <img
          src='/imgs/logo/mb-4.jpg'
          alt='Left App 1'
          className='hidden sm:block h-96 object-contain absolute z-10 left-[calc(50%-30rem)] shadow-2xl'
        />
        <img
          src='/imgs/logo/mb-3.jpg'
          alt='Left App 2'
          className='hidden sm:block h-[26rem] object-contain absolute z-20 left-[calc(50%-19rem)] shadow-2xl'
        />
        {/* Center image */}
        <img
          src='/imgs/logo/mb-1.jpg'
          alt='Center App'
          className='relative z-30 h-[30rem] object-contain shadow-2xl rounded-xl'
        />
        {/* Right images */}
        <img
          src='/imgs/logo/mb-2.jpg'
          alt='Right App 1'
          className='hidden sm:block h-[26rem] object-contain absolute z-20 left-[calc(50%+7rem)] shadow-2xl'
        />
        <img
          src='/imgs/logo/mb-5.jpg'
          alt='Right App 2'
          className='hidden sm:block h-96 object-contain absolute z-10 left-[calc(50%+19rem)] shadow-2xl'
        />
      </div>

      {/* Customer Reviews */}
      <section className='py-16 overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 text-center'>
        <h3 className='text-3xl font-bold text-center text-blue-900 mb-12'>What Our Customers Say About Us</h3>
        <motion.div
          className='flex gap-8 w-max px-4 animate-marquee'
          animate={{ x: [0, -800] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {customerReviews.map((review, i) => (
            <div key={i} className='bg-white rounded-2xl shadow-lg p-6 w-[300px] min-w-[300px]'>
              <p className='text-sm text-gray-600 h-[60px] mb-4'>“{review.comment}”</p>
              <p className='text-blue-800 font-semibold'>{review.name}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='py-16'>
        <FadeInSection>
          <div className='max-w-xl mx-auto text-center'>
            <h3 className='text-4xl font-bold text-gray-800 mb-4'>Contact Us</h3>
            <p className='text-gray-600 mb-8 text-lg'>
              Want to experience our system? Leave your information and we will get in touch with you as soon as
              possible!
            </p>
            <form className='space-y-5 text-left'>
              <div>
                <input
                  type='text'
                  placeholder='Enter your name...'
                  className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1976d3] focus:outline-none transition'
                />
              </div>

              <div>
                <input
                  type='email'
                  placeholder='Enter your email...'
                  className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1976d3] focus:outline-none transition'
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder='What would you like to say?'
                  className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1976d3] focus:outline-none transition resize-none'
                ></textarea>
              </div>

              <div className='text-center pt-2'>
                <button
                  type='submit'
                  className='bg-[#1976d3] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all'
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </FadeInSection>
      </section>

      {/* Footer */}
      <footer id='contact' className='bg-gray-100 text-gray-800 pt-12 px-6 border-t border-gray-200'>
        <FadeInSection>
          <div className='max-w-6xl mx-auto grid grid-cols-4 gap-12'>
            {/* Logo & Introduction (chiếm 2 cột) */}
            <div className='col-span-2 space-y-5'>
              <h4 className='text-3xl font-bold text-[#1976d3]'>EzCondo</h4>
              <p className='text-base text-gray-600 leading-relaxed'>
                Apartment Management System is a comprehensive solution designed to overcome difficulties in managing
                apartment buildings and help residents use services conveniently and easily.
              </p>
            </div>

            {/* Contact */}
            <div className='space-y-5'>
              <h4 className='text-xl font-semibold text-gray-900 mb-8'>Contact Us</h4>
              <p className='text-base'>
                Email: <span className='text-[#1976d3] font-medium'>ezcondo@gmail.com</span>
              </p>
              <p className='text-base mt-[-15px]'>
                Hotline: <span className='text-[#1976d3] font-medium'>1900 1234</span>
              </p>
            </div>

            {/* Social Media */}
            <div className='space-y-5'>
              <h4 className='text-xl font-semibold text-gray-900 mb-8'>Follow Us</h4>
              <div className='flex gap-4'>
                <IconButton
                  href='https://facebook.com'
                  target='_blank'
                  className='p-3 rounded-full shadow-md'
                  style={{ backgroundColor: 'white' }}
                >
                  <Facebook sx={{ fontSize: 28, color: '#1877f2' }} className='group-hover:text-white transition' />
                </IconButton>
                <IconButton
                  href='https://linkedin.com'
                  target='_blank'
                  className='p-3 rounded-full shadow-md'
                  style={{ backgroundColor: 'white' }}
                >
                  <LinkedIn sx={{ fontSize: 28, color: '#0a66c2' }} className='group-hover:text-white transition' />
                </IconButton>
                <IconButton
                  href='https://youtube.com'
                  target='_blank'
                  className='p-3 rounded-full shadow-md'
                  style={{ backgroundColor: 'white' }}
                >
                  <YouTube sx={{ fontSize: 28, color: '#ff0000' }} className='group-hover:text-white transition' />
                </IconButton>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className='text-center py-8 text-sm text-gray-500 mt-10 border-t border-gray-300'>
            © 2025 EzCondo. All rights reserved.
          </div>
        </FadeInSection>
      </footer>

      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className='fixed bottom-6 right-6 bg-blue-600 text-white cursor-pointer w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 focus:outline-none active:scale-95 transition-all duration-200 z-50'
          aria-label='Trở lại đầu trang'
        >
          <ArrowUpwardIcon fontSize='small' />
        </motion.button>
      )}
    </div>
  )
}
