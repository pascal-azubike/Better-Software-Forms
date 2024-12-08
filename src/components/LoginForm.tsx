import '../styles/Checkbox.css';
import '../styles/Form.css';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { PasswordInput } from './PasswordInput'

interface LoginFormProps {
  setMessage: (message: string) => void
}

export function LoginForm({ setMessage }: LoginFormProps) {
  // Load remembered email from localStorage if it exists
  const rememberedEmail = localStorage.getItem('rememberedEmail')

  const formik = useFormik({
    initialValues: {
      email: rememberedEmail || '',
      password: '',
      rememberMe: Boolean(rememberedEmail),
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
      rememberMe: Yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      // TODO: Implement API call to authenticate user if there is backend support
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      setMessage('Login Successful!')
      resetForm()
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="form" noValidate method="post">
      <div className="form-group">
        <label htmlFor="email">
          Email Address
          <span className="required" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps('email')}
          aria-describedby={formik.errors.email ? 'email-error' : undefined}
          autoComplete="username"
          aria-autocomplete="list"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error" id="email-error" role="alert">
            {formik.errors.email}
          </div>
        )}
      </div>

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        formik={formik}
        aria-describedby={formik.errors.password ? 'password-error' : undefined}
      />

      <div className="checkbox-wrapper">
        <label>
          <input
            type="checkbox"
            {...formik.getFieldProps('rememberMe')}
          />
          Remember Me
        </label>
      </div>

      <button type="submit" disabled={formik.isSubmitting}>
        Log In
      </button>
    </form>
  )
} 