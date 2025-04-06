require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const nodemailer = require('nodemailer');

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

app.get('/', (req, res) => {
  res.send('Server is running!')
});



//------------------ HELPER FUNCTIONS ------------------//

/*
purpose: check that the input key is allowed
argument types:
  inputs: object
  allowedFields: array

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
  privilege: { type: String, default: "student", enum: ["admin", "teacher", "student"] },
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
  level: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: [String], default: [] }
}, { collection: 'levels' })

const Level = mongoose.model("Level", LevelSchema)


// Translation Schema
const TranslationSchema = new Schema({
  key: { type: String, required: true },
  translations: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    zh: { type: String, required: true },
    tr: { type: String, required: true },
    ug: { type: String, required: true }
  }
}, { collection: 'translations' })

const Translation = mongoose.model("Translation", TranslationSchema)



//------------------ ENDPOINTS ------------------//

/* TRANSLATION RELATED ENDPOINTS */

// Get Translations
app.get('/api/translations', async (req, res) => {
  try {
    const translations = await Translation.find();
    return res.status(200).json(translations);
  } catch (error) {
    res.status(500).json({ message: 'Error getting translations' });
  }
})


// Edit Translation
app.put('/api/translation/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const updatedTranslation = await Translation.findByIdAndUpdate(
      id,
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(updatedTranslation);
  } catch (error) {
    res.status(500).json({ message: 'Error editing translation' });
  }
})


// Delete Translation
app.delete('/api/translation/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    await Translation.findByIdAndDelete(id);
    res.status(204);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting translation' });
  }
})


// Move all i18nexus translations to MongoDB
app.post('/api/transfer-translations/', async (req, res) => {
  try {
    const response = await fetch(`https://api.i18nexus.com/project_resources/translations.json?api_key=${process.env.I18NEXUS_API_KEY}`)
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Failed to fetch translations' });
    }

    const translations = await response.json();

    const translationsToInsert = [];
    for (const lang in translations) {
      const languageData = translations[lang];

      // Loop through each key in the language's translations
      for (const key in languageData.default) {
        const existingTranslation = translationsToInsert.find(t => t.key === key);

        if (existingTranslation) {
          // If the translation already exists in the array update the language value
          existingTranslation.translations[lang] = languageData.default[key];
        } else {
          // Otherwise create new translation document for this key
          const newTranslation = {
            key,
            translations: {
              en: languageData.default['en'] || '',
              ru: languageData.default['ru'] || '',
              zh: languageData.default['zh'] || '',
              tr: languageData.default['tr'] || '',
              ug: languageData.default['ug'] || ''
            }
          };
          newTranslation.translations[lang] = languageData.default[key];
          translationsToInsert.push(newTranslation);
        }
      }
    }

    // Ensure each translation has all language fields
    translationsToInsert.forEach(translation => {
      ['en', 'ru', 'zh', 'tr', 'ug'].forEach(lang => {
        if (!translation[lang]) {
          translation[lang] = '';
        }
      });
    });

    await Translation.insertMany(translationsToInsert);

    return res.status(200).json({ message: "Successfully inserted translations" })
  } catch (error) {
    res.status(500).json({ message: 'Error transferring translations' })
  }
})


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
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
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
    console.error('Error during login.', error);
    res.status(500).send({ message: 'Server Error.' });
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

// Update Conversation
app.put('/api/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({ message: 'Error updating conversation' });
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
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Error deleting conversation' });
  }
});

// Create conversation
app.post('/api/conversations', async (req, res) => {
  try {
    const { ageGroup, instructor, schedule } = req.body;

    // Check if conversation already exists
    const query = { ageGroup, instructor };
    if (schedule) {
      query.$expr = { $setEquals: ["$schedule", schedule] };
    }
    const existingConversation = await Conversation.findOne(query);

    if (existingConversation) {
      return res.status(409).json({
        message: 'Conversation already exists',
        class: existingConversation
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
    return res.status(500).json({ message: 'Error creating conversation' });
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


// Create class
app.post('/api/classes', async (req, res) => {
  try {
    const { level, ageGroup, instructor, schedule } = req.body;

    // Check if class already exists
    const query = { level, ageGroup, instructor };
    if (schedule) {
      query.$expr = { $setEquals: ["$schedule", schedule] };
    }
    const existingClass = await Class.findOne(query);

    if (existingClass) {
      return res.status(409).json({
        message: 'Class already exists',
        class: existingClass
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
    console.error('Error creating:', error);
    return res.status(500).json({ message: 'Error creating class' });
  }
});


// Update Class
app.put('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
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
    console.error('Error updating class:', error);
    res.status(500).json({ message: 'Error updating class' });
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
          .catch(err => console.error(`Failed to update student ${studentId}:`, err))
      )
    );

    // delete class
    await Class.findByIdAndDelete(id);

    res.status(204).json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Error deleting class' });
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
  console.log("unenrolling")

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
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

// Update user
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
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
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

    const updatedLevel = await Level.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }

    res.status(200).json(updatedLevel);
  } catch (error) {
    console.error('Error updating level:', error);
    res.status(500).json({ message: 'Error updating level' });
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

    await Level.findByIdAndDelete(id);

    res.status(204).json({ message: 'Level deleted successfully' });
  } catch (error) {
    console.error('Error deleting level:', error);
    res.status(500).json({ message: 'Error deleting level' });
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
        message: 'Level already exists',
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
      return res.status(201).json({
        message: 'Level created successfully',
        level: newLevel
      });
    }
  } catch (error) {
    console.error('Error creating:', error);
    return res.status(500).json({ message: 'Error creating class' });
  }
});