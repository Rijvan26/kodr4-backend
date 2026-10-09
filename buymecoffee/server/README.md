# Backend Development

## Razorpay test webhook through ngrok

The backend listens on `PORT` (3000 by default). The registered webhook endpoint is:

```text
POST /api/payment/webhook
```

The webhook handler is mounted before JSON parsing and reads the raw request body for signature verification. It uses `RAZORPAY_WEBHOOK_SECRET`; this is separate from `RAZORPAY_KEY_SECRET`.

For each local webhook test:

1. Start the backend with `npm run dev`.
2. Start a tunnel to the configured backend port, for example `ngrok http 3000`.
3. Copy the current HTTPS forwarding URL from ngrok. Free ngrok URLs can change whenever a tunnel restarts.
4. In the Razorpay Dashboard's **Test Mode** webhook settings, set the URL to `<current-https-forwarding-url>/api/payment/webhook`.
5. Subscribe to `payment.captured` and `payment.failed`.
6. Set the Razorpay webhook secret in the backend's `RAZORPAY_WEBHOOK_SECRET` environment variable to the same secret saved in the Razorpay webhook configuration, then restart the backend.
7. Before making another payment, open the ngrok request inspector (normally `http://127.0.0.1:4040`) and confirm webhook requests reach the tunnel. In development, the backend logs receipt, event name, order ID, and payment ID; it never logs the signature or secrets.
8. After a test payment, confirm `payment.captured` appears in the inspector and backend output. The matching payment is looked up by Razorpay `order_id`, amount and currency are checked, and the stored status becomes `paid`.
9. Check the payment status endpoint and creator dashboard after the webhook has been accepted.

A successful local request to the handler does not prove that Razorpay's Dashboard points to the current tunnel. Update the Dashboard URL whenever ngrok issues a new forwarding URL.

`CORS_ORIGINS` is for browser-to-backend requests only. It does not control Razorpay's server-to-server webhook request. If the frontend is opened through a tunnel, add that exact browser origin to `CORS_ORIGINS`; set the frontend's `VITE_API_URL` to a backend URL reachable by that browser as well.
