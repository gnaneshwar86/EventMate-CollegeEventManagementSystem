import React, { useEffect, useState } from 'react';
import {
  Calendar, Users, TrendingUp, Settings, Plus, Search, Filter, Download, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, MapPin, User, Mail,
  Phone, DollarSign, BarChart3, PieChart, Activity, Star, X, Save,
  CirclePlus
} from 'lucide-react';
import apiService from '../services/api';
import { useThemeContext } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import AddEventPage from '../components/AddEventPage';

const AdminDashboard = ({ admin, onLogout }) => {

  const { isAdminLoggedIn, setIsAdminLoggedIn } = useThemeContext();
  const { showNotification } = useNotification();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [allEvents, setEvents] = useState([]);
  const [allStudents, setStudents] = useState([]);
  const [allRegistrations, setRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEventsCount: 0,
    totalRegistrations: 0,
    mostPopularEvent: null,
  });
  const [showStudentEventsModal, setShowStudentEventsModal] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventsAndStats = async () => {
      try {
        const eventsData = await apiService.getAllEvents();
        const registrations = await apiService.getAllRegistrations();
        const studentsData = await apiService.getAllStudents();
        const today = new Date();

        setEvents(eventsData);
        setStudents(studentsData);
        setRegistrations(registrations);

        // --- Upcoming & Completed Events ---
        const upcoming = eventsData
          .filter(e => new Date(e.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);

        const completed = eventsData
          .filter(e => new Date(e.date) < today)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);

        setUpcomingEvents(upcoming);
        setCompletedEvents(completed);

        // --- Stats ---
        const totalEvents = eventsData.length;
        const upcomingEventsCount = eventsData.filter(
          e => new Date(e.date) >= today
        ).length;
        const totalRegistrations = registrations.length;

        // Count registrations per event
        const eventCountMap = {};
        registrations.forEach(r => {
          const eventId = r.event?.eventId;
          if (eventId) {
            eventCountMap[eventId] = (eventCountMap[eventId] || 0) + 1;
          }
        });

        let mostPopularEvent = null;
        if (Object.keys(eventCountMap).length > 0) {
          const maxEventId = Object.keys(eventCountMap).reduce((a, b) =>
            eventCountMap[a] > eventCountMap[b] ? a : b
          );
          const event = eventsData.find(e => e.eventId === Number(maxEventId));
          mostPopularEvent = event ? event.eventName : null;
        }

        setStats({
          totalEvents,
          upcomingEventsCount,
          totalRegistrations,
          mostPopularEvent,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndStats();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'today': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || !data.length) {
      showNotification('error', 'Error', 'No data available to export.');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(item => Object.values(item).map(val =>
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', 'Success', `${filename} exported successfully!`);
  };

  const getEventStatus = (eventDate) => {
    const today = new Date();
    const eventDay = new Date(eventDate);
    return eventDay < today ? "Completed" : "Upcoming";
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEditFormData({ ...event });
    setShowEditModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    showNotification(
      'confirm',
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      async () => {
        try {
          await apiService.deleteEvent(eventId);
          setEvents(allEvents.filter(event => event.eventId !== eventId));
          showNotification('success', 'Success', 'Event deleted successfully!');
        } catch (error) {
          showNotification('error', 'Error', 'Failed to delete event: ' + error.message);
        }
      }
    );
  };

  const handleSaveEdit = async () => {
    try {
      await apiService.updateEvent(selectedEvent.eventId, editFormData);
      setEvents(allEvents.map(event =>
        event.eventId === selectedEvent.eventId ? editFormData : event
      ));
      setShowEditModal(false);
      showNotification('success', 'Success', 'Event updated successfully!');
    } catch (error) {
      showNotification('error', 'Error', 'Failed to update event: ' + error.message);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, isPrimary = false }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${isPrimary ? 'border-l-8' : ''}`}
      style={{ borderLeftColor: isPrimary ? '#FFD700' : '#00809D' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-lg"
          style={{
            background: isPrimary
              ? 'linear-gradient(135deg, #FFD700, #FFC107)'
              : 'linear-gradient(135deg, #00809D, #006B7A)'
          }}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-500 text-sm font-medium">{trend}</span>
        </div>
      )}
    </div>
  );

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-90vh overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <aside className="bg-white shadow-lg w-64 min-h-screen fixed top-12 left-0">
      <div className="p-6 mt-20">
        <div className="space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'addEvent', label: 'Add Event', icon: CirclePlus },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'attendees', label: 'Students', icon: Users },
            { id: 'reports', label: 'Reports', icon: Activity }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === id
                ? 'text-white'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
              style={activeTab === id ? {
                background: 'linear-gradient(90deg, #00809D, #006B7A)'
              } : {}}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          title="Total Events"
          value={stats.totalEvents}
          subtitle="All scheduled events"
          isPrimary={true}
        />

        <StatCard
          icon={Clock}
          title="Upcoming Events"
          value={stats.upcomingEventsCount}
          subtitle="Yet to happen"
        />

        <StatCard
          icon={Users}
          title="Total Registrations"
          value={stats.totalRegistrations.toLocaleString()}
          subtitle="All participants"
        />

        <StatCard
          icon={Star}
          title="Most Popular Event"
          value={<span className="text-base font-bold">{stats.mostPopularEvent || "N/A"}</span>}
          subtitle="Highest registrations"
          isPrimary={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-6 mr-3 rounded" style={{ backgroundColor: '#00809D' }}></div>
            Completed Events
          </h3>
          <div className="space-y-4">
            {completedEvents.map((event) => (
              <div key={event.eventId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-medium text-gray-900">{event.eventName}</h4>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{event.currentCapacity} attendees</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-6 mr-3 rounded" style={{ backgroundColor: '#FFD700' }}></div>
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((item) => (
              <div key={item.eventId} className="flex items-center justify-between p-4 rounded-lg border-l-4 hover:shadow-md transition-shadow"
                style={{ backgroundColor: '#F8F9FA', borderLeftColor: '#FFD700' }}>
                <div>
                  <h4 className="font-medium text-gray-900">{item.eventName}</h4>
                  <p className="text-sm text-gray-600">{item.category} • {item.department}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: '#00809D' }}>{item.currentCapacity}</p>
                  <p className="text-xs text-gray-500">registrations</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const EventsTab = () => {
    // sort state
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
    // dropdown control for selecting sort key
    const [dropdownKey, setDropdownKey] = useState('date');

    // toggle asc/desc (used from header click or toggle button)
    const toggleDirection = () => {
      setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }));
    };

    // click header to sort by that key (toggles direction if same key)
    const handleSort = (key) => {
      setSortConfig(prev => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
      setDropdownKey(key);
    };

    // apply dropdown selection (keeps direction)
    const applySortFromDropdown = () => {
      setSortConfig(prev => ({ key: dropdownKey, direction: prev.direction }));
    };

    // compute sorted events (stable, memoized)
    const sortedEvents = React.useMemo(() => {
      const list = [...allEvents];

      if (!sortConfig.key) return list;

      const key = sortConfig.key;
      const dir = sortConfig.direction === 'asc' ? 1 : -1;

      list.sort((a, b) => {
        let A = a[key];
        let B = b[key];

        // custom handling
        if (key === 'date') {
          A = new Date(a.date).getTime();
          B = new Date(b.date).getTime();
        } else if (key === 'status') {
          A = getEventStatus(a.date);
          B = getEventStatus(b.date);
          // define a stable ordering for statuses so sorting makes sense
          const order = { expired: 0, today: 1, upcoming: 2, completed: 3 };
          A = order[A] ?? 99;
          B = order[B] ?? 99;
        } else if (key === 'eventName' || key === 'category' || key === 'department') {
          A = (A || '').toString().toLowerCase();
          B = (B || '').toString().toLowerCase();
        } else if (typeof A === 'number' || typeof B === 'number' || key === 'currentCapacity' || key === 'capacity') {
          A = Number(A || 0);
          B = Number(B || 0);
        } else {
          // fallback
          A = (A || '').toString().toLowerCase();
          B = (B || '').toString().toLowerCase();
        }

        if (A < B) return -1 * dir;
        if (A > B) return 1 * dir;
        return 0;
      });

      return list;
    }, [allEvents, sortConfig]);

    // small helper to render sort arrow
    const SortArrow = ({ col }) => {
      if (sortConfig.key !== col) return <span className="opacity-40 ml-1 text-xs">↕</span>;
      return sortConfig.direction === 'asc'
        ? <span className="ml-1 text-xs">▲</span>
        : <span className="ml-1 text-xs">▼</span>;
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="w-2 h-8 mr-4 rounded" style={{ backgroundColor: '#00809D' }}></div>
            Event Management
          </h2>

          <div className="flex items-center space-x-3">
            {/* Filter select (existing) */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-opacity-75"
              style={{ borderColor: '#00809D' }}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="today">Today</option>
            </select>

            {/* Sort by dropdown */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={dropdownKey}
                onChange={(e) => setDropdownKey(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none"
              >
                <option value="date">Date</option>
                <option value="eventName">Event Name</option>
                <option value="status">Status</option>
                <option value="currentCapacity">Attendees</option>
                <option value="category">Category</option>
              </select>

              <button
                onClick={applySortFromDropdown}
                className="px-3 py-2 bg-[#00809D] text-white rounded-lg hover:opacity-90 transition"
                title="Apply Sort"
              >
                Apply
              </button>

              <button
                onClick={toggleDirection}
                className="px-3 py-2 border rounded-lg hover:bg-gray-100 transition"
                title={`Toggle direction (${sortConfig.direction === 'asc' ? 'ascending' : 'descending'})`}
              >
                {sortConfig.direction === 'asc' ? 'Asc' : 'Desc'}
              </button>

            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-white" style={{ background: 'linear-gradient(90deg, #00809D, #006B7A)' }}>
                <tr>
                  <th
                    onClick={() => handleSort('eventName')}
                    className="px-6 py-4 text-left font-medium cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    Event Name <SortArrow col="eventName" />
                  </th>

                  <th
                    onClick={() => handleSort('date')}
                    className="px-6 py-4 text-left font-medium cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    Date <SortArrow col="date" />
                  </th>

                  <th
                    onClick={() => handleSort('status')}
                    className="px-6 py-4 text-left font-medium cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    Status <SortArrow col="status" />
                  </th>

                  <th
                    onClick={() => handleSort('currentCapacity')}
                    className="px-6 py-4 text-left font-medium cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    Attendees <SortArrow col="currentCapacity" />
                  </th>

                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedEvents.map((event) => (
                  <tr
                    key={event.eventId}
                    className="hover:bg-gray-50 transition-colors transform hover:scale-[1.001]"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{event.eventName}</div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{event.date}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getEventStatus(event.date))}`}
                      >
                        {getEventStatus(event.date)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{event.currentCapacity}</td>

                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="hover:opacity-80 p-1 transition-colors rounded-md hover:bg-gray-100"
                          style={{ color: '#FFD700' }}
                          title="View Event"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleEditEvent(event)}
                          className="hover:opacity-80 p-1 transition-colors rounded-md hover:bg-gray-100"
                          style={{ color: '#00809D' }}
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(event.eventId)}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors rounded-md hover:bg-red-50"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedEvents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">No events found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Event Details"
        >
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <p className="mt-1 text-gray-900">{selectedEvent.eventName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-gray-900">{selectedEvent.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="mt-1 text-gray-900">{selectedEvent.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="mt-1 text-gray-900">{selectedEvent.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Capacity</label>
                  <p className="mt-1 text-gray-900">{selectedEvent.currentCapacity}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                  <p className="mt-1 text-gray-900">{selectedEvent.capacity}</p>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Event"
        >
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input
                    type="text"
                    value={editFormData.eventName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, eventName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={editFormData.date || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={editFormData.category || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={editFormData.department || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity</label>
                  <input
                    type="number"
                    value={editFormData.capacity || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, capacity: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  };


  const ReportsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <div className="w-2 h-8 mr-4 rounded" style={{ backgroundColor: '#FFD700' }}></div>
        Event Reports
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4" style={{ borderTopColor: '#00809D' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Event Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Events</span>
              <span className="font-bold" style={{ color: '#00809D' }}>{stats.totalEvents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-bold text-green-600">{completedEvents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Upcoming</span>
              <span className="font-bold" style={{ color: '#FFD700' }}>{upcomingEvents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Students</span>
              <span className="font-bold text-purple-600">{allStudents.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4" style={{ borderTopColor: '#FFD700' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Events</h3>
          <div className="space-y-3">
            {allEvents.slice(0, 3).map((event, index) => (
              <div key={event.eventId} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white`}
                  style={{ backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#00809D' : '#6B7280' }}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{event.eventName}</p>
                  <p className="text-xs text-gray-600">{event.currentCapacity} attendees</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => exportToCSV(allEvents, 'Event_Report')}
              className="w-full hover:opacity-90 text-white p-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              style={{ backgroundColor: '#00809D' }}>
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="w-full hover:opacity-90 text-gray-800 p-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              style={{ backgroundColor: '#FFD700' }}>
              <BarChart3 className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Send Notifications</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  // export default AdminDashboard;

  const AttendeesTab = () => {
    const [studentSearch, setStudentSearch] = useState('');

    const filteredStudents = allStudents.filter(student =>
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (student.department && student.department.toLowerCase().includes(studentSearch.toLowerCase()))
    );

    const getStudentRegistrations = (studentId) => {
      return allRegistrations.filter(r => r.student?.studentId === studentId);
    };

    const handleViewStudentEvents = (student) => {
      const registrations = getStudentRegistrations(student.studentId);
      const registeredEvents = registrations.map(reg => {
        const eventData = reg.event;
        return eventData ? { ...eventData, registrationDate: reg.registrationDate } : null;
      }).filter(e => e !== null);

      setSelectedStudentForView({ ...student, events: registeredEvents });
      setShowStudentEventsModal(true);
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="w-2 h-8 mr-4 rounded" style={{ backgroundColor: '#FFD700' }}></div>
            Attendee Management
          </h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00809D]"
              />
            </div>
            <button
              onClick={() => exportToCSV(filteredStudents, 'Student_List')}
              className="hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#00809D' }}>
              Export All
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Registered Students</h3>
            <span className="text-sm text-gray-500">{filteredStudents.length} students found</span>
          </div>

          <div className="grid gap-4">
            {filteredStudents.map((student, index) => {
              const studentRegs = getStudentRegistrations(student.studentId);
              return (
                <div
                  key={student.studentId}
                  onClick={() => handleViewStudentEvents(student)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#00809D]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner"
                      style={{
                        background: index % 2 === 0
                          ? 'linear-gradient(135deg, #00809D, #006B7A)'
                          : 'linear-gradient(135deg, #FFD700, #FFC107)'
                      }}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center"><Mail className="w-3 h-3 mr-1" /> {student.email}</p>
                      <p className="text-xs text-gray-500 font-medium">{student.department || 'General'}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Registrations</p>
                      <p className="text-xl font-black" style={{ color: '#00809D' }}>{studentRegs.length}</p>
                    </div>
                    <Eye className="w-5 h-5 text-gray-300 group-hover:text-[#00809D]" />
                  </div>
                </div>
              );
            })}
            {filteredStudents.length === 0 && (
              <div className="py-12 text-center text-gray-500 italic">No students found matching your search.</div>
            )}
          </div>
        </div>

        {/* Student Events Modal */}
        <Modal
          isOpen={showStudentEventsModal}
          onClose={() => setShowStudentEventsModal(false)}
          title={`Registered Events: ${selectedStudentForView?.name}`}
        >
          {selectedStudentForView && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-800">{selectedStudentForView.email}</p>
                  <p className="text-xs text-blue-600">{selectedStudentForView.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-600 uppercase font-bold">Total Events</p>
                  <p className="text-2xl font-black text-blue-800">{selectedStudentForView.events.length}</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedStudentForView.events.length > 0 ? (
                  selectedStudentForView.events.map((event, idx) => (
                    <div key={idx} className="p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-gray-900">{event.eventName}</h5>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-2" /> {event.date}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-2" /> {event.venue}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(getEventStatus(event.date))}`}>
                            {getEventStatus(event.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-gray-500 italic">This student hasn't registered for any events yet.</p>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'addEvent': return <AddEventPage />;
      case 'events': return <EventsTab />;
      case 'attendees': return <AttendeesTab />;
      case 'reports': return <ReportsTab />;
      case 'analytics': return <AnalyticsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex-1 p-6 ml-64">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

