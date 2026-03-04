import React, { useState } from 'react';
import { Mail, Search, Calendar, MapPin, X, Loader2, Ticket } from 'lucide-react';
import apiService from '../services/api';

const MyRegistrationsModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [registrations, setRegistrations] = useState(null);
    const [error, setError] = useState(null);

    const handleLookup = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError(null);
        try {
            const data = await apiService.getRegistrationsByEmail(email);
            setRegistrations(data);
            if (data.length === 0) {
                setError("No registrations found for this email.");
            }
        } catch (err) {
            setError(err.message || "Failed to fetch registrations.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#00809D] to-[#00B4D8] p-6 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Ticket className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">My Registrations</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8">
                    {!registrations ? (
                        <div className="text-center space-y-6">
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 italic text-blue-700">
                                Enter your registered email to view your event timeline and tickets.
                            </div>
                            <form onSubmit={handleLookup} className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="yourname@college.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-32 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#00809D] focus:outline-none transition-all text-lg"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#00809D] text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all flex items-center space-x-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                    <span>Find</span>
                                </button>
                            </form>
                            {error && <p className="text-red-500 font-medium">{error}</p>}
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-gray-600">Showing <span className="font-bold text-[#00809D]">{registrations.length}</span> registrations for <span className="font-bold">{email}</span></p>
                                <button onClick={() => setRegistrations(null)} className="text-sm text-[#00809D] font-bold hover:underline">Change Email</button>
                            </div>

                            <div className="space-y-4">
                                {registrations.map((reg) => (
                                    <div key={reg.registrationId} className="group p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#00809D] transition-all hover:shadow-lg">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00809D] transition-colors">{reg.event.eventName}</h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-2 text-[#00809D]" />
                                                        {new Date(reg.event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-2 text-[#00809D]" />
                                                        {reg.event.venue}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
                                                    Registered
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-2">ID: #{reg.registrationId}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRegistrationsModal;
