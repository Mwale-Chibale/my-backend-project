# BY MWALE CHIBALE (2655462) AND MUMBA ILUNGA (2655397)

# Event Management API


## Description of Architecture
This backend is built using **Node.js** and **Express.js**, following a clean **MVC (Model-View-Controller) pattern** with an added Service layer to separate business logic from request handling. 
* **Routing (`/routes`):** Express routers define the API endpoints and pass requests through security middlewares.
* **Controllers (`/controllers`):** Extract incoming request data, pass it to the services, and format the outgoing HTTP JSON responses.
* **Services (`/services`):** House the core business logic and direct database interactions.
* **Database:** Uses **SQLite** for lightweight local storage, managed by the **Prisma ORM** (v7) with the `better-sqlite3` driver.
* **Security:** Implements JSON Web Tokens (JWT) for stateless authentication, `bcryptjs` for secure password hashing, and custom middleware for role-based authorization (separating `ORGANISER` and `ATTENDEE` permissions).
* **Concurrency & Safety:** Utilizes Prisma `$transaction` blocks in the booking service to prevent race conditions and overbooking during high-traffic ticket purchases. A Global Error Handler catches unexpected crashes and returns clean JSON.

---

## Setup Instructions

**1. Install Dependencies**
Run the following command in the terminal to install all required packages:
\`\`\`bash
npm install
\`\`\`

**2. Environment Configuration**
Create a `.env` file in the root directory and add the following variables:
\`\`\`env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_super_secret_development_key_123"
PORT=3000
\`\`\`

**3. Initialize the Database**
Generate the SQLite database and apply the schema migrations:
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

**4. Seed the Database**
Populate the database with a test Organiser, Attendee, and sample events:
\`\`\`bash
npm run seed
\`\`\`

**5. Start the Server**
Start the application in development mode:
\`\`\`bash
npm run dev
\`\`\`
The server will run on `http://localhost:3000`.

---

## API Documentation

### Authentication
* **`POST /auth/register`**
  * **Description:** Registers a new user.
  * **Body:** `{ "name": "John", "email": "john@test.com", "password": "password123", "role": "ATTENDEE" }` (Roles: `ATTENDEE` or `ORGANISER`)
  * **Returns:** `201 Created` with user details.
* **`POST /auth/login`**
  * **Description:** Authenticates a user and returns a token.
  * **Body:** `{ "email": "john@test.com", "password": "password123" }`
  * **Returns:** `200 OK` with a JWT `token`.

### Events
* **`GET /events`** (Public)
  * **Description:** Fetches a list of all available events.
  * **Returns:** `200 OK` with an array of all events, including organiser details.
* **`POST /events`** (Protected: Requires `ORGANISER` token)
  * **Description:** Creates a new event.
  * **Headers:** `Authorization: Bearer <token>`
  * **Body:** `{ "title": "Tech Meetup", "description": "Networking", "date": "2026-05-15T18:30:00Z", "capacity": 50 }`
  * **Returns:** `201 Created` with event details.

### Bookings
* **`POST /bookings/:eventId`** (Protected: Requires any valid token)
  * **Description:** Books a ticket for a specific event.
  * **Headers:** `Authorization: Bearer <token>`
  * **Returns:** `201 Created` if successful. Returns `400 Bad Request` if the event is sold out or the user has already booked a ticket.