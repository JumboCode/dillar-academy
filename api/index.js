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

const app = express();
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

app.use('/api/locales', translationRoutes);
app.use('/api', emailRoutes);
app.use('/api', userRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/classes', classRoutes);

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
// Get Students Export Data
app.get('/api/students-export', async (req, res) => {
  try {
    // Get all students with privilege "student"
    const students = await User.find({ privilege: 'student' });

    // Get all classes for reference
    const classes = await Class.find();

    // Create a map for quick access to class details
    const classMap = new Map(classes.map(c => [c._id.toString(), c]));

    // Helper to format time in 12-hour clock with am/pm
    const formatTime = (hours, minutes) => {
      const period = hours >= 12 ? 'pm' : 'am';
      const hour12 = hours % 12 || 12; // Convert 0 to 12
      return `${hour12}:${minutes.toString().padStart(2, '0')}${period}`;
    };

    // Format student data for export
    const formattedStudents = [];

    for (const student of students) {
      const enrolledClasses = (student.enrolledClasses || [])
        .map(classId => {
          const classInfo = classMap.get(classId.toString());
          if (!classInfo || !Array.isArray(classInfo.schedule)) return null;

          // Format schedules in EST
          const scheduleEST = classInfo.schedule
            .map(s => `${s.day} ${s.startTime}-${s.endTime}`)
            .join('\n');

          // Convert EST to Istanbul time (EST + 7 hours)
          const scheduleIstanbul = classInfo.schedule
            .map(s => {
              const [startHour, startMin] = s.startTime.split(':').map(Number);
              const [endHour, endMin] = s.endTime.split(':').map(Number);

              const estStart = new Date();
              const estEnd = new Date();
              estStart.setHours(startHour, startMin || 0);
              estEnd.setHours(endHour, endMin || 0);

              const istStart = new Date(estStart.getTime() + 7 * 60 * 60 * 1000);
              const istEnd = new Date(estEnd.getTime() + 7 * 60 * 60 * 1000);

              return `${s.day} ${formatTime(istStart.getHours(), istStart.getMinutes())}-${formatTime(istEnd.getHours(), istEnd.getMinutes())}`;
            })
            .join('\n');

          return {
            level: classInfo.level,
            ageGroup: classInfo.ageGroup,
            instructor: classInfo.instructor,
            link: classInfo.link,
            scheduleEST,
            scheduleIstanbul
          };
        })
        .filter(Boolean); // Remove nulls

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
    console.error('Error exporting students:', err.stack || err);
    res.status(500).json({ message: 'Error exporting students' });
  }
});
