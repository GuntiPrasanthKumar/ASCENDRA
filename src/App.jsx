import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PageLoader from './components/common/PageLoader';
import ToastContainer from './components/common/Toast';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyLearning = lazy(() => import('./pages/MyLearning'));
const AIMentor = lazy(() => import('./pages/AIMentor'));
const Practice = lazy(() => import('./pages/Practice'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/ai-mentor" element={<AIMentor />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
