# Security Specification: Velvet Cocoa Firestore Backend

## 1. Data Invariants
- **Products & Categories**: Catalog items can be read by any visitor (public read for active catalog items); writes, updates, and deletes are restricted strictly to verified Admins.
- **Orders**: Orders can be created by patrons (either signed-in or guest checkout) with strictly validated fields and bounded amounts. Order status updates and fulfillment transitions are restricted to Admins. Individual users can only read their own orders (`customerId == request.auth.uid` or admin).
- **Reviews**: Verified patrons or visitors can submit pending reviews with rating between 1 and 5. Only Admins can approve, reject, or delete reviews.
- **Contact Messages**: Anyone can create an inquiry message. Only Admins can list, inspect, and update status.
- **Site Settings**: Publicly readable by all users. Only Admins can modify settings.
- **User Accounts**: Users can read and write only their own document (`/users/{userId}`). Escalation of role to `admin` by non-admins is forbidden.
- **Admin Privilege**: Evaluated via `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or matching bootstrapped admin `pornimakannan98@gmail.com`.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Unauthenticated Product Injection**: An unauthenticated user attempts to create a product. (Denied)
2. **Product Price Tamper**: A non-admin attempts to update a product price to 0. (Denied)
3. **Ghost Field in Product**: Creating a product with unauthorized extra property `_isShadowAdmin: true`. (Denied)
4. **Order Status Hijack**: A regular user updates their order `status` to `delivered` or `refunded`. (Denied)
5. **PII Order Snooping**: User B attempts to read User A's order document. (Denied)
6. **Order Negative Total**: Order submission with a negative total or invalid currency amount. (Denied)
7. **Self-Promoted Admin Role**: User creates/updates `/users/{userId}` with `role: 'admin'`. (Denied)
8. **Contact Message Scraping**: Non-admin lists all submitted customer contact messages. (Denied)
9. **Review Rating Out of Bounds**: Submitting a review with `rating: 10`. (Denied)
10. **Store Settings Tampering**: Non-admin modifies `freeDeliveryThreshold` or payment keys in `/site_settings/general`. (Denied)
11. **Malicious Oversized ID**: Creating an order or document with an excessively large 2KB ID string. (Denied)
12. **Admin Record Creation**: Non-admin creates a document in `/admins/{uid}`. (Denied)
