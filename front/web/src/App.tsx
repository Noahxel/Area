import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import './App.css';
import { UserContext } from './context/userContext';
import AuthenticatedNavbar from './components/NavBars/AuthenticatedNavbar';
import UnauthenticatedNavbar from './components/NavBars/UnauthenticatedNavbar';
import Login from './components/pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home'
import CreatePage from './components/pages/Private/Create/CreatePage';
import Account from './components/pages/Private/Account'
import { useLocation } from 'react-router-dom';
import Register from './components/Register';
import Applets from './components/pages/Private/Applets';
import Confirm from './components/pages/Confirm';
import 'react-notifications-component/dist/theme.css';
import jwtDecode from 'jwt-decode';
import { ReactNotifications } from 'react-notifications-component';
import ResetPassword from './components/pages/ResetPassword';
import EmailChange from './components/pages/EmailChange';
import PrivacyPolicy from './components/pages/PrivacyPolicy';

function App() {  
  const userContext = useContext(UserContext);
  let token = userContext ? userContext.token : null;
  const location = useLocation();

  useEffect(() => {
    const now = (new Date().getTime()) / 1000;
    if (token) {
      const decoded: any = jwtDecode(token)
      if (decoded.exp < now) {
        localStorage.removeItem('userToken');
        token = null
      } else {
        localStorage.setItem('userToken', token);
      }
    }
    if (location.pathname === '/' || location.pathname.startsWith('/auth/confirm/')) {
      document.body.style.backgroundColor = '#1D1D1D';
    } else {
      document.body.style.backgroundColor = '#fff';
    }
  }, [location.pathname]);


  return (
    <>
      <ReactNotifications/>
      {token ? <AuthenticatedNavbar /> : <UnauthenticatedNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/applets" element={<Applets />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/auth/confirm/:token" element={<Confirm />} />
        <Route path="/auth/confirm-email-change/:token" element={<EmailChange/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
      </Routes>
    </>
  );
}

export default App;