import "dotenv/config";
import express from "express";
import cors from "cors";
import mongo from "mongodb";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";

// util functions
import { validateInput } from "./utils/validate-utils.js";

// external schemas
import User from "./schemas/User.js";
import { Class, Conversation } from './schemas/Classes.js';

// external routes
import translationRoutes from './routes/translation-routes.js';
import emailRoutes from './routes/email-routes.js';
import userRoutes from './routes/user-routes.js';
import levelRoutes from './routes/level-routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

app.use('/api/locales', translationRoutes);
app.use('/api', emailRoutes);
app.use('/api', userRoutes);
app.use('/api/levels', levelRoutes);

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

// Get Classes
app.get('/api/classes', async (req, res) => {
  try {
    const allowedFields = ['level', 'instructor', 'ageGroup'];
    const filters = validateInput(req.query, allowedFields);

    //apply the filters directly to the database query
    const data = await Class.find(filters);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})


// Get Conversation classes
app.get("/api/conversations", async (req, res) => {
  try {
    const data = await Conversation.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Get Conversation by ID
app.get('/api/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = await Conversation.findOne({ _id: id });
    res.json(data)

  } catch (err) {
    res.status(500).send(err);
  }
})

// Edit Conversation
app.put('/api/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Conversation Class ID' });
    }

    const existingConversations = await Conversation.find({ ageGroup: updates.ageGroup, instructor: updates.instructor });
    if (existingConversations.length !== 0) {
      const matchingSchedules = existingConversations.filter(convo =>
        convo.schedule.length === updates.schedule.length &&
        convo.schedule.every(itemA =>
          updates.schedule.some(itemB =>
            itemA.day === itemB.day &&
            itemA.startTime === itemB.startTime &&
            itemA.endTime === itemB.endTime
          )
        )
      );
      const duplicate = matchingSchedules.find(convo => convo._id.toString() !== id.toString());

      if (duplicate) {
        return res.status(409).json({
          message: 'Conversation class already exists',
          class: duplicate
        });
      }
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ message: 'Conversation class not found' });
    }

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.error('Failed to update conversation class:', error);
    res.status(500).json({ message: 'Failed to update conversation class' });
  }
});

// Delete Conversation
app.delete('/api/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedConversation = await Conversation.findOne({ _id: id });
    if (!deletedConversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // remove class from student's enrolled classes
    await Promise.all(
      deletedConversation.roster.map(studentId =>
        User.findByIdAndUpdate(studentId, { $pull: { enrolledClasses: id } })
          .catch(err => console.error(`Failed to update student ${studentId}:`, err)) // TODO: throw error?
      )
    );

    // delete conversation
    await Conversation.findByIdAndDelete(id);

    res.status(204).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Failed to delete conversation class:', error);
    res.status(500).json({ message: 'Failed to delete conversation class' });
  }
});

// Create Conversation
app.post('/api/conversations', async (req, res) => {
  try {
    const { ageGroup, instructor, schedule } = req.body;

    // Check if conversation already exists
    const existingConversations = await Conversation.find({ ageGroup, instructor });
    const matchingSchedules = existingConversations.filter(convo =>
      convo.schedule.length === schedule.length &&
      convo.schedule.every(itemA =>
        schedule.some(itemB =>
          itemA.day === itemB.day &&
          itemA.startTime === itemB.startTime &&
          itemA.endTime === itemB.endTime
        )
      )
    );

    if (matchingSchedules.length > 0) {
      return res.status(409).json({
        message: 'Conversation class already exists',
        class: matchingSchedules[0]
      });
    } else {
      const newConversation = new Conversation({
        ageGroup,
        instructor,
        schedule
      });

      await newConversation.save();
      return res.status(201).json({
        message: 'Conversation created successfully',
        class: newConversation
      });
    }
  } catch (error) {
    console.error('Error creating:', error);
    return res.status(500).json({ message: 'Failed to create conversation class' });
  }
});

// Get class by ID
app.get('/api/class/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = await Class.findOne({ _id: id });
    res.json(data)

  } catch (err) {
    res.status(500).send(err);
  }
})


