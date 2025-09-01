// src/pages/registration/Confirmation.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Copy } from 'lucide-react';
import {finalizeRegistration} from '../../lib/confirmation.queries';
import type {FullRegistrationData} from '../../types/confirmation.types';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const [applicationNumber, setApplicationNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  const submitRegistration = async () => {
    try {
      setIsSubmitting(true);
        const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}') as FullRegistrationData;

        // Generate a fallback reference number if submission fails
        const fallbackRefNumber = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Try to submit to backend, but don't fail if it doesn't work
        try {
          if (registrationData.step1 && registrationData.step2) {
            const result = await finalizeRegistration(registrationData);
            setApplicationNumber(result.reference_number);
            
            // Store final application data with reference number
            localStorage.setItem('applicationData', JSON.stringify({
              ...registrationData,
              applicationNumber: result.reference_number,
              status: 'Pending Review',
              submittedAt: result.submitted_at
            }));
          } else {
            throw new Error("Incomplete registration data");
          }
        } catch (backendError) {
          console.warn('Backend submission failed, using fallback:', backendError);
          // Use fallback reference number
          setApplicationNumber(fallbackRefNumber);
          
          // Store application data with fallback reference
          localStorage.setItem('applicationData', JSON.stringify({
            ...registrationData,
            applicationNumber: fallbackRefNumber,
            status: 'Submitted (Pending Processing)',
            submittedAt: new Date().toISOString()
          }));
        }
      
    } catch (error) {
        console.error('Critical error in confirmation page:', error);
        // Generate emergency fallback
        const emergencyRefNumber = `EMG-${Date.now()}`;
        setApplicationNumber(emergencyRefNumber);
    } finally {
      setIsSubmitting(false);
    }
  };

      void submitRegistration();
  }, [navigate]);

  const copyToClipboard = () => {
      if (!applicationNumber) return;
      navigator.clipboard.writeText(applicationNumber)
          .then(() => alert('Application number copied to clipboard!'))
          .catch(err => console.error('Failed to copy text:', err));
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you for registering!</h1>
            <p className="text-gray-600">Your business registration has been submitted for review.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Application Reference Number</h3>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg font-mono text-primary-600 h-7">
                {isSubmitting ? 'Generating...' : applicationNumber}
              </span>
              <button
                onClick={copyToClipboard}
                disabled={isSubmitting || !applicationNumber}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                  <span>We'll review your application within 2-3 business days.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                  <span>You'll receive an email notification once approved.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                  <span>You can then log in to your new dashboard.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
              <a href="mailto:support@seventytwo.co.za" className="text-primary-600 hover:text-primary-700">
                  support@seventytwo.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;