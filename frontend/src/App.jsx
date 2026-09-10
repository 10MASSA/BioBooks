import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import BookShowcase from './components/BookShowcase'
import Description from './components/Description'
import TargetAudience from './components/TargetAudience'
import Advantages from './components/Advantages'
import CustomerFeedback from './components/CustomerFeedback'
import OrderForm from './components/OrderForm'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Admin from './pages/Admin'

function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BookShowcase />
        <Description />
        <TargetAudience />
        <Advantages />
        <CustomerFeedback />
        <OrderForm />
        <Contact />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
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
