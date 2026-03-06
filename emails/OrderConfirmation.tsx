import * as React from 'react';

interface EmailProps {
  businessName: string;
  trade: string;
}

export const OrderConfirmationEmail = ({ businessName, trade }: EmailProps) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
    <h1 style={{ color: '#2563eb' }}>Order Received!</h1>
    <p>Hi there,</p>
    <p>Thanks for choosing us! We've received your order for <strong>{businessName}</strong>.</p>
    <p>Our design team is currently crafting your 5 premium <strong>{trade}</strong> flyer variations based on your style preferences.</p>
    <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
    <p style={{ fontSize: '14px', color: '#666' }}>
      <strong>Next Steps:</strong> You will receive a follow-up email with your high-resolution files within 48 hours.
    </p>
    <p>Best,<br /><strong>Josh</strong><br />Founder, Apex Flyers</p>
  </div>
);
