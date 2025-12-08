# JobCompass

> Master navigating the sea of irrelevant jobs with **JobCompass**

JobCompass is an advanced job search platform that helps you find ideal positions with smart filtering capabilities, commute calculations, and personalized matching. Tell us your skills, role, and location, and we'll steer you to the right job with the least commute time.

The repo is a monorepo with a Vite/React Frontend and an Express/PostgreSQL Backend that also integrates Google Maps for transit times, RapidAPI (LinkedIn jobs), Firebase Storage for avatars, and email-based password recovery.

## 🎯 Mission

Connect talented professionals with opportunities that match their skills, preferences, and career goals.

## ✨ Features

- **🔍 Smart Filtering and Sorting** - Filter by job type, work mode, and experience level, and sort listings based on what matters most to you
- **⚡ Smart Matching** - Search and browse open roles; surface skills detected in each description.
- **🗺️ Commute Calculator** - See travel time and number of transfers from your home to workplace
- **❤️ Save to Favorites** - Mark interesting job posts to easily view them later
- **✉️ Password Reset** - Recover account access via email with secure, short-lived tokens
- **👤 User Profiles** - Customize your profile with skills, address settings, and avatar uploads
- **👥 Guest Mode** - Try the platform without creating an account (with limited features)

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

### Backend

- **Node.js** (>=24.0.0) - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** (Neon DB) - Database
- **Firebase Admin** - File storage and authentication
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File upload handling
- **Google Maps API** - Commute calculations

### DevOps & Tools

- **Husky** - Git hooks
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Concurrently** - Run multiple commands

## 📁 Project Structure

```
c53-final-project-group-A/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── util/          # Utility functions
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                 # Express backend application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic services
│   │   ├── db/            # Database configuration
│   │   ├── config/        # Configuration files
│   │   ├── data/          # Data files
│   │   └── util/          # Utility functions
│   └── package.json
├── .github/               # GitHub workflows
├── .husky/                # Git hooks
└── package.json           # Root package.json with workspace scripts
```

## Backend Routes Overview

- `POST /api/users` – sign up; `POST /api/users/login` / `/logout` – auth via HTTP-only cookie.
- `GET /api/users/me` – current user; `PUT /api/users/profile` – update profile fields.
- `POST /api/users/update-avatar` – upload avatar (Multer memory storage → Firebase Storage).
- `POST /api/users/change-password` / `/change-skills` – profile mutations.
- `POST /api/users/favorites/toggle` – save/unsave a job; `DELETE /api/users/delete/:userid` – delete account.
- `POST /api/users/forgot-password` / `/reset-password` – email reset flow.
- `POST /api/jobs/search` – search jobs (RapidAPI LinkedIn + local processing).
- `POST /api/travel/batch` – batch transit time + transfer counts for job locations.

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 24.0.0
- **npm** (comes with Node.js)
- **PostgreSQL** database (Neon DB recommended)
- **Firebase** Firebase service account (as JSON string)
- **SMTP credentials**
- **LinkedIn Job Search RapidAPI key**
- **Google Maps API** key for commute calculations

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/HackYourFuture/c53-final-project-group-A.git
   cd c53-final-project-group-A
   ```

2. **Install dependencies**

   ```bash
   npm run setup
   ```

   This will install dependencies for both client and server.

3. **Set up environment variables**

   In client and server directories, copy and rename the `.env.example` files into `.env`. Set all environmental variables.

4. **Run the development servers**

   ```bash
   npm run dev
   ```

   This will start both the client (Vite dev server) and server (Express with nodemon) concurrently.

   - Frontend: http://localhost:5173 (or the port Vite assigns)
   - Backend: http://localhost:3000 (or your configured PORT)

## 📜 Available Root Level Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run start` - Start the production server
- `npm run build` - Build the client for production
- `npm run setup` - Install dependencies for both client and server

## 🚢 Deployment

The project is configured for Heroku deployment. The `Procfile` specifies the production start command.

### Heroku Deployment Steps

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Push to Heroku:
   ```bash
   git push heroku main
   ```

The `heroku-postbuild` script will automatically:

- Install dependencies
- Build the client application

## 👥 Contributors

This project was developed as part of HackYourFuture's final project by:

- **Yaroslav Kazeev** - HYF trainee - [GitHub](https://github.com/YaroslavKazeev) | [LinkedIn](https://www.linkedin.com/in/yaroslavkazeev/)
- **Hanna Dubyna** - HYF trainee - [GitHub](https://github.com/HannaInIT) | [LinkedIn](https://www.linkedin.com/in/hanna-dubyna/)
- **Yahya Al-Ademi** - HYF trainee - [GitHub](https://github.com/YahyaAl-Ademi) | [LinkedIn](https://www.linkedin.com/in/yahya-al-ademi-12786555/)
- **Stas Seldin** - DevOps, Education Director - [GitHub](https://github.com/stasel) | [LinkedIn](https://www.linkedin.com/in/stasel/)
- **Jana Gombitová** - Product Owner, Scrum Master - [GitHub](https://github.com/janagombitova) | [LinkedIn](https://www.linkedin.com/in/jana-gombitova-42b08394/)
- **Tim Lorent** - Tech Lead - [GitHub](https://github.com/tlorent) | [LinkedIn](https://www.linkedin.com/in/timlorent/)

## 📧 Contact

Have questions or feedback? We would love to hear from you!

Drop us a line at [jobcompass2025@gmail.com](mailto:jobcompass2025@gmail.com?subject=Question about JobCompass) and we will get back to you as soon as possible!

## 📄 License

ISC

## 🙏 Acknowledgments

- Built as part of [HackYourFuture](https://www.hackyourfuture.net/) curriculum
- Special thanks to all mentors and contributors who made this project possible
