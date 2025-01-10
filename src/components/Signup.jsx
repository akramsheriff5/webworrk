import React, { useState } from 'react';
import '../styles/Signup.css'

const Signup = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappOtpSent, setWhatsappOtpSent] = useState(false);
  const [whatsappOtp, setWhatsappOtp] = useState('');
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [whoYouAre, setWhoYouAre] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email OTP Generation (Simulated for Demo)
  const handleSendEmailOtp = () => {
    if (email) {
      alert(`OTP Sent to ${email}`);
      setEmailOtpSent(true);
    } else {
      alert('Please enter Email first.');
    }
  };

  // Email OTP Verification (Simulated for Demo)
  const handleVerifyEmailOtp = () => {
    if (emailOtp === '1234') {
      setEmailVerified(true);
      alert('Email Verified Successfully!');
    } else {
      alert('Invalid Email OTP! Try again.');
    }
  };

  // WhatsApp OTP Generation (Simulated for Demo)
  const handleSendWhatsappOtp = () => {
    if (whatsapp) {
      alert(`OTP Sent to ${whatsapp}`);
      setWhatsappOtpSent(true);
    } else {
      alert('Please enter WhatsApp number first.');
    }
  };

  // WhatsApp OTP Verification (Simulated for Demo)
  const handleVerifyWhatsappOtp = () => {
    if (whatsappOtp === '1234') {
      setWhatsappVerified(true);
      alert('WhatsApp Verified Successfully!');
    } else {
      alert('Invalid WhatsApp OTP! Try again.');
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      alert('Please verify your Email!');
      return;
    }
    if (!whatsappVerified) {
      alert('Please verify your WhatsApp number!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('https://akramsheriff5.pythonanywhere.com//signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: whatsapp,
          password,
          role,
          companyName,
          whoYouAre,
          location,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Signup Successful!');
        window.location.href = '/';
      } else {
        alert(result.error || 'Signup Failed!');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="background-container">
      <div className="header-logo">Webworrk</div>
      <div className="content-wrapper">
        <div className="card-container">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="">Select Role</option>
                <option value="client">Client</option>
                <option value="service_provider">Service Provider</option>
              </select>
            </div>
            <div className="input-box">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <label>Name</label>
            </div>
            <div className="otp-box">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                required
              />
              <button
                type="button"
                onClick={emailVerified ? null : handleSendEmailOtp}
                disabled={emailVerified}
              >
                {emailVerified ? 'Verified' : emailOtpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>
            {emailOtpSent && !emailVerified && (
              <div className="otp-box">
                <input type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} required />
                <button type="button" onClick={handleVerifyEmailOtp}>Verify OTP</button>
              </div>
            )}
            <div className="otp-box">
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Enter Phone Number"
                required
              />
              <button
                type="button"
                onClick={whatsappVerified ? null : handleSendWhatsappOtp}
                disabled={whatsappVerified}
              >
                {whatsappVerified ? 'Verified' : whatsappOtpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>
            {whatsappOtpSent && !whatsappVerified && (
              <div className="otp-box">
                <input type="text" value={whatsappOtp} onChange={(e) => setWhatsappOtp(e.target.value)} required />
                <button type="button" onClick={handleVerifyWhatsappOtp}>Verify OTP</button>
              </div>
            )}
            {role === 'client' && (
              <div className="input-box">
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                <label>Company Name</label>
              </div>
            )}
            <div className="input-box">
              <select value={whoYouAre} onChange={(e) => setWhoYouAre(e.target.value)} required>
                <option value="">Who You Are?</option>
                {role === 'client' ? (
                  <>
                    <option value="founder">Founder/CEO</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR</option>
                    <option value="operations_head">Operations Head</option>
                    <option value="lead_team">Lead Team</option>
                  </>
                ) : (
                  <>
                    <option value="freelancer">Freelancer</option>
                    <option value="agency">Agency</option>
                    <option value="anything_works">Anything Works</option>
                  </>
                )}
              </select>
            </div>
            <div className="input-box">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label>Create Password</label>
            </div>
            <div className="input-box">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label>Confirm Password</label>
            </div>
            <div className="input-box">
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <label>Location</label>
            </div>
            <button type="submit" className="login-btn">Sign Up</button>
          </form>
        </div>
        <div className="image-container">
          <img
            src="https://cdn.prod.website-files.com/65c1c617b0a6cc111ce93947/65c445ecdab5c40e29f53eca_Untitled%20design%20(15).png"
            alt="Signup Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
