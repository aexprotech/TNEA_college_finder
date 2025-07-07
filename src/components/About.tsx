import React from 'react';
import { Target, Users, TrendingUp, Heart, Award, MapPin } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Empowering Tamil Nadu's Future Engineers
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We're dedicated to bridging the information gap for students from Tier 2 and 3 cities, 
          ensuring every aspiring engineer has access to comprehensive college data and guidance.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed">
          To democratize access to engineering education information across Tamil Nadu, 
          helping students make informed decisions about their academic future through 
          data-driven insights, personalized recommendations, and comprehensive college profiles.
        </p>
      </div>

      {/* Problems We Solve */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Problems We Solve</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Information Overload</h4>
            <p className="text-gray-600">
              Traditional college websites and portals overwhelm students with complex navigation 
              and scattered information, making it difficult to find relevant details quickly.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Limited Exposure</h4>
            <p className="text-gray-600">
              Students from Tier 2 and 3 cities often lack awareness about quality engineering 
              colleges beyond their immediate vicinity, missing out on better opportunities.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Complex User Interfaces</h4>
            <p className="text-gray-600">
              Most existing platforms have cluttered designs and poor user experience, 
              making it challenging for students to navigate and find what they need.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Lack of Data-Driven Guidance</h4>
            <p className="text-gray-600">
              Students struggle to make informed decisions without access to comprehensive 
              analytics, placement statistics, and personalized recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Our Approach */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Approach</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Student-Centric Design</h4>
            <p className="text-gray-600">
              Our platform is designed with students in mind, featuring intuitive navigation, 
              clean interfaces, and mobile-friendly design for easy access anywhere.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Data-Driven Insights</h4>
            <p className="text-gray-600">
              We provide comprehensive analytics, placement statistics, and trend analysis 
              to help students make informed decisions about their engineering career.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Personalized Experience</h4>
            <p className="text-gray-600">
              Our AI-powered recommendation system personalizes college suggestions based on 
              student preferences, cutoff marks, and career goals.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Makes Us Different</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Location-Based Search</h4>
              <p className="text-gray-600 text-sm">Find colleges by district with detailed location insights</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Cutoff-Based Matching</h4>
              <p className="text-gray-600 text-sm">Get matched with colleges based on your marks and category</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
              <Award className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Quality Metrics</h4>
              <p className="text-gray-600 text-sm">NIRF rankings, accreditation, and placement data</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Analytics Dashboard</h4>
              <p className="text-gray-600 text-sm">Comprehensive insights and trends analysis</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Mobile Responsive</h4>
              <p className="text-gray-600 text-sm">Optimized for all devices, especially mobile</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-pink-100 p-2 rounded-lg flex-shrink-0">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Free to Use</h4>
              <p className="text-gray-600 text-sm">Complete access to all features at no cost</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Ready to Find Your Perfect College?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join thousands of students who have already discovered their ideal engineering college 
          through our comprehensive search and analytics platform.
        </p>
        <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors">
          Start Your Search Now
        </button>
      </div>
    </div>
  );
};

export default About;