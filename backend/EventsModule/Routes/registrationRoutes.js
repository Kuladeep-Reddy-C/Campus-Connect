// backend/EventsModule/Routes/registrationRoutes.js
import express from 'express';
import {
  registerForEvent,
  getUserRegistrations,
  checkInUser
} from '../Controllers/registrationController.js';

const router = express.Router();

// User registration route (requires Clerk authentication)
router.post('/', registerForEvent);

// Get a user's registrations (requires Clerk authentication)
router.get('/user-registrations', getUserRegistrations); // Changed endpoint for clarity

// Check-in route (requires Clerk authentication and role-check)
router.post('/checkin', checkInUser);

export default router;