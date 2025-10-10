// backend/EventsModule/Controllers/registrationController.js
import Event from '../Models/Event.js';
import User from '../Models/User.js';
import Registration from '../Models/Registration.js';
import QRCode from 'qrcode';
// import { auth } from '@clerk/express'; // REMOVE THIS LINE or comment it out

// Helper to generate QR Code data for a specific registration
const generateRegistrationQrCodeData = async (registrationId) => {
  const qrData = `campusconnect_reg:${registrationId}`;
  return QRCode.toDataURL(qrData);
};

// @desc    Register a user for an event
// @route   POST /api/register
// @access  Private (Clerk authenticated user)
export const registerForEvent = async (req, res, next) => {
  const { auth } = req; // <<< CORRECT WAY
  const { userId } = auth(); // Get Clerk userId from the auth() helper
  const { eventId } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required to register.' });
  }
  if (!eventId) {
    return res.status(400).json({ success: false, message: 'Event ID is required.' });
  }

  try {
    // 1. Find or create the local User record based on Clerk userId
    let user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      user = await User.create({ clerkUserId: userId });
    }

    // 2. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: `Event not found with id ${eventId}` });
    }

    // 3. Check if user is already registered for this event
    const existingRegistration = await Registration.findOne({ user: user._id, event: event._id });
    if (existingRegistration) {
      return res.status(409).json({ success: false, message: 'You are already registered for this event.' });
    }

    // 4. Create the registration
    const registration = await Registration.create({
      user: user._id,
      event: event._id,
      qrCodeData: 'placeholder'
    });

    // 5. Generate QR Code specific to this registration
    const qrCodeDataUrl = await generateRegistrationQrCodeData(registration._id.toString());
    registration.qrCodeData = qrCodeDataUrl;
    await registration.save();

    // Optionally increment trending score for the event
    event.trendingScore = (event.trendingScore || 0) + 1;
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event!',
      data: {
        registrationId: registration._id,
        eventId: event._id,
        qrCodeData: registration.qrCodeData
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'You are already registered for this event.' });
    }
    next(error);
  }
};

// @desc    Get user's registrations
// @route   GET /api/register/user-registrations
// @access  Private (Clerk authenticated user)
export const getUserRegistrations = async (req, res, next) => {
  const { auth } = req; // <<< CORRECT WAY
  const { userId } = auth(); // Get Clerk userId from the auth() helper

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required to view registrations.' });
  }

  try {
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      return res.status(200).json({ success: true, count: 0, data: [] }); // User not found locally, no registrations
    }

    const registrations = await Registration.find({ user: user._id })
      .populate('event', 'title date location category description'); // Populate event details

    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    next(error);
  }
};

// @desc    Check-in for an event using registration QR code (Admin/Event Staff Only)
// @route   POST /api/register/checkin
// @access  Private (Clerk authenticated, potentially role-based)
export const checkInUser = async (req, res, next) => {
  const { auth } = req; // <<< CORRECT WAY
  const { userId } = auth(); // Clerk userId of the staff performing check-in
  const { registrationId } = req.body; // registrationId extracted from QR code

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required for check-in.' });
  }
  // TODO: Implement role-based access control here to ensure only staff can check in

  if (!registrationId) {
    return res.status(400).json({ success: false, message: 'Registration ID is required for check-in.' });
  }

  try {
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }
    if (registration.checkInStatus) {
      return res.status(409).json({ success: false, message: 'User already checked in.' });
    }

    registration.checkInStatus = true;
    await registration.save();

    res.status(200).json({ success: true, message: 'User successfully checked in!', data: registration });
  } catch (error) {
    next(error);
  }
};