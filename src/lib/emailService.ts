// src/lib/emailService.ts

import emailjs from '@emailjs/browser';

// Define types for email data
interface ConfirmationEmailData {
  fullName: string;
  email: string;
  businessName: string;
  referenceNumber: string;
  submissionDate: string;
}

interface AdminNotificationData {
  fullName: string;
  email: string;
  businessName: string;
  referenceNumber: string;
  submissionDate: string;
}

/**
 * Sends confirmation email to user
 */
export const sendConfirmationEmail = async (emailData: ConfirmationEmailData): Promise<{ status: string; method: string }> => {
  try {
    console.log('=== EMAIL SENDING DEBUG ===');
    console.log('Email Data:', emailData);
    console.log('Environment variables check:');
    console.log('VITE_EMAILJS_SERVICE_ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID ? 'EXISTS' : 'MISSING');
    console.log('VITE_EMAILJS_TEMPLATE_ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID ? 'EXISTS' : 'MISSING');
    console.log('VITE_EMAILJS_PUBLIC_KEY:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? 'EXISTS' : 'MISSING');

    // Get EmailJS configuration
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      const templateParams = {
        to_email: emailData.email,
        to_name: emailData.fullName,
        business_name: emailData.businessName,
        reference_number: emailData.referenceNumber,
        submission_date: emailData.submissionDate
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log('✅ Confirmation email sent successfully via EmailJS');
      console.log('=== EMAIL DEBUG END ===');
      
      return { status: 'sent', method: 'emailjs' };
    } else {
      console.log('❌ EmailJS configuration missing');
      return { status: 'failed', method: 'config_missing' };
    }
    
  } catch (error) {
    console.error('Error in sendConfirmationEmail:', error);
    return { status: 'failed', method: 'error' };
  }
};

/**
 * Sends a notification email to admin when a new application is submitted
 */
export const sendAdminNotification = async (adminData: AdminNotificationData): Promise<void> => {
  try {
    // Check if admin email was already sent for this reference number
    const adminEmailSentKey = `admin_email_sent_${adminData.referenceNumber}`;
    if (localStorage.getItem(adminEmailSentKey)) {
      console.log('Admin notification already sent for reference:', adminData.referenceNumber);
      return;
    }

    console.log('Sending admin notification to hello@hapogroup.co.za');
    
    // Get EmailJS configuration
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    if (serviceId && adminTemplateId && publicKey) {
      // Send admin notification using separate template
      const adminTemplateParams = {
        to_email: 'hello@hapogroup.co.za',
        subject: `🚨 New Business Application - ${adminData.referenceNumber}`,
        applicant_name: adminData.fullName,
        applicant_email: adminData.email,
        business_name: adminData.businessName,
        reference_number: adminData.referenceNumber
      };
      
      console.log('Admin template params:', adminTemplateParams);
      await emailjs.send(serviceId, adminTemplateId, adminTemplateParams, publicKey);
      
      // Mark admin email as sent
      localStorage.setItem(adminEmailSentKey, 'true');
      console.log('Admin notification sent successfully to hello@hapogroup.co.za');
      
    } else {
      throw new Error('EmailJS admin configuration missing');
    }
    
  } catch (error) {
    console.error('Error sending admin notification:', error);
    // Don't throw error to prevent breaking user registration flow
  }
};
