import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../../context/AuthContext';
import Input from '../../components/FormElements/Input';
import TextArea from '../../components/FormElements/TextArea';
import Button from '../../components/FormElements/Button';
import { toast } from 'react-toastify';

interface ProfileFormData {
  name: string;
  location: string;
  bio: string;
  password: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile, loading, error } = useContext(AuthContext);
  const [formError, setFormError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ProfileFormData>();

  useEffect(() => {
    document.title = 'Edit Profile | JobExplorer';
    
    if (user) {
      reset({
        name: user.name,
        location: user.location || '',
        bio: user.bio || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const onSubmit = async (data: ProfileFormData) => {
    setFormError(null);
    
    if (data.password && data.password !== data.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      // Only include password if it's not empty
      const updateData = {
        name: data.name,
        location: data.location,
        bio: data.bio,
        ...(data.password ? { password: data.password } : {})
      };
      
      await updateProfile(updateData);
      toast.success('Profile updated successfully');
    } catch (error) {
      // The error is handled by AuthContext
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {formError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
              {formError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
            
            <Input
              label="Location"
              placeholder="e.g., San Francisco, CA or Remote"
              {...register('location')}
              error={errors.location?.message}
            />
          </div>
          
          <TextArea
            label="Bio"
            placeholder="Tell us about yourself, your skills, and experience..."
            rows={4}
            className="mt-4"
            {...register('bio')}
            error={errors.bio?.message}
          />
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
            <p className="text-sm text-gray-600 mb-4">
              Leave blank if you don't want to change your password.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="New Password"
                type="password"
                {...register('password', {
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.password?.message}
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                {...register('confirmPassword', {
                  validate: (value) => 
                    !watch('password') || value === watch('password') || 'Passwords do not match'
                })}
                error={errors.confirmPassword?.message}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;