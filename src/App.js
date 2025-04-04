import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import LoginPage from './Components/LoginPage';
import Order from './Components/Kitchen/Orders/Order';
import Dashboard from './Components/Kitchen/Dashboard/Dashboard';
import Signup from './Components/Signup';
import OpeningPage from './Components/OpeningPage';
import Welcome from './Components/Welcome'; 
import AvailableMenu from './Components/Kitchen/AvailableMenu/AvailableMenu';
import NavbarMain from './Components/Subpage/NavBarMain';
import Navbar from './Components/Admin/Navbar';
import CustomerDashboard from './Components/Customer/CustomerDashboard'


function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.redirectTo === "Update Grocery") {
      navigate("/main", { state: { activeTab: "Update Grocery" } });
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <RedirectHandler />  {/* ✅ Automatically redirects if needed */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/order" element={<Order />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<OpeningPage />} />
          <Route path="/welcome" element={<Welcome />} /> 
          <Route path="/menu" element={<AvailableMenu />} />
          <Route path="/main" element={<NavbarMain />} />
          <Route path="/admin" element={<Navbar />} />
          <Route path="/customer" element={<CustomerDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

