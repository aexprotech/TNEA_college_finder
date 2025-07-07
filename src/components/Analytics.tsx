import React from 'react';
import { BarChart3, TrendingUp, MapPin, Users, Award, Target } from 'lucide-react';
import { colleges } from '../data/colleges';

const Analytics: React.FC = () => {
  // Calculate analytics data
  const totalColleges = colleges.length;
  const avgPlacementRate = Math.round(
    colleges.reduce((sum, college) => sum + college.placementRate, 0) / totalColleges
  );
  const avgPackage = Math.round(
    colleges.reduce((sum, college) => sum + college.averagePackage, 0) / totalColleges / 100000
  );

  const locationStats = colleges.reduce((acc, college) => {
    acc[college.district] = (acc[college.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeStats = colleges.reduce((acc, college) => {
    acc[college.type] = (acc[college.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cutoffRanges = {
    'Very High (170+)': colleges.filter(c => 
      c.courses.some(course => course.cutoff.general >= 170)
    ).length,
    'High (150-169)': colleges.filter(c => 
      c.courses.some(course => course.cutoff.general >= 150 && course.cutoff.general < 170)
    ).length,
    'Medium (130-149)': colleges.filter(c => 
      c.courses.some(course => course.cutoff.general >= 130 && course.cutoff.general < 150)
    ).length,
    'Low (Below 130)': colleges.filter(c => 
      c.courses.some(course => course.cutoff.general < 130)
    ).length,
  };

  const formatCurrency = (amount: number) => `₹${amount}L`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Engineering Education Analytics
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Data-driven insights to help you make informed decisions about your engineering career in Tamil Nadu.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Colleges</p>
              <p className="text-3xl font-bold">{totalColleges}</p>
            </div>
            <Award className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Avg Placement Rate</p>
              <p className="text-3xl font-bold">{avgPlacementRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg Package</p>
              <p className="text-3xl font-bold">{formatCurrency(avgPackage)}</p>
            </div>
            <Target className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Districts Covered</p>
              <p className="text-3xl font-bold">{Object.keys(locationStats).length}</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* College Distribution by Location */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Colleges by District</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(locationStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([district, count]) => (
                <div key={district} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{district}</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-200 rounded-full h-2 w-20 relative">
                      <div 
                        className="bg-blue-600 rounded-full h-2 absolute"
                        style={{ width: `${(count / Math.max(...Object.values(locationStats))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-blue-600 w-8">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* College Type Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">College Types</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(typeStats).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{type}</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-green-200 rounded-full h-2 w-20 relative">
                    <div 
                      className="bg-green-600 rounded-full h-2 absolute"
                      style={{ width: `${(count / totalColleges) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-green-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cutoff Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="h-5 w-5 text-orange-600" />
          <h3 className="text-xl font-semibold text-gray-900">Cutoff Score Distribution</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(cutoffRanges).map(([range, count]) => (
            <div key={range} className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">{range}</h4>
              <p className="text-2xl font-bold text-orange-700">{count}</p>
              <p className="text-sm text-orange-600">colleges</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Insights for Students</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-blue-900 mb-3">📍 Geographic Distribution</h4>
            <p className="text-gray-700 mb-4">
              Chennai and Coimbatore have the highest concentration of engineering colleges, 
              offering more options but also more competition.
            </p>
            <p className="text-gray-700">
              Consider exploring opportunities in other districts like Madurai, Tiruchirappalli, 
              and Thanjavur for potentially better admission chances.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-green-900 mb-3">💼 Placement Trends</h4>
            <p className="text-gray-700 mb-4">
              The average placement rate across Tamil Nadu engineering colleges is {avgPlacementRate}%, 
              indicating good career prospects.
            </p>
            <p className="text-gray-700">
              Government colleges generally offer lower fees with competitive placement rates, 
              making them excellent value propositions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-orange-900 mb-3">🎯 Admission Strategy</h4>
            <p className="text-gray-700 mb-4">
              With varied cutoff ranges, students with scores between 130-150 have good options 
              across different college types.
            </p>
            <p className="text-gray-700">
              Consider applying to a mix of government and private colleges to maximize your admission chances.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-purple-900 mb-3">💰 Cost Analysis</h4>
            <p className="text-gray-700 mb-4">
              Government colleges offer significantly lower fees (₹45K-50K annually) compared to 
              private institutions (₹1.5L-2.5L annually).
            </p>
            <p className="text-gray-700">
              Factor in living costs, especially for colleges in metro cities like Chennai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;