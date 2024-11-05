# URL Shortener Project

A simple and efficient URL shortener service built with Node.js, Express.

## Features
- Shorten long URLs into easy-to-share links.
- Track clicks, including successful and failed attempts.
- User-friendly interface for managing, updating, and deleting URLs.

## Setup Instructions

### 1. Clone the repository
   ```bash
   git clone https://github.com/swatibbhadoriya/url-shortener.git
   cd url-shortener
   ```

### 2. Install dependencies
   ```bash
   npm install
   ```

### 3. Configure environment variables
   - Create a `.env` file in the project root.
   - Add the required variables:
     ```
     DATABASE_URL=<your_database_url>
     JWT_SECRET=<your_jwt_secret>
     ```

### 4. Run the server
   ```bash
   node server.js
   ```
   Access the application at [http://localhost:3000](http://localhost:3000).
