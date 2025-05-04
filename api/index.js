import "dotenv/config";
import express from "express";
import cors from "cors";
import mongo from "mongodb";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";

// util functions
import { validateInput } from "../src/utils/backend/validate-utils.js";

// external schemas
import User from "./schemas/User.js";
import Class from './schemas/Class.js';

// external routes
import translationRoutes from './routes/translation-routes.js';
import emailRoutes from './routes/email-routes.js';
import userRoutes from './routes/user-routes.js';
import levelRoutes from './routes/level-routes.js';
import classRoutes from './routes/class-routes.js';
import conversationRoutes from './routes/conversation-routes.js';
import ieltsRoutes from './routes/ielts-routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

app.use('/api/locales', translationRoutes);
app.use('/api', emailRoutes);
app.use('/api', userRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/ielts', ieltsRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB database:', mongoose.connection.name);
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
        server.listen(PORT + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit if we can't connect to the database
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
  res.send('Server is running!')
});


//------------------ ENDPOINTS ------------------//


/* CLASS RELATED ENDPOINTS */

// Get All Classes
app.get('/api/all-classes', async (req, res) => {
  try {
    if ('level' in req.query) {
      req.query.level = Number(req.query.level);
    }
    const allowedFields = ['level', 'instructor', 'ageGroup'];
    const filters = validateInput(req.query, allowedFields);

    //apply the filters directly to the database query
    const data = await Class.find(filters);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Enroll in a class
app.put('/api/users/:id/enroll', async (req, res) => {
  const { classId } = req.body
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    // check that student isn't already enrolled
    const user = await User.findById(id);
    if (user.enrolledClasses.includes(classId)) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    let cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }
    if (!cls.isEnrollmentOpen) {
      return res.status(403).json({ message: 'Enrollment is currently closed for this class.' });
    }

    // add class id to user's classes
    await User.findByIdAndUpdate(
      id,
      { $addToSet: { enrolledClasses: classId } }
    )

    // add student id to class's roster
    await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { roster: id } }
    )

    res.status(201).json({ message: 'Enrolled successfully!' })
  } catch (err) {
    console.error('Error enrolling into class:', err);
    res.status(500).json({ message: 'Error enrolling into class' })
  }
})

// Unenroll in a class
app.put('/api/users/:id/unenroll', async (req, res) => {
  const { classId } = req.body
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    // check that student is enrolled
    const user = await User.findById(id);
    if (!user.enrolledClasses.includes(classId)) {
      return res.status(400).json({ message: 'Not enrolled in this class' });
    }

    // remove class id from user's classes
    await User.findByIdAndUpdate(
      id,
      { $pull: { enrolledClasses: classId } },
    )

    // remove student id from class's roster
    await Class.findByIdAndUpdate(
      classId,
      { $pull: { roster: id } },
    )

    res.status(201).json({ message: 'Successfully unenrolled' })
  } catch (err) {
    res.status(500).json({ message: 'Error unenrolling into class' })
  }
})

// Get Students Export Data
app.get('/api/students-export', async (req, res) => {
  try {
    // Get all students with privilege "student"
    const students = await User.find({ privilege: 'student' });

    // Get all classes for reference
    const classes = await Class.find();
    // Create a map for quick access to class details
    const classMap = new Map(classes.map(c => [c._id.toString(), c]));

    // Format student data for export
    const formattedStudents = [];

    for (const student of students) {
      // Get enrolled classes for student
      const enrolledClasses = student.enrolledClasses
        .map(classId => {
          const classInfo = classMap.get(classId.toString());
          if (!classInfo) return null;

          // Format schedules
          const scheduleEST = classInfo.schedule.map(s => `${s.day} ${s.startTime}-${s.endTime}`).join('\n');

          // Convert EST to Istanbul time (EST + 7 hours)
          const scheduleIstanbul = classInfo.schedule.map(s => {
            // Parse the time string (e.g., "10:00am")
            const [startHourStr, startMinuteStr] = s.startTime.split(':');
            const [startHour, startMinute] = [parseInt(startHourStr), parseInt(startMinuteStr || 0)];
            const [endHourStr, endMinuteStr] = s.endTime.split(':');
            const [endHour, endMinute] = [parseInt(endHourStr), parseInt(endMinuteStr || 0)];

            // Create date objects for conversion
            const estStartTime = new Date();
            const estEndTime = new Date();
            estStartTime.setHours(startHour, startMinute);
            estEndTime.setHours(endHour, endMinute);

            // Istanbul is EST + 7 hours
            // TODO: fix for DST
            const istStartTime = new Date(estStartTime.getTime() + (7 * 60 * 60 * 1000));
            const istStartHours = istStartTime.getHours();
            const istStartMinutes = istStartTime.getMinutes();
            const istEndTime = new Date(estEndTime.getTime() + (7 * 60 * 60 * 1000));
            const istEndHours = istEndTime.getHours();
            const istEndMinutes = istEndTime.getMinutes();

            return `${s.day} ${istStartHours}:${istStartMinutes.toString().padStart(2, '0')}${hour >= 12 ? 'pm' : 'am'}-${istEndHours}:${istEndMinutes.toString().padStart(2, '0')}${hour >= 12 ? 'pm' : 'am'}`;
          }).join('\n');

          return {
            level: classInfo.level,
            ageGroup: classInfo.ageGroup,
            instructor: classInfo.instructor,
            link: classInfo.link,
            scheduleEST,
            scheduleIstanbul
          };
        })
        .filter(Boolean);

      // If student has no classes, add one row with empty class info
      if (enrolledClasses.length === 0) {
        formattedStudents.push({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          creationDate: student.creationDate.toISOString().split('T')[0],
          level: '',
          ageGroup: '',
          instructor: '',
          link: '',
          scheduleEST: '',
          scheduleIstanbul: ''
        });
      } else {
        // For each enrolled class, add a separate row in the spreadsheet
        for (const classInfo of enrolledClasses) {
          formattedStudents.push({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            creationDate: student.creationDate.toISOString().split('T')[0],
            ...classInfo
          });
        }
      }
    }

    // Return data in the format expected by export-xlsx
    res.json({ student_data: formattedStudents });
  } catch (err) {
    console.error('Error exporting students:', err);
    res.status(500).json({ message: 'Error exporting students' });
  }
});