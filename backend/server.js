require('dotenv').config(); //environment vars from file

//importing necessary modules to run the server (backend)
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
});

// defining a route to test (can be deleted later)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// signup route
/**
 * Handles the signup process for a new user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.body.teamName - The team name provided by the user.
 * @param {string} req.body.email - The email address provided by the user.
 * @param {string} req.body.password - The password provided by the user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 */
app.post("/api/signup", async (req, res) => {
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
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    }); // Sign JWT here
    res
      .status(201)
      .json({ user: { ...savedUser._doc, password: undefined }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define the login route
/**
 * Handles user login by verifying the provided email and password.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 */
app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      }); // Sign JWT here
      res.status(200).json({ message: "Login successful!", token });
    } else {
      res.status(401).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Middleware function that authenticates a request using a JWT token.
 *
 * This function is used to verify the validity of a JWT token provided in the
 * `Authorization` header of an incoming request. If the token is valid, the
 * user information associated with the token is stored in the `req.user`
 * property, allowing subsequent middleware functions to access the user data.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void}
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // token is no longer valid
    req.user = user;
    next();
  });
}

/**
 * Endpoint that requires authentication to access.
 * This route is protected and can only be accessed by authenticated users.
 * It returns a JSON response with a welcome message.
 *
 * @route GET /api/protected
 * @group Authentication - Endpoints that require authentication
 * @security Bearer
 * @returns {object} 200 - Welcome message
 * @returns {Error}  default - Unexpected error
 */
app.get("/api/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the protected route!" });
});

/**
 * Saves or updates the text content for a user's file.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.body.userEmail - The email of the user.
 * @param {string} req.body.fileName - The name of the file.
 * @param {string} req.body.content - The content of the file.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the text is saved or updated.
 */
app.post("/api/save-text", async (req, res) => {
  const { userEmail, fileName, content } = req.body;

  try {
    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a saved text with the same fileName and userEmail already exists
    let savedText = await SavedText.findOne({ userEmail, fileName });
    if (savedText) {
      // If it exists, update the content
      savedText.content = content;
      await savedText.save();
      res.status(200).json({ message: "Text updated successfully" });
    } else {
      // If it doesn't exist, create a new SavedText document
      const newSavedText = new SavedText({
        userEmail,
        fileName,
        content,
      });
      await newSavedText.save();
      res.status(201).json({ message: "Text saved successfully" });
    }
  } catch (error) {
    console.error("Error saving or updating text:", error);
    res.status(500).json({ message: "Failed to save or update text" });
  }
});
  

/**
 * Retrieves a list of saved texts for the given user email.
 *
 * @param {string} userEmail - The email address of the user to fetch texts for.
 * @returns {Promise<SavedText[]>} - An array of SavedText objects for the given user.
 */
app.get("/api/get-texts", async (req, res) => {
  const { userEmail } = req.query; // Obtain userEmail from query parameters

  try {
    const texts = await SavedText.find({ userEmail: userEmail });
    if (!texts) {
      return res
        .status(404)
        .json({ message: "No texts found for the given user." });
    }
    res.status(200).json(texts);
  } catch (error) {
    console.error("Error fetching texts:", error);
    res.status(500).json({ message: "Failed to fetch texts" });
  }
});

  

  //forgot password route 
/**
 * Handles the forgot password functionality for the application.
 *
 * This endpoint is used to initiate the password reset process. It checks if the provided email
 * exists in the database, generates a random reset token, and saves it along with the expiration
 * time in the user document. Finally, it sends an email to the user with a password reset link.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.body.email - The email address of the user who requested the password reset.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the password reset process is complete.
 */
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a random token for password reset
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Save the reset token and expiration time in the user document
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token is valid for 1 hour

    await user.save();

    // Send an email to the user with the reset link
    sendResetEmail(email, resetToken);

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  //function to send password reset email
/**
 * Sends a password reset email to the specified email address.
 *
 * @param {string} toEmail - The email address to send the reset email to.
 * @param {string} resetToken - The reset token to include in the reset link.
 * @returns {void}
 */
const sendResetEmail = (toEmail, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mazecomphero@gmail.com",
      pass: "",
    },
  });

  const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: "mazecomphero@gmail.com",
    to: toEmail,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  //try to sent the email, and check for the status
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending reset email:", error);
    } else {
      console.log("Reset email sent:", info.response);
    }
  });
};

  //defining the leaderboard route
/**
 * Retrieves the leaderboard data from the database based on the specified type ('software' or 'hardware').
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.query.type - The type of leaderboard data to retrieve ('software' or 'hardware').
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the leaderboard data has been sent in the response.
 */
app.get("/api/leaderboard", async (req, res) => {
  const { type } = req.query; // `type` can be 'software' or 'hardware'
  try {
    let sortCriteria = {};
    if (type === "software") {
      sortCriteria = { softwareScore: -1 }; //descending order
    } else if (type === "hardware") {
      sortCriteria = { hardwareScore: -1 }; //descending order
    }

    const leaderboardData = await User.find().sort(sortCriteria); //retrieve the score from the user data in the DB
    res.status(200).json(leaderboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Handles a POST request to the '/api/upload-to-bot' endpoint.
 * Updates the 'lastUploadToBotTimestamp' field in the user document with the current server timestamp.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.body.email - The email of the user whose upload timestamp needs to be updated.
 * @returns {Promise<Object>} - A JSON response with a success message or an error message.
 */
app.post("/api/upload-to-bot", async (req, res) => {
  const { email } = req.body; // Expecting user's email to be sent in the request body
  const timestamp = new Date(); // Get current server timestamp

  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $set: { lastUploadToBotTimestamp: timestamp },
      },
      { new: true }
    ); // Update the user document with the new timestamp

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({
        message: `Upload to bot timestamp updated for user with email ${email}.`,
      });
  } catch (error) {
    console.error("Error updating upload to bot timestamp:", error);
    res
      .status(500)
      .json({ message: "Failed to update upload to bot timestamp." });
  }
});



// Route to update software score
/**
 * Updates the software score for a user.
 *
 * @param {string} userEmail - The email of the user whose software score should be updated.
 * @param {number} newScore - The new software score to be set for the user.
 * @returns {Promise<{ message: string, softwareScore: number }>} - An object containing a success message and the updated software score.
 * @throws {Error} - If the user is not found or there is an error updating the score.
 */
app.patch("/api/update-software-score", async (req, res) => {
  const { userEmail, newScore } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        $set: { softwareScore: newScore },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({
        message: "Software score updated successfully",
        softwareScore: user.softwareScore,
      });
  } catch (error) {
    console.error("Error updating software score:", error);
    res.status(500).json({ message: "Failed to update software score" });
  }
});



  
  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});