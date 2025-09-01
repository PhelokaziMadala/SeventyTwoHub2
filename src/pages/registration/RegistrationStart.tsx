import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, Building, Upload, Send } from 'lucide-react';

const RegistrationStart: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: 'Business Information',
      description: 'Provide your business details and contact information',
      icon: Building,
      path: '/register/business'
    },
    {
      number: 2,
      title: 'Supporting Documents',
      description: 'Upload required documents and certificates',
      icon: Upload,
      path: '/register/documents'
    },
    {
      number: 3,
      title: 'Select Programs',
      description: 'Choose the training programs you want to join',
      icon: FileText,
      path: '/register/application-type'
    },
    {
      number: 4,
      title: 'Review & Submit',
      description: 'Review your application and submit',
      icon: Send,
      path: '/register/confirmation'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/welcome')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 ml-4">Business Registration</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Application</h2>
            <p className="text-gray-600">
              Complete your business registration in 4 simple steps to join the Standard Bank Township Business Development Programme.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className="w-5 h-5 text-primary-600" />
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Before You Start</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure you have your business registration documents ready</li>
              <li>• Prepare your B-BBEE certificate or affidavit</li>
              <li>• Have your ID document and business profile available</li>
              <li>• Review the program requirements and deadlines</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/welcome')}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Welcome
            </button>
            <button
              onClick={() => navigate('/register/business')}
              className="flex-1 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Start Registration
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Need assistance with your application?</p>
          <p className="text-xs text-gray-500">
            Contact us at{' '}
            <a href="mailto:support@seventytwo.co.za" className="text-primary-600 hover:text-primary-700">
              support@seventytwo.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStart;
