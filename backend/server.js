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
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    username: String,
})
const User = mongoose.model("users", UserSchema)

// Contact Schema

// TODO (Frank & Madeline): Create a ContactSchema


// Class Schema

// TODO (Claire & Fahim): Create a ClassSchema


//------------------ ENDPOINTS ------------------//

// Sign up

// TODO (Spencer & Tony): Create an endpoint to receive and upload sign up data to the database


// Login

// TODO (Donatello & John): Create an endpoint to receive login data and check if the user exists in the database


// Contact

// TODO (Frank & Madeline): Create an endpoint to receive and upload contact inquiries to the database


// Classes

// TODO (Claire & Fahim): Create an endpoint to retrieve class data from the database