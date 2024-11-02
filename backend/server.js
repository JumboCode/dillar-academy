require('dotenv').config();
const express = require('express');
const cors = require('cors')
const mongo = require("mongodb");
const mongoose = require("mongoose");
console.log(process.env)

const app = express()
app.use(cors())
app.use(express.json())
// console.log('MongoDB URI:', process.env.MONGODB_URI);
// console.log(process.env.PORT);
//ERROR ERRO ERROR .ENV FILE DOES NOT CONNECT
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


// Class Schema

// TODO (Claire & Fahim): Create a ClassSchema
const ClassSchema = new Schema({
    id: {type: String, required: true},
    title: {type: String, required: true},
    level: {type: String, required: true},
    ageGroup: {type: String, required: true},
    instructor: {type: String, required: true},
    schedule: {type: [String], required:true},
})
const Class = mongoose.model("class", ClassSchema)
//testing
// const math = new ClassSchema({id: "43", title: "claire", level: "100", ageGroup: "7", instructor: "fahimrbarh", schedule: ["3",'4']})
// console.log(math.id)




//------------------ ENDPOINTS ------------------//

// Sign up

// TODO (Spencer & Tony): Create an endpoint to receive and upload sign up data to the database


// Login

// TODO (Donatello & John): Create an endpoint to receive login data and check if the user exists in the database


// Contact

// TODO (Frank & Madeline): Create an endpoint to receive and upload contact inquiries to the database


// Classes

// TODO (Claire & Fahim): Create an endpoint to retrieve class data from the database
app.get('/data', async (req, res)=>{
    console.log("endpoint is being hit")
    try {
        const data = await Class.find(); // Replace YourModel with your actual model
        res.json(data);
        console.log(data);
      } catch (err) {
        res.status(500).send(err);
      }
})