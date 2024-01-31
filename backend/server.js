require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./User');
const nodemailer = require('nodemailer');


const app = express();
const saltRounds = 10;
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Define the signup route
app.post('/api/signup', async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
          return res.status(409).json({ message: "Email already exists" });
      }
      const user = new User({
          teamName: req.body.teamName,
          email: req.body.email,
          password: hashedPassword,
      });

      const savedUser = await user.save();

      res.status(201).json({ user: { ...savedUser._doc, password: undefined } });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Define the login route
app.post('/api/login', async (req, res) => {
    try {
      // Find the user by email
      const user = await User.findOne({ email: req.body.email });
  
      // If user is found, compare the submitted password with the stored hashed password
      if (user && await bcrypt.compare(req.body.password, user.password)) {
        // Passwords match, handle login success
        res.status(200).json({ message: "Login successful!" });
      } else {
        // Passwords do not match or user does not exist, handle login failure
        res.status(401).json({ message: "Invalid credentials!" });
      }
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if the email exists in the database
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Generate a random token for password reset
      const resetToken = crypto.randomBytes(20).toString('hex');
  
      // Save the reset token and expiration time in the user document
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // Token is valid for 1 hour
  
      await user.save();
  
      // Send an email to the user with the reset link
      sendResetEmail(email, resetToken);
  
      res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
      console.error('Error during forgot password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const sendResetEmail = (toEmail, resetToken) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mazecomphero@gmail.com',
        pass: '',
      },
    });
  
    const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
  
    const mailOptions = {
      from: 'mazecomphero@gmail.com',
      to: toEmail,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset email:', error);
      } else {
        console.log('Reset email sent:', info.response);
      }
    });
  };

  app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboardData = await User.find().sort({ score: -1 });
        res.status(200).json(leaderboardData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
