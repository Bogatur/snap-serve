import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/login&signupPage/LoginPage';
import SignupPage from './pages/login&signupPage/SignupPage';
import Home from './pages/homePage/Home'
import CreateMenu from './pages/createMenuPage/CreateMenu';
import GenerateQr from './pages/generateQrPage/GenerateQr';
import MobileMenu from './pages/mobileMenuPage/MobileMenu';
import OrderTracking from './pages/orderTrackingPage/OrderTracking';
import Cart from './pages/mobileMenuPage/Cart';
import Statistics from './pages/statistics/Statistics';
import { OrderProvider } from './context/OrderContext';
import AdminPage from './pages/denemeOrderPage';
import Ord from './pages/orderTrackingPage/ord';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/createmenu" element={<CreateMenu />} />
          <Route path="/generateqr" element={<GenerateQr />} />
          <Route path="/mobilemenu" element={<MobileMenu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/ordertracking" element={<OrderTracking />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/orderDeneme" element={<AdminPage />} />
          <Route path="/ord" element={<Ord />} />
        </Routes>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
