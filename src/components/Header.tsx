import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Briefcase, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isEmployer, isEmployee } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'employee' | 'employer'>(
    isEmployer ? 'employer' : 'employee'
  );
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const switchTab = (tab: 'employee' | 'employer') => {
    setActiveTab(tab);
    
    if (tab === 'employer') {
      navigate('/employer');
    } else {
      navigate('/employee');
    }
    
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">JobExplorer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                {/* Role tabs for authenticated users */}
                {user?.role === 'employer' && (
                  <Link
                    to="/add-job"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Post a Job
                  </Link>
                )}
                
                <div className="relative group">
                  <button
                    className="flex items-center text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  >
                    <User className="h-5 w-5 mr-1" />
                    {user?.name}
                  </button>
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {isEmployer && (
                      <>
                        <Link
                          to="/employer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/employer/jobs"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Jobs
                        </Link>
                      </>
                    )}
                    
                    {isEmployee && (
                      <>
                        <Link
                          to="/employee"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/employee/applications"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Applications
                        </Link>
                      </>
                    )}
                    
                    <Link
                      to={isEmployer ? "/employer/profile" : "/employee/profile"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Employee/Employer Tabs */}
        {isAuthenticated && (
          <div className="flex border-b border-gray-200 -mb-px">
            {user?.role === 'employer' && (
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'employer'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => switchTab('employer')}
              >
                Employer
              </button>
            )}
            {user?.role === 'employee' && (
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'employee'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => switchTab('employee')}
              >
                Employee
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  {isEmployer && (
                    <>
                      <Link
                        to="/add-job"
                        className="text-gray-700 hover:text-indigo-600 py-2 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Post a Job
                      </Link>
                      <Link
                        to="/employer"
                        className="text-gray-700 hover:text-indigo-600 py-2 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/employer/jobs"
                        className="text-gray-700 hover:text-indigo-600 py-2 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Jobs
                      </Link>
                    </>
                  )}
                  
                  {isEmployee && (
                    <>
                      <Link
                        to="/employee"
                        className="text-gray-700 hover:text-indigo-600 py-2 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/employee/applications"
                        className="text-gray-700 hover:text-indigo-600 py-2 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Applications
                      </Link>
                    </>
                  )}
                  
                  <Link
                    to={isEmployer ? "/employer/profile" : "/employee/profile"}
                    className="text-gray-700 hover:text-indigo-600 py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-indigo-600 py-2 font-medium text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;