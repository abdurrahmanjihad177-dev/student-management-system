"use client";

import { useEffect, useState } from "react";

const empty = { name: "", email: "", phone: "", department: "" };
const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/students");
    const data = await res.json();
    if (res.ok) setStudents(data);
    else setError(data.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch(editingId ? `/api/students/${editingId}` : "/api/students", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error);
    reset();
    load();
  }

  function reset() {
    setForm(empty);
    setEditingId(null);
    setError("");
  }

  function onEdit(s) {
    setEditingId(s._id);
    setForm({ name: s.name, email: s.email, phone: s.phone, department: s.department });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onDelete(id) {
    if (!confirm("এই Student-কে Delete করবেন?")) return;
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (editingId === id) reset();
      load();
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Student Management System</h1>
      <p className="mt-1 text-slate-500">Student-এর তথ্য যোগ, দেখা, Edit ও Delete করুন।</p>

      <form
        onSubmit={onSubmit}
        className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Student-এর তথ্য Edit করুন" : "নতুন Student যুক্ত করুন"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className={inputCls} name="name" placeholder="Name" value={form.name} onChange={onChange} required />
          <input className={inputCls} name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className={inputCls} name="phone" placeholder="Phone" value={form.phone} onChange={onChange} required />
          <input className={inputCls} name="department" placeholder="Department" value={form.department} onChange={onChange} required />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex gap-3">
          <button
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Add student"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Department</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">এখনো কোনো Student নেই। উপরের ফর্ম দিয়ে প্রথম Student যুক্ত করুন।</td></tr>
            ) : (
              students.map((s) => (
                <tr key={s._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3">{s.department}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(s)} className="mr-2 rounded-md bg-amber-100 px-3 py-1 text-amber-800 hover:bg-amber-200">Edit</button>
                    <button onClick={() => onDelete(s._id)} className="rounded-md bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
