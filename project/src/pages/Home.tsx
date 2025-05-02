import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, ChevronDown, Star } from 'lucide-react';
import { cars } from '../data/cars';
import { Car } from '../types';

const Home = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  
  // Get unique brands for filter
  const uniqueBrands = Array.from(new Set(cars.map(car => car.brand)));
  
  // Get unique fuel types for filter
  const uniqueFuelTypes = Array.from(new Set(cars.map(car => car.fuelType)));
  
  // Filter cars whenever filters change
  useEffect(() => {
    let result = [...cars];
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(car => 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply brand filter
    if (selectedBrand) {
      result = result.filter(car => car.brand === selectedBrand);
    }
    
    // Apply fuel type filter
    if (fuelTypeFilter) {
      result = result.filter(car => car.fuelType === fuelTypeFilter);
    }
    
    // Apply price filter
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      result = result.filter(car => car.pricePerDay >= min && car.pricePerDay <= max);
    }
    
    setFilteredCars(result);
  }, [searchTerm, selectedBrand, fuelTypeFilter, priceFilter]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Cars</h1>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by car name, brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            <span>Filters</span>
            <ChevronDown className={`h-5 w-5 ml-1 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Brand filter */}
            <div>
              <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <select
                id="brand-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            {/* Fuel type filter */}
            <div>
              <label htmlFor="fuel-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type
              </label>
              <select
                id="fuel-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={fuelTypeFilter}
                onChange={(e) => setFuelTypeFilter(e.target.value)}
              >
                <option value="">All Fuel Types</option>
                {uniqueFuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Price range filter */}
            <div>
              <label htmlFor="price-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (per day)
              </label>
              <select
                id="price-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="0-75">$0 - $75</option>
                <option value="75-100">$75 - $100</option>
                <option value="100-150">$100 - $150</option>
                <option value="150-250">$150 - $250</option>
                <option value="250-500">$250+</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Results count */}
      <p className="text-sm text-gray-600 mb-4">
        Showing {filteredCars.length} of {cars.length} cars
      </p>
      
      {/* Car grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCars.map(car => (
          <Link 
            to={`/car/${car.id}`} 
            key={car.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={car.image} 
                alt={car.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 m-2 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded">
                ${car.pricePerDay}/day
              </div>
              
              {/* Hover details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold">{car.name}</h3>
                <p className="text-white text-sm truncate">{car.description}</p>
                <div className="flex items-center mt-2 gap-2">
                  <span className="text-white text-xs bg-gray-700/60 rounded px-2 py-1">{car.fuelType}</span>
                  <span className="text-white text-xs bg-gray-700/60 rounded px-2 py-1">{car.seats} Seats</span>
                  <span className="text-white text-xs bg-gray-700/60 rounded px-2 py-1">{car.transmission}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{car.name}</h3>
                  <p className="text-sm text-gray-600">{car.brand} {car.model}, {car.year}</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700 ml-1">4.8</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-blue-600 font-bold">${car.pricePerDay} / day</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition">
                  View Details
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No cars match your search criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedBrand('');
              setFuelTypeFilter('');
              setPriceFilter('');
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;