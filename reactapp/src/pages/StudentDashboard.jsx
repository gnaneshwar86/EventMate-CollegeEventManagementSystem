import React, { useEffect, useState } from 'react';
import { Calendar, Users, Clock, MapPin, UserCheck, XCircle, BookOpen, Star, } from 'lucide-react';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';
import WelcomeSection from '../components/WelcomeSection';
import EventCard from '../components/EventCard';

const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [allEvents, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await apiService.getAllEvents();
        setEvents(eventsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 🔹 Dynamic categories from backend enums
  const categories = [...new Set(allEvents.map((e) => e.category))];


  // 🔹 Apply search + category filter
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || event.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const navigate = useNavigate();

  const goToRegistrationPage = (eventId) => {
    navigate(`/register/${eventId}`);
  };

  // 🔹 EventsTab Component
  const EventsTab = () => {
    const SkeletonLoader = () => (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );

    if (loading) {
      return (
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Error loading events
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <WelcomeSection />

        {/* Filters and Browse Events */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div
              className="w-2 h-8 mr-4 rounded"
              style={{ backgroundColor: '#00809D' }}
            ></div>
            Browse Events
          </h2>
          <div className="flex space-x-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-opacity-75"
              style={{ borderColor: '#FFD700' }}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Available Events */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#00809D]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Available Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredEvents.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-[#00809D]" />
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FFD700]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredEvents.filter((e) => new Date(e.date) > new Date()).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-[#FFD700]" />
            </div>
          </div>

          {/* Most Popular Event */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#10B981]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Most Popular Event</p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  {filteredEvents.length > 0
                    ? filteredEvents.reduce((prev, current) =>
                      current.currentCapacity > prev.currentCapacity
                        ? current
                        : prev
                    ).eventName
                    : 'N/A'}
                </p>
              </div>
              <Star className="w-8 h-8 text-[#10B981]" />
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.eventId} event={event} onRegister={goToRegistrationPage} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex-1 p-6">{<EventsTab />}</main>
    </div>
  );
};

export default StudentDashboard;
