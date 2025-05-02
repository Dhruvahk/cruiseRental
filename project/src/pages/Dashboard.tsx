import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Filter, 
  ChevronDown, 
  AlertTriangle, 
  Check, 
  X, 
  ShoppingCart 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Booking } from '../types';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    // Load bookings from localStorage
    const fetchBookings = () => {
      setLoading(true);
      try {
        const storedBookings = localStorage.getItem('bookings');
        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // Filter bookings based on status
  const filteredBookings = statusFilter
    ? bookings.filter(booking => booking.status === statusFilter)
    : bookings;
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check size={14} className="mr-1" />;
      case 'pending':
        return <Clock size={14} className="mr-1" />;
      case 'completed':
        return <Check size={14} className="mr-1" />;
      case 'cancelled':
        return <X size={14} className="mr-1" />;
      default:
        return null;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h1>
          <p className="text-gray-600 mb-6">You haven't made any car rental bookings yet.</p>
          <Link 
            to="/home"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
          >
            <ShoppingCart size={18} className="mr-2" />
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage and view your car rental bookings</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredBookings.length}</span> of <span className="font-medium">{bookings.length}</span> bookings
          </p>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-gray-700 hover:text-gray-900"
          >
            <Filter size={18} className="mr-1" />
            Filters
            <ChevronDown size={18} className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${!statusFilter ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter('cancelled')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Cancelled
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Bookings list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredBookings.map((booking) => (
            <li key={booking.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 lg:mb-0">
                  <img
                    src={booking.car.image}
                    alt={booking.car.name}
                    className="w-full sm:w-48 h-32 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6"
                  />
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-bold text-gray-900 mr-3">{booking.car.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {booking.car.brand} {booking.car.model}, {booking.car.year}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        <span>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{booking.totalDays} days</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-start lg:items-end">
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Booking ID:</span>
                    <span className="ml-2 font-medium">#{booking.id}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="ml-2 font-medium">{formatDate(booking.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-lg font-bold text-blue-600">
                    <CreditCard size={20} className="mr-2" />
                    ${booking.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                <Link
                  to={`/car/${booking.car.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  View Car
                </Link>
                {booking.status === 'confirmed' && (
                  <button className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none">
                    Cancel Booking
                  </button>
                )}
                {booking.status === 'completed' && (
                  <button className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none">
                    Leave Review
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;