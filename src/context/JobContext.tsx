import React, { createContext, useState, ReactNode } from 'react';
import api from '../utils/api';

interface Job {
  _id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  description: string;
  requirements?: string;
  salary?: string;
  employer: {
    _id: string;
    name: string;
    company: string;
  };
  createdAt: string;
}

interface JobSearchParams {
  search?: string;
  type?: string;
  location?: string;
  page?: number;
  limit?: number;
}

interface JobContextType {
  jobs: Job[];
  job: Job | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  getAllJobs: (params?: JobSearchParams) => Promise<void>;
  getJobById: (id: string) => Promise<void>;
  createJob: (jobData: Partial<Job>) => Promise<void>;
  updateJob: (id: string, jobData: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getEmployerJobs: () => Promise<void>;
  clearJobState: () => void;
}

const JobContext = createContext<JobContextType>({} as JobContextType);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Get all jobs
  const getAllJobs = async (params: JobSearchParams = {}) => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.type) queryParams.append('type', params.type);
      if (params.location) queryParams.append('location', params.location);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const res = await api.get(`/api/jobs?${queryParams.toString()}`);
      
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  // Get job by ID
  const getJobById = async (id: string) => {
    try {
      setLoading(true);
      setJob(null);
      
      const res = await api.get(`/api/jobs/${id}`);
      
      setJob(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching job details');
    } finally {
      setLoading(false);
    }
  };

  // Create new job
  const createJob = async (jobData: Partial<Job>) => {
    try {
      setLoading(true);
      
      await api.post('/api/jobs', jobData);
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update job
  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      setLoading(true);
      
      const res = await api.put(`/api/jobs/${id}`, jobData);
      
      if (job && job._id === id) {
        setJob(res.data);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const deleteJob = async (id: string) => {
    try {
      setLoading(true);
      
      await api.delete(`/api/jobs/${id}`);
      
      setJobs(jobs.filter(job => job._id !== id));
      
      if (job && job._id === id) {
        setJob(null);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting job');
    } finally {
      setLoading(false);
    }
  };

  // Get employer's jobs
  const getEmployerJobs = async () => {
    try {
      setLoading(true);
      
      const res = await api.get('/api/jobs/employer/jobs');
      
      setJobs(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching your jobs');
    } finally {
      setLoading(false);
    }
  };

  // Clear job state
  const clearJobState = () => {
    setJob(null);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        job,
        loading,
        error,
        totalPages,
        currentPage,
        getAllJobs,
        getJobById,
        createJob,
        updateJob,
        deleteJob,
        getEmployerJobs,
        clearJobState
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;