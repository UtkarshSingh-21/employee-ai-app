// src/pages/AddEmployee.jsx
import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiSave } from 'react-icons/fi';
import './AddEmployee.css';

const DEPARTMENTS = ['Development', 'HR', 'Marketing', 'Finance', 'Design', 'Sales', 'Operations'];

const AddEmployee = () => {
  const [form, setForm] = useState({
    name: '', email: '', department: 'Development',
    performanceScore: '', experience: '', skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) return toast.error('Add at least one skill');
    setLoading(true);
    try {
      await API.post('/employees', {
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      toast.success('Employee added successfully! 🎉');
      setForm({ name: '', email: '', department: 'Development', performanceScore: '', experience: '', skills: [] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-emp-page fade-up">
      <div className="page-header">
        <h2>Add New Employee</h2>
        <p className="subtitle">Fill in employee details below</p>
      </div>
      <div className="add-emp-card card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Full Name *</label>
              <input className="input" placeholder="Aman Verma" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="label">Email Address *</label>
              <input className="input" type="email" placeholder="aman@gmail.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Department *</label>
              <select className="input" value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Performance Score (0-100) *</label>
              <input className="input" type="number" min="0" max="100" placeholder="85"
                value={form.performanceScore}
                onChange={(e) => setForm({ ...form, performanceScore: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Years of Experience *</label>
              <input className="input" type="number" min="0" placeholder="3" value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
            </div>
          </div>

          {/* Skills Section */}
          <div className="form-group">
            <label className="label">Skills *</label>
            <div className="skill-input-row">
              <input className="input" placeholder="e.g. React, Node.js..." value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button type="button" className="btn btn-primary" onClick={addSkill}>
                <FiPlus /> Add
              </button>
            </div>
            <div className="skills-list">
              {form.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}><FiX /></button>
                </span>
              ))}
              {form.skills.length === 0 && (
                <span className="no-skills">No skills added yet</span>
              )}
            </div>
          </div>

          <button className="btn btn-primary submit-btn" type="submit" disabled={loading}>
            <FiSave />
            {loading ? 'Saving...' : 'Save Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;