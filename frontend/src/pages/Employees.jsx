// src/pages/Employees.jsx
import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiSearch, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import './Employees.css';

const DEPARTMENTS = ['All', 'Development', 'HR', 'Marketing', 'Finance', 'Design', 'Sales', 'Operations'];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [editEmp, setEditEmp] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('name', search);
      if (dept !== 'All') params.append('department', dept);
      const url = params.toString() ? `/employees/search?${params}` : '/employees';
      const res = await API.get(url);
      setEmployees(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, [search, dept]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await API.delete(`/employees/${id}`);
      toast.success('Employee deleted');
      fetchEmployees();
    } catch { toast.error('Delete failed'); }
  };

  const openEdit = (emp) => {
    setEditEmp(emp);
    setEditForm({ ...emp, skills: emp.skills.join(', ') });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/employees/${editEmp._id}`, {
        ...editForm,
        skills: editForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        performanceScore: Number(editForm.performanceScore),
        experience: Number(editForm.experience),
      });
      toast.success('Employee updated!');
      setEditEmp(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const getScoreClass = (s) => s >= 80 ? 'score-high' : s >= 60 ? 'score-mid' : 'score-low';

  return (
    <div className="emp-page fade-up">
      <div className="page-header">
        <div>
          <h2>Employee Directory</h2>
          <p className="subtitle">{employees.length} employees found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar card">
        <div className="search-wrap">
          <FiSearch className="search-icon" />
          <input className="input search-input" placeholder="Search by name..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="clear-btn" onClick={() => setSearch('')}><FiX /></button>}
        </div>
        <div className="dept-filters">
          {DEPARTMENTS.map((d) => (
            <button key={d} className={`dept-btn ${dept === d ? 'active' : ''}`} onClick={() => setDept(d)}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? <div className="spinner" /> : (
        <div className="emp-table">
          <div className="table-head-6">
            <span>Employee</span>
            <span>Department</span>
            <span>Skills</span>
            <span>Score</span>
            <span>Exp</span>
            <span>Actions</span>
          </div>
          {employees.length === 0 ? (
            <div className="empty-state">No employees found</div>
          ) : employees.map((emp) => (
            <div className="table-row-6" key={emp._id}>
              <div>
                <div className="emp-name">{emp.name}</div>
                <div className="emp-email">{emp.email}</div>
              </div>
              <span><span className="badge badge-accent">{emp.department}</span></span>
              <div className="skills-cell">
                {emp.skills.slice(0, 3).map((s) => (
                  <span key={s} className="badge badge-accent" style={{ fontSize: '11px', padding: '2px 7px' }}>{s}</span>
                ))}
                {emp.skills.length > 3 && <span className="more-skills">+{emp.skills.length - 3}</span>}
              </div>
              <span><span className={`score-pill ${getScoreClass(emp.performanceScore)}`}>{emp.performanceScore}%</span></span>
              <span className="exp-text">{emp.experience}y</span>
              <div className="action-btns">
                <button className="btn btn-ghost icon-btn" onClick={() => openEdit(emp)}><FiEdit2 /></button>
                <button className="btn btn-danger icon-btn" onClick={() => handleDelete(emp._id)}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editEmp && (
        <div className="modal-overlay" onClick={() => setEditEmp(null)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Employee</h3>
              <button className="btn btn-ghost icon-btn" onClick={() => setEditEmp(null)}><FiX /></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="label">Name</label>
                <input className="input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="label">Department</label>
                <select className="input" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}>
                  {DEPARTMENTS.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="label">Performance Score</label>
                  <input className="input" type="number" min="0" max="100" value={editForm.performanceScore}
                    onChange={(e) => setEditForm({ ...editForm, performanceScore: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Experience (years)</label>
                  <input className="input" type="number" min="0" value={editForm.experience}
                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Skills (comma separated)</label>
                <input className="input" value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} />
              </div>
              <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;