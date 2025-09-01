import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoSvg from '../assets/seventytwo-logo.svg';
import standardBankImg from '../assets/Standard-Bank.jpg';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
      <div className="min-h-screen relative overflow-hidden group/page">
        {/* Background with tropical beach image */}
        <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
                           url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
        />

        {/* Navigation Header */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <img
                  src={logoSvg}
                  alt="SeventyTwo X Logo"
                  className="h-10 w-auto filter brightness-0 invert"
              />
            </div>
          </div>


          <div className="flex items-center space-x-4">
            <button
                onClick={() => navigate('/login')}
                className="bg-white text-green-800 px-4 py-2 rounded-md hover:bg-green-50 transition-colors font-medium"
            >
              LogIn
            </button>
            <button
                onClick={() => navigate('/register/account-validated')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Register My Business
            </button>
          </div>
        </nav>

        {/* Welcome Title */}
        <div className="relative z-10 px-8 pt-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-xl mb-6 opacity-90 font-bold text-cyan-300 text-left text-white">WELCOME TO STANDARD BANK TOWNSHIP BUSINESS DEVELOPMENT PROGRAMME</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center min-h-[calc(100vh-160px)] px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3 items-center">
            {/* Left side - Standard Bank Image */}
            <div className="relative max-w-sm">
              <img
                src={standardBankImg}
                alt="Standard Bank"
                className="w-full h-auto transform rotate-[-6deg]"
              />
            </div>

            {/* Right side - Content (wider, smaller fonts) */}
            <div className="text-white text-center lg:text-left lg:col-span-2">
              <h1 className="text-xl lg:text-2xl leading-tight mb-5 font-normal">
              Are you a registered township business owner <br />
              in the Gauteng Province that is willing to learn and 
grow? 
              </h1>
              <div className="mb-6">
                <p className="text-base opacity-90 mb-3 leading-relaxed">
                Join the Standard Bank 6-Week Township Business Development Programme today and 
                take the next step towards growing your business with expert guidance and mentorship.
                </p>

                {/* Scrollable content area */}
                <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10 pr-2">
                  <p className="text-sm opacity-90 mb-3 leading-relaxed">
                  Standard Bank Enterprise Development, in collaboration with the Gauteng Provincial Treasury, 
                  is excited to announce the return of the Gauteng Township Business Development Programme, 
                  in partnership with Classic Oriental Consultancy.

                  </p>

                  {/* Additional content can be added here */}
                  <p className="text-sm opacity-90 mb-3 leading-relaxed">
                  This 6-week programme is designed to equip 100 selected township-based businesses with critical business skills, mentorship, and practical tools to help them grow, thrive, and succeed in today's competitive environment.
                  </p>
                  
                  <div className="text-sm opacity-90 mb-3">
                    <p className="font-medium mb-2">Qualifying Criteria:</p>
                    <ul className="space-y-1 ml-4">
                      <li className="flex items-start">
                        <span className="text-blue-300 mr-2">•</span>
                        <span>Gauteng-based business</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-300 mr-2">•</span>
                        <span>The beneficiary must be a Black South African citizen, trading in South Africa</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-300 mr-2">•</span>
                        <span>51% or more Black-owned business</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-300 mr-2">•</span>
                        <span>The business must be registered on CSD and have a vendor number</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-300 mr-2">•</span>
                        <span>Business operational for 1 – 5 years</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-300 mr-2">•</span>
                        <span>Total Annual Revenue: R0 – R5 million</span>
                      </li>
                    </ul>
                  </div>

                  {/* Additional content can be added here */}
                  <div className="text-sm opacity-90 mb-3">
                    <p className="font-medium mb-2">Exclusions:</p>
                    <ul className="space-y-1 ml-4">
                      <li className="flex items-start">
                        <span className="text-green-300 mr-2">•</span>
                        <span>Non-Profit Organisations, NGOs, Co-operatives, and joint ventures</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-300 mr-2">•</span>
                        <span>Standard Bank staff members</span>
                      </li>
                    </ul>
                  </div>

                  
                  {/* Additional content can be added here */}
                  <div className="text-sm opacity-90 mb-3">
                    <p className="font-medium mb-2">Required Documents:</p>
                    <ul className="space-y-1 ml-4">
                      <li className="flex items-start">
                        <span className="text-purple-300 mr-2">•</span>
                        <span> CIPC Registration (Company Registration Documents)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-300 mr-2">•</span>
                        <span>Valid B-BBEE Certificate/Affidavit</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-300 mr-2">•</span>
                        <span>Certified Proof of ID</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-300 mr-2">•</span>
                        <span>Valid Tax Clearance Certificate (Optional)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-300 mr-2">•</span>
                        <span>Business Profile (Optional)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
  );
};

export default WelcomeScreen;