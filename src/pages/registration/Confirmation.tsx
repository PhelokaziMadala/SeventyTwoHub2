// src/pages/registration/Confirmation.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, Mail } from 'lucide-react';
import {finalizeRegistration} from '../../lib/confirmation.queries';
import { sendConfirmationEmail, sendAdminNotification } from '../../lib/emailService';
import type {FullRegistrationData} from '../../types/confirmation.types';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const [applicationNumber, setApplicationNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [registrationData, setRegistrationData] = useState<FullRegistrationData | null>(null);

  useEffect(() => {
    const submitRegistration = async () => {
      try {
        setIsSubmitting(true);
        const regData = JSON.parse(localStorage.getItem('registrationData') || '{}') as FullRegistrationData;
        setRegistrationData(regData);

        // Check if already submitted to prevent duplicates
        const existingApplication = localStorage.getItem('applicationData');
        if (existingApplication) {
          const appData = JSON.parse(existingApplication);
          setApplicationNumber(appData.applicationNumber);
          setUserEmail(regData.step1?.emailAddress || regData.step2?.emailAddress);
          setEmailSent(true);
          console.log('Registration already submitted, skipping duplicate submission');
          return;
        }

        // Add submission flag to prevent multiple simultaneous submissions
        const submissionFlag = localStorage.getItem('submissionInProgress');
        if (submissionFlag) {
          console.log('Submission already in progress, preventing duplicate');
          return;
        }
        localStorage.setItem('submissionInProgress', 'true');

        // Try to submit to backend
        if (!regData.step2) {
          throw new Error("Incomplete registration data");
        }

        const result = await finalizeRegistration(regData);
        setApplicationNumber(result.reference_number);
        
        // Store final application data with reference number
        localStorage.setItem('applicationData', JSON.stringify({
          ...regData,
          applicationNumber: result.reference_number,
          status: 'Pending Review',
          submittedAt: result.submitted_at
        }));

        // Clear registration data to prevent resubmission
        localStorage.removeItem('registrationData');

        // Send emails after successful registration
        const userEmailAddr = regData.step1?.emailAddress || regData.step2?.emailAddress;
        const fullName = regData.step1?.fullName || `${regData.step2?.firstName || ''} ${regData.step2?.lastName || ''}`.trim();
        setUserEmail(userEmailAddr);
        
        // Send both emails only once after successful registration
        try {
          // Send user confirmation email
          await sendConfirmationEmail({
            email: userEmailAddr,
            fullName: fullName,
            businessName: regData.step2.businessName,
            referenceNumber: result.reference_number,
            submittedAt: result.submitted_at
          });
          setEmailSent(true);
          console.log('User confirmation email sent successfully');
          
          // Send admin notification email
          await sendAdminNotification({
            applicantEmail: userEmailAddr,
            fullName: fullName,
            businessName: regData.step2.businessName,
            referenceNumber: result.reference_number,
            submittedAt: result.submitted_at,
            businessType: regData.step2.businessType,
            location: regData.step2.cityTownship
          });
          console.log('Admin notification email sent successfully');
          
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          setEmailSent(false);
        }
      
      } catch (error) {
        console.error('Critical error in confirmation page:', error);
        // Generate emergency fallback
        const emergencyRefNumber = `EMG-${Date.now()}`;
        setApplicationNumber(emergencyRefNumber);
      } finally {
        // Clear submission flag and set submitting to false
        localStorage.removeItem('submissionInProgress');
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

  const handleResendEmail = async () => {
    if (!registrationData?.step2 || !applicationNumber) return;
    
    setIsResending(true);
    try {
      const userEmailAddr = registrationData.step1?.emailAddress || registrationData.step2?.emailAddress;
      const fullName = registrationData.step1?.fullName || `${registrationData.step2?.firstName || ''} ${registrationData.step2?.lastName || ''}`.trim();
      
      await sendConfirmationEmail({
        email: userEmailAddr,
        fullName: fullName,
        businessName: registrationData.step2.businessName,
        referenceNumber: applicationNumber,
        submittedAt: new Date().toISOString()
      });
      
      alert('Confirmation email resent successfully!');
    } catch (error) {
      console.error('Error resending email:', error);
      alert('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
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

          {emailSent && userEmail && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 text-sm">
                    <strong>Confirmation email sent!</strong> We've sent a confirmation email with your reference number to <strong>{userEmail}</strong>
                  </p>
                </div>
                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="ml-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  title="Resend confirmation email"
                >
                  <Mail className="w-3 h-3" />
                  <span>{isResending ? 'Sending...' : 'Resend'}</span>
                </button>
              </div>
            </div>
          )}

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
              <a href="mailto:Phelokazi@hapogroup.co.za" className="text-primary-600 hover:text-primary-700">
                  Phelokazi@hapogroup.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;