import Footer from '@/components/customs/landing/Footer'
import Navbar from '@/components/customs/landing/Navbar'
import { Outlet } from 'react-router-dom'

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