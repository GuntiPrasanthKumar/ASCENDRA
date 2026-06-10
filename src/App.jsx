import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CustomCursor from './components/common/CustomCursor';
import PageLoader from './components/common/PageLoader';
import ToastContainer from './components/common/Toast';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Quiz = lazy(() => import('./pages/Quiz'));
const MyVault = lazy(() => import('./pages/MyVault'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const Echo = lazy(() => import('./pages/Echo'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Assessment = lazy(() => import('./pages/Assessment'));

function AnimatedRoutes() {
  const location = useLocation();

  // Do not show navbar/footer on Quiz page
  const isQuizRoute = location.pathname.includes('/quiz');

  return (
    <div className="flex flex-col min-h-screen">
      {!isQuizRoute && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/proctoring" element={<Assessment />} />
            <Route path="/vault" element={<MyVault />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/echo" element={<Echo />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </AnimatePresence>

      </main>
      {!isQuizRoute && <Footer />}
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
