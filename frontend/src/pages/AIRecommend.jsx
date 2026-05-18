// src/pages/AIRecommend.jsx
import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiCpu, FiZap, FiUsers } from 'react-icons/fi';
import './AIRecommend.css';

const AIRecommend = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState('');
  const [mode, setMode] = useState('single');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/employees').then((r) => setEmployees(r.data.data));
  }, []);

  const handleGenerate = async () => {
    if (mode === 'single' && !selected) return toast.error('Select an employee');
    setLoading(true);
    setResult('');
    try {
      const body = mode === 'all' ? { allEmployees: true } : { employeeId: selected };
      const res = await API.post('/ai/recommend', body);
      setResult(res.data.recommendation);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page fade-up">
      <div className="page-header">
        <div>
          <h2>AI Insights Engine</h2>
          <p className="subtitle">Powered by LLaMA 3.1 via OpenRouter</p>
        </div>
      </div>

      <div className="ai-layout">
        <div className="ai-controls card">
          <h3><FiCpu /> Generate Recommendations</h3>

          <div className="mode-tabs">
            <button className={`mode-tab ${mode === 'single' ? 'active' : ''}`} onClick={() => setMode('single')}>
              Single Employee
            </button>
            <button className={`mode-tab ${mode === 'all' ? 'active' : ''}`} onClick={() => setMode('all')}>
              All Employees
            </button>
          </div>

          {mode === 'single' && (
            <div className="form-group">
              <label className="label">Select Employee</label>
              <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">-- Choose Employee --</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name} — {e.department} ({e.performanceScore}%)
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'all' && (
            <div className="all-info">
              <FiUsers />
              <span>Will analyze all <strong>{employees.length}</strong> employees and generate rankings & team insights</span>
            </div>
          )}

          <button className="btn btn-primary gen-btn" onClick={handleGenerate} disabled={loading}>
            <FiZap />
            {loading ? 'Analyzing...' : 'Generate AI Insight'}
          </button>
        </div>

        <div className="ai-result card">
          <h3>📊 AI Analysis</h3>
          {loading && (
            <div className="ai-loading">
              <div className="ai-pulse" />
              <p>AI is analyzing employee data...</p>
            </div>
          )}
          {!loading && !result && (
            <div className="ai-empty">
              <span>🤖</span>
              <p>Select an employee or choose all employees, then click "Generate AI Insight"</p>
            </div>
          )}
          {!loading && result && (
            <div className="ai-output">
              {result.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('#') ? 'ai-heading' : line.trim() === '' ? 'ai-spacer' : 'ai-text'}>
                  {line.replace(/^#+\s*/, '')}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommend;