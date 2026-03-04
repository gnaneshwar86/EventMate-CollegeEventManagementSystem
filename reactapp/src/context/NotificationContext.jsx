import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, HelpCircle, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((type, title, message, onConfirm = null) => {
        setNotification({ type, title, message, onConfirm });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    const confirmAction = useCallback(() => {
        if (notification && notification.onConfirm) {
            notification.onConfirm();
        }
        hideNotification();
    }, [notification, hideNotification]);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            {notification && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                {notification.type === 'success' && (
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                )}
                                {notification.type === 'error' && (
                                    <div className="p-3 bg-red-100 rounded-full">
                                        <AlertCircle className="w-12 h-12 text-red-600" />
                                    </div>
                                )}
                                {notification.type === 'confirm' && (
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <HelpCircle className="w-12 h-12 text-blue-600" />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{notification.title}</h3>
                            <p className="text-gray-600 mb-8">{notification.message}</p>

                            <div className="flex gap-3">
                                {notification.type === 'confirm' ? (
                                    <>
                                        <button
                                            onClick={hideNotification}
                                            className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmAction}
                                            className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-[#00809D] hover:bg-[#006C82] transition-colors"
                                        >
                                            Confirm
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={hideNotification}
                                        className="w-full py-3 px-4 rounded-xl font-medium text-white bg-[#00809D] hover:bg-[#006C82] transition-colors"
                                    >
                                        Got it
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
