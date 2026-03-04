import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Download, Save, Users, Calendar, MapPin, X, Mail, Phone, GraduationCap } from 'lucide-react';

// Mock API Service (replace with actual API calls)
const apiService = {
  async getAllEvents() {
    return [
      { eventId: 1, eventName: "Tech Conference 2025", date: "2025-09-15", description: "Annual technology conference", location: "Main Auditorium", category: "Technology", department: "Computer Science", maxCapacity: 200, currentCapacity: 150 },
      { eventId: 2, eventName: "Cultural Fest", date: "2025-08-25", description: "College cultural festival", location: "Campus Ground", category: "Cultural", department: "Arts", maxCapacity: 500, currentCapacity: 320 },
      { eventId: 3, eventName: "Science Exhibition", date: "2025-07-10", description: "Student science projects showcase", location: "Science Block", category: "Academic", department: "Science", maxCapacity: 100, currentCapacity: 85 }
    ];
  },
  async getAllStudents() {
    return [
      { studentId: 1, name: "John Doe", email: "john.doe@college.edu", phoneNumber: "+1234567890", department: "Computer Science", year: "3rd Year" },
      { studentId: 2, name: "Jane Smith", email: "jane.smith@college.edu", phoneNumber: "+1234567891", department: "Arts", year: "2nd Year" },
      { studentId: 3, name: "Mike Johnson", email: "mike.johnson@college.edu", phoneNumber: "+1234567892", department: "Science", year: "4th Year" }
    ];
  },
  async updateEvent(id, event) { console.log('Updating event:', id, event); return { success: true }; },
  async deleteEvent(id) { console.log('Deleting event:', id); return { success: true }; }
};

// Event View Modal
const EventViewModal = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b" style={{ backgroundColor: '#00809D' }}>
          <h2 className="text-xl font-bold text-white">Event Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <div className="p-3 bg-gray-50 rounded-md">{event.eventName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="p-3 bg-gray-50 rounded-md flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                {new Date(event.date).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="p-3 bg-gray-50 rounded-md">{event.description}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="p-3 bg-gray-50 rounded-md flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                {event.location}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="p-3 bg-gray-50 rounded-md">{event.category}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <div className="p-3 bg-gray-50 rounded-md">{event.department}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <div className="p-3 bg-gray-50 rounded-md flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                {event.currentCapacity} / {event.maxCapacity}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Edit Modal
const EventEditModal = ({ event, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    eventName: '', date: '', description: '', location: '', category: '', department: '', maxCapacity: ''
  });

  useEffect(() => {
    if (event) setFormData({ ...event });
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateEvent(event.eventId, formData);
      onSave({ ...event, ...formData });
      onClose();
    } catch (err) { console.error(err); }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b" style={{ backgroundColor: '#00809D' }}>
          <h2 className="text-xl font-bold text-white">Edit Event</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input type="text" value={formData.eventName} onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Cultural">Cultural</option>
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
              <input type="number" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Save className="w-4 h-4"/> <span>Save Changes</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const EventManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [allEvents, setEvents] = useState([]);
  const [allStudents, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, studentsData] = await Promise.all([apiService.getAllEvents(), apiService.getAllStudents()]);
        setEvents(eventsData);
        setStudents(studentsData);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // New date-only comparison: returns 'expired' if eventDay < today, 'today' if equal, 'upcoming' otherwise
  const getEventStatus = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (eventDay.getTime() < startOfToday.getTime()) return 'expired';
    if (eventDay.getTime() === startOfToday.getTime()) return 'today';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'today': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteEvent(selectedEvent.eventId);
      setEvents(allEvents.filter(ev => ev.eventId !== selectedEvent.eventId));
      setDeleteModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleEditSave = (updatedEvent) => {
    setEvents(allEvents.map(ev => ev.eventId === updatedEvent.eventId ? updatedEvent : ev));
  };

  const filteredEvents = allEvents.filter(ev => {
    const status = getEventStatus(ev.date);
    const matchesSearch = ev.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
      <div className="flex space-x-3">
        <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-3 border border-gray-300 rounded-md w-full"/>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-3 border border-gray-300 rounded-md">
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="today">Today</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Category</th>
              <th className="p-3 border-b">Department</th>
              <th className="p-3 border-b">Capacity</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event.eventId} className="hover:bg-gray-50">
                <td className="p-3 border-b">{event.eventName}</td>
                <td className="p-3 border-b">{new Date(event.date).toLocaleDateString()}</td>
                <td className="p-3 border-b">{event.category}</td>
                <td className="p-3 border-b">{event.department}</td>
                <td className="p-3 border-b">{event.currentCapacity} / {event.maxCapacity}</td>
                <td className="p-3 border-b">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getEventStatus(event.date))}`}>
                    {getEventStatus(event.date)}
                  </span>
                </td>
                <td className="p-3 border-b flex space-x-2">
                  <button onClick={() => { setSelectedEvent(event); setViewModalOpen(true); }} className="p-2 bg-blue-100 rounded-md hover:bg-blue-200"><Eye className="w-4 h-4"/></button>
                  <button onClick={() => { setSelectedEvent(event); setEditModalOpen(true); }} className="p-2 bg-yellow-100 rounded-md hover:bg-yellow-200"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => { setSelectedEvent(event); setDeleteModalOpen(true); }} className="p-2 bg-red-100 rounded-md hover:bg-red-200"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EventViewModal event={selectedEvent} isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)}/>
      <EventEditModal event={selectedEvent} isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleEditSave}/>
      <ConfirmationModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Event" message={`Are you sure you want to delete ${selectedEvent?.eventName}?`} />
    </div>
  );
};

export default EventManagementSystem;
