// api.js - Full API service with JWT support
const BASE_URL =
  import.meta.env.VITE_BASE_URL ?? "http://localhost:8080/api";

  console.log("API BASE URL:", import.meta.env.VITE_BASE_URL);
  console.log("FINAL BASE URL:", BASE_URL);

class ApiService {
  // Helper method for making HTTP requests
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    // Convert body to JSON if it's an object
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error('Unauthorized or Forbidden. Token may be invalid/expired.');
        }

        // Read text body once
        const errorText = await response.text();
        let errorMessage = errorText || `HTTP error! status: ${response.status}`;

        // Try to parse as JSON to get a more specific message if available
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || (typeof errorData === 'string' ? errorData : errorMessage);
        } catch (e) {
          // If not JSON, use the raw text already stored in errorMessage
        }

        throw new Error(errorMessage);
      }


      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ---------------- Event API ----------------
  async getAllEvents() {
    return this.request('/events');
  }

  async getEventById(id) {
    return this.request(`/events/${id}`);
  }

  async createEvent(event) {
    return this.request('/events', { method: 'POST', body: event });
  }

  async updateEvent(id, event) {
    return this.request(`/events/${id}`, { method: 'PUT', body: event });
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, { method: 'DELETE' });
  }

  async getEventsByCategory(category) {
    return this.request(`/events/category/${category}`);
  }

  async getEventsByDepartment(department) {
    return this.request(`/events/department/${department}`);
  }

  async getUpcomingEvents() {
    return this.request('/events/upcoming');
  }

  async getAvailableEvents() {
    return this.request('/events/available');
  }

  // ---------------- Student API ----------------
  async getAllStudents() {
    return this.request('/students');
  }

  async getStudentById(id) {
    return this.request(`/students/${id}`);
  }

  async getStudentByEmail(email) {
    return this.request(`/students/email/${email}`);
  }

  async createStudent(student) {
    return this.request('/students', { method: 'POST', body: student });
  }

  async updateStudent(id, student) {
    return this.request(`/students/${id}`, { method: 'PUT', body: student });
  }

  async deleteStudent(id) {
    return this.request(`/students/${id}`, { method: 'DELETE' });
  }

  // ---------------- Registration API ----------------
  async getAllRegistrations() {
    return this.request('/registrations');
  }

  async getRegistrationById(id) {
    return this.request(`/registrations/${id}`);
  }

  async registerStudentForEvent(studentId, eventId) {
    return this.request(`/registrations/register/${studentId}/${eventId}`, { method: 'POST' });
  }

  async cancelRegistration(id) {
    return this.request(`/registrations/${id}`, { method: 'DELETE' });
  }

  async markAttendance(id, attended) {
    return this.request(`/registrations/${id}/attendance?attended=${attended}`, { method: 'PUT' });
  }

  async getStudentRegistrations(studentId) {
    return this.request(`/registrations/student/${studentId}`);
  }

  async getEventRegistrations(eventId) {
    return this.request(`/registrations/event/${eventId}`);
  }

  async getRegistrationsByEmail(email) {
    return this.request(`/registrations/email/${email}`);
  }

  // ---------------- Auth API ----------------
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  }

  async logout() {
    localStorage.removeItem('token');
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }
}

// Export a single instance
const apiService = new ApiService();
export default apiService;
