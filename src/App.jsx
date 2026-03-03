import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Assets from './pages/Assets';
import Dashboard from './pages/dashboard/Dashboard';
import Stocks from './pages/dashboard/Stocks';
import BuyStocks from './pages/dashboard/BuyStocks';
import Plans from './pages/dashboard/Plans';
import PlanCheckout from './pages/dashboard/PlanCheckout';
import StockCheckout from './pages/dashboard/StockCheckout';
import Currencies from './pages/dashboard/Currencies';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Layout wrapper for pages with Navbar and Footer
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Routes with Navbar and Footer */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/contacto" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/registro" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/recuperar-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
            <Route path="/activos" element={<MainLayout><Assets /></MainLayout>} />

            {/* Dashboard route without Navbar and Footer */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Stocks/Portfolio route */}
            <Route
              path="/dashboard/stocks"
              element={
                <ProtectedRoute>
                  <Stocks />
                </ProtectedRoute>
              }
            />

            {/* Buy Stocks route */}
            <Route
              path="/dashboard/buy"
              element={
                <ProtectedRoute>
                  <BuyStocks />
                </ProtectedRoute>
              }
            />

            {/* Plans route */}
            <Route
              path="/dashboard/plans"
              element={
                <ProtectedRoute>
                  <Plans />
                </ProtectedRoute>
              }
            />

            {/* Plan Checkout route */}
            <Route
              path="/dashboard/plans/checkout"
              element={
                <ProtectedRoute>
                  <PlanCheckout />
                </ProtectedRoute>
              }
            />

            {/* Stock Checkout route */}
            <Route
              path="/dashboard/buy/checkout"
              element={
                <ProtectedRoute>
                  <StockCheckout />
                </ProtectedRoute>
              }
            />

            {/* Currencies route */}
            <Route
              path="/dashboard/currencies"
              element={
                <ProtectedRoute>
                  <Currencies />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App;
