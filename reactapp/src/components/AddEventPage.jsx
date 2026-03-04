import React, { useState } from 'react';
import { Calendar, MapPin, User, Layers, Save } from 'lucide-react';
import apiService from '../services/api';
import { useNotification } from '../context/NotificationContext';

// AddEventPage component (compact, info on top, form below)
// Usage: place at route path like /admin/events/new or import into your Events page.
// Props:
// - onEventAdded(newEvent) -> optional callback to refresh parent list
// - primaryColor / accentColor (optional)

export default function AddEventPage({ onEventAdded, primaryColor = '#00809D', accentColor = '#FFD700' }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showNotification } = useNotification();

  const [form, setForm] = useState({
    eventName: '',
    description: '',
    date: '', // YYYY-MM-DD (LocalDate on backend)
    time: '', // string like "14:00"
    venue: '',
    department: '',
    currentCapacity: 0,
    capacity: '',
    category: 'OTHER',
  });

  const categories = [
    'WORKSHOP', 'SEMINAR', 'CONFERENCE', 'HACKATHON', 'CULTURAL', 'SPORTS', 'TECHNICAL', 'OTHER'
  ];

  const validate = () => {
    const errs = {};
    if (!form.eventName || form.eventName.trim().length < 5) errs.eventName = 'Event name must be at least 5 characters';
    if (!form.date) errs.date = 'Date is required';
    if (!form.time) errs.time = 'Time is required';
    if (!form.venue) errs.venue = 'Venue is required';
    if (!form.department) errs.department = 'Department is required';
    if (!form.capacity || Number(form.capacity) <= 0) errs.capacity = 'Capacity must be a positive integer';
    if (Number(form.currentCapacity) < 0) errs.currentCapacity = 'Current capacity cannot be negative';
    if (Number(form.currentCapacity) > Number(form.capacity)) errs.currentCapacity = 'Current capacity cannot exceed capacity';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'capacity' || name === 'currentCapacity' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        eventName: form.eventName.trim(),
        description: form.description || null,
        date: form.date,
        time: form.time,
        venue: form.venue,
        department: form.department,
        currentCapacity: form.currentCapacity || 0,
        capacity: Number(form.capacity),
        category: form.category,
      };

      const created = await apiService.createEvent(payload);

      showNotification('success', 'Success', 'Event created successfully!');
      setErrors({});
      // reset form but keep category for convenience
      setForm({ eventName: '', description: '', date: '', time: '', venue: '', department: '', currentCapacity: 0, capacity: '', category: form.category });
      if (onEventAdded) onEventAdded(created);
    } catch (err) {
      console.error('Failed to create event', err);
      showNotification('error', 'Error', err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[50vh] bg-gradient-to-br">
      <div className="max-w-6xl mx-auto">
        {/* Top event info card (compact) */}
        {/* <div className="mb-6 p-6 rounded-xl shadow-md bg-gradient-to-r from-[#00809D] to-[#006B7A] text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-white/10">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Event Info</h2>
            </div>
          </div>
        </div> */}

        {/* Compact form card below */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                <input name="eventName" value={form.eventName} onChange={handleChange} placeholder="e.g., Tech Symposium 2026" className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
                {errors.eventName && <p className="text-red-600 text-sm mt-1">{errors.eventName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
                {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input name="time" type="time" value={form.time} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
                {errors.time && <p className="text-red-600 text-sm mt-1">{errors.time}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input name="department" value={form.department} onChange={handleChange} placeholder="e.g., Computer Science" className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
                {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Venue</label>
                <input name="venue" value={form.venue} onChange={handleChange} placeholder="e.g., Main Auditorium" className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
                {errors.venue && <p className="text-red-600 text-sm mt-1">{errors.venue}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity (Max)</label>
                <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
                {errors.capacity && <p className="text-red-600 text-sm mt-1">{errors.capacity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Current Capacity</label>
                <input name="currentCapacity" type="number" min="0" value={form.currentCapacity} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
                {errors.currentCapacity && <p className="text-red-600 text-sm mt-1">{errors.currentCapacity}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Short description or agenda" className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
            </div>


            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Preview: <span className="font-medium">{form.eventName || '—'}</span> • <span className="font-medium">{form.date || '—'}</span> • <span className="font-medium">{form.time || '—'}</span></div>

              <div className="flex items-center space-x-2">
                <button type="reset" onClick={() => setForm({ eventName: '', description: '', date: '', time: '', venue: '', department: '', currentCapacity: 0, capacity: '', category: form.category })} className="px-3 py-2 border rounded-md">Reset</button>

                <button type="submit" disabled={loading} className="inline-flex items-center px-6 py-2 rounded-md font-semibold shadow" style={{ background: accentColor, color: '#111' }}>
                  {loading ? 'Saving...' : (<><Save className="w-8 h-4" /> Create Event</>)}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
