import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PageLoader from './components/common/PageLoader';
import ToastContainer from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout & Context Theme
import { ThemeProvider } from './contexts/ThemeContext';
import AppShell from './layouts/AppShell';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyLearning = lazy(() => import('./pages/MyLearning'));
const AIMentor = lazy(() => import('./pages/AIMentor'));
const Practice = lazy(() => import('./pages/Practice'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Profile and Settings Pages
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

// Practice Module Pages
const SubjectPractice = lazy(() => import('./pages/SubjectPractice'));
const PracticeSession = lazy(() => import('./pages/PracticeSession'));
const PracticeResults = lazy(() => import('./pages/PracticeResults'));

// Learn Module Pages
const LearnHome = lazy(() => import('./pages/LearnHome'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const ChapterPage = lazy(() => import('./pages/ChapterPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));

// Quiz Module Pages
const QuizHome = lazy(() => import('./pages/QuizHome'));
const QuizSession = lazy(() => import('./pages/QuizSession'));
const QuizResults = lazy(() => import('./pages/QuizResults'));

// CodeLab Pages
const CodeLabHome = lazy(() => import('./pages/CodeLabHome'));
const CodingWorkspace = lazy(() => import('./pages/CodingWorkspace'));

// Interview Module Pages
const InterviewHome = lazy(() => import('./pages/InterviewHome'));
const InterviewSetup = lazy(() => import('./pages/InterviewSetup'));
const InterviewSession = lazy(() => import('./pages/InterviewSession'));
const EvaluationReport = lazy(() => import('./pages/EvaluationReport'));

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* Public Routing Scope */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Guarded Application Shell Scope */}
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/practice" element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'faculty', 'admin']}>
                <Practice />
              </ProtectedRoute>
            } />
            <Route path="/practice/:subjectId" element={
              <ProtectedRoute>
                <SubjectPractice />
              </ProtectedRoute>
            } />
            <Route path="/practice/:subjectId/:setId" element={
              <ProtectedRoute>
                <PracticeSession />
              </ProtectedRoute>
            } />
            <Route path="/practice/:subjectId/:setId/results" element={
              <ProtectedRoute>
                <PracticeResults />
              </ProtectedRoute>
            } />

            <Route path="/my-learning" element={
              <ProtectedRoute>
                <MyLearning />
              </ProtectedRoute>
            } />
            <Route path="/ai-mentor" element={
              <ProtectedRoute>
                <AIMentor />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Learn Module Routes */}
            <Route path="/learn" element={
              <ProtectedRoute>
                <LearnHome />
              </ProtectedRoute>
            } />
            <Route path="/learn/:subjectId" element={
              <ProtectedRoute>
                <SubjectPage />
              </ProtectedRoute>
            } />
            <Route path="/learn/:subjectId/:chapterId" element={
              <ProtectedRoute>
                <ChapterPage />
              </ProtectedRoute>
            } />
            <Route path="/learn/:subjectId/:chapterId/:lessonId" element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            } />

            {/* Quiz Module Routes */}
            <Route path="/quiz" element={
              <ProtectedRoute>
                <QuizHome />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:subjectId/:quizId" element={
              <ProtectedRoute>
                <QuizSession />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:subjectId/:quizId/results" element={
              <ProtectedRoute>
                <QuizResults />
              </ProtectedRoute>
            } />

            {/* CodeLab Routes */}
            <Route path="/codelab" element={
              <ProtectedRoute>
                <CodeLabHome />
              </ProtectedRoute>
            } />
            <Route path="/codelab/:problemId" element={
              <ProtectedRoute>
                <CodingWorkspace />
              </ProtectedRoute>
            } />

            {/* Interview Module Routes */}
            <Route path="/interview" element={
              <ProtectedRoute>
                <InterviewHome />
              </ProtectedRoute>
            } />
            <Route path="/interview/:interviewId/setup" element={
              <ProtectedRoute>
                <InterviewSetup />
              </ProtectedRoute>
            } />
            <Route path="/interview/:interviewId/session" element={
              <ProtectedRoute>
                <InterviewSession />
              </ProtectedRoute>
            } />
            <Route path="/interview/:interviewId/results" element={
              <ProtectedRoute>
                <EvaluationReport />
              </ProtectedRoute>
            } />

            {/* Protected Teacher Routes */}
            <Route path="/teacher" element={
              <ProtectedRoute allowedRoles={['teacher', 'faculty']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>

        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ToastContainer />
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
