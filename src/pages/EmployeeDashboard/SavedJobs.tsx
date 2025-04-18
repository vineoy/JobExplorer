import React, { useEffect, useState, useContext } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import JobCard from '../../components/JobCard';
import Button from '../../components/FormElements/Button';
import { toast } from 'react-toastify';

// This is a placeholder component. In a real app, this would connect to a
// database to store and retrieve saved jobs. For now, we'll use localStorage.

interface SavedJob {
  _id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  createdAt: string;
}

const SavedJobs: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Saved Jobs | JobExplorer';
    
    // Simulate loading from database (using localStorage)
    const fetchSavedJobs = () => {
      try {
        const jobs = localStorage.getItem('savedJobs');
        if (jobs) {
          setSavedJobs(JSON.parse(jobs));
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedJobs();
  }, []);

  const removeSavedJob = (jobId: string) => {
    const updatedJobs = savedJobs.filter(job => job._id !== jobId);
    setSavedJobs(updatedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    toast.success('Job removed from saved list');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Jobs</h1>
      
      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
            <Bookmark className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
          <p className="text-gray-600 mb-6">
            You haven't saved any jobs yet. Browse jobs and click the bookmark icon to save jobs for later.
          </p>
          <Button variant="primary" as="a" href="/">
            Browse Jobs
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <div key={job._id} className="relative">
              <button
                onClick={() => removeSavedJob(job._id)}
                className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                title="Remove from saved"
              >
                <Trash2 className="h-5 w-5 text-gray-500" />
              </button>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;