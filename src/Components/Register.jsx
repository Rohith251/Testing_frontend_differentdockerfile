import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import instance from '../axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Full Name Validation
    const nameRegex = /^[A-Z][a-zA-Z\s]*$/;
    if (!nameRegex.test(form.name)) {
      toast.error('Full Name must start with a capital letter and contain only alphabets.');
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Password Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      toast.error('Password must be at least 8 characters, with 1 uppercase letter, 1 special character, and 1 number.');
      return;
    }

    // Confirm Password Match
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // If all validations pass
    try {
      const { name, email, password } = form;
      await instance.post('/user/addUser', { name, email, password });

      toast.success('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Registration failed! Please try again.');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row g-0 w-100">
        {/* Left Info Panel */}
        <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center p-5 bg-white">
          <div className="text-center mx-auto" style={{ maxWidth: '400px' }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Signup Illustration"
              className="img-fluid mb-4"
              style={{ height: '200px' }}
            />
            <h3 className="fw-bold text-primary mb-3">Welcome to ForexCard</h3>
            <p className="text-muted mb-4">
              Manage your global spending effortlessly. Safe, simple, and smart.
            </p>
            <div className="d-flex justify-content-center gap-4 mt-3">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-2 d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-globe fs-4 text-primary"></i>
                </div>
                <p className="mb-0 small text-muted">Global Access</p>
              </div>
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-2 d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-shield-lock fs-4 text-primary"></i>
                </div>
                <p className="mb-0 small text-muted">Secure</p>
              </div>
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-2 d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-lightning-charge fs-4 text-primary"></i>
                </div>
                <p className="mb-0 small text-muted">Fast</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-3 p-md-5">
          <div className="card shadow border-0 rounded-3 w-100" style={{ maxWidth: '500px' }}>
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-person-plus fs-3 text-white"></i>
                </div>
                <h2 className="fw-bold mb-2">Create Account</h2>
                <p className="text-muted">Join us today to get started</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    <i className="bi bi-person-fill me-2 text-primary"></i>Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="bi bi-envelope-fill me-2 text-primary"></i>Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="bi bi-lock-fill me-2 text-primary"></i>Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-text text-muted">Must be at least 8 characters</div>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">
                    <i className="bi bi-lock-fill me-2 text-primary"></i>Confirm Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key-fill text-muted"></i>
                    </span>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="terms" required />
                  <label className="form-check-label small text-muted" htmlFor="terms">
                    I agree to the <a href="/terms" className="text-primary text-decoration-none">Terms</a> and <a href="/privacy" className="text-primary text-decoration-none">Privacy Policy</a>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 mb-3 py-2">
                  <i className="bi bi-person-plus me-2"></i>Register Now
                </button>
              </form>

              <div className="text-center mt-4">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <hr className="flex-grow-1" />
                  <span className="px-3 text-muted small">OR</span>
                  <hr className="flex-grow-1" />
                </div>
              </div>

              <p className="text-center mt-3 mb-0 text-muted">
                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
