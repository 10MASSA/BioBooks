import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Description from './components/Description'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Admin from './pages/Admin'

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-primary-500 selection:text-white">
      <Header />
      <main className="flex-grow">
        {/* Main Hero with Interactive Media Gallery & Animated Order Form */}
        <Hero />
        {/* Modern Book Content Description */}
        <Description />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
