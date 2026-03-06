import * as React from 'react';

interface OrderConfirmationProps {
  businessName: string;
}

export const OrderConfirmationEmail = ({ businessName }: OrderConfirmationProps) => (
  <div style={{
    fontFamily: 'Helvetica, Arial, sans-serif',
    backgroundColor: '#f9fafb',
    padding: '40px 20px'
  }}>
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <h1 style={{ color: '#111827', fontSize: '24px', fontWeight: 'bold' }}>Order Received!</h1>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '24px' }}>
        Hi there! We’ve received your order for <strong>{businessName}</strong>. 
      </p>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '24px' }}>
        Our design team is currently processing your custom flyer variations. You will receive an email with your high-resolution files within the next 48 hours.
      </p>
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Best,<br />
          <strong>Aretifi Team</strong><br />
          Aretifi.com
        </p>
      </div>
    </div>
  </div>
);
