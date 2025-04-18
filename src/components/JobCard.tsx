import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    company: string;
    type: string;
    location: string;
    createdAt: string;
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const jobTypeColors = {
    'Full-time': 'bg-blue-100 text-blue-800',
    'Part-time': 'bg-green-100 text-green-800',
    'Contract': 'bg-purple-100 text-purple-800',
    'Internship': 'bg-orange-100 text-orange-800',
  };

  const getTypeColor = (type: string) => {
    return jobTypeColors[type as keyof typeof jobTypeColors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Link to={`/job/${job._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 h-full">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-600 mb-4">{job.company}</p>
          </div>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
              {job.type}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-auto">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;