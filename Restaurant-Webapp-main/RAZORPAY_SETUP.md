# Razorpay Integration Setup

This document provides instructions on setting up Razorpay payment integration for the EatsHub food delivery app.

## Prerequisites

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from the Razorpay Dashboard

## Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=8085
MONGO_URI=mongodb://localhost:27017/food-app
JWT_SECRET=your-jwt-secret-key
FRONTEND_URL=http://localhost:5173

# Razorpay credentials
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

Replace the placeholders with your actual Razorpay credentials:

- `RAZORPAY_KEY_ID`: Your Razorpay API Key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay API Key Secret
- `RAZORPAY_WEBHOOK_SECRET`: Your Razorpay Webhook Secret (create this in the Razorpay Dashboard)

## Setting up Razorpay Webhooks

1. Log in to your Razorpay Dashboard
2. Go to Settings > Webhooks
3. Click on "Add New Webhook"
4. Enter your webhook URL: `https://your-backend-url.com/api/v1/order/webhook`
5. Select events to track: `payment.captured`, `payment.failed`
6. Create a webhook secret and add it to your `.env` file as `RAZORPAY_WEBHOOK_SECRET`

## Testing the Integration

1. Start your backend server:
   ```
   npm run dev
   ```

2. Start your frontend:
   ```
   cd client && npm run dev
   ```

3. Use Razorpay test cards for testing:
   - Card Number: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name

## Troubleshooting

If you encounter any issues:

1. Check that your Razorpay credentials are correct
2. Ensure the webhook URL is accessible from the internet (use ngrok for local testing)
3. Check the server logs for any error messages
4. Verify that the Razorpay script is loading correctly in the browser

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Testing Guide](https://razorpay.com/docs/payments/payments/test-card-details/) 