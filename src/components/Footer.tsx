import React from 'react';
// import { Button } from "@/components/ui/button"; // Commented out as Button does not exist

interface FooterProps {
  onInfoClick: (type: string) => void;
  onFAQClick: () => void;
}

// Temporary fallback for Button until implemented
const Button: React.FC<any> = ({ children, ...props }) => (
  <button {...props} className={props.className}>{children}</button>
);

export const Footer: React.FC<FooterProps> = ({ onInfoClick, onFAQClick }) => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => onInfoClick('About Us')}
                >
                  About Us
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => onInfoClick('How it Works')}
                >
                  How it Works
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => onInfoClick('Contact')}
                >
                  Contact
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => window.open('#', '_blank')}
                >
                  Improvements & Updates
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => onInfoClick('Terms of Service')}
                >
                  Terms of Service
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => onInfoClick('Privacy Policy')}
                >
                  Privacy Policy
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => onInfoClick('Cookie Policy')}
                >
                  Cookie Policy
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => onInfoClick('Disclaimer')}
                >
                  Disclaimer
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => window.open('https://www.tneaonline.org/', '_blank')}
                >
                  TNEA Official
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => window.open('https://psychometrics.ischs.in/career-library/all/?channel_id=MjMzNQ==', '_blank')}
                >
                  Career Library
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={() => window.open('https://psychometrics.ischs.in/aexpro', '_blank')}
                >
                  Career Guidance
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white p-0 h-auto"
                  onClick={onFAQClick}
                >
                  FAQs
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            We believe every student deserves a chance to shine. Our team is here to guide you, every step of the way. Have questions? We’re always ready to help.
          </div>
          <div className="text-sm text-gray-400">
            Powered by real student stories and data—your future is bright!
          </div>
        </div>
      </div>
    </footer>
  );
};