import React from 'react';
import { MapPin, Star, TrendingUp, DollarSign, Users, Award, ExternalLink } from 'lucide-react';
import { College } from '../types';

interface CollegeCardProps {
  college: College;
  onClick: (college: College) => void;
  userCategory?: string;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college, onClick, userCategory = 'general' }) => {
  const getRelevantCutoff = () => {
    const course = college.courses[0]; // Show first course for card preview
    if (!course) return 0;
    
    switch (userCategory.toLowerCase()) {
      case 'obc': return course.cutoff.obc;
      case 'sc': return course.cutoff.sc;
      case 'st': return course.cutoff.st;
      default: return course.cutoff.general;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Government': return 'bg-green-100 text-green-800';
      case 'Private': return 'bg-blue-100 text-blue-800';
      case 'Aided': return 'bg-purple-100 text-purple-800';
      case 'Autonomous': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100 overflow-hidden"
      onClick={() => onClick(college)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{college.name}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{college.location}, {college.district}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(college.type)}`}>
              {college.type}
            </span>
            {college.nirf_ranking && (
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-700">NIRF #{college.nirf_ranking}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Cutoff</span>
            </div>
            <p className="text-lg font-bold text-blue-700">{getRelevantCutoff()}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Placement</span>
            </div>
            <p className="text-lg font-bold text-green-700">{college.placementRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Avg Package</p>
              <p className="text-sm font-semibold text-gray-700">{formatCurrency(college.averagePackage)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Total Seats</p>
              <p className="text-sm font-semibold text-gray-700">
                {college.courses.reduce((sum, course) => sum + course.seats, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {college.courses.slice(0, 2).map((course, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {course.name.split(' ').slice(0, 2).join(' ')}
            </span>
          ))}
          {college.courses.length > 2 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              +{college.courses.length - 2} more
            </span>
          )}
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
          <span>View Details</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CollegeCard;