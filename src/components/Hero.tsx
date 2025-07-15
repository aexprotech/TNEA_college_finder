import React from 'react';
import { Search, TrendingUp, MapPin, Award } from 'lucide-react';

interface HeroProps {
  onStartSearch: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartSearch }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Not sure which college is right for you?
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              {' '}Let’s find out together!
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Just enter your marks and preferences—we’ll help you discover your best options, no matter your score. Every student has a place—let’s discover yours!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onStartSearch}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Find My Best Fit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-green-400 to-green-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Supportive Guidance</h3>
              <p className="text-blue-100">We use real student data to help you make smart, confident choices—no need to be a topper!</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-purple-400 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Place</h3>
              <p className="text-blue-100">See colleges near you or explore new places—there’s a great fit for everyone.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Future is Bright</h3>
              <p className="text-blue-100">We’re here to help you take the next step—your journey starts here!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;