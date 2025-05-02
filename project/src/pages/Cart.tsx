import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Check, CreditCard, ChevronLeft, AlertTriangle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { format, parseISO } from 'date-fns';
import { Booking } from '../types';

// Function to generate a mock booking ID
const generateBookingId = (): number => {
  return Math.floor(Math.random() * 1000000);
};

const Cart = () => {
  const { cartItems, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Create new bookings from cart items
        const newBookings: Booking[] = cartItems.map(item => ({
          id: generateBookingId(),
          userId: 1, // Hardcoded for demo
          car: item.car,
          startDate: item.startDate,
          endDate: item.endDate,
          totalDays: item.totalDays,
          totalPrice: item.totalPrice,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }));
        
        // Save bookings to localStorage
        const existingBookings = localStorage.getItem('bookings');
        const allBookings = existingBookings 
          ? [...JSON.parse(existingBookings), ...newBookings] 
          : newBookings;
        
        localStorage.setItem('bookings', JSON.stringify(allBookings));
        
        // Update state
        setBookings(newBookings);
        setOrderComplete(true);
        clearCart();
      } catch (error) {
        console.error('Error processing checkout:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  };
  
  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your car rental bookings have been successfully confirmed.</p>
          </div>
          
          <div className="border rounded-md divide-y divide-gray-200 mb-6">
            {bookings.map(booking => (
              <div key={booking.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <img 
                      src={booking.car.image} 
                      alt={booking.car.name} 
                      className="w-16 h-12 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.car.name}</h3>
                      <p className="text-sm text-gray-600">{booking.car.brand} {booking.car.model}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-sm font-medium text-gray-900">Booking #{booking.id}</span>
                    <span className="text-sm text-gray-600">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-semibold text-gray-900">${booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/home')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition"
            >
              Browse More Cars
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any cars to your cart yet.</p>
          <Link 
            to="/home"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
          >
            <ChevronLeft size={18} className="mr-1" />
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="text-gray-600">{cartItems.length} item(s)</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.car.id} className="p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <img
                        src={item.car.image}
                        alt={item.car.name}
                        className="w-full md:w-48 h-32 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{item.car.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.car.brand} {item.car.model}, {item.car.year}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Calendar size={16} className="mr-1" />
                            <span>
                              {formatDate(item.startDate)} - {formatDate(item.endDate)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 md:text-right">
                          <div className="text-sm text-gray-600 mb-1">
                            ${item.car.pricePerDay.toFixed(2)} × {item.totalDays} days
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            ${item.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <Link 
                          to={`/car/${item.car.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.car.id)}
                          className="flex items-center text-sm text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4">
            <Link
              to="/home"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft size={18} className="mr-1" />
              Continue browsing
            </Link>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="mb-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between py-3 font-bold">
                <span>Total</span>
                <span className="text-blue-600">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
              <div className="flex items-start">
                <AlertTriangle size={20} className="flex-shrink-0 mr-2 text-yellow-500" />
                <p className="text-sm text-yellow-700">
                  This is a demo application. No actual payment will be processed.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard size={18} className="mr-2" />
                  Complete Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;