import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Input from '../components/FormElements/Input';
import Select from '../components/FormElements/Select';
import Button from '../components/FormElements/Button';
import { toast } from 'react-toastify';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'employee' | 'employer';
  company?: string;
  location?: string;
}

const RegisterPage: React.FC = () => {
  const { register: registerUser, loading, error, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'employee'
    }
  });
  
  const selectedRole = watch('role');

  useEffect(() => {
    document.title = 'Sign Up | JobExplorer';
    
    // Redirect if user is already authenticated
    if (isAuthenticated) {
      navigate(user?.role === 'employer' ? '/employer' : '/');
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const onSubmit = async (data: RegisterFormData) => {
    setFormError(null);
    
    if (data.password !== data.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      // Create a trimmed data object without confirmPassword
      const { confirmPassword, ...registerData } = data;
      
      await registerUser(registerData);
      
      // No need to redirect, the useEffect will handle it
    } catch (error) {
      // The error is handled by AuthContext
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Briefcase className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {formError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {formError}
              </div>
            )}
            
            <Input
              label="Full Name"
              autoComplete="name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
            
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
            />
            
            <Select
              label="I want to"
              options={[
                { value: 'employee', label: 'Find a job (I\'m an employee)' },
                { value: 'employer', label: 'Hire talent (I\'m an employer)' }
              ]}
              {...register('role')}
            />
            
            {selectedRole === 'employer' && (
              <Input
                label="Company Name"
                {...register('company', {
                  required: selectedRole === 'employer' ? 'Company name is required for employers' : false
                })}
                error={errors.company?.message}
              />
            )}
            
            <Input
              label="Location (Optional)"
              placeholder="e.g., San Francisco, CA or Remote"
              {...register('location')}
              error={errors.location?.message}
            />
            
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === watch('password') || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                Create account
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 text-center mt-4">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;