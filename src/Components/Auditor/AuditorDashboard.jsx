import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './AuditorDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AuditorDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = transactions.filter(tx => 
        tx.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [searchTerm, transactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      prepareChartData();
    }
  }, [transactions]);

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('import.meta.env.VITE_API_BASE_URL/transaction');
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTransactions = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`import.meta.env.VITE_API_BASE_URL/transaction/${userId}`);
      setSelectedUser(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    const dates = [...new Set(transactions.map(tx => tx.date))].sort();
    const amounts = dates.map(date => {
      const dayTransactions = transactions.filter(tx => tx.date === date);
      return dayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    });

    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Daily Transaction Amount',
          data: amounts,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="auditor-dashboard">
      {/* Header */}
      <div className="auditor-header">
        <div className="header-left">
          <h3 className="dashboard-title">
            <i className="bi bi-graph-up me-2"></i>
            Auditor Dashboard
          </h3>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by User ID or Transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>
        <button className="btn btn-outline-danger btn-sm logout-btn" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="auditor-content">
        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-container">
            <h4>Transaction Trends</h4>
            {chartData && (
              <div className="chart-wrapper">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: value => formatAmount(value),
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="transactions-section">
          <h4>All Transactions</h4>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>No transactions found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>User ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.transactionId}>
                      <td>{tx.transactionId}</td>
                      <td>{tx.userId}</td>
                      <td>{formatDate(tx.date)}</td>
                      <td>{formatAmount(tx.amount)}</td>
                      <td>
                        <span className={`badge ${tx.type === 'CREDIT' ? 'bg-success' : 'bg-danger'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${tx.status === 'COMPLETED' ? 'bg-success' : 'bg-warning'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-view"
                          onClick={() => fetchUserTransactions(tx.userId)}
                        >
                          <i className="bi bi-eye me-1"></i> View User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Transactions Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content1">
            <div className="modal-header">
              <h5>User Transactions</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="user-transactions">
                <h6>User ID: {selectedUser.userId}</h6>
                <div className="table-responsive">
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.transactions.map((tx) => (
                        <tr key={tx.transactionId}>
                          <td>{tx.transactionId}</td>
                          <td>{formatDate(tx.date)}</td>
                          <td>{formatAmount(tx.amount)}</td>
                          <td>
                            <span className={`badge ${tx.type === 'CREDIT' ? 'bg-success' : 'bg-danger'}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${tx.status === 'COMPLETED' ? 'bg-success' : 'bg-warning'}`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditorDashboard; 