import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Users, Fuel, GitBranch, Check, AlertTriangle } from 'lucide-react';
import { cars } from '../data/cars';
import { useCart } from '../contexts/CartContext';
import { format, addDays } from 'date-fns';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const car = cars.find(car => car.id === Number(id));
  
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  
  // Reset form state when car changes
  useEffect(() => {
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
    setEndDate(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
    setBookingError('');
  }, [id]);
  
  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Car Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the car you're looking for.</p>
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Cars
        </button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      setBookingError('Please select both start and end dates');
      return;
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time portion for comparison
    
    if (start < today) {
      setBookingError('Start date cannot be in the past');
      return;
    }
    
    if (end <= start) {
      setBookingError('End date must be after start date');
      return;
    }
    
    setIsSubmitting(true);
    setBookingError('');
    
    // Simulate API delay
    setTimeout(() => {
      try {
        addToCart(car, startDate, endDate);
        navigate('/cart');
      } catch (error) {
        console.error('Error adding to cart:', error);
        setBookingError('Something went wrong. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };
  
  // Calculate price preview
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const totalDays = calculateDays();
  const totalPrice = car.pricePerDay * totalDays;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate('/home')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back to Cars
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Car image */}
          <div className="h-64 sm:h-80 lg:h-full overflow-hidden">
            <img 
              src={car.image} 
              alt={car.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Car details */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="mr-4">{car.brand}</span>
              <span className="mr-4">{car.model}</span>
              <span>{car.year}</span>
            </div>
            
            <p className="text-gray-700 mb-6">{car.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md">
                <Fuel size={24} className="text-blue-600 mb-1" />
                <span className="text-sm font-medium">{car.fuelType}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md">
                <GitBranch size={24} className="text-blue-600 mb-1" />
                <span className="text-sm font-medium">{car.transmission}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md">
                <Users size={24} className="text-blue-600 mb-1" />
                <span className="text-sm font-medium">{car.seats} Seats</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md">
                <Calendar size={24} className="text-blue-600 mb-1" />
                <span className="text-sm font-medium">Year {car.year}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              
              {bookingError && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                  <p>{bookingError}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    min={format(new Date(), 'yyyy-MM-dd')}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Price calculation */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price per day:</span>
                  <span className="font-medium">${car.pricePerDay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Number of days:</span>
                  <span className="font-medium">{totalDays}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="text-blue-600 font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isSubmitting || totalDays === 0}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  'Adding to Cart...'
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;