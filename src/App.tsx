import { useState } from 'react'
import './styles/App.css'
import './styles/Layout.css'
import { LoginForm } from './components/LoginForm'
import { SignupForm } from './components/SignupForm'
import { Toast } from './components/Toast'
import betterSoftwareLogo from './assets/icons/better-software-logo.svg'
import googleIcon from './assets/icons/google.svg'
import facebookIcon from './assets/icons/facebook.svg'

// Main App component that handles form switching and social login
function App() {
  // Track which form is currently shown (login/signup)
  const [activeForm, setActiveForm] = useState<'login' | 'signup'>('login')
  // Manage toast notifications
  const [message, setMessage] = useState<string | null>(null)

  // Clear any active toast message
  const clearMessage = () => {
    setMessage(null);
  };

  // Show a temporary message for social login attempts
  const handleSocialMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="page-container">
      {message && <Toast message={message} onClose={clearMessage} />}
      
      <div className="form-container" data-form={activeForm}>
        <div className="content-wrapper">
          <div className="form-header">
            <img 
              src={betterSoftwareLogo}
              alt="Better Software" 
              className="logo"
            />
            <p className="description">
              Welcome to the Better Software internship assignment. This application demonstrates
              form handling with React, TypeScript, and Formik, featuring both traditional and social login options.
            </p>
          </div>

          <div className="form-content">
            <div className="form-tabs">
              <button 
                className={`tab ${activeForm === 'login' ? 'active' : ''}`}
                onClick={() => setActiveForm('login')}
              >
                Login
              </button>
              <button 
                className={`tab ${activeForm === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveForm('signup')}
              >
                Sign Up
              </button>
            </div>

            <div className="auth-container">
              <div className="social-section">
                <div className="social-buttons">
                  <button 
                    type="button" 
                    className="social-button google"
                    onClick={() => handleSocialMessage(`Continuing with Google ${activeForm}...`)}
                  >
                    <img src={googleIcon} alt="" />
                    <span>Google</span>
                  </button>
                  <button 
                    type="button" 
                    className="social-button facebook"
                    onClick={() => handleSocialMessage(`Continuing with Facebook ${activeForm}...`)}
                  >
                    <img src={facebookIcon} alt="" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="form-section">
                {activeForm === 'login' ? (
                  <LoginForm setMessage={setMessage} />
                ) : (
                  <SignupForm setMessage={setMessage} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
