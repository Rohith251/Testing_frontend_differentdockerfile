import React, { useState } from 'react';
import instance from '../../axios';
import { toast } from 'react-toastify';

const TransactionsByDate = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchByDateRange = async () => {
    if (!fromDate || !toDate) {
      toast.warn('Please select both From and To dates.');
      return;
    }

    const userId = localStorage.getItem('id');
    if (!userId) {
      toast.error('User ID not found. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const response = await instance.get(
        `/transaction/transactionsByDate`,
        {
          params: {
            userId,
            startDate: fromDate,
            endDate: toDate,
          },
        }
      );

      const data = response.data;

      if (data.length === 0) {
        toast.info('No transactions found in selected date range.');
      }

      const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sorted);
    } catch (err) {
      toast.error('Failed to fetch transactions.');
      console.error('AxiosError:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format balance in INR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <>
      {/* Date Filters */}
      <div className="d-flex justify-content-center flex-wrap gap-3 align-items-end mb-4">
        <div>
          <label className="form-label">From:</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">To:</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div>
          <button
            className="btn btn-primary px-4 fw-semibold"
            onClick={fetchByDateRange}
          >
            {loading ? 'Loading...' : 'Fetch'}
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      {transactions.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Date</th>
                <th>Merchant details</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td className="text-muted">{txn.date}</td>
                  <td>{txn.merchant}</td>
                  <td className="fw-bold text-success">
                    {parseFloat(txn.amount).toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 fs-6 ${
                        txn.status === 'SUCCESS'
                          ? 'bg-success'
                          : txn.status === 'FAILED'
                          ? 'bg-danger'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="fw-semibold text-primary">
                    {formatCurrency(txn.currentBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading ? (
        <div className="alert alert-light text-center mt-4">
          No transactions to display for the selected date range.
        </div>
      ) : null}
    </>
  );
};

export default TransactionsByDate;
