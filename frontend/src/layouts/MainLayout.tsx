import React from 'react'
import Navbar from '@/components/custom/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '@/components/custom/Footer'

const MainLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    <Footer />
    </>
  )
}

export default MainLayout