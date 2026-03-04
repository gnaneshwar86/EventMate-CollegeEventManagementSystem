import React, { useState } from "react";
import { Calendar, Ticket } from "lucide-react";
import MyRegistrationsModal from "./MyRegistrationsModal";

function WelcomeSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date();
  const hours = today.getHours();
  let greeting = "Welcome";

  if (hours < 12) greeting = "Good Morning";
  else if (hours < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return (
    <>
      <div className="bg-gradient-to-r from-[#00809D] to-[#00B4D8] rounded-2xl shadow-xl p-10 mb-8 flex items-center justify-between text-white relative overflow-hidden">
        <div className="relative z-10 w-full md:w-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold">{greeting}!</h1>
          <p className="text-lg md:text-xl mt-3 opacity-90">
            Explore the latest events and updates below.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center space-x-2 bg-white text-[#00809D] px-6 py-3 rounded-xl font-bold hover:bg-[#FFD700] hover:text-[#00809D] transition-all shadow-lg group"
          >
            <Ticket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Already Registered? View My Events</span>
          </button>
        </div>
        <div className="hidden md:flex items-center relative z-10">
          <Calendar className="w-20 h-20 opacity-80" />
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[-20px] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <MyRegistrationsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default WelcomeSection;
