import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Users, Eye } from 'lucide-react';
import JobContext from '../../context/JobContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/FormElements/Button';
import { toast } from 'react-toastify';

const PostedJobs: React.FC = () => {
  const { jobs, loading, error, getEmployerJobs, deleteJob } = useContext(JobContext);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [jobApplications, setJobApplications] = useState<Record<string, number>>({});

  useEffect(() => {
    document.title = 'Posted Jobs | JobExplorer';
    getEmployerJobs();
  }, []);

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      setDeleting(id);
      try {
        await deleteJob(id);
        toast.success('Job deleted successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error deleting job');
      } finally {
        setDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="primary"
            onClick={() => getEmployerJobs()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Job Postings</h1>
        <Link to="/add-job">
          <Button variant="primary" className="mt-4 md:mt-0">
            <Plus className="h-5 w-5 mr-2" />
            Post a New Job
          </Button>
        </Link>
      </div>
      
      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first job posting to start receiving applications from qualified candidates.
          </p>
          <Link to="/add-job">
            <Button variant="primary">
              <Plus className="h-5 w-5 mr-2" />
              Post a Job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/employer/applicants/${job._id}`}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                          title="View Applicants"
                        >
                          <Users className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/job/${job._id}`}
                          className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                          title="View Job"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                          title="Delete Job"
                          disabled={deleting === job._id}
                        >
                          {deleting === job._id ? (
                            <LoadingSpinner size="small" color="text-red-600" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostedJobs;