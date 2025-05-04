import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import Contact from "../schemas/Contact.js";

const router = express.Router();

// Post Contact
router.post('/contact', async (req, res) => {
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

export default router;