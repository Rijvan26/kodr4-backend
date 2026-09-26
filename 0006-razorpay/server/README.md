# Auth Backend + Razorpay Checkout

Express.js API (JavaScript, ESM) with MongoDB/Mongoose authentication and a Razorpay checkout demo.

## Install & Run

```bash
cd server
npm install
cp .env.example src/.env   # only needed if src/.env does not already exist
npm run dev             # start with node --watch
npm start                # run without watch
```

Open `http://localhost:5000/` to use the checkout page. The server loads environment variables from `src/.env`; keep Razorpay secrets there, never in frontend code. Use Razorpay test-mode credentials while developing.

The single-file checkout page lets you enter an amount from ₹1 to ₹10,00,000. It posts the amount to the server in paise; the server validates the range before creating the Razorpay order. For a real shop, look up the price from a trusted server-side product catalog instead of accepting a user-entered price.

## Vite Dev Proxy

No CORS is configured on this server. In your frontend's `vite.config.ts`, proxy API calls instead:

```ts
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
```

## Endpoints

All responses use the envelope:

```json
{ "success": true, "message": "...", "data": {} }
```

or

```json
{ "success": false, "message": "...", "errors": [{ "field": "email", "message": "..." }] }
```

### POST /api/v1/auth/register

Request:
```json
{ "name": "Ada Lovelace", "email": "ada@example.com", "password": "letmein123" }
```
Response (201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": { "user": { "id": "...", "name": "Ada Lovelace", "email": "ada@example.com" }, "accessToken": "..." }
}
```

### POST /api/v1/auth/login

Request:
```json
{ "email": "ada@example.com", "password": "letmein123" }
```
Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "user": { "id": "...", "name": "Ada Lovelace", "email": "ada@example.com" }, "accessToken": "..." }
}
```

### POST /api/v1/auth/refresh

Reads the httpOnly `refreshToken` cookie, rotates both tokens.

Response (200):
```json
{ "success": true, "message": "Token refreshed", "data": { "accessToken": "..." } }
```

### POST /api/v1/auth/logout

Response (200):
```json
{ "success": true, "message": "Logout successful", "data": {} }
```

### GET /api/v1/auth/me

Requires `Authorization: Bearer <accessToken>`.

Response (200):
```json
{ "success": true, "message": "Current user", "data": { "user": { "id": "...", "name": "Ada Lovelace", "email": "ada@example.com" } } }
```

### POST /api/v1/payments/create-order

Creates a Razorpay order. Send `amount` as an integer in paise; for example, ₹1,499 is `149900`:

```json
{ "amount": 149900 }
```

The response contains `data.order` and the public `data.key` used by Razorpay Checkout.

### POST /api/v1/payments/verify

Send the three fields returned by Razorpay Checkout's success handler: `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`. The server fetches the order, confirms its amount and currency, then validates the signature using `RAZORPAY_KEY_SECRET` before returning `data.status: "verified"`.

This demo verifies payments but does not persist orders or trigger fulfillment. Before using it for real sales, persist order/payment state and fulfill only after server-side verification.
