import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Box, Alert, CircularProgress } from '@mui/material';

const PayPalCheckout = ({ 
  amount, 
  currency = 'USD', 
  onSuccess, 
  onError, 
  onCancel,
  disabled = false,
  tourTitle = '',
  numberOfPeople = 1
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = (data, actions) => {
    setLoading(true);
    setError(null);
    
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: currency,
          },
          description: `Green Path Bookings - ${tourTitle} for ${numberOfPeople} ${numberOfPeople === 1 ? 'person' : 'people'}`,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      setLoading(false);
      
      if (details.status === 'COMPLETED') {
        // Pass payment details to parent component
        onSuccess({
          paymentId: details.id,
          payerId: details.payer.payer_id,
          paymentStatus: details.status,
          amount: details.purchase_units[0].amount.value,
          currency: details.purchase_units[0].amount.currency_code,
          paymentMethod: 'paypal',
          transactionDetails: details,
        });
      } else {
        throw new Error('Payment not completed');
      }
    } catch (error) {
      setLoading(false);
      setError('Payment processing failed. Please try again.');
      onError(error);
    }
  };

  const onErrorHandler = (error) => {
    setLoading(false);
    setError('Payment failed. Please try again.');
    onError(error);
  };

  const onCancelHandler = (data) => {
    setLoading(false);
    setError(null);
    onCancel(data);
  };

  if (disabled) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Alert severity="info">
          Please select the number of people to continue with payment
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancelHandler}
        disabled={loading || disabled}
      />
    </Box>
  );
};

export default PayPalCheckout;