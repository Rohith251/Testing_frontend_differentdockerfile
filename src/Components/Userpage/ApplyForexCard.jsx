import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import instance from '../../axios';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
].sort();

const stateOptions = indianStates.map(state => ({ value: state, label: state }));

const ApplyForexCard = () => {
  const [formData, setFormData] = useState({
    pan: '',
    dob: '',
    phonenumber: '',
    gender: '',
    salary: '',
    address: '',
    state: '',
    country: '',
  });

  const [selectedState, setSelectedState] = useState(null);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF files are allowed.');
      e.target.value = null;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      e.target.value = null;
      return;
    }

    setDocument(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('id');
    if (!userId) {
      toast.error('User not logged in!');
      return;
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.pan)) {
      toast.error('Enter valid PAN card number (e.g., ABCDE1234F)');
      return;
    }

    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(formData.phonenumber)) {
      toast.error('Enter a valid 10-digit phone number starting from 6-9');
      return;
    }

    if (formData.salary <= 0 || isNaN(formData.salary)) {
      toast.error('Salary should be a positive number');
      return;
    }

    if (!selectedState) {
      toast.error('Please select a state');
      return;
    }

    if (!document) {
      toast.error('Please upload a document');
      return;
    }

    setLoading(true);

    try {
      const userDetailsDTO = {
        ...formData,
        state: selectedState.value
      };

      const fullForm = new FormData();
      fullForm.append("userDetails", new Blob([JSON.stringify(userDetailsDTO)], { type: "application/json" }));
      fullForm.append("salarySlip", document);

      await instance.put(`/apply/${userId}`, fullForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Forex card application submitted!', { autoClose: 1500 });
      setTimeout(() => navigate('/userdashboard'), 1700);
    } catch (err) {
      console.error('Submission error:', err);

      if (err.response) {
        if (err.response.status === 500) {
          toast.error('Internal server error. Please try again later.');
        } else if (err.response.status === 400) {
          toast.error(err.response.data);
        } else {
          toast.error('An error occurred while submitting your application.');
        }
      } else {
        toast.error('Network error or no response from server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="shadow p-4 bg-white rounded" style={{ width: '100%', maxWidth: '700px' }}>
        <form
          onSubmit={handleUpdate}
          style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.7 : 1 }}
        >
          <h3 className="mb-4 text-center">Apply for Forex Card</h3>

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="PAN Card Number"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="date"
                className="form-control"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <input
                type="tel"
                className="form-control"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary"
              required
            />
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <Select
                options={stateOptions}
                value={selectedState}
                onChange={setSelectedState}
                placeholder="Select State"
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="salaryProof" className="form-label fw-bold">Upload Salary Proof</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
            <small className="text-muted">Only PDF files allowed (Max 5MB)</small><br />
            {document && <small className="text-success">Selected: {document.name}</small>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            )}
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForexCard;
