# PawsFirst App Prototype

A mobile-first front-end app prototype for **PawsFirst**, a dog walking business in the Medway area.

This is a static app prototype built with plain HTML, CSS and JavaScript. It does not require React, Node, npm, a database or a backend to view.

## What is included

- Mobile-first app shell
- Client dashboard
- Booking request flow
- Dog profile management
- Schedule/calendar style view
- Invoice and payment status UI
- Private dog media gallery
- Messaging/check-in updates
- Owner/admin dashboard
- Admin media upload preview
- Admin bookings, clients, invoices and routes
- LocalStorage demo persistence
- PWA manifest for installable-app direction

## How to run locally

Open `index.html` in your browser.

For a better local dev preview, open the folder in VS Code and use the **Live Server** extension.

## Demo login

There is no real authentication yet. Use the role switcher on the login screen:

- **Client mode** shows a client app for a dog owner.
- **Owner mode** shows your mum's admin/owner dashboard.

## Important: front-end only

This prototype is designed to help you test the UX and app idea. For real use, you would need a backend for:

- Secure user accounts
- Private photo/video storage
- Real bookings and scheduling
- Real invoices
- Online payments
- Admin permissions
- GDPR-safe data handling

Recommended backend options later:

- Supabase for auth, database and file storage
- Firebase for auth, storage and notifications
- Stripe for payments
- Resend or SendGrid for email notifications
- Twilio or WhatsApp Business API for message reminders

## Suggested next build phase

1. Connect client login/auth.
2. Store dog profiles and bookings in a database.
3. Add admin approval for new booking requests.
4. Add private media uploads per dog.
5. Add Stripe payment links or invoices.
6. Add email/SMS booking confirmations.

