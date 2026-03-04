import React, { useState } from 'react';

export default function CollegeEventHomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'All', icon: '📚', color: 'bg-blue-500' },
    { name: 'Academic', icon: '🎓', color: 'bg-green-500' },
    { name: 'Sports', icon: '⚽', color: 'bg-orange-500' },
    { name: 'Cultural', icon: '🎭', color: 'bg-pink-500' },
    { name: 'Technical', icon: '💻', color: 'bg-purple-500' },
    { name: 'Business', icon: '💼', color: 'bg-slate-500' }
  ];

  const featuredEvents = [
    {
      id: 1,
      title: 'Annual Tech Symposium 2025',
      date: '2025-09-15',
      time: '10:00 AM',
      location: 'Main Auditorium',
      category: 'Technical',
      attendees: 250,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
      description: 'Join us for the biggest tech event of the year featuring industry experts and innovative projects.',
      featured: true
    },
    {
      id: 2,
      title: 'Cultural Fest - Expressions',
      date: '2025-08-28',
      time: '6:00 PM',
      location: 'College Ground',
      category: 'Cultural',
      attendees: 500,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=200&fit=crop',
      description: 'A vibrant celebration of arts, music, and dance showcasing student talents.',
      featured: true
    },
    {
      id: 3,
      title: 'Inter-College Basketball Championship',
      date: '2025-09-05',
      time: '9:00 AM',
      location: 'Sports Complex',
      category: 'Sports',
      attendees: 300,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop',
      description: 'Compete with the best teams from neighboring colleges in this exciting tournament.',
      featured: false
    },
    {
      id: 4,
      title: 'Startup Pitch Competition',
      date: '2025-09-20',
      time: '2:00 PM',
      location: 'Innovation Hub',
      category: 'Business',
      attendees: 150,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
      description: 'Present your innovative business ideas to industry experts and investors.',
      featured: false
    },
    {
      id: 5,
      title: 'Science Exhibition',
      date: '2025-09-10',
      time: '11:00 AM',
      location: 'Science Block',
      category: 'Academic',
      attendees: 200,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=200&fit=crop',
      description: 'Explore groundbreaking research projects and scientific innovations by students.',
      featured: false
    },
    {
      id: 6,
      title: 'Photography Workshop',
      date: '2025-08-30',
      time: '3:00 PM',
      location: 'Art Studio',
      category: 'Cultural',
      attendees: 80,
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=200&fit=crop',
      description: 'Learn professional photography techniques from renowned photographers.',
      featured: false
    }
  ];

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.name === category);
    return cat ? cat.color : 'bg-blue-500';
  };

  const filteredEvents = selectedCategory === 'All' 
    ? featuredEvents 
    : featuredEvents.filter(event => event.category === selectedCategory);

  const upcomingEvents = featuredEvents
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-600 to-yellow-500 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to CampusEvents
          </h1>
          <h2 className="text-2xl mb-4 opacity-90 font-normal">
            Discover and Join Amazing College Events
          </h2>
          <p className="text-lg mb-8 opacity-80 leading-relaxed">
            Your one-stop platform for managing college events. From academic conferences to cultural festivals, 
            sports tournaments to technical workshops - find and participate in events that matter to you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              className="bg-white text-blue-700 border-0 px-8 py-4 rounded font-bold cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setShowEventDialog(true)}
            >
              Browse Events
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-4 mt-8">
        {/* Upcoming Events Highlight */}
        <section className="bg-blue-50 rounded-lg p-8 mb-8 border-2 border-blue-500">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🔥 Upcoming This Week
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg p-6 border-2 border-blue-500 shadow-sm min-w-80 flex-shrink-0"
              >
                <div className="flex items-center mb-4 text-blue-700 font-bold">
                  📅 {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <h3 className="font-bold mb-2 text-lg">
                  {event.title}
                </h3>
                <div className="flex items-center mb-2 text-gray-600">
                  📍 {event.location}
                </div>
                <span className={`${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-sm`}>
                  {event.category}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Events */}
        <section>
          <h2 className="text-3xl font-bold mb-6">
            {selectedCategory === 'All' ? 'All Events' : `${selectedCategory} Events`}
          </h2>
          
          <div className="grid grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
              >
                {event.featured && (
                  <span className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    ⭐ Featured
                  </span>
                )}
                
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <h3 className="font-bold mb-4 text-xl">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2 text-gray-600">
                      📅 {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      📍 {event.location}
                    </div>
                    <div className="flex items-center mb-4 text-gray-600">
                      👥 {event.attendees} attendees
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-sm`}>
                      {event.category}
                    </span>
                    
                    <div className="flex gap-2">
                      <button className="bg-blue-700 text-white border-0 px-4 py-2 rounded cursor-pointer text-sm hover:bg-blue-800 transition-colors">
                        Register
                      </button>
                      <button className="bg-transparent text-blue-700 border-2 border-blue-700 px-4 py-2 rounded cursor-pointer text-sm hover:bg-blue-50 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 w-15 h-15 rounded-full bg-blue-700 text-white border-0 text-2xl cursor-pointer shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        onClick={() => setShowEventDialog(true)}
      >
        ➕
      </button>

      {/* Event Browser Dialog */}
      {showEventDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-11/12 max-h-4/5 overflow-auto">
            <h3 className="mb-4 text-xl font-bold">Browse Events</h3>
            
            <div className="mb-4">
              <label className="block mb-2 font-bold">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded text-base focus:border-blue-500 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-bold">
                Search Events
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for events..."
                className="w-full p-3 border-2 border-gray-300 rounded text-base focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <p className="text-gray-600 mb-6">
              Found {filteredEvents.length} events in {selectedCategory === 'All' ? 'all categories' : selectedCategory}
            </p>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowEventDialog(false)}
                className="bg-transparent text-gray-600 border-2 border-gray-300 px-6 py-3 rounded cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setShowEventDialog(false)}
                className="bg-blue-700 text-white border-0 px-6 py-3 rounded cursor-pointer hover:bg-blue-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}