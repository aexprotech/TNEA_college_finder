import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CollegeFinder</h3>
                <p className="text-gray-400 text-sm">Tamil Nadu Engineering Colleges</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering Tamil Nadu students to discover the perfect engineering college 
              through comprehensive data, analytics, and personalized recommendations.
            </p>
            <div className="flex items-center text-gray-400">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              <span>Made for students, by students</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#search" className="text-gray-300 hover:text-white transition-colors">Search Colleges</a></li>
              <li><a href="#analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Admission Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cutoff Trends</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Placement Reports</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Scholarship Info</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Email Us</p>
                <p className="text-gray-300">support@collegefinder-tn.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Call Us</p>
                <p className="text-gray-300">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-gray-300">Chennai, Tamil Nadu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} CollegeFinder. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;