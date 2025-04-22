require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const nodemailer = require('nodemailer');

// external schemas
const Translation = require("./schemas/Translation");

// external routes
const translationRoutes = require('./routes/translations');

const app = express()
app.use(cors())
app.use(express.json())
app.use(mongoSanitize())

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

app.use('/api/locales', translationRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!')
});



//------------------ HELPER FUNCTIONS ------------------//

/*
purpose: check that the input key is allowed
argument types:
  inputs: object
  allowedFields: array
return type:
  array containing fields that are in allowedFields

example of using to get filters for classes: validateInput(req.query, classFields)
*/
const validateInput = (input, allowedFields) => {
  const filteredInput = {}

  for (const key in input) {
    if (allowedFields.includes(key)) {
      filteredInput[key] = input[key]
    }
  }

  return filteredInput
}

const formattedSkillKey = (skill) => `level_skill_${skill.toLowerCase().replace(/ /g, "_")}`;

const deleteLevelTranslations = async (levelData) => {
  try {
    await Translation.deleteMany({ key: `level_name_${levelData._id}` });
    await Translation.deleteMany({ key: `level_desc_${levelData._id}` });
    for (const skill of levelData.skills) {
      const key = `${formattedSkillKey(skill)}_${levelData._id}`;
      await Translation.deleteMany({ key });
    }
  } catch (error) {
    console.error("Failed to delete level translations", error);
    throw new Error("Failed to delete level translations");
  }
};

const createLevelTranslations = async (levelData) => {
  try {
    // name translation
    const response = await fetch(`https://api.i18nexus.com/project_resources/base_strings.json?api_key=${process.env.I18NEXUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.I18NEXUS_PAT}`
      },
      body: JSON.stringify({
        key: `level_name_${levelData._id}`,
        value: levelData.name,
        namespace: "levels"
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Failed to create translation", data);
    }
    // description translation
    await fetch(`https://api.i18nexus.com/project_resources/base_strings.json?api_key=${process.env.I18NEXUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.I18NEXUS_PAT}`
      },
      body: JSON.stringify({
        key: `level_desc_${levelData._id}`,
        value: levelData.description,
        namespace: "levels"
      })
    });
    // skill translations
    for (const skill of levelData.skills) {
      const key = `${formattedSkillKey(skill)}_${levelData._id}`;
      await fetch(`https://api.i18nexus.com/project_resources/base_strings.json?api_key=${process.env.I18NEXUS_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.I18NEXUS_PAT}`
        },
        body: JSON.stringify({
          key,
          value: skill,
          namespace: "levels"
        })
      });
    }
  } catch (error) {
    throw new Error("Failed to create level translations");
  }
}


//------------------ MONGOOSE SCHEMAS ------------------//

const Schema = mongoose.Schema

// User Schema
const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String },
  age: { type: Number },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  privilege: { type: String, default: "student", enum: ["admin", "instructor", "student"] },
  clerkId: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  enrolledClasses: { type: [Schema.Types.ObjectId], default: [] }
}, { collection: 'users' })

const User = mongoose.model("User", UserSchema)


// Contact Schema
const ContactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
}, { collection: 'contacts' })

const Contact = mongoose.model('Contact', ContactSchema);


// Schedule Schema
// timezone is automatically UTC
const ScheduleSchema = new Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  endTime: { type: String, required: true }
})

// Class Schema
const ClassSchema = new Schema({
  level: { type: Number, required: true },
  ageGroup: { type: String, required: true },
  instructor: { type: String, required: true },
  classroomLink: { type: String, default: "" },
  schedule: { type: [ScheduleSchema], default: [] },
  roster: { type: [Schema.Types.ObjectId], default: [] }
}, { collection: 'classes' })

const Class = mongoose.model("Class", ClassSchema)


// Conversation Schema
const ConversationSchema = new Schema({
  instructor: { type: String, required: true },
  ageGroup: { type: String, required: true },
  schedule: { type: [ScheduleSchema], default: [] },
  roster: { type: [Schema.Types.ObjectId], default: [] }
}, { collection: 'conversations' })

const Conversation = mongoose.model("Conversation", ConversationSchema)


// Level Schema
const LevelSchema = new Schema({
  level: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: [String], default: [] }
}, { collection: 'levels' })

const Level = mongoose.model("Level", LevelSchema)


//------------------ ENDPOINTS ------------------//


/* USER RELATED ENDPOINTS */

// Sign up
app.post('/api/sign-up', async (req, res) => {
  try {
    const { firstName, lastName, email, password, clerkId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Create new user with separate first/last name fields
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      clerkId
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (error) {
    console.error('Failed to sign up:', error);
    res.status(500).json({ message: 'Failed to sign up' });
  }
})


// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      if (user.password === password) {
        console.log('Login successful for user:', email);
        res.status(200).json(user);
      } else {
        console.log('Login failed: Incorrect password.');
        res.status(401).send('Invalid password.');
      }
    } else {
      console.log('Login failed: User not found');
      res.status(401).send('Invalid email.');
    }
  } catch (error) {
    console.error('Failed to login:', error);
    res.status(500).send({ message: 'Failed to login' });
  }
})


// Get Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
})


