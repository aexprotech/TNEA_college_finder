import React from 'react';
import { 
  X, MapPin, Star, TrendingUp, DollarSign, Users, Award, 
  ExternalLink, Phone, Mail, Calendar, Building, Wifi,
  Book, Car, Coffee, Dumbbell
} from 'lucide-react';
import { College } from '../types';

interface CollegeModalProps {
  college: College | null;
  isOpen: boolean;
  onClose: () => void;
  userCategory?: string;
}

const CollegeModal: React.FC<CollegeModalProps> = ({ 
  college, 
  isOpen, 
  onClose, 
  userCategory = 'general' 
}) => {
  if (!isOpen || !college) return null;

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakhs`;
    }
    return `₹${(amount / 1000).toFixed(0)} Thousands`;
  };

  const getCutoffForCategory = (course: any) => {
    switch (userCategory.toLowerCase()) {
      case 'obc': return course.cutoff.obc;
      case 'sc': return course.cutoff.sc;
      case 'st': return course.cutoff.st;
      default: return course.cutoff.general;
    }
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'library': return Book;
      case 'hostel': return Building;
      case 'wi-fi': case 'wifi': return Wifi;
      case 'cafeteria': return Coffee;
      case 'sports complex': case 'sports': return Dumbbell;
      case 'sports ground': return Dumbbell;
      default: return Building;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{college.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{college.location}, {college.district}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Est. {college.established}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  college.type === 'Government' ? 'bg-green-100 text-green-800' :
                  college.type === 'Private' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {college.type}
                </span>
                {college.nirf_ranking && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    NIRF #{college.nirf_ranking}
                  </span>
                )}
                {college.accreditation.map((acc, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {acc}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Placement Rate</span>
                  <span className="font-semibold text-green-600">{college.placementRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Package</span>
                  <span className="font-semibold">{formatCurrency(college.averagePackage)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Highest Package</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(college.highestPackage)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Courses</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {college.courses.map((course, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{course.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Duration: </span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Seats: </span>
                      <span className="font-medium">{course.seats}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cutoff ({userCategory}): </span>
                      <span className="font-medium text-blue-600">{getCutoffForCategory(course)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fees: </span>
                      <span className="font-medium">{formatCurrency(course.fees)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Facilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {college.facilities.map((facility, index) => {
                const IconComponent = getFacilityIcon(facility);
                return (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{facility}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{college.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{college.contact.email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <p className="font-medium">{college.contact.address}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Visit Website</span>
            </a>
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeModal;