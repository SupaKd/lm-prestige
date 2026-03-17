import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Accueil from './pages/Accueil'
import Catalogue from './pages/Catalogue'
import FicheVehicule from './pages/FicheVehicule'
import Reservation from './pages/Reservation'
import Recapitulatif from './pages/Recapitulatif'
import NotFound from './pages/NotFound'
import { ToastProvider } from './components/ui/Toast'
import { ReservationProvider } from './context/ReservationContext'

function App() {
  return (
    <BrowserRouter>
      <ReservationProvider>
      <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/vehicule/:id" element={<FicheVehicule />} />
          <Route path="/reservation/:id" element={<Reservation />} />
          <Route path="/recapitulatif" element={<Recapitulatif />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </ToastProvider>
      </ReservationProvider>
    </BrowserRouter>
  )
}

export default App
