// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiTrendingUp, FiAward, FiBarChart2 } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    API.get('/employees')
      .then((res) => setEmployees(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avgScore = employees.length
    ? (employees.reduce((a, b) => a + b.performanceScore, 0) / employees.length).toFixed(1)
    : 0;
  const topPerformers = employees.filter((e) => e.performanceScore >= 80).length;
  const departments = [...new Set(employees.map((e) => e.department))].length;

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: <FiUsers />, color: '#6c63ff' },
    { label: 'Avg Performance', value: `${avgScore}%`, icon: <FiBarChart2 />, color: '#22c55e' },
    { label: 'Top Performers', value: topPerformers, icon: <FiAward />, color: '#f59e0b' },
    { label: 'Departments', value: departments, icon: <FiTrendingUp />, color: '#06b6d4' },
  ];

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-mid';
    return 'score-low';
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="dashboard-page fade-up">
      <div className="page-header">
        <div>
          <h2>Welcome back, {user?.name} 👋</h2>
          <p className="subtitle">Here's what's happening with your team</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div className="stat-card card" key={i} style={{ '--stat-color': stat.color }}>
            <div className="stat-icon" style={{ background: `${stat.color}22`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-section">
        <h3>🏆 Top Performers</h3>
        <div className="emp-table">
          <div className="table-head">
            <span>Name</span>
            <span>Department</span>
            <span>Score</span>
            <span>Experience</span>
          </div>
          {employees.slice(0, 8).map((emp) => (
            <div className="table-row" key={emp._id}>
              <span className="emp-name">{emp.name}</span>
              <span><span className="badge badge-accent">{emp.department}</span></span>
              <span>
                <span className={`score-pill ${getScoreClass(emp.performanceScore)}`}>
                  {emp.performanceScore}%
                </span>
              </span>
              <span className="exp-text">{emp.experience} yrs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;