const express = require('express');
const cors = require('cors')
const mongo = require("mongodb");
const mongoose = require("mongoose");
require('dotenv').config();


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
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

// Add this right after your mongoose.connect() to debug connection issues
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
  res.send('Server is running!')
});

//------------------ MONGOOSE SCHEMAS ------------------//

const Schema = mongoose.Schema

// User Schema
const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: false }, // Changed to false
    email: { type: String, required: true},
    password: { type: String, required: true},
    isAdmin: { type: Boolean, required: true},
    username: { type: String, required: true},
})
const User = mongoose.model("users", UserSchema)

// Contact Schema

// TODO (Frank & Madeline): Create a ContactSchema


// Class Schema

// TODO (Claire & Fahim): Create a ClassSchema


//------------------ ENDPOINTS ------------------//

// Sign up
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;

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

    // Split username for first/last name
    const nameParts = username.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' '); // Join remaining parts as lastName

    // Create new user
    const newUser = new User({
      firstName: firstName,
      lastName: lastName || undefined, // Use undefined if no lastName
      email: email,
      password: password,
      isAdmin: false,
      username: username
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login

// TODO (Donatello & John): Create an endpoint to receive login data and check if the user exists in the database


// Contact

// TODO (Frank & Madeline): Create an endpoint to receive and upload contact inquiries to the database


// Classes

// TODO (Claire & Fahim): Create an endpoint to retrieve class data from the database
