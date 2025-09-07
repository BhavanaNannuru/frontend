import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext'; // ✅ new import
import { format } from 'date-fns';
import { 
  Bell, 
  FileText, 
  CheckCircle, 
  Circle, 
  Search,
  Trash2,
  Clock,
  Info
} from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    toggleRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications(); // ✅ consume context

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  // ✅ filtering works directly on context notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || notification.type === filterType;
      const matchesRead = filterRead === 'all' || 
                         (filterRead === 'read' && notification.is_read) ||
                         (filterRead === 'unread' && !notification.is_read);
      
      return matchesSearch && matchesType && matchesRead;
    });
  }, [notifications, searchTerm, filterType, filterRead]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment-reminder':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'appointment-confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'test-results':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'general':
        return <Info className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment-reminder':
        return 'border-l-blue-500 bg-blue-50';
      case 'appointment-confirmed':
        return 'border-l-green-500 bg-green-50';
      case 'test-results':
        return 'border-l-purple-500 bg-purple-50';
      case 'general':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatNotificationType = (type: string) => {
    switch (type) {
      case 'appointment-reminder':
        return 'Appointment Reminder';
      case 'appointment-confirmed':
        return 'Appointment Confirmed';
      case 'test-results':
        return 'Test Results';
      case 'general':
        return 'General';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
       
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Notifications</h1>
              <p className="text-gray-600">
              Stay updated with your healthcare information
              {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
            )}
          </div>
        </div>
{notifications.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => n.type === 'appointment-confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Confirmations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {notifications.filter(n => n.type === 'medical-record-updated').length}
                </div>
                <div className="text-sm text-gray-600">Test Results</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <label htmlFor="typeFilter" className="sr-only">Filter by Type</label>
<select
  id="typeFilter"
  value={filterType}
  onChange={(e) => setFilterType(e.target.value)}
  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
  <option value="all">All Types</option>
  <option value="appointment-reminder">Appointment Reminders</option>
  <option value="appointment-confirmed">Confirmations</option>
  <option value="test-results">Test Results</option>
  <option value="general">General</option>
</select>

            <label htmlFor="readFilter" className="sr-only">Filter by Read Status</label>
<select
  id="readFilter"
  value={filterRead}
  onChange={(e) => setFilterRead(e.target.value)}
  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
  <option value="all">All Status</option>
  <option value="unread">Unread</option>
  <option value="read">Read</option>
</select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
                  !notification.is_read ? 'ring-2 ring-blue-100' : ''
                }`}
              >
                <div className={`border-l-4 rounded-l-xl ${getNotificationColor(notification.type)}`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-lg font-semibold ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {formatNotificationType(notification.type)}
                              </span>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className={`text-sm mb-3 ${
                            !notification.is_read ? 'text-gray-700' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                           {/* <p className="text-xs text-gray-500">
  {notification.createdAt
    ? format(new Date(notification.createdAt), 'MMM dd, yyyy • h:mm a')
    : 'Invalid date'}
</p> */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleRead(notification.id)}
                                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border transition-colors hover:bg-gray-50"
                                title={notification.is_read ? 'Mark as unread' : 'Mark as read'}
                              >
                                {notification.is_read ? (
                                  <>
                                    <Circle className="w-3 h-3 mr-1" />
                                    Mark Unread
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Mark Read
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 rounded-full border border-red-200 hover:bg-red-50 transition-colors"
                                title="Delete notification"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' || filterRead !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'You\'re all caught up! New notifications will appear here.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        
      </div>
    </div>
  );
};

export default NotificationsPage;