// Create Class
app.post('/api/classes', async (req, res) => {
  try {
    const { level, ageGroup, instructor, schedule } = req.body;

    // Check if class already exists
    const existingClasses = await Class.find({ level, ageGroup, instructor });
    const matchingSchedules = existingClasses.filter(cls =>
      cls.schedule.length === schedule.length &&
      cls.schedule.every(itemA =>
        schedule.some(itemB =>
          itemA.day === itemB.day &&
          itemA.startTime === itemB.startTime &&
          itemA.endTime === itemB.endTime
        )
      )
    );

    if (matchingSchedules.length > 0) {
      return res.status(409).json({
        message: 'Class already exists',
        class: matchingSchedules[0]
      });
    } else {
      const newClass = new Class({
        level,
        ageGroup,
        instructor,
        schedule,
      });

      await newClass.save();
      return res.status(201).json({
        message: 'Class created successfully',
        class: newClass
      });
    }
  } catch (error) {
    console.error('Failed to create class:', error);
    return res.status(500).json({ message: 'Failed to create class' });
  }
});


// Edit Class
app.put('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { level, ageGroup, instructor, schedule } = updates;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const existingClasses = await Class.find({ level: level, ageGroup: ageGroup, instructor: instructor });
    if (existingClasses.length !== 0) {
      const matchingSchedules = existingClasses.filter(cls =>
        cls.schedule.length === schedule.length &&
        cls.schedule.every(itemA =>
          schedule.some(itemB =>
            itemA.day === itemB.day &&
            itemA.startTime === itemB.startTime &&
            itemA.endTime === itemB.endTime
          )
        )
      );
      const duplicate = matchingSchedules.find(cls => cls._id.toString() !== id.toString());

      if (duplicate) {
        return res.status(409).json({
          message: 'Class already exists',
          class: duplicate
        });
      }
    }

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json(updatedClass);
  } catch (error) {
    console.error('Failed to update class details:', error);
    res.status(500).json({ message: 'Failed to update class details' });
  }
});

// Delete Class
app.delete('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedClass = await Class.findOne({ _id: id });
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // remove class from student's enrolled classes
    await Promise.all(
      deletedClass.roster.map(studentId =>
        User.findByIdAndUpdate(studentId, { $pull: { enrolledClasses: id } })
          .catch(err => console.error(`Failed to update student ${studentId}:`, err)) // TODO: throw error?
      )
    );

    // delete class
    await Class.findByIdAndDelete(id);

    res.status(204).json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Failed to delete class:', error);
    res.status(500).json({ message: 'Failed to delete class' });
  }
});


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
      cls = await Conversation.findById(classId);
    }
    if (!cls) {
      return res.status(404).json({ message: 'Class or Conversation not found' });
    }
    if (!cls.isEnrollmentOpen) {
      return res.status(403).json({ message: 'Enrollment is currently closed for this class.' });
    }

    // add class id to user's classes
    await User.findByIdAndUpdate(
      id,
      { $addToSet: { enrolledClasses: classId } }
    )

    const model = typeof cls.level === "number" ? Class : Conversation;
    // add student id to class's roster
    await model.findByIdAndUpdate(
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

    let cls = await Class.findById(classId);
    if (!cls) {
      cls = await Conversation.findById(classId);
    }
    if (!cls) {
      return res.status(404).json({ message: 'Class or Conversation not found' });
    }

    // remove class id from user's classes
    await User.findByIdAndUpdate(
      id,
      { $pull: { enrolledClasses: classId } },
    )

    const model = typeof cls.level === "number" ? Class : Conversation;
    // remove student id from class's roster
    await model.findByIdAndUpdate(
      classId,
      { $pull: { roster: id } },
    )
    res.status(201).json({ message: 'Unenrolled successfully!' })
  } catch (err) {
    console.error('Error unenrolling into class:', err);
    res.status(500).json({ message: 'Error unenrolling into class' })
  }
})

// TODO: get rid of
// Forgot Password
app.put('/api/users/reset-password', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (user) {
      // Update the password (make sure to hash it if needed)
      await User.findOneAndUpdate({ email }, { password }, { returnDocument: 'after' });
      res.status(200).json({ success: true, message: "Password updated successfully." });
    } else {
      res.status(401).json({ success: false, message: "Invalid email." });
    }
  } catch (err) {
    console.error('Error resetting password', err);
    res.status(500).json({ success: false, message: "Server error resetting password." });
  }
});

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