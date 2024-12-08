import { useState } from 'react';
import { FormikProps } from 'formik';
import '../styles/PasswordInput.css';

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  formik: FormikProps<any>;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  'aria-describedby'?: string;
}

export function PasswordInput({
  id,
  name,
  label,
  formik,
  autoComplete = "current-password",
  onChange,
  'aria-describedby': ariaDescribedBy,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    onChange?.(e);
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        <span className="required" aria-hidden="true">*</span>
      </label>
      <div className="password-input-wrapper">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          aria-describedby={ariaDescribedBy}
          autoComplete={autoComplete}
          autoCapitalize="none"
          spellCheck="false"
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <div className="error" id={`${id}-error`} role="alert">
          {formik.errors[name]?.toString()}
        </div>
      )}
    </div>
  );
} 