# BikeBid - Online Bike Auction Marketplace

BikeBid is a high-performance, real-time online bike auction platform. Built with Laravel 12, Inertia.js, and React, it features a premium "Glassmorphism" dark-themed UI and robust backend logic to handle high-concurrency bidding environments.

## 🚀 Features

- **Real-time Bidding**: Instant price updates and bid history without page refreshes using Laravel Reverb (WebSockets).
- **Anti-Sniping Logic**: Auctions are automatically extended by 2 minutes if a bid is placed in the final 2 minutes of the auction, ensuring fair play.
- **Concurrency Protection**: Uses database transactions and pessimistic locking (`lockForUpdate`) to prevent double-bidding and race conditions.
- **Buy Now**: Instant purchase option for eligible auctions.
- **Notifications**: Real-time notifications for being outbid or winning an auction.
- **Premium UI**: Modern dark mode design with sleek animations and responsive layout.

---

## 🛠️ Environment Setup

### Prerequisites
- **PHP**: ^8.2
- **Node.js**: ^18.x / ^20.x
- **Composer**: ^2.x
- **Database**: SQLite (default), MySQL, or PostgreSQL

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bikebid
   ```

2. **Setup Environment File**:
   ```bash
   cp .env.example .env
   ```
   *Configure your database and Reverb settings in `.env` if necessary.*

3. **Run Automatic Setup**:
   This command installs dependencies, generates the application key, runs migrations, and builds assets.
   ```bash
   composer setup
   ```

4. **Start the Development Environment**:
   The project includes a combined command to run the server, queue, Reverb, and Vite concurrently:
   ```bash
   composer dev
   ```

---

## 🏃 How to Run

### Manual Services (Optional)
If you prefer running services individually:

- **Web Server**: `php artisan serve`
- **Asset Compiler**: `npm run dev`
- **Reverb (WebSockets)**: `php artisan reverb:start`
- **Queue Worker**: `php artisan queue:listen`

### Seed Sample Data
To populate the database with a rich set of sample data (auctions, bids, and users):
```bash
php artisan db:seed
```

**Available Test Accounts (Password: `password`):**
- **Admin**: `admin@bikebid.com`
- **Seller**: `seller@bikebid.com`
- **Buyer**: `buyer@bikebid.com`
- **Generic User**: `test@example.com`

---

## 🧪 Running Tests

The project includes a suite of feature tests covering the core auction logic, including concurrency and anti-sniping.

Run all tests:
```bash
php artisan test
```

Specific test file:
```bash
php artisan test tests/Feature/AuctionSystemTest.php
```

---

## 🧠 Key Decisions & Assumptions

1. **Tech Stack Choice**:
   - **Laravel 12 + Reverb**: Selected for first-party WebSocket support, making real-time features lightweight and easy to deploy without external dependencies like Pusher.
   - **Inertia.js + React**: Provides a SPA-like experience (fast transitions) while keeping the powerful Laravel routing and controller logic.

2. **Concurrency Management**:
   - Every bid placement is wrapped in a **DB Transaction**.
   - We use **Pessimistic Locking** (`lockForUpdate`) on the auction record during the bid process. This ensures that only one bid is processed at a time for a specific auction, preventing price discrepancies.

3. **Anti-Sniping (Auction Extension)**:
   - **Assumption**: A 2-minute "buffer" is sufficient. 
   - **Logic**: If a bid is placed when `end_time` is less than 2 minutes away, the `end_time` is extended by exactly 2 minutes from its current value.

4. **Audit Logs**:
   - Every major action (Bid, Cancel, Extension, Buy Now) is recorded in an `audit_logs` table for administrative transparency and debugging.

5. **State Management**:
   - Auction states are strictly defined: `draft`, `scheduled`, `live`, `ended`, `canceled`. Transitions are managed via a service layer (`AuctionService`) to ensure consistency.
