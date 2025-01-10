require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

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
      // capitalize the value
      filteredInput[key] = input[key].charAt(0).toUpperCase() + input[key].slice(1)
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
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  username: { type: String, required: true },
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
  message: { type: String, required: true }
}, { collection: 'contacts' })

const Contact = mongoose.model('Contact', ContactSchema);


// Schedule Schema
const ScheduleSchema = new Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
})

// Class Schema
const ClassSchema = new Schema({
  title: { type: String, required: true },
  level: { type: String, required: true },
  ageGroup: { type: String, required: true },
  instructor: { type: String, required: true },
  schedule: { type: [ScheduleSchema], required: true, default: [] },
  roster: { type: [Schema.Types.ObjectId], default: [] }
}, { collection: 'classes' })

const Class = mongoose.model("Class", ClassSchema)


// Conversation Schema
const ConversationSchema = new Schema({
  instructor: { type: String, required: true },
  ageGroup: { type: String, required: true },
  schedule: { type: [ScheduleSchema], required: true, default: [] },
  roster: { type: [Schema.Types.ObjectId], default: [] }
}, { collection: 'conversations' })

const Conversation = mongoose.model("Conversation", ConversationSchema)


// Level Schema
const LevelSchema = new Schema({
  level: { type: Number, required: true },
  name: { type: String, required: true },
  instructors: { type: [String], required: true, default: [] },
}, { collection: 'levels' })

const Level = mongoose.model("Level", LevelSchema)



//------------------ ENDPOINTS ------------------//

/* USER RELATED ENDPOINTS */

// Sign up
app.post('/api/sign-up', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, clerkId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      if (existingUser.username === username) {
        return res.status(409).json({ message: 'Username already exists' });
      }
    }

    // Create new user with separate first/last name fields
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      isAdmin: false,
      username,
      clerkId
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});


// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log('Database query result:', user);
    if (user) {
      if (user.password === password) {
        console.log('Login successful for user:', email);
        res.status(200).json({ user });
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
});


// Get Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
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
    })
    await newContact.save()

    res.status(201).json({ message: 'Inquiry submitted successfully' })
  }
  catch (err) {
    res.status(500).json({ message: 'Error submitting inquiry' });
  }
})


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
  } catch (error) {
    res.status(500).send(err);
  }
})

// Get Student's classes
app.get('/api/students-classes', async (req, res) => {
  try {
    const allowedFields = ['_id'];
    const filters = validateInput(req.query, allowedFields);

    //apply the filters directly to the database query
    const data = await User.findOne(filters, { enrolledClasses: 1, _id: 0 });
    res.json(data);

  } catch (err) {
    res.status(500).send(err);
  }
})

// Get class by ID
app.get('/api/class', async (req, res) => {
  try {
    const allowedFields = ['_id'];
    const filters = validateInput(req.query, allowedFields);

    //apply the filters directly to the database query
    const data = await Class.findOne(filters);
    res.json(data)

  } catch (err) {
    res.status(500).send(err);
  }
})

// Enroll in a class
app.put('/api/users/:id/enroll', async (req, res) => {
  const { classId } = req.body
  const studentId = new mongoose.Types.ObjectId('674f72531d7f25e7213721cd') // hardcode userId
  try {
    // add class id to user's classes
    await User.findByIdAndUpdate(
      studentId,
      { $addToSet: { enrolledClasses: classId } },
      { new: true }
    )

    // add student id to class's roster
    await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { roster: studentId } },
      { new: true }
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
  const studentId = new mongoose.Types.ObjectId('674f72531d7f25e7213721cd') // hardcode userId
  try {
    // remove class id from user's classes
    await User.findByIdAndUpdate(
      studentId,
      { $pull: { enrolledClasses: classId } },
    )

    // remove student id from class's roster
    await Class.findByIdAndUpdate(
      classId,
      { $pull: { roster: studentId } },
    )
    res.status(201).json({ message: 'Unenrolled successfully!' })
  } catch (err) {
    console.error('Error unenrolling into class:', err);
    res.status(500).json({ message: 'Error unenrolling into class' })
  }
})
