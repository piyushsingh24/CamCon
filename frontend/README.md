# CampusConnect - MERN Stack Application

CampusConnect is a student-to-student mentorship platform that bridges the gap between college aspirants and verified seniors. Students can connect with mentors from their dream colleges through real-time chat and video calls.

## 🚀 Features

- **Role-based Authentication**: Separate login/signup for students and mentors
- **Real-time Chat**: Instant messaging using Socket.IO
- **Video Calling**: WebRTC integration for face-to-face conversations
- **Payment Integration**: Razorpay integration for session payments (₹99)
- **Rating System**: Students can rate mentors after sessions
- **College-based Filtering**: Find mentors from specific colleges
- **Online Status**: See which mentors are available for instant calls
- **Session Management**: Book, accept, decline, and complete sessions

## 🛠️ Tech Stack

### Frontend
- **React** (JavaScript)
- **Tailwind CSS** for styling
- **Shadcn/UI** for components
- **Socket.IO Client** for real-time features
- **React Router** for navigation

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Razorpay** for payments
- **bcryptjs** for password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Razorpay Account (for payments)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configurations:
```env
MONGODB_URI=mongodb://localhost:27017/campusconnect
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=5000
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to root directory and install dependencies:
```bash
npm install
```

2. Install Socket.IO client:
```bash
npm install socket.io-client
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/mentors` - Get mentors by college
- `GET /api/users/mentors/online` - Get online mentors
- `PUT /api/users/profile` - Update user profile
- `PATCH /api/users/availability` - Toggle mentor availability

### Sessions
- `POST /api/sessions` - Create session request
- `GET /api/sessions` - Get user sessions
- `PATCH /api/sessions/:id/status` - Accept/decline session
- `PATCH /api/sessions/:id/complete` - Complete session with rating
- `POST /api/sessions/:id/messages` - Send message in session

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## 🎯 Test Accounts

After running the seed script, you can use these test accounts:

**Mentors:**
- rahul@iitdelhi.ac.in (IIT Delhi)
- priya@iitbombay.ac.in (IIT Bombay)
- amit@bits.ac.in (BITS Pilani)
- sneha@iitmadras.ac.in (IIT Madras)

**Student:**
- student@test.com

**Password:** password123

## 🔐 Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/campusconnect

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Client URL
CLIENT_URL=http://localhost:3000

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set up MongoDB Atlas for production database
3. Configure environment variables on your hosting platform

### Frontend Deployment
1. Update API base URL in `src/api/api.js`
2. Deploy to Vercel, Netlify, or similar platforms

## 📱 Features Breakdown

### For Students:
- Browse mentors by college
- Search mentors by name, course, or specialties
- Book paid sessions (₹99)
- Real-time chat and video calls
- Rate mentors after sessions

### For Mentors:
- Manage availability status
- Accept/decline session requests
- Earn money by helping students
- Track earnings and session history
- Build reputation through ratings

## 🔄 Real-time Features

- **Online Status**: See which mentors are online
- **Instant Messaging**: Real-time chat during sessions
- **Video Calling**: WebRTC-based video calls
- **Live Notifications**: Session requests and status updates

## 💳 Payment Integration

- Integrated with Razorpay for secure payments
- Session-based payment model (₹99 per session)
- Automatic payment verification
- Mentor earnings tracking

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Request rate limiting
- Input validation and sanitization
- CORS protection

## 📞 Support

For any issues or questions, please create an issue in the repository or contact the development team.

## 📄 License

This project is licensed under the MIT License.