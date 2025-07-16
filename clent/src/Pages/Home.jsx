import React from 'react'
import NavBar from '../Components/NavBar'
import Hero from '../Components/Hero'
import JobListing from '../Components/JobListing'
import AppDownload from '../Components/AppDownload'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <div>
      <NavBar/>
      <Hero/>
      <JobListing/>
      <AppDownload/>
      <Footer/>
    </div>
  )
}

export default Home
