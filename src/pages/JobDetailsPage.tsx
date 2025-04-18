import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Briefcase, Building, ArrowLeft, ExternalLink } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import JobContext from '../context/JobContext';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/FormElements/Button';
import api from '../utils/api';
import { toast } from 'react-toastify';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { job, loading, error, getJobById } = useContext(JobContext);
  const { user, isAuthenticated, isEmployee } = useContext(AuthContext);
  const [applying, setApplying] = useState(false);
  const [resumeLink, setResumeLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationSubmitting, setApplicationSubmitting] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (id) {
      getJobById(id);
    }
  }, [id]);

  useEffect(() => {
    if (job) {
      document.title = `${job.title} at ${job.company} | JobExplorer`;
      
      // Check if user has already applied
      if (isAuthenticated && isEmployee) {
        const checkApplication = async () => {
          try {
            const res = await api.get('/api/applications');
            const hasApplied = res.data.some((app: any) => app.job._id === id);
            setAlreadyApplied(hasApplied);
          } catch (error) {
            console.error('Error checking application status:', error);
          }
        };
        
        checkApplication();
      }
    }
  }, [job, isAuthenticated]);

  const goBack = () => {
    navigate(-1);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeLink) {
      toast.error('Please provide a resume link');
      return;
    }
    
    setApplicationSubmitting(true);
    
    try {
      await api.post('/api/applications', {
        jobId: id,
        resume: resumeLink,
        coverLetter
      });
      
      toast.success('Application submitted successfully!');
      setApplying(false);
      setAlreadyApplied(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error submitting application');
    } finally {
      setApplicationSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button variant="primary" onClick={goBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Job not found</p>
          <Button variant="primary" onClick={goBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        size="sm"
        className="mb-4 inline-flex items-center"
        onClick={goBack}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Jobs
      </Button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
          <div className="flex flex-wrap items-center text-white/90 gap-4">
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-1" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-1" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-1" />
              <span>{job.type}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
            <div>
              <p className="text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </p>
            </div>
            
            {isAuthenticated && isEmployee && (
              <div>
                {alreadyApplied ? (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md inline-flex items-center">
                    <span className="font-medium">Applied</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setApplying(true)}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>{job.description}</p>
            </div>

            {job.requirements && (
              <>
                <h2 className="text-xl font-semibold mt-6 mb-4">Requirements</h2>
                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>{job.requirements}</p>
                </div>
              </>
            )}

            {job.salary && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Salary</h2>
                <p className="text-gray-700">{job.salary}</p>
              </div>
            )}
          </div>

          {/* Apply Form */}
          {applying && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Apply for this position</h2>
              <form onSubmit={handleApply}>
                <div className="mb-4">
                  <label htmlFor="resumeLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Resume Link (Google Drive, Dropbox, etc.)*
                  </label>
                  <input
                    type="url"
                    id="resumeLink"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={resumeLink}
                    onChange={(e) => setResumeLink(e.target.value)}
                    required
                    placeholder="https://example.com/your-resume.pdf"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Provide a link to your resume. Make sure it's accessible.
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    id="coverLetter"
                    rows={5}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're a good fit for this position..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={applicationSubmitting}
                  >
                    Submit Application
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setApplying(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;