import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, FileText, Mail, ExternalLink } from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/FormElements/Button';
import Select from '../../components/FormElements/Select';
import { toast } from 'react-toastify';

interface Application {
  _id: string;
  applicant: {
    _id: string;
    name: string;
    email: string;
    location: string;
  };
  job: {
    _id: string;
    title: string;
  };
  resume: string;
  coverLetter?: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  createdAt: string;
}

const Applicants: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<{ title: string; company: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get job details
        const jobRes = await api.get(`/api/jobs/${jobId}`);
        setJob({
          title: jobRes.data.title,
          company: jobRes.data.company
        });
        
        // Get applications for the job
        const applicationsRes = await api.get(`/api/applications/job/${jobId}`);
        setApplications(applicationsRes.data);
        
        document.title = `Applicants for ${jobRes.data.title} | JobExplorer`;
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching applications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setStatusUpdating(applicationId);
    
    try {
      const res = await api.put(`/api/applications/${applicationId}`, {
        status: newStatus
      });
      
      // Update the application in state
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus as any } : app
      ));
      
      toast.success(`Application status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating application status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusOptions = () => [
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' }
  ];

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
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/employer/jobs" className="inline-flex items-center text-indigo-600 mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Jobs
      </Link>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Applicants for {job?.title}
      </h1>
      <p className="text-gray-600 mb-6">{job?.company}</p>
      
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600">
            There are no applications for this job posting yet. Check back later.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.applicant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.applicant.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Resume
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-40">
                        <Select
                          options={getStatusOptions()}
                          value={application.status}
                          onChange={(e) => handleStatusChange(application._id, e.target.value)}
                          containerClassName="mb-0"
                          className={
                            statusUpdating === application._id 
                              ? 'opacity-50 cursor-not-allowed' 
                              : ''
                          }
                          disabled={statusUpdating === application._id}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href={`mailto:${application.applicant.email}`}
                        className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Contact
                      </a>
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

export default Applicants;