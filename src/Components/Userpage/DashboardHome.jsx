import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import './DashboardHome.css'
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardHome = ({ userData }) => {
  const [forexRates, setForexRates] = useState({
    USD: { rate: 82.45, change: 0.25 },
    EUR: { rate: 89.12, change: -0.15 },
    GBP: { rate: 104.23, change: 0.10 },
    JPY: { rate: 0.58, change: -0.02 },
    AUD: { rate: 54.67, change: 0.18 }
  });

  const [marketIndicators, setMarketIndicators] = useState({
    volatility: { value: 12.5, trend: 'up' },
    liquidity: { value: 85.2, trend: 'down' },
    sentiment: { value: 72.8, trend: 'up' }
  });

  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'USD/INR',
        data: [81.5, 82.1, 82.8, 82.3, 82.6, 82.45],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  });

  const [volumeData, setVolumeData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Trading Volume',
        data: [1200, 1900, 3000, 5000, 2000],
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  });

  const [sentimentData, setSentimentData] = useState({
    labels: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ]
      }
    ]
  });

  useEffect(() => {
    // Simulate real-time forex rate updates
    const interval = setInterval(() => {
      setForexRates(prevRates => {
        const newRates = { ...prevRates };
        Object.keys(newRates).forEach(currency => {
          const change = (Math.random() - 0.5) * 0.1;
          newRates[currency].rate = Number((newRates[currency].rate + change).toFixed(2));
          newRates[currency].change = Number(change.toFixed(2));
        });
        return newRates;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-success' : 'text-danger';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'bi-arrow-up-circle-fill text-success' : 'bi-arrow-down-circle-fill text-danger';
  };

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section mb-4">
        <h2>Welcome, {userData?.name || 'User'}!</h2>
        <p className="text-muted">Here's your Forex Card Overview</p>
      </div>

      {/* Forex Rates Section */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Live Forex Rates</h5>
              <div className="forex-rates">
                {Object.entries(forexRates).map(([currency, data]) => (
                  <div key={currency} className="forex-rate-item">
                    <div className="currency-info">
                      <span className="currency">{currency}/INR</span>
                      <span className="rate">{data.rate}</span>
                    </div>
                    <div className={`change ${getChangeColor(data.change)}`}>
                      <i className={`bi ${getChangeIcon(data.change)}`}></i>
                      {Math.abs(data.change)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Indicators Section */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Market Indicators</h5>
              <div className="indicators-container">
                {Object.entries(marketIndicators).map(([indicator, data]) => (
                  <div key={indicator} className="indicator-item">
                    <div className="indicator-name">{indicator}</div>
                    <div className="indicator-value">{data.value}</div>
                    <div className="indicator-trend">
                      <i className={`bi ${getTrendIcon(data.trend)}`}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">USD/INR Trend</h5>
              <div className="chart-container">
                <Line data={chartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Trading Volume</h5>
              <div className="chart-container">
                <Bar data={volumeData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default DashboardHome;

