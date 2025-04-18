import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import JobContext from '../context/JobContext';
import AuthContext from '../context/AuthContext';
import Input from '../components/FormElements/Input';
import TextArea from '../components/FormElements/TextArea';
import Select from '../components/FormElements/Select';
import Button from '../components/FormElements/Button';
import { toast } from 'react-toastify';

interface JobFormData {
  title: string;
  company: string;
  type: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
}

const AddJobPage: React.FC = () => {
  const { createJob } = useContext(JobContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<JobFormData>({
    defaultValues: {
      company: user?.company || ''
    }
  });

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    
    try {
      await createJob(data);
      toast.success('Job posted successfully!');
      navigate('/employer/jobs');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error posting job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Job Title"
              {...register('title', { required: 'Job title is required' })}
              error={errors.title?.message}
              placeholder="e.g., Senior Software Engineer"
            />
            
            <Input
              label="Company"
              {...register('company', { required: 'Company name is required' })}
              error={errors.company?.message}
              placeholder="e.g., Acme Corporation"
              disabled={!!user?.company}
            />
            
            <Select
              label="Job Type"
              options={[
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Internship', label: 'Internship' }
              ]}
              {...register('type', { required: 'Job type is required' })}
              error={errors.type?.message}
            />
            
            <Input
              label="Location"
              {...register('location', { required: 'Location is required' })}
              error={errors.location?.message}
              placeholder="e.g., San Francisco, CA or Remote"
            />
            
            <TextArea
              label="Job Description"
              {...register('description', { required: 'Description is required' })}
              error={errors.description?.message}
              rows={6}
              placeholder="Describe the role, responsibilities, and ideal candidate..."
            />
            
            <TextArea
              label="Requirements (Optional)"
              {...register('requirements')}
              error={errors.requirements?.message}
              rows={4}
              placeholder="List the skills, qualifications, and experience required..."
            />
            
            <Input
              label="Salary (Optional)"
              {...register('salary')}
              error={errors.salary?.message}
              placeholder="e.g., $80,000 - $100,000/year"
            />
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
              >
                Post Job
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJobPage;