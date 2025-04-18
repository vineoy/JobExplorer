import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, PlusCircle, FileText } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import JobContext from '../../context/JobContext';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/FormElements/Button';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  applications: number;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { getEmployerJobs } = useContext(JobContext);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Employer Dashboard | JobExplorer';
    
    const fetchDashboardData = async () => {
      try {
        // Get employer's jobs
        const jobsRes = await api.get('/api/jobs/employer/jobs');
        const jobs = jobsRes.data;
        
        // Get applications for each job
        let totalApps = 0;
        const jobsWithApps = await Promise.all(
          jobs.slice(0, 5).map(async (job: any) => {
            try {
              const appsRes = await api.get(`/api/applications/job/${job._id}`);
              const appCount = appsRes.data.length;
              totalApps += appCount;
              
              return {
                ...job,
                applications: appCount
              };
            } catch (error) {
              return {
                ...job,
                applications: 0
              };
            }
          })
        );
        
        setRecentJobs(jobsWithApps);
        setStats({
          totalJobs: jobs.length,
          activeJobs: jobs.length, // In a real app, we'd filter by active status
          totalApplications: totalApps
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <Link to="/add-job">
          <Button variant="primary" className="mt-4 md:mt-0">
            <PlusCircle className="h-5 w-5 mr-2" />
            Post a New Job
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs Posted</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJobs}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Job Listings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeJobs}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Job Postings</h2>
            <Link to="/employer/jobs" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {recentJobs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">You haven't posted any jobs yet</p>
              <Link to="/add-job" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium">
                Post your first job
              </Link>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.applications}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/employer/applicants/${job._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        View Applicants
                      </Link>
                      <Link to={`/job/${job._id}`} className="text-gray-600 hover:text-gray-900">
                        View Job
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/add-job"
            className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <PlusCircle className="h-5 w-5 text-indigo-600 mr-2" />
            <span>Post a Job</span>
          </Link>
          
          <Link
            to="/employer/jobs"
            className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
            <span>Manage Jobs</span>
          </Link>
          
          <Link
            to="/employer/profile"
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

export default Dashboard;