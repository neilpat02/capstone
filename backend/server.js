require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./User');

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
            ...req.body,
            password: hashedPassword,
        });

        const savedUser = await user.save();

        res.status(201).json({user: { ...savedUser._doc, password: undefined } });
    } catch (error) {
        // Handle errors, such as duplicate email, etc.
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
