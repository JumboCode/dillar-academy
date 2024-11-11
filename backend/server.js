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
      filteredInput[key] = query[key]
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

// Class Schema
const ScheduleSchema = new Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
})
const ClassSchema = new Schema({
  title: { type: String, required: true },
  level: { type: String, required: true },
  ageGroup: { type: String, required: true },
  instructor: { type: String, required: true },
  schedule: { type: [ScheduleSchema], required: true, default: [] },
}, { collection: 'classes' })

const Class = mongoose.model("Class", ClassSchema)

// Level Schema
const InstructorSchema = new Schema({ name: { type: String, required: true } })
const LevelSchema = new Schema({
  level: { type: Number, required: true },
  name: { type: String, required: true },
  instructors: { type: [InstructorSchema], required: true, default: [] },
}, { collection: 'levels' })

const Level = mongoose.model("Level", LevelSchema)

//------------------ ENDPOINTS ------------------//

// Sign up
app.post('/api/users', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

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
      username
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
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log('Database query result:', user);

    if (user) {
      if (user.password === password) {
        console.log('Login successful for user:', username);
        res.status(200).send('Login successful!');
      } else {
        console.log('Login failed: Incorrect password.');
        res.status(401).send('Invalid password.');
      }
    } else {
      console.log('Login failed: User not found');
      res.status(401).send('Invalid username.');
    }
  } catch (error) {
    console.error('Error during login.', error);
    res.status(500).send({ message: 'Server Error.' });
  }
});

// Get Users
app.get('/api/users', async (req, res) => {
  try {
    console.log("getting the users");
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }

})

// Contact
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
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ message: 'Error submitting inquiry' })
  }
})

// Classes
// TODO (Donatello, Claire, Yi): Modify the endpoint to take in query params and filter classes with them
app.get('/api/classes', async (req, res) => {
  try {
    const data = await Class.find();
    console.log(data);
    res.json(data)
  } catch (err) {
    res.status(500).send(err);
  }
})

// Levels
// TODO (Fahim & Frank): Get the levels data from the database