// Get User
app.get('/api/user', async (req, res) => {
  const allowedFields = ['email', '_id']
  const filters = validateInput(req.query, allowedFields)

  try {
    const user = await User.findOne(filters);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
})


/* CONTACT RELATED ENDPOINTS */

// Post Contact
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body

  try {
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });
    await newContact.save();

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error('Error initializing transporter:', error);
      } else {
        console.log('Transporter is ready to send emails', success);
      }
    });


    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Contact Form: ${subject}`,
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Inquiry and email submitted successfully' });
  }
  catch (err) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ message: 'Error submitting inquiry', error: err.message });
  }
});


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


// Get Levels
app.get("/api/levels", async (req, res) => {
  try {
    const allowedFields = ['level'];
    const filters = validateInput(req.query, allowedFields);
    const data = await Level.find(filters);
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
    const matchingSchedules = existingConversations.filter(convo =>
      convo.schedule.length === updates.schedule.length &&
      convo.schedule.every(itemA =>
        updates.schedule.some(itemB =>
          itemA.day === itemB.day && itemA.time === itemB.time
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
          itemA.time === itemB.time &&
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

// Get Student's classes by ID
app.get('/api/students-classes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = await User.findOne({ _id: id }, { enrolledClasses: 1, _id: 0 });
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

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
          itemA.time === itemB.time && 
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
    console.error('Error creating class:', error.name, error.message);
    return res.status(500).json({ message: error.message });;
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
    const matchingSchedules = existingClasses.filter(cls =>
      cls.schedule.length === schedule.length &&
      cls.schedule.every(itemA =>
        schedule.some(itemB =>
          itemA.day === itemB.day && 
          itemA.time === itemB.time &&
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


//instead of Class, use level
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
    res.status(201).json({ message: 'Unenrolled successfully!' })
  } catch (err) {
    console.error('Error unenrolling into class:', err);
    res.status(500).json({ message: 'Error unenrolling into class' })
  }
})


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

// Edit user
app.put('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Get level by ID
app.get('/api/levels/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = await Level.findOne({ _id: id });
    res.json(data)

  } catch (err) {
    res.status(500).send(err);
  }
})

// Edit Level
app.put('/api/levels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const existingLevel = await Level.findOne({ level: updates.level });
    if (existingLevel && existingLevel._id.toString() !== id.toString()) {
      return res.status(409).json({
        message: 'Level with this number already exists',
        level: existingLevel
      })
    }

    const updatedLevel = await Level.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    // Update translations
    // delete existing translations 
    await deleteLevelTranslations(existingLevel);
    // create new translations
    await createLevelTranslations(updatedLevel);
    // translations transferred to MongoDB in updateLevel wrapper


    if (!updatedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }

    res.status(200).json(updatedLevel);
  } catch (error) {
    console.error('Failed to update level details:', error);
    res.status(500).json({ message: 'Failed to update level details' });
  }
});

// Delete Level
app.delete('/api/levels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedLevel = await Level.findById(id);
    if (!deletedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Delete level's translations
    await deleteLevelTranslations(deletedLevel);

    await Level.findByIdAndDelete(id);

    res.status(204).json({ message: 'Level deleted successfully' });
  } catch (error) {
    console.error('Failed to delete level:', error);
    res.status(500).json({ message: 'Failed to delete level' });
  }
});

// Create Level 
app.post('/api/levels', async (req, res) => {
  try {
    const { level, name, description, skills } = req.body;

    // Check if level already exists
    const query = { level };
    const existingLevel = await Level.findOne(query);

    if (existingLevel) {
      return res.status(409).json({
        message: 'Level with this number already exists',
        level: existingLevel
      });
    } else {
      const newLevel = new Level({
        level,
        name,
        description,
        skills,
      });
      await newLevel.save();

      // Add level translations to i18nexus
      await createLevelTranslations(newLevel);
      // translations transferred to MongoDB in createLevel wrapper

      return res.status(201).json({
        message: 'Level created successfully',
        level: newLevel
      });
    }
  } catch (error) {
    console.error('Error creating:', error);
    return res.status(500).json({ message: 'Failed to create level' });
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
          const scheduleEST = classInfo.schedule.map(s => `${s.day} ${s.time} ${s.endTime}`).join('\n');

          // Convert EST to Istanbul time (EST + 7 hours)
          const scheduleIstanbul = classInfo.schedule.map(s => {
            // Parse the time string (e.g., "10:00am")
            const [hourStr, minuteStr] = s.time.split(':');
            const [hour, minute] = [parseInt(hourStr), parseInt(minuteStr || 0)];

            // Create date objects for conversion
            const estTime = new Date();
            estTime.setHours(hour, minute);

            // Istanbul is EST + 7 hours
            const istTime = new Date(estTime.getTime() + (7 * 60 * 60 * 1000));
            const istHours = istTime.getHours();
            const istMinutes = istTime.getMinutes();

            return `${s.day} ${istHours}:${istMinutes.toString().padStart(2, '0')}${hour >= 12 ? 'pm' : 'am'}`;
          }).join('\n');

          return {
            level: classInfo.level,
            ageGroup: classInfo.ageGroup,
            instructor: classInfo.instructor,
            classroomLink: classInfo.classroomLink,
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
          classroomLink: '',
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