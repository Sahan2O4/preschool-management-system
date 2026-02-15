import React, { useState } from 'react';

const StudentProgress = () => {
  const [progressList, setProgressList] = useState([
    // example data
    { id: 1, studentName: 'Alice', subject: 'Math', progress: 'A' },
    { id: 2, studentName: 'Bob', subject: 'English', progress: 'B+' }
  ]);

  const [form, setForm] = useState({ id: null, studentName: '', subject: '', progress: '' });
  const [editing, setEditing] = useState(false);

  // Handle input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Add or update student progress
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setProgressList(progressList.map(p => (p.id === form.id ? form : p)));
      setEditing(false);
    } else {
      setProgressList([...progressList, { ...form, id: Date.now() }]);
    }
    setForm({ id: null, studentName: '', subject: '', progress: '' });
  };

  // Delete a progress entry
  const handleDelete = (id) => setProgressList(progressList.filter(p => p.id !== id));

  // Edit a progress entry
  const handleEdit = (item) => {
    setForm(item);
    setEditing(true);
  };

  return (
    <div className="container">
      <h2>Student Progress (Teacher)</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          name="studentName"
          placeholder="Student Name"
          value={form.studentName}
          onChange={handleChange}
          required
        />
        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
        />
        <input
          name="progress"
          placeholder="Progress"
          value={form.progress}
          onChange={handleChange}
          required
        />
        <button type="submit">{editing ? 'Update' : 'Add'} Progress</button>
      </form>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {progressList.map((item) => (
            <tr key={item.id}>
              <td>{item.studentName}</td>
              <td>{item.subject}</td>
              <td>{item.progress}</td>
              <td>
                <button style={{ marginRight: '5px' }} onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {progressList.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No student progress added yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentProgress;
