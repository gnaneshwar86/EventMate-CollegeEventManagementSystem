import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import apiService from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const RegistrationPage = () => {

  const { eventId } = useParams();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    department: "",
    year: ""
  });
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await apiService.getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [eventId]);

  const getCategoryColor = (category) => {
    switch (category?.toUpperCase()) {
      case 'WORKSHOP': return '#E6F3F7';
      case 'SEMINAR': return '#FFF8E1';
      case 'CONFERENCE': return '#F4E6FF';
      case 'HACKATHON': return '#FFE6E6';
      case 'CULTURAL': return '#FFD9EC';
      case 'SPORTS': return '#E6FBF9';
      case 'TECHNICAL': return '#DFF5E1';
      case 'OTHER': return '#F8F9FA';
      default: return '#F8F9FA';
    }
  };

  const handleRegister = async () => {
    setError(null);
    if (!student.name || !student.email || !student.phoneNumber) {
      showNotification('error', 'Missing Information', "Please fill in all required fields!");
      return;
    }

    setRegistering(true);
    try {
      // Step 1: Create/Get Student
      const savedStudent = await apiService.createStudent(student);
      console.log("Student created/found:", savedStudent);

      // Step 2: Register Student for Event
      const registration = await apiService.registerStudentForEvent(
        savedStudent.studentId,
        eventId
      );

      console.log("Registration successful:", registration);
      showNotification('success', 'Registration Successful!', 'You have been successfully registered for the event.');
      setSuccess(true);
    } catch (error) {
      console.error(error);
      showNotification('error', 'Registration Failed', error.message || 'Registration failed!');
    } finally {
      setRegistering(false);
    }
  };



  const navigate = useNavigate();

  const onBack = () => {
    navigate(`/`);
  };
  // ✅ UI Rendering
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#DFF5E1' }}>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            You have successfully registered for <strong>{event?.eventName}</strong>
          </p>
          <button
            onClick={onBack}
            className="mt-6 w-full py-3 px-4 rounded-lg text-white bg-[#00809D] 
                      hover:bg-[#006C82] active:scale-95 transition duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <div className="w-2 h-10 mr-4 rounded" style={{ backgroundColor: '#00809D' }}></div>
            Event Registration
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Event Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4"
            style={{ borderLeftColor: getCategoryColor(event?.category) }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event?.eventName}</h2>
            <p className="text-gray-600 mb-4">{event?.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3" />
                {event?.date}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-3" />
                {event?.time}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3" />
                {event?.venue}
              </div>
              <div className="flex items-center text-gray-600">
                <BookOpen className="w-5 h-5 mr-3" />
                {event?.department}
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <UserCheck className="w-6 h-6 mr-2" style={{ color: '#00809D' }} />
              Registration Form
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Name of the Student"
                  value={student.name || ''}
                  onChange={(e) => setStudent({ ...student, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Email of the Student"
                  value={student.email || ''}
                  onChange={(e) => setStudent({ ...student, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Department</label>
                <input
                  type="text"
                  placeholder="Department of the Student"
                  value={student.department || ''}
                  onChange={(e) => setStudent({ ...student, department: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Academic Year</label>
                <input
                  type="text"
                  placeholder="Year"
                  value={student.year || ''}
                  onChange={(e) => setStudent({ ...student, year: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Contact Number *</label>
                <input
                  type="text"
                  value={student.phoneNumber || ''}
                  onChange={(e) => setStudent({ ...student, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Phone number"
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={registering || event?.currentCapacity >= event?.capacity}
                className={`
                  w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200
                  ${registering || event?.currentCapacity >= event?.capacity
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#00809D] hover:bg-[#006C82] active:scale-95'}
                `}
              >
                {registering
                  ? 'Processing...'
                  : event?.currentCapacity >= event?.capacity
                    ? 'Event Full'
                    : 'Complete Registration'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
