import React from 'react';
import { SmartSearchResult } from '../lib/supabase';

interface CourseInsightsModalProps {
  college: SmartSearchResult;
  onClose: () => void;
}

const CourseInsightsModal: React.FC<CourseInsightsModalProps> = ({ college, onClose }) => {
  const getMatchTypeInfo = (matchType: string) => {
    switch (matchType) {
      case 'Perfect Match':
        return { color: 'bg-green-100 text-green-800 border-green-200' };
      case 'Very Close':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'Good Option':
        return { color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'Consider This':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {college.branch_name}
            </h3>
            <p className="text-gray-600">
              at {college.college_name} ({college.district})
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Cutoff Analysis */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">📊</span>
                Cutoff Analysis
              </h4>
              <div className="space-y-2">
                <p><span className="font-medium">Current Year:</span> {college.year}</p>
                <p><span className="font-medium">Cutoff Mark:</span> {college.cutoff_mark}</p>
                <p>
                  <span className="font-medium">Your Difference:</span> 
                  <span className={college.cutoffDifference <= 5 ? 'text-green-600' : 'text-orange-600'}>
                    {college.cutoffDifference > 0 ? '+' : ''}{college.cutoffDifference.toFixed(1)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Match Type:</span> 
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getMatchTypeInfo(college.matchType).color}`}>
                    {college.matchType}
                  </span>
                </p>
              </div>
            </div>
            
            {/* Rest of your modal sections... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInsightsModal;