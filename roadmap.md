# Roadmap

- [x] Google-only sign-in: enable provider, build /auth page, wire session state
- [ ] Finish creator dashboard modules (portfolio, sell, services, projects, earnings)
- [ ] Polish public marketplace (artwork pages, artist profiles, search, collections, join)
- [ ] Collector account area (home, orders, saved works, collaborations)
- [ ] Shopping & checkout polish (bag, checkout steps, confirmation)
- [x] Bigger text and icons site-wide
- [x] Commission / hire workflow: discipline questions, references, drafts, creator proposal builder, history, cancel/decline, payment failure
- [x] Project workspace tabs (overview, messages, files, milestones, payments, timeline)
- [x] Order fulfilment + wallet state definitions
- [x] Admin / Operations dashboard as its own separate shell (/admin)
- [x] Full admin operations build: grouped nav, attention queue, search palette, 18 routes, detail views with reason-confirmed actions, notes and audit trail
- [ ] Gate /admin behind a server-checked staff role before wiring real operational data (deferred — frontend-only phase, all data is mock)
- [x] Move all shared state (bag, account context, dashboard context) to Zustand stores

## Frontend-only phase (mock data everywhere; external APIs wired later)
- [x] Earnings / Wallet full UI: pending → available → withdraw → processing → paid, fees, reversals, failed payouts (creator)
- [x] Order fulfilment tracking UI: paid → confirmed → preparing → dispatch → delivered → completed (collector view; creator sell-side view still open)
- [ ] Notifications center: grouped purchases, enquiries, bookings, profile updates across shells
- [ ] Messaging / inbox: project + commission conversations, both sides
- [ ] Collector account completion: orders, saved works, collaborations, reviews
- [ ] Creator dashboard modules completion: portfolio, sell, services, projects
- [ ] Public marketplace polish: artwork pages, artist profiles, search, collections

- [x] Admin account area: /admin/account (+profile, security, notifications, preferences, activity), avatar menu, team & internal staff management (brief: Add_and_complete_the_Admin_Account_Profile)
