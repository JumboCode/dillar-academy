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
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`)
        });
    })
    .catch((e) => {
        console.log(e)
    })

app.get('/', (req, res) => {
  res.send('Server is running!')
});

//------------------ MONGOOSE SCHEMAS ------------------//

const Schema = mongoose.Schema

// User Schema
const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true},
    isAdmin: { type: Boolean, required: true},
    username: { type: String, required: true},
})
const User = mongoose.model("users", UserSchema)

// Contact Schema

// TODO (Frank & Madeline): Create a ContactSchema
const ContactSchema = new Schema ({
    name: { type: String, required: true},
    email: { type: String, required: true},
    subject: { type: String, required: true},
    message: { type: String, required: true}
})

const Contact = mongoose.model("contact", ContactSchema)

// Class Schema

// TODO (Claire & Fahim): Create a ClassSchema


//------------------ ENDPOINTS ------------------//

// Sign up

// TODO (Spencer & Tony): Create an endpoint to receive and upload sign up data to the database


// Login

// TODO (Donatello & John): Create an endpoint to receive login data and check if the user exists in the database


// Contact

// TODO (Frank & Madeline): Create an endpoint to receive and upload contact inquiries to the database
app.post('/api/contact', async (req, res) => {
    const{ name, email, subject, message } = req.body
    try {
        await Contact.create({
            name: name,
            email: email,
            subject: subject,
            message: message
        })
        res.status(201).json({message: 'Inquiry submitted successfully'})
    }
    catch (err) {
        console.error('Error submitting inquiry:', err);
        res.status(500).json({message: 'Error submitting inquiry'})
    }
})

// Classes

// TODO (Claire & Fahim): Create an endpoint to retrieve class data from the database