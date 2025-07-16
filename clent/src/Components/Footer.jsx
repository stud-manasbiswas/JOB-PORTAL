import React from 'react'
import { assets } from '../assets/assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-50 border-t border-gray-200 mt-20'>
      <div className='container px-4 2xl:px-20 mx-auto py-6 flex flex-col sm:flex-row items-center justify-between gap-6'>

        {/* Logo */}
        <img width={160} src={assets.logo} alt="Company Logo" />

        {/* Copyright */}
        <p className='text-sm text-gray-500 text-center sm:text-left'>
          © {new Date().getFullYear()} manasbiswas.dev — All rights reserved
        </p>

        {/* Social Icons */}
        <div className='flex gap-4'>
          <a href="#" aria-label="Instagram">
            <img className='w-8 hover:scale-110 transition-transform' src={assets.instagram_icon} alt="Instagram" />
          </a>
          <a href="#" aria-label="Facebook">
            <img className='w-8 hover:scale-110 transition-transform' src={assets.facebook_icon} alt="Facebook" />
          </a>
          <a href="#" aria-label="Twitter">
            <img className='w-8 hover:scale-110 transition-transform' src={assets.twitter_icon} alt="Twitter" />
          </a>
        </div>

      </div>
    </footer>
  )
}

export default Footer
