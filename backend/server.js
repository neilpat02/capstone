require('dotenv').config(); //environment vars from file

//importing necessary modules to run the server (backend)
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./User'); // path to the user schema
const nodemailer = require('nodemailer'); 
const SavedText = require('./SavedTexts'); // path to the savedText schema


const app = express(); 
const saltRounds = 10; //factor used to hash passwords
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// defining a route to test (can be deleted later)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// signup route
app.post('/api/signup', async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); //hasing the passowrd the user enters
      const existingUser = await User.findOne({ email: req.body.email }); // check if the user already exists based on the email
      if (existingUser) {
          return res.status(409).json({ message: "Email already exists" });
      }
      const user = new User({ //create a new user with the necessary details
          teamName: req.body.teamName,
          email: req.body.email,
          password: hashedPassword,
      });

      const savedUser = await user.save(); //the user is saved to the DB 

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

  app.post('/api/save-text', async (req, res) => {
    const { userEmail, fileName, content } = req.body;
  
    try {
      const userExists = await User.findOne({ email: userEmail });
      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if a saved text with the same fileName and userEmail already exists
      let savedText = await SavedText.findOne({ userEmail, fileName });
      if (savedText) {
        // If it exists, update the content
        savedText.content = content;
        await savedText.save();
        res.status(200).json({ message: 'Text updated successfully' });
      } else {
        // If it doesn't exist, create a new SavedText document
        const newSavedText = new SavedText({
          userEmail,
          fileName,
          content
        });
        await newSavedText.save();
        res.status(201).json({ message: 'Text saved successfully' });
      }
    } catch (error) {
      console.error('Error saving or updating text:', error);
      res.status(500).json({ message: 'Failed to save or update text' });
    }
  });
  

  app.get('/api/get-texts', async (req, res) => {
    const { userEmail } = req.query; // Obtain userEmail from query parameters

    try {
        const texts = await SavedText.find({ userEmail: userEmail });
        if (!texts) {
            return res.status(404).json({ message: 'No texts found for the given user.' });
        }
        res.status(200).json(texts);
    } catch (error) {
        console.error('Error fetching texts:', error);
        res.status(500).json({ message: 'Failed to fetch texts' });
    }
});

  

  //forgot password route 
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


  //function to send password reset email
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
  
    //try to sent the email, and check for the status
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset email:', error);
      } else {
        console.log('Reset email sent:', info.response);
      }
    });
  };

  //defining the leaderboard route
  app.get('/api/leaderboard', async (req, res) => {
    const { type } = req.query; // `type` can be 'software' or 'hardware'
    try {
        let sortCriteria = {}; 
        if (type === 'software') {
            sortCriteria = { softwareScore: -1 }; //descending order 
        } else if (type === 'hardware') {
            sortCriteria = { hardwareScore: -1 }; //descending order
        }

        const leaderboardData = await User.find().sort(sortCriteria); //retrieve the score from the user data in the DB
        res.status(200).json(leaderboardData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/upload-to-bot', async (req, res) => {
    const { email } = req.body; // Expecting user's email to be sent in the request body
    const timestamp = new Date(); // Get current server timestamp
  
    try {
      const user = await User.findOneAndUpdate({ email: email }, {
        $set: { lastUploadToBotTimestamp: timestamp }
      }, { new: true }); // Update the user document with the new timestamp
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({ message: `Upload to bot timestamp updated for user with email ${email}.` });
    } catch (error) {
      console.error('Error updating upload to bot timestamp:', error);
      res.status(500).json({ message: 'Failed to update upload to bot timestamp.' });
    }
  });
  
  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
