// backend/EventsModule/Routes/eventRoutes.js
import express from 'express';
import {
  getEvents,
  getEvent,
  getTrendingEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../Controllers/eventController.js';


import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// --- MULTER STORAGE CONFIGURATION ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus-connect-event-pamphlets', // Folder name in your Cloudinary account
    format: async (req, file) => 'png', // or 'jpg', 'webp'
    public_id: (req, file) => `event-${Date.now()}-${file.originalname.split('.')[0]}`
  },
});

const upload = multer({ storage: storage });
// --- END MULTER/CLOUDINARY CONFIG ---

// Public routes (with API Key)
router.get('/', getEvents);
router.get('/trending/top', getTrendingEvents);
router.get('/:id', getEvent);

// Admin/Moderator routes (require Clerk authentication and potentially role-check in controller)
router.post('/', upload.single('eventImage'), createEvent); // 'eventImage' must match the frontend field name
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;