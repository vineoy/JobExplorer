// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - at least 6 characters
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Required field validation
export const isRequired = (value: string): boolean => {
  return value.trim() !== '';
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Form validation - returns errors object
export const validateForm = (
  values: Record<string, any>,
  validations: Record<string, ((value: any) => boolean | string)[]>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const field in validations) {
    for (const validation of validations[field]) {
      const result = validation(values[field]);
      
      if (typeof result === 'string') {
        errors[field] = result;
        break;
      } else if (result === false) {
        errors[field] = `Invalid ${field}`;
        break;
      }
    }
  }

  return errors;
};

// Specific validation rules
export const required = (fieldName: string) => (value: any) => 
  value ? true : `${fieldName} is required`;

export const minLength = (length: number, fieldName: string) => (value: string) => 
  value && value.length >= length ? true : `${fieldName} must be at least ${length} characters`;

export const maxLength = (length: number, fieldName: string) => (value: string) => 
  value && value.length <= length ? true : `${fieldName} must be less than ${length} characters`;

export const email = (value: string) => 
  isValidEmail(value) ? true : 'Invalid email address';

export const passwordsMatch = (password: string, confirmPassword: string) => 
  password === confirmPassword ? true : 'Passwords do not match';