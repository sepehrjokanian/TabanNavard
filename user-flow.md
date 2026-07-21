# User Flow — Taban Elevator

## 1. Public Visitor Flow

```
Landing Page (Hero)
 ├─ Scroll → About/History → Founder → Products preview → Certificates → Contact
 ├─ Nav: Home / Products / About / Certificates / Contact (RTL nav, sticky)
 │
 ├─→ Products Page
 │     ├─ Filter (category: elevator/part, price range, specs)
 │     ├─ Product Grid (placeholder images, name, short desc, price/"contact for price")
 │     └─→ Product Detail Page
 │           ├─ Full description, specs table, image gallery (placeholder)
 │           └─→ "Request a Quote" CTA → Inquiry Form (pre-filled with product name)
 │
 ├─→ Contact Page / Section
 │     ├─ Contact form (name, phone, email, message) → creates Inquiry (status: new)
 │     ├─ WhatsApp / phone / address / map
 │
 └─→ Certificates Section (gallery/lightbox view)
```

### Inquiry Submission Flow
1. Visitor fills "Request a Quote" (from product page) or general Contact form
2. Client-side validation (required fields, phone format)
3. Submit → API route → stored in DB with `status = new`, `source = product|contact`
4. Confirmation message shown to user (Farsi, friendly, sets expectation of callback)
5. (Optional future) email/SMS notification to admin

## 2. Admin Flow

```
/admin/login
 └─ Email + password → session (auth cookie)
      │
      ├─→ /admin/dashboard
      │     ├─ Summary: total products, new inquiries count, recent activity
      │
      ├─→ /admin/products
      │     ├─ List (search/filter) → Create / Edit / Delete
      │     └─ Product form: title, category, price, description, specs (key-value), images (placeholder/upload), status (active/hidden)
      │
      ├─→ /admin/inquiries
      │     ├─ List (filter by status) 
      │     ├─ Detail view → change status (new → contacted → closed), add internal notes
      │
      ├─→ /admin/content  (lightweight CMS)
      │     ├─ Company history text
      │     ├─ Founder bio/photo
      │     └─ Contact info (phone/address/map link)
      │
      └─→ /admin/certificates
            └─ (v1: static list shown read-only; structured for future upload capability)
```

## 3. Auth Flow (Admin)
1. Admin visits `/admin/login`
2. Enters email + password
3. Server validates against `AdminUser` table (hashed password)
4. On success → signed session cookie (e.g. via Auth.js/NextAuth credentials provider or lightweight JWT)
5. All `/admin/*` routes protected by middleware — redirect to login if unauthenticated
6. Logout clears session

## 4. Edge Cases
- Empty product list → friendly empty state, not broken UI
- No price set → show "برای اطلاع از قیمت تماس بگیرید"
- Duplicate inquiry submissions → basic rate limiting / honeypot field for spam protection
- Admin session expiry → redirect to login with return URL
