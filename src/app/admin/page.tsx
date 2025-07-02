import React from 'react';
import { FileText, ShoppingCart, Tag } from 'lucide-react';
import { StatsCardProps } from '@/types'; 

// Mock imports - these would be actual component imports in a real application
// import Sidebar from './components/Sidebar';
// import Navbar from './components/Navbar';
// import ProductQuoteCard from './components/ProductQuoteCard';
// import AnalyticsDashboard from './components/AnalyticsDashboard';

// For demo purposes, I'll inline simplified versions

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, number, label, color = "green" }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer relative overflow-hidden">
    <div className={`absolute top-0 left-0 w-20 h-20 bg-${color}-100 rounded-full opacity-50 -translate-x-4 -translate-y-4`}></div>
    <div className="relative z-10">
      <div className="mb-4">
        <div className={`w-10 h-10 bg-${color}-600 rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mb-2">
        <h2 className={`text-3xl font-bold text-${color}-600`}>{number}</h2>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">{label}</span>
        <svg className={`w-4 h-4 text-${color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);

const CompleteDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Using the previously created Sidebar component */}
      <div className="flex-shrink-0">
        {/* <Sidebar /> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar - Using the previously created Navbar component */}
        {/* <Navbar /> */}
        

        {/* Dashboard Content */}
        <div className="flex-1 flex">
          {/* Main Dashboard Section */}
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatsCard icon={FileText} number="482" label="Product Quote" color="green" />
              <StatsCard icon={ShoppingCart} number="155" label="Rent & Buy" color="green" />
              <StatsCard icon={Tag} number="0" label="Rental" color="green" />
              <StatsCard icon={FileText} number="180" label="Specification" color="green" />
              <StatsCard icon={FileText} number="44" label="Get Catalogue" color="green" />
            </div>

            {/* Charts Section - Using the previously created AnalyticsDashboard component */}
            {/* <AnalyticsDashboard /> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Quote Chart */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Product Quote</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">June 2025</span>
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <span className="text-sm text-gray-500">Monthly</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-center space-x-2 p-4">
                  {[7, 9, 13, 7, 11, 4, 6, 12, 10].map((height, index) => (
                    <div key={index} className="bg-blue-300 rounded-t" style={{ height: `${height * 8}px`, width: '20px' }}></div>
                  ))}
                </div>
              </div>

              {/* Rent & Buy Chart */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Rent & Buy</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">June 2025</span>
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <span className="text-sm text-gray-500">Monthly</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-blue-600 font-semibold">Line Chart: 20 → 62</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry History Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Enquiry History</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="border-b border-gray-100 pb-4">
                  <h4 className="font-medium text-gray-900 mb-1">Username</h4>
                  <p className="text-sm text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteDashboard;