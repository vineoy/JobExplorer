import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search, BookmarkCheck, FileText } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import JobContext from '../../context/JobContext';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import JobCard from '../../components/JobCard';

interface ApplicationStats {
  total: number;
  pending: number;
  accepted: number;
}

const EmployeeDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { jobs, loading: jobsLoading, getAllJobs } = useContext(JobContext);
  
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    accepted: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    document.title = 'Employee Dashboard | JobExplorer';
    
    const fetchUserData = async () => {
      try {
        // Get application stats
        const applicationsRes = await api.get('/api/applications');
        const applications = applicationsRes.data;
        
        setApplicationStats({
          total: applications.length,
          pending: applications.filter((app: any) => app.status === 'pending').length,
          accepted: applications.filter((app: any) => app.status === 'accepted').length
        });
        
        // Get recent jobs
        await getAllJobs({ limit: 3 });
        
        setLoadingStats(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoadingStats(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (loadingStats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {user?.name}</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{applicationStats.total}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{applicationStats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Search className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{applicationStats.accepted}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BookmarkCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Job Listings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Job Listings</h2>
            <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {jobsLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent jobs found</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/"
            className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Search className="h-5 w-5 text-indigo-600 mr-2" />
            <span>Browse Jobs</span>
          </Link>
          
          <Link
            to="/employee/applications"
            className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
            <span>My Applications</span>
          </Link>
          
          <Link
            to="/employee/profile"
            className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5 text-indigo-600 mr-2" />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;