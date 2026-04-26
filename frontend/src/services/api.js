// src/services/api.js
// ─────────────────────────────────────────────────────────────
// All HTTP calls to the backend go through here.
// Usage: import { studentAPI, attendanceAPI, progressAPI } from '../services/api';
// ─────────────────────────────────────────────────────────────

const BASE_URL = "http://localhost:5000/api";

// ── Helper: get auth headers ───────────────────────────────────────────────
const authHeaders = () => {
  const token = localStorage.getItem("mkToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ── Helper: handle response ────────────────────────────────────────────────
const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════
export const authAPI = {
  getTeachers: () =>
    fetch(`${BASE_URL}/auth/teachers`, { headers: authHeaders() }).then(handleRes),

  registerTeacher: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleRes),

  deleteTeacher: (id) =>
    fetch(`${BASE_URL}/auth/teachers/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleRes),
  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(handleRes),

  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleRes),
};

// ═══════════════════════════════════════════════════════════════
// STUDENTS
// ═══════════════════════════════════════════════════════════════
export const studentAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/students`, { headers: authHeaders() }).then(handleRes),

  getById: (id) =>
    fetch(`${BASE_URL}/students/${id}`, { headers: authHeaders() }).then(handleRes),

  create: (data) =>
    fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  update: (id, data) =>
    fetch(`${BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  delete: (id) =>
    fetch(`${BASE_URL}/students/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleRes),

  // Find student linked to a parent's email address
  byParentEmail: (email) =>
    fetch(`${BASE_URL}/students/by-parent/${encodeURIComponent(email)}`, {
      headers: authHeaders(),
    }).then(handleRes),
};

// ═══════════════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════════════
export const attendanceAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/attendance`, { headers: authHeaders() }).then(handleRes),

  getByDate: (date) =>
    fetch(`${BASE_URL}/attendance/date/${date}`, { headers: authHeaders() }).then(handleRes),

  save: (date, records) =>
    fetch(`${BASE_URL}/attendance`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ date, records }),
    }).then(handleRes),

  update: (id, data) =>
    fetch(`${BASE_URL}/attendance/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  delete: (id) =>
    fetch(`${BASE_URL}/attendance/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleRes),
};

// ═══════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════
export const progressAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/progress`, { headers: authHeaders() }).then(handleRes),

  getByStudent: (studentId) =>
    fetch(`${BASE_URL}/progress/student/${studentId}`, { headers: authHeaders() }).then(handleRes),

  create: (data) =>
    fetch(`${BASE_URL}/progress`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  update: (id, data) =>
    fetch(`${BASE_URL}/progress/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  delete: (id) =>
    fetch(`${BASE_URL}/progress/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleRes),
};

// ═══════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════
export const eventAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/events`).then(handleRes),

  create: (data) =>
    fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  update: (id, data) =>
    fetch(`${BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  delete: (id) =>
    fetch(`${BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleRes),
};

// ═══════════════════════════════════════════════════════════════
// FEEDBACK
// ═══════════════════════════════════════════════════════════════
export const feedbackAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/feedback`, { headers: authHeaders() }).then(handleRes),

  submit: (data) =>
    fetch(`${BASE_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleRes),

  update: (id, data) =>
    fetch(`${BASE_URL}/feedback/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  delete: (id) =>
    fetch(`${BASE_URL}/feedback/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleRes),
};

// ═══════════════════════════════════════════════════════════════
// FINANCIAL
// ═══════════════════════════════════════════════════════════════
export const financialAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/financial`, { headers: authHeaders() }).then(handleRes),

  create: (data) =>
    fetch(`${BASE_URL}/financial`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  update: (id, data) =>
    fetch(`${BASE_URL}/financial/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  delete: (id) =>
    fetch(`${BASE_URL}/financial/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleRes),
};

// ═══════════════════════════════════════════════════════════════
// SESSIONS
// ═══════════════════════════════════════════════════════════════
export const sessionAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/sessions`).then(handleRes),

  create: (data) =>
    fetch(`${BASE_URL}/sessions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  update: (id, data) =>
    fetch(`${BASE_URL}/sessions/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleRes),

  delete: (id) =>
    fetch(`${BASE_URL}/sessions/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleRes),
};
