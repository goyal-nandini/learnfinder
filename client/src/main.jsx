import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Saved from './pages/Saved.jsx';
import './index.css';
import Path from "./pages/Path.jsx";
import { ThemeProvider } from './context/ThemeContext.jsx';
import Footer from "./components/Footer.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/path" element={<Path />}/>
        </Routes>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);