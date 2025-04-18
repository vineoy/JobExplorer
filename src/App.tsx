import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';

// Layouts
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import JobDetailsPage from './pages/JobDetailsPage';
import AddJobPage from './pages/AddJobPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Employee Dashboard
import EmployeeDashboard from './pages/EmployeeDashboard/Dashboard';
import SavedJobs from './pages/EmployeeDashboard/SavedJobs';
import Applications from './pages/EmployeeDashboard/Applications';
import EmployeeProfile from './pages/EmployeeDashboard/Profile';

// Employer Dashboard
import EmployerDashboard from './pages/EmployerDashboard/Dashboard';
import PostedJobs from './pages/EmployerDashboard/PostedJobs';
import Applicants from './pages/EmployerDashboard/Applicants';
import EmployerProfile from './pages/EmployerDashboard/Profile';

// Protected Routes
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/job/:id" element={<JobDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Employer Routes */}
                <Route path="/employer" element={
                  <ProtectedRoute role="employer">
                    <EmployerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/employer/jobs" element={
                  <ProtectedRoute role="employer">
                    <PostedJobs />
                  </ProtectedRoute>
                } />
                <Route path="/employer/applicants/:jobId" element={
                  <ProtectedRoute role="employer">
                    <Applicants />
                  </ProtectedRoute>
                } />
                <Route path="/employer/profile" element={
                  <ProtectedRoute role="employer">
                    <EmployerProfile />
                  </ProtectedRoute>
                } />
                <Route path="/add-job" element={
                  <ProtectedRoute role="employer">
                    <AddJobPage />
                  </ProtectedRoute>
                } />
                
                {/* Employee Routes */}
                <Route path="/employee" element={
                  <ProtectedRoute role="employee">
                    <EmployeeDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/employee/saved" element={
                  <ProtectedRoute role="employee">
                    <SavedJobs />
                  </ProtectedRoute>
                } />
                <Route path="/employee/applications" element={
                  <ProtectedRoute role="employee">
                    <Applications />
                  </ProtectedRoute>
                } />
                <Route path="/employee/profile" element={
                  <ProtectedRoute role="employee">
                    <EmployeeProfile />
                  </ProtectedRoute>
                } />
                
                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        </Router>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;