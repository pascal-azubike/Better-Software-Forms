import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { PasswordInput } from './PasswordInput'
import '../styles/Form.css'

interface SignupFormProps {
  setMessage: (message: string) => void
}

// Calculates password strength on a scale of 0-5
// Checks for length, uppercase, lowercase, numbers, and special characters
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  // At least 8 characters
  if (password.length >= 8) strength += 1;
  
  // Check for different character types
  if (/[A-Z]/.test(password)) strength += 1;  // Has uppercase
  if (/[a-z]/.test(password)) strength += 1;  // Has lowercase
  if (/[0-9]/.test(password)) strength += 1;  // Has numbers
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;  // Has special chars
  
  return strength;
}

export function SignupForm({ setMessage }: SignupFormProps) {
  const [passwordStrength, setPasswordStrength] = useState(0)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .matches(
          /^[a-zA-Z\s]+$/, 
          'Name can only contain letters and spaces'
        ),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /[A-Z]/,
          'Password must contain at least one uppercase letter'
        )
        .matches(
          /[a-z]/,
          'Password must contain at least one lowercase letter'
        )
        .matches(
          /[0-9]/,
          'Password must contain at least one number'
        )
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          'Password must contain at least one special character'
        )
        .test('password-strength', 'Password is not strong enough', function(value) {
          if (!value) return true;
          const strength = calculatePasswordStrength(value);
          return strength >= 3; // Requires at least "Good" strength
        }),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    }),
    onSubmit: (values, { resetForm }) => {
      const strength = calculatePasswordStrength(values.password);
      
      if (strength < 3) {
        formik.setFieldError('password', 'Please choose a stronger password');
        return;
      }

      // In a real app, this would make an API call
      setMessage('Sign Up Successful!');
      resetForm();
      setPasswordStrength(0);
    },
  })

  // Update password strength when password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    const newStrength = calculatePasswordStrength(e.target.value);
    setPasswordStrength(newStrength);
  };

  // Update name handler to show error immediately
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    formik.setFieldValue('name', value);
    
    // Show error immediately if special characters are entered
    if (value && /[^a-zA-Z\s]/.test(value)) {
      formik.setFieldError('name', 'Name can only contain letters and spaces');
      formik.setFieldTouched('name', true, false);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="form" noValidate method="post">
      <div className="form-group">
        <label htmlFor="name">
          Full Name
          <span className="required" aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          onChange={handleNameChange}
          aria-describedby={formik.errors.name ? 'name-error' : undefined}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="error" id="name-error" role="alert">
            {formik.errors.name}
          </div>
        )}
      </div>

      {/* Email field similar to login form */}
      <div className="form-group">
        <label htmlFor="signup-email">
          Email Address
          <span className="required" aria-hidden="true">*</span>
        </label>
        <input
          id="signup-email"
          type="email"
          {...formik.getFieldProps('email')}
          aria-describedby={formik.errors.email ? 'signup-email-error' : undefined}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error" id="signup-email-error" role="alert">
            {formik.errors.email}
          </div>
        )}
      </div>

      <PasswordInput
        id="signup-password"
        name="password"
        label="Password"
        formik={formik}
        autoComplete="new-password"
        onChange={handlePasswordChange}
        aria-describedby="password-strength"
      />

      <div className="password-strength">
        <div 
          className={`strength-bar strength-${passwordStrength}`}
          style={{ width: `${(passwordStrength / 5) * 100}%` }}
        />
        <span className="strength-text">
          {passwordStrength === 0 && 'Enter password'}
          {passwordStrength === 1 && 'Weak'}
          {passwordStrength === 2 && 'Fair'}
          {passwordStrength === 3 && 'Good'}
          {passwordStrength === 4 && 'Strong'}
          {passwordStrength === 5 && 'Very Strong'}
        </span>
      </div>

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        formik={formik}
        autoComplete="new-password"
        aria-describedby={formik.errors.confirmPassword ? 'confirm-password-error' : undefined}
      />

      <button type="submit" disabled={formik.isSubmitting}>
        Sign Up
      </button>
    </form>
  )
} 