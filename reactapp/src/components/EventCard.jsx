// src/components/EventCard.jsx
import React from "react";
import { Calendar, Clock, MapPin, BookOpen, Users, UserCheck } from "lucide-react";

const getCategoryColor = (category) => {
  switch (category?.toUpperCase()) {
    case "WORKSHOP":
      return "#E6F3F7";
    case "SEMINAR":
      return "#FFF8E1";
    case "CONFERENCE":
      return "#F4E6FF";
    case "HACKATHON":
      return "#FFE6E6";
    case "CULTURAL":
      return "#FFD9EC";
    case "SPORTS":
      return "#E6FBF9";
    case "TECHNICAL":
      return "#DFF5E1";
    case "OTHER":
      return "#F8F9FA";
    default:
      return "#F8F9FA";
  }
};

const EventCard = ({ event, onRegister, showActions = true }) => (
  <div
    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-b-4 group overflow-hidden flex flex-col h-full"
    style={{ borderBottomColor: getCategoryColor(event.category) }}
  >
    {/* Header with Icon and Category */}
    <div className="p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: getCategoryColor(event.category) }}
        >
          <Calendar className="w-7 h-7 text-gray-800" />
        </div>
        <span
          className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-700 shadow-sm"
          style={{ backgroundColor: getCategoryColor(event.category) }}
        >
          {event.category}
        </span>
      </div>

      <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#00809D] transition-colors line-clamp-1">
        {event.eventName}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">
        {event.description}
      </p>
    </div>

    {/* Content */}
    <div className="px-6 py-4 bg-gray-50/50 flex-grow border-y border-gray-100/50">
      <div className="grid grid-cols-2 gap-y-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-[#00809D]" />
          <span className="font-medium">{event.date}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-[#00809D]" />
          <span className="font-medium">{event.time}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-[#00809D]" />
          <span className="font-medium truncate">{event.venue}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <BookOpen className="w-4 h-4 mr-2 text-[#00809D]" />
          <span className="font-medium truncate">{event.department}</span>
        </div>
      </div>
    </div>

    {/* Footer with Capacity and Action */}
    <div className="p-6 mt-auto">
      <div className="flex flex-col space-y-4">
        {/* Capacity Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tighter">
            <span>Availability</span>
            <span>{event.currentCapacity} / {event.capacity} Filled</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(event.currentCapacity / event.capacity) * 100}%`,
                backgroundColor: "#FFD700",
              }}
            ></div>
          </div>
        </div>

        {showActions && (
          <button
            onClick={() => onRegister(event.eventId)}
            disabled={event.currentCapacity >= event.capacity}
            className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 ${event.currentCapacity >= event.capacity
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "text-white hover:opacity-90 hover:shadow-[#00809D]/20 animate-in fade-in slide-in-from-bottom-2"
              }`}
            style={
              event.currentCapacity < event.capacity
                ? { backgroundColor: "#00809D" }
                : {}
            }
          >
            {event.currentCapacity >= event.capacity ? (
              <span>Registration Full</span>
            ) : (
              <>
                <UserCheck className="w-5 h-5" />
                <span>Secure My Spot</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  </div>
);

export default EventCard;
