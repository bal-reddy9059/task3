// src/Pages/LoginSignUp.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CSS/LoginSignup.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Auto detect login/signup from route path
  const [isLogin, setIsLogin] = useState(!location.pathname.includes('signup'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('otpData'));
    if (stored && Date.now() > stored.expiry) localStorage.removeItem('otpData');
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const resetAll = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setOtp('');
    setStep(1);
  };

  const toggleMode = () => {
    const newMode = isLogin ? 'signup' : 'login';
    navigate(`/${newMode}`);
    setIsLogin(!isLogin);
    resetAll();
    setOtpMode(false);
  };

  const handleSubmit = () => {
    if (!emailRegex.test(email)) return setError('Enter a valid email');
    if (!passwordRegex.test(password)) return setError('Password must be 6+ chars & include special character');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (isLogin) {
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) return setError('Invalid credentials');
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success('Login successful!');
      setTimeout(() => navigate('/'), 1000);
    } else {
      if (!name.trim()) return setError('Name is required');
      if (users.some((u) => u.email === email)) return setError('User already exists');
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      toast.success('Signup successful!');
      navigate('/login');
      setIsLogin(true);
      resetAll();
    }
  };

  const handleForgotPassword = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (!users.some((u) => u.email === email)) return toast.error('User not found');

    const newOtp = '' + Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 60 * 1000;
    localStorage.setItem('otpData', JSON.stringify({ otp: newOtp, expiry, email }));
    toast.info(`OTP sent: ${newOtp}`);
    setOtpMode(true);
    setStep(2);
    setResendDisabled(true);
    setTimer(60);
  };

  const verifyOtp = () => {
    const stored = JSON.parse(localStorage.getItem('otpData'));
    if (!stored || stored.email !== email || Date.now() > stored.expiry)
      return toast.error('OTP expired or invalid. Resend.');

    if (otp === stored.otp) {
      setStep(3);
      toast.success('OTP verified');
    } else {
      toast.error('Incorrect OTP');
    }
  };

  const resetPassword = () => {
    if (!passwordRegex.test(password)) return toast.error('Password must be 6+ chars & include special character');
    if (password !== confirmPassword) return toast.error('Passwords do not match');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updated = users.map((u) => (u.email === email ? { ...u, password } : u));
    localStorage.setItem('users', JSON.stringify(updated));
    localStorage.removeItem('otpData');
    toast.success('✅ Password updated!');
    setOtpMode(false);
    setIsLogin(true);
    resetAll();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <div className={`loginsignup ${darkMode ? 'dark-mode' : ''}`}>
      <ToastContainer position="top-right" />
      <div className="loginsignup-container">
        <h1>{otpMode ? 'Forgot Password' : isLogin ? 'Login' : 'Sign Up'}</h1>

        {otpMode && (
          <div className="back-to-login" onClick={() => { setOtpMode(false); setStep(1); resetAll(); }}>
            ← Back
          </div>
        )}

        {!otpMode && (
          <div className="loginsignup-fields">
            {!isLogin && (
              <div className="input-icon">
                <span className="icon">👤</span>
                <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="input-icon">
              <span className="icon">📧</span>
              <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-icon password-wrapper">
              <span className="icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
        )}

        {otpMode && (
          <div className="loginsignup-fields">
            {step === 1 && (
              <div className="input-icon">
                <span className="icon">📧</span>
                <input placeholder="Enter registered email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
            {step === 2 && (
              <div className="input-icon">
                <span className="icon">🔢</span>
                <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
            )}
            {step === 3 && (
              <>
                <div className="input-icon password-wrapper">
                  <span className="icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="input-icon password-wrapper">
                  <span className="icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}
            {step === 1 && <button onClick={handleForgotPassword}>Send OTP</button>}
            {step === 2 && <button onClick={verifyOtp}>Verify OTP</button>}
            {step === 3 && <button onClick={resetPassword}>Update Password</button>}
            {step === 2 && (
              <button disabled={resendDisabled} className={resendDisabled ? 'disabled-btn' : ''} onClick={handleForgotPassword}>
                Resend OTP {resendDisabled && `in 0:${String(timer).padStart(2, '0')}`}
              </button>
            )}
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {!otpMode && (
          <>
            <div className="loginsignup-options">
              <label>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember Me
              </label>
              {isLogin && <span className="forgot-link" onClick={() => setOtpMode(true)}>Forgot Password?</span>}
            </div>
            <button onClick={handleSubmit}>Continue</button>
            <p className="loginsignup-login">
              {isLogin ? "Don't have an account?" : "Already have one?"}{' '}
              <span onClick={toggleMode}>{isLogin ? 'Sign Up' : 'Login'}</span>
            </p>
          </>
        )}

        <button className="dark-toggle-btn" onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>
  );
};

export default LoginSignUp;  