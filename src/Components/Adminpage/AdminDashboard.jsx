import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import './AdminDashboard.css';
import { toast } from 'react-toastify';
import instance from '../../axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Analytics');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);

  // 🔐 Authentication and Redirection
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    if (token && role) {
      if (role === 'admin') {
        // stay on admin dashboard
      } else if (role === 'user') {
        navigate('/userdashboard'); // redirect regular users
      }
    } else {
      navigate('/login'); // no token or role
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllCounts();
    if (activeTab !== 'Analytics') {
      fetchUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (counts.pending || counts.approved || counts.rejected) {
      setChartData({
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [{
          data: [counts.pending, counts.approved, counts.rejected],
          backgroundColor: ['rgba(255, 193, 7, 0.8)', 'rgba(25, 135, 84, 0.8)', 'rgba(220, 53, 69, 0.8)'],
          borderColor: ['rgba(255, 193, 7, 1)', 'rgba(25, 135, 84, 1)', 'rgba(220, 53, 69, 1)'],
          borderWidth: 2,
          hoverOffset: 4,
        }]
      });

      setBarChartData({
        labels: ['Applications'],
        datasets: [
          { label: 'Pending', data: [counts.pending], backgroundColor: 'rgba(255, 193, 7, 0.8)', borderColor: 'rgba(255, 193, 7, 1)', borderWidth: 1 },
          { label: 'Approved', data: [counts.approved], backgroundColor: 'rgba(25, 135, 84, 0.8)', borderColor: 'rgba(25, 135, 84, 1)', borderWidth: 1 },
          { label: 'Rejected', data: [counts.rejected], backgroundColor: 'rgba(220, 53, 69, 0.8)', borderColor: 'rgba(220, 53, 69, 1)', borderWidth: 1 },
        ]
      });

      const total = counts.pending + counts.approved + counts.rejected;
      const approvalRate = total > 0 ? (counts.approved / total) * 100 : 0;

      setLineChartData({
        labels: ['Last Week', 'This Week'],
        datasets: [{
          label: 'Approval Rate (%)',
          data: [approvalRate - 10, approvalRate],
          borderColor: 'rgba(25, 135, 84, 1)',
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          tension: 0.4,
          fill: true,
        }]
      });
    }
  }, [counts]);

  const fetchAllCounts = async () => {
    try {
      const responses = await Promise.allSettled([
        instance.get('/admin/pending'),
        instance.get('/user/approved'),
        instance.get('/user/rejected'),
      ]);

      setCounts({
        pending: responses[0].status === "fulfilled" ? responses[0].value.data.length : 0,
        approved: responses[1].status === "fulfilled" ? responses[1].value.data.length : 0,
        rejected: responses[2].status === "fulfilled" ? responses[2].value.data.length : 0,
      });

    } catch (err) {
      console.error('Error fetching user counts:', err);
      setCounts({ pending: 0, approved: 0, rejected: 0 });
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = '';
      switch (activeTab) {
        case 'Pending': url = '/admin/pending'; break;
        case 'Approved': url = '/user/approved'; break;
        case 'Rejected': url = '/user/rejected'; break;
        default: break;
      }

      const res = await instance.get(url);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      const endpoint = action === 'approve'
        ? `/admin/approve/${userId}`
        : `/admin/reject/${userId}`;

      await instance.put(endpoint);
      alert(`User ${action}d successfully!`);
      setSelectedUser(null);
      fetchAllCounts();
      fetchUsers();
    } catch (error) {
      console.error(`Error on ${action}:`, error);
      alert(`Failed to ${action} user.`);
    }
  };

  const fetchSalarySlip = async (userId) => {
    try {
      if (!userId) {
        toast.error('User ID not available.');
        return;
      }

      const response = await instance.get(`/card/document/${userId}`, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error fetching salary slip:', error);
      toast.error('Document not available for this user.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h3 className="dashboard-title">
            <i className="bi bi-speedometer2 me-2"></i>
            Admin Panel
          </h3>
          <div className="tab-navigation">
            {['Analytics', 'Pending', 'Approved', 'Rejected'].map(tab => (
              <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-outline-danger btn-sm logout-btn" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {activeTab === 'Analytics' ? (
          <div className="analytics-section">
            {/* Doughnut */}
            <div className="chart-container">
              <div className="chart-card">
                <h4>Application Distribution</h4>
                {chartData && (
                  <div className="chart-wrapper">
                    <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 20, font: { size: 12 } } } }, animation: { animateScale: true, animateRotate: true } }} />
                  </div>
                )}
              </div>
            </div>

            {/* Bar */}
            <div className="chart-container">
              <div className="chart-card">
                <h4>Application Status</h4>
                {barChartData && (
                  <div className="chart-wrapper">
                    <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 20, font: { size: 12 } } } }, scales: { y: { beginAtZero: true } } }} />
                  </div>
                )}
              </div>
            </div>

            {/* Line */}
            <div className="chart-container">
              <div className="chart-card">
                <h4>Approval Rate Trend</h4>
                {lineChartData && (
                  <div className="chart-wrapper">
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 20, font: { size: 12 } } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: value => `${value}%` } } } }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Status Cards */}
            <div className="status-cards">
              {activeTab === 'Pending' && <StatusCard icon="hourglass-split" label="Pending Users" count={counts.pending} />}
              {activeTab === 'Approved' && <StatusCard icon="check-circle" label="Approved Users" count={counts.approved} />}
              {activeTab === 'Rejected' && <StatusCard icon="x-circle" label="Rejected Users" count={counts.rejected} />}
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="loading-container"><div className="spinner"></div><p>Loading users...</p></div>
            ) : users.length === 0 ? (
              <div className="empty-state"><i className="bi bi-inbox"></i><p>No {activeTab} applications found.</p></div>
            ) : (
              <div className="table-responsive">
                <table className="users-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Salary</th><th>PAN Card Number</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>₹{user.salary}</td>
                        <td>{user.pan}</td>
                        <td>
                          <button className="btn btn-view" onClick={() => setSelectedUser(user)}>
                            <i className="bi bi-eye me-1"></i> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content2">
            <div className="modal-header">
              <h5>Applicant Details</h5>
              <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                {['name', 'email', 'phonenumber', 'salary', 'pan', 'dob', 'gender', 'address', 'state', 'country'].map(key => (
                  <div className="detail-item" key={key}>
                    <span className="label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                    <span className="value">{key === 'salary' ? `₹${selectedUser[key]}` : selectedUser[key]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
              {activeTab === 'Pending' && (
                <>
                  <button className="btn btn-danger" onClick={() => handleAction(selectedUser.id, 'reject')}>
                    <i className="bi bi-x-circle me-1"></i> Reject
                  </button>
                  <button className="btn btn-success" onClick={() => handleAction(selectedUser.id, 'approve')}>
                    <i className="bi bi-check-circle me-1"></i> Approve
                  </button>
                </>
              )}
              <button className="btn btn-primary" onClick={() => fetchSalarySlip(selectedUser.id)}>
                View Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 💡 Helper for status card
const StatusCard = ({ icon, label, count }) => (
  <div className="status-card">
    <div className="status-icon"><i className={`bi bi-${icon}`}></i></div>
    <div className="status-info">
      <h6>{label}</h6>
      <h4>{count}</h4>
    </div>
  </div>
);

export default AdminDashboard;
