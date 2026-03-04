import React from "react";
import { Calendar, UserCheck, User, Bell } from "lucide-react";

function Sidebar({ studentInfo, activeTab, setActiveTab, registrations }) {
  return (
    <aside
      className="fixed top-[10vh] left-0 w-64 h-[90vh] bg-white shadow-lg z-50 overflow-y-auto"
    >
      <div className="p-6">

        {/* Navigation Menu */}
        <div className="space-y-2">
          {[
            { id: "events", label: "Browse Events", icon: Calendar },
            { id: "registrations", label: "My Registrations", icon: UserCheck },
            { id: "profile", label: "Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === id
                  ? "text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              style={
                activeTab === id
                  ? {
                      background: "linear-gradient(90deg, #00809D, #006B7A)",
                    }
                  : {}
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
              {id === "registrations" && (
                <span
                  className="ml-auto px-2 py-1 text-xs rounded-full"
                  style={{ backgroundColor: "#FFD700", color: "#00809D" }}
                >
                  {registrations.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
