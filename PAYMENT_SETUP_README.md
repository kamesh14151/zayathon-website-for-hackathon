# Payment System Setup Instructions

## Project Update

- This project has been revamped by AJ STUDIOZ.
- The public favicon/logo has been added at `public/favicon.png` (AJ STUDIOZ logo).

## Overview
The payment page has been successfully created with QR code display and file upload functionality. Here's what was implemented:

## Files Created/Modified

### 1. New Payment Page
- **File**: `src/pages/PaymentPage.tsx`
- **Features**:
  - Displays QR code image from `assets/QR.jpeg`
  - File upload for payment screenshots (JPEG, PNG) or PDFs
  - File validation (type and size < 5MB)
  - Uploads to Supabase Storage
  - Updates registration record with payment proof URL
  - Success animation and auto-redirect

### 2. Database Migration
- **File**: `supabase/migrations/20260204000000_add_payment_screenshot.sql`
- **Changes**:
  - Added `payment_screenshot` column to registrations table
  - Created `payments` storage bucket
  - Set up storage policies for public access

### 3. Registration Component Updated
- **File**: `src/components/Registration.tsx`
- **Changes**:
  - Added navigation import
  - Redirects to payment page after successful registration
  - Passes registration ID to payment page

### 4. Admin Panel Updated
- **File**: `src/pages/Admin.tsx`
- **Changes**:
  - Added payment_screenshot field to Registration interface
  - Updated CSV export to include payment status
  - Added visual indicator for paid registrations
  - Added "View Screenshot" link for payment proofs

### 5. App Routes Updated
- **File**: `src/App.tsx`
- **Changes**:
  - Added `/payment` route

## Setup Steps Required

### 1. Add QR Code Image
Make sure you have the QR code image at:
```
src/assets/QR.jpeg
```

### 2. Run Database Migration
You need to apply the migration to your Supabase database:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase Dashboard
# Go to SQL Editor and run the content of:
# supabase/migrations/20260204000000_add_payment_screenshot.sql
```

### 3. Create Storage Bucket in Supabase
If the migration doesn't automatically create the bucket:

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `payments`
3. Make it **public**
4. Set up the following policies:
   - SELECT: Public access
   - INSERT: Public access
   - UPDATE: Authenticated users
   - DELETE: Authenticated users

### 4. Environment Variables
Ensure your `.env` file has:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Zayathon <you@yourdomain.com>
DODO_WEBHOOK_SECRET=shared_secret_for_webhook_calls
PAYMENT_REMINDER_SECRET=shared_secret_for_reminder_endpoint
PAYMENT_REMINDER_MINUTES=45
```

Notes:
- `PAYMENT_REMINDER_SECRET` is optional. Set it if you want to protect `/api/payment-reminders` from unauthorized calls.
- `PAYMENT_REMINDER_MINUTES` is optional. If not set, it defaults to `45` minutes in code.
- If both are not set, reminders still run with default timing and without secret protection.

### 5. Apply Payment Lifecycle Migration
Run the migration below to support payment event tracking and reminders:

```bash
supabase db push
```

It includes `payment_status`, `dodo_payment_id`, `checkout_url`, and reminder timestamps.

### 6. Configure Dodo Webhook
Point Dodo webhook to:

```text
https://your-domain.com/api/dodo-webhook
```

Set the same secret in Dodo and `DODO_WEBHOOK_SECRET` so success/failure events can be processed securely.

### 7. Reminder Job
Vercel cron triggers:

```text
/api/payment-reminders
```

once per day at 09:00 UTC (configured in `vercel.json`) and sends reminder emails to users who entered checkout but have not paid.

Note:
- Vercel Hobby only allows daily cron execution.
- If you need reminders every 30 minutes, upgrade to Vercel Pro and change the cron expression back to `*/30 * * * *`.

## User Flow

1. **User Registration**:
   - User fills registration form
   - After successful submission, redirected to payment page
   - Registration ID passed via navigation state

2. **Payment Page**:
   - User sees QR code to scan and make payment
   - User uploads payment screenshot/PDF
   - File uploaded to Supabase Storage
   - Registration record updated with payment proof URL
   - Success message and redirect to home

3. **Admin Panel**:
   - Admin sees all registrations
   - Paid registrations show green badge with "Payment Received"
   - Admin can click "View Screenshot" to see payment proof
   - CSV export includes payment status

## File Upload Specifications

- **Allowed formats**: JPEG, JPG, PNG, PDF
- **Maximum size**: 5MB
- **Storage location**: Supabase Storage bucket `payments`
- **Naming convention**: `{registrationId}_{timestamp}.{extension}`

## Testing Checklist

- [ ] QR.jpeg image exists in src/assets/
- [ ] Database migration applied successfully
- [ ] Storage bucket `payments` created and public
- [ ] Registration form redirects to payment page
- [ ] File upload works (try JPEG, PNG, PDF)
- [ ] File size validation works (> 5MB rejected)
- [ ] Payment screenshot appears in admin panel
- [ ] View Screenshot link opens the uploaded file
- [ ] CSV export includes payment status

## Troubleshooting

### Image not displaying
- Check if `src/assets/QR.jpeg` exists
- Verify import path in PaymentPage.tsx

### Upload fails
- Check Supabase storage bucket exists and is public
- Verify storage policies are set correctly
- Check browser console for errors

### Registration ID missing
- Ensure registration form passes ID via navigation state
- Check that addRegistration returns the ID in result

### Admin panel not showing payment
- Verify migration added payment_screenshot column
- Check that upload successfully updated the database
- Refresh the admin panel after payment upload

## Security Notes

- Payment screenshots are stored in public bucket (readable by anyone with URL)
- Consider adding Row Level Security (RLS) if sensitive data
- File size limit prevents abuse
- Only specific file types are allowed
- Consider adding virus scanning for production
