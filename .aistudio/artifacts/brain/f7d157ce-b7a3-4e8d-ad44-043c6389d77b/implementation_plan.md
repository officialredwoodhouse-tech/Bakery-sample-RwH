# Maison Élysée — Haute Pâtisserie & Salon de Thé

An editorial, luxury bakery web application showcasing handcrafted artisanal desserts, an interactive dining room table reservation engine ("Book Your Table"), a custom pre-order & dessert box builder ("Book Now / Order Online"), a full customer review and rating system, and an authentic "About Us" heritage story.

> [!IMPORTANT]
> **Key Experience Alignments**:
> - **Aesthetic Identity**: Parisian Haute Pâtisserie styling with refined champagne/warm cream neutrals, deep espresso charcoal typography, gold foil accents, and typography pairing *Cormorant Garamond* with *Plus Jakarta Sans*.
> - **Book Your Table**: Dynamic seating zone selector (The Glass Orangerie, Grand Salon, Chef's Tasting Counter) with guest counter, date picker, curated time slots, special dietary requests, and instant booking confirmation cards.
> - **Book Now / Pre-Order**: Pastry & dessert box builder with pickup scheduling, custom cake size selection, gift note customization, and slide-over order drawer with tabular totals.
> - **Customer Review System**: 5-star interactive rating and written feedback submission for each dessert, verified review tags, average rating badges (clean text without pills), and breakdown filters.
> - **About Us Heritage Page**: The founding story (1924 roots in Paris, modern studio revival), the Master Bakers' philosophy on slow fermentation and seasonal terroir, and the artistic inspiration behind the architectural dessert silhouettes.

---

## 1. Overview & Core Concept

**Maison Élysée** delivers a digital experience reflecting the precision, indulgence, and beauty of high-end French pastry artistry. 

- **Primary Persona**: Connoisseurs of fine desserts, event hosts seeking showstopper celebration cakes, and patrons booking an afternoon high-tea or evening dessert tasting flight.
- **Core Value**: Seamlessly bridges digital visual elegance with high-utility booking tools—letting guests reserve a salon table in seconds, customize and pre-order luxury pastry boxes for pickup or celebration delivery, explore rich ingredient stories, and contribute genuine customer reviews.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Dessert Showcase & Review Discovery**:
   - Guests browse artisanal creations (Entremets, Viennoiserie, Macaron Collections, Tartes, Seasonal Specials) with high-definition photography, flavor profiles, and allergen transparency.
   - Patrons can open any dessert in an elegant quick-view modal to read detailed tasting notes, see the average star rating and review count, read verified reviews, and submit their own rating and review.
2. **"Book Your Table" (Reservation Engine)**:
   - Guests choose their dining experience: *Grand Salon* (intimate banquettes), *The Glass Orangerie* (sunlit garden courtyard), or *The Atelier Tasting Counter* (front-row seat to pastry finishing).
   - Guests select party size (1 to 8 guests), dining date, and curated service slots (Morning Viennoiserie, Afternoon Tea & Petit Fours, Evening Dessert & Champagne pairing).
   - Instant confirmation voucher with booking reference code, calendar addition details, and cancellation terms.
3. **"Book Now" (Dessert Pre-Order & Box Builder)**:
   - Guests curate a custom 4-piece, 6-piece, or 9-piece bespoke dessert box, or order bespoke celebration entremets with custom chocolate plaque inscriptions.
   - Schedule pickup time or local refrigerated courier delivery.
   - Slide-over order bag with tabular calculations, gift message input, and confirmation slip.
4. **"About Us" Heritage & Philosophy**:
   - Editorial chapter layout: *01. The Heritage (Roots & Revival)*, *02. The Bakers' Philosophy (Precision & Pure Terroir)*, *03. The Architecture of Flavor (Inspiration & Silhouettes)*, and *Meet the Master Pâtissiers*.

### Visual Identity & Theme Tokens

- **Dominant Neutral Canvas (60%)**: Alabaster / soft warm parchment (`#FAF7F2`) with crisp ivory cards (`#FFFFFF`).
- **Structural Surfaces (30%)**: Warm taupe hairline dividers (`#E8E2D8`), muted charcoal text (`#1C1917`), and warm biscuit borders.
- **Accent Budget (10%)**: Burnished French gold (`#C5A059` / `#9E7D3B`) and deep black currant accent for primary action buttons.
- **Typography**:
  - *Display / Headlines*: `Cormorant Garamond` (classic serif, optical grace, balanced weights).
  - *Body Prose & UI Controls*: `Plus Jakarta Sans` (crisp legibility, clean geometric neutrality).
  - *Metrics & Tabular Times*: Tabular numerals (`tabular-nums font-mono`) for prices, guest counts, and dates.
- **Anti-Slop Discipline**:
  - Strict zero-pill metadata rule: ratings, categories, and times use subtle unboxed typography separated by `·`.
  - Top Bar Contract: 1-line wordmark ("Maison Élysée"), 4 concise navigation links (`Showcase`, `About Us`, `Reviews`, `Book Table`), 1 primary CTA button ("Book Now").
  - Working handlers on every button, modal dismiss, filter chip, and rating star.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side State Persistence via LocalStorage**
  - *Approach*: Persist table reservations, customer reviews, and cart orders in browser `localStorage` with rich default artisanal seed data.
  - *Why*: Allows instant interaction, immediate reviews addition, live updates to average dessert ratings without external database provisioning delays, while surviving page refreshes.
- **Decision 2: Integrated Multi-View Architecture with Clean Route State**
  - *Approach*: Single-Page App with tabbed navigation (`showcase`, `table-booking`, `order-now`, `about-us`, `reviews-hub`) plus modal overlays for individual dessert review submission and order bag drawer.
  - *Why*: Eliminates page reload flicker and retains cart state seamlessly when switching between viewing the menu, booking a table, or reading the About page.
- **Decision 3: Authentic Review & Rating Computation Engine**
  - *Approach*: Compute real-time average star ratings, total counts, and distribution percentages for every dessert dynamically whenever a customer adds a new review.
  - *Why*: User changes instantly reflect across both the dessert card badges, the dessert detail view, and the dedicated Reviews Hub.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             MAISON ÉLYSÉE APP                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Top Bar: Brand Wordmark ── Nav Links [Showcase, About, Reviews, Table] ── CTA│
├─────────────────────────────────────────────────────────────────────────────┤
│ Active View Router:                                                         │
│   ├── [Showcase View]: Hero Banner, Category Filter, Dessert Grid, Modals    │
│   ├── [Book Your Table]: Zone Selector, Date/Time/Guests, Dietary, Voucher  │
│   ├── [Book Now / Pre-Order]: Box Builder, Pickup Scheduler, Order Slip     │
│   ├── [About Us]: Heritage Story, Bakers' Philosophy, Artisanal Process     │
│   └── [Reviews Hub]: All Customer Feedback, Rating Breakdown, Submit Modal   │
├─────────────────────────────────────────────────────────────────────────────┤
│ State Layer (React Context / LocalStorage):                                 │
│   ├── dessertsState: Items with ingredients, allergens, base ratings         │
│   ├── reviewsState: User and seed reviews with rating, author, dessertId    │
│   ├── reservationsState: Confirmed bookings with zone, date, slot, code     │
│   └── cartState: Box items, custom entremets, pickup details, order slips   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Entities

- **Dessert**: `id`, `name`, `frenchName`, `category`, `price`, `description`, `tastingNotes[]`, `allergens[]`, `imageUrl`, `featured`, `prepTime`.
- **Review**: `id`, `dessertId`, `authorName`, `rating` (1–5), `title`, `comment`, `date`, `verifiedBuyer`.
- **Reservation**: `id`, `code`, `guestName`, `email`, `phone`, `partySize`, `date`, `timeSlot`, `seatingZone` (`orangerie` | `salon` | `counter`), `specialRequests`, `status`.
- **CartItem / Order**: `id`, `type` (`box` | `single` | `custom-cake`), `items[]`, `inscription`, `pickupDate`, `pickupTime`, `totalPrice`, `orderStatus`.
