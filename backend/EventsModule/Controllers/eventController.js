// // backend/EventsModule/Controllers/eventController.js
// import Event from '../Models/Event.js';
// import QRCode from 'qrcode';

// // Helper to generate QR Code data for the event page
// const generateQrCodeData = async (eventId) => {
//   const data = `campusconnect_event:${eventId}`;
//   return QRCode.toDataURL(data); // Generates a base64 data URL
// };

// // @desc    Get all events
// // @route   GET /api/events
// // @access  Public (API Key protected)
// export const getEvents = async (req, res, next) => {
//   try {
//     const events = await Event.find();
//     res.status(200).json({ success: true, count: events.length, data: events });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get single event
// // @route   GET /api/events/:id
// // @access  Public (API Key protected)
// export const getEvent = async (req, res, next) => {
//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({ success: false, message: `Event not found with id of ${req.params.id}` });
//     }

//     res.status(200).json({ success: true, data: event });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get trending events
// // @route   GET /api/events/trending/top
// // @access  Public (API Key protected)
// export const getTrendingEvents = async (req, res, next) => {
//   try {
//     // This example fetches events, sorts by trendingScore (descending), then by date (ascending), and limits to 5.
//     // You can adjust the sorting and limiting logic as per your definition of "trending".
//     const trendingEvents = await Event.find()
//       .sort({ trendingScore: -1, date: 1 }) // Highest score first, then by date for ties
//       .limit(5); // Get top 5 trending events

//     res.status(200).json({ success: true, count: trendingEvents.length, data: trendingEvents });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Create new event (Admin/Moderator Only)
// // @route   POST /api/events
// // @access  Private (Clerk authenticated, potentially role-based)
// export const createEvent = async (req, res, next) => {
//   const { auth } = req; // <<< CORRECT WAY to access auth() from Clerk Express middleware
//   const { userId } = auth(); // Call auth() to get the userId

//   if (!userId) { // Ensure user is authenticated by Clerk
//     return res.status(401).json({ success: false, message: 'Authentication required.' });
//   }
//   // TODO: Add role-based access control here (e.g., check if userId has 'admin' role)
//   // if (!checkAdminRole(userId)) { return res.status(403).json({ message: 'Forbidden: Admin access required.' }); }

//   try {
//     const eventData = req.body;
//     const event = await Event.create(eventData);

//     const qrCodeDataUrl = await generateQrCodeData(event._id.toString());
//     event.qrCode = qrCodeDataUrl;
//     await event.save();

//     res.status(201).json({ success: true, data: event });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({ success: false, message: messages.join(', ') });
//     }
//     next(error);
//   }
// };

// // @desc    Update an event (Admin/Moderator Only)
// // @route   PUT /api/events/:id
// // @access  Private (Clerk authenticated, potentially role-based)
// export const updateEvent = async (req, res, next) => {
//   const { auth } = req; // <<< CORRECT WAY
//   const { userId } = auth();

//   if (!userId) {
//     return res.status(401).json({ success: false, message: 'Authentication required.' });
//   }
//   // TODO: Add role-based access control here

//   try {
//     let event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({ success: false, message: `Event not found with id of ${req.params.id}` });
//     }

//     event = await Event.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });

//     res.status(200).json({ success: true, data: event });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({ success: false, message: messages.join(', ') });
//     }
//     next(error);
//   }
// };

// // @desc    Delete an event (Admin/Moderator Only)
// // @route   DELETE /api/events/:id
// // @access  Private (Clerk authenticated, potentially role-based)
// export const deleteEvent = async (req, res, next) => {
//   const { auth } = req; // <<< CORRECT WAY
//   const { userId } = auth();

//   if (!userId) {
//     return res.status(401).json({ success: false, message: 'Authentication required.' });
//   }
//   // TODO: Add role-based access control here

//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({ success: false, message: `Event not found with id of ${req.params.id}` });
//     }

//     await event.deleteOne();

//     res.status(200).json({ success: true, data: {} });
//   } catch (error) {
//     next(error);
//   }
// };

// backend/EventsModule/Controllers/eventController.js
import Event from '../Models/Event.js';
import QRCode from 'qrcode';

// Helper to generate QR Code data for the event page
const generateQrCodeData = async (eventId) => {
  const data = `campusconnect_event:${eventId}`;
  return QRCode.toDataURL(data); // Generates a base64 data URL
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public (API Key protected)
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public (API Key protected)
export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: `Event not found with id of ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending events
// @route   GET /api/events/trending/top
// @access  Public (API Key protected)
export const getTrendingEvents = async (req, res, next) => {
  try {
    const trendingEvents = await Event.find()
      .sort({ trendingScore: -1, date: 1 })
      .limit(5);

    res.status(200).json({ success: true, count: trendingEvents.length, data: trendingEvents });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event (Admin/Moderator Only)
// @route   POST /api/events
// @access  Private (Clerk authenticated, potentially role-based)
export const createEvent = async (req, res, next) => {
  const { auth } = req;
  const { userId } = auth();

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    // req.body contains the text fields (title, description, etc.)
    // req.file contains the uploaded file info from multer

    const { title, description, category, date, location } = req.body;

    let imageUrl = '';
    if (req.file) {
      // Multer-Cloudinary-Storage saves the Cloudinary URL in req.file.path or req.file.url
      imageUrl = req.file.path || req.file.url;
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      location,
      imageUrl: imageUrl, // Save the image URL
      // Assuming 'creator' will be added later, or default to some value if not explicitly passed
      // For now, if you want to store the creator, you need to add creator field to event model and pass userId
      // creator: userId, // uncomment this if you add creator field to Event model and want to store it
    });

    const qrCodeDataUrl = await generateQrCodeData(event._id.toString());
    event.qrCode = qrCodeDataUrl;
    await event.save();

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Update an event (Admin/Moderator Only)
// @route   PUT /api/events/:id
// @access  Private (Clerk authenticated, potentially role-based)
export const updateEvent = async (req, res, next) => {
  const { auth } = req;
  const { userId } = auth();

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  // TODO: Add role-based access control here

  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: `Event not found with id of ${req.params.id}` });
    }

    // You might want to handle image updates here similarly if needed for PUT requests
    // If you allow changing image on update, you'd add upload.single() to PUT route too.

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Delete an event (Admin/Moderator Only)
// @route   DELETE /api/events/:id
// @access  Private (Clerk authenticated, potentially role-based)
export const deleteEvent = async (req, res, next) => {
  const { auth } = req;
  const { userId } = auth();

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  // TODO: Add role-based access control here

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: `Event not found with id of ${req.params.id}` });
    }

    await event.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};