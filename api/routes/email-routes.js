import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

// Post Contact
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body

  try {
    transporter.verify((error, success) => {
      if (error) {
        console.error('Error initializing transporter:', error);
      } else {
        console.log('Transporter is ready to send emails', success);
      }
    });


    const mailOptions = {
      from: `"${name}" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
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