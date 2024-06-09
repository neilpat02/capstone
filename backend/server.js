require('dotenv').config(); // environment vars from file
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./User'); // path to the user schema
const nodemailer = require('nodemailer'); 
const SavedText = require('./SavedTexts'); // path to the savedText schema

const app = express(); 
const saltRounds = 10; // factor used to hash passwords
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
});

// Define a schema for storing tokens
const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 Hours
  }
});

const Token = mongoose.model('Token', tokenSchema);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

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
    });

    const tokenEntry = new Token({ userId: savedUser._id, token });
    await tokenEntry.save();

    res
      .status(201)
      .json({ user: { ...savedUser._doc, password: undefined }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      const tokenEntry = new Token({ userId: user._id, token });
      await tokenEntry.save();

      res.status(200).json({ message: "Login successful!", token });
    } else {
      res.status(401).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.sendStatus(403);
    }

    const tokenEntry = await Token.findOne({ token });
    if (!tokenEntry) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.get("/api/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the protected route!" });
});

app.post("/api/save-text", async (req, res) => {
  const { userEmail, fileName, content } = req.body;

  try {
    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let savedText = await SavedText.findOne({ userEmail, fileName });
    if (savedText) {
      savedText.content = content;
      await savedText.save();
      res.status(200).json({ message: "Text updated successfully" });
    } else {
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

app.get("/api/get-texts", async (req, res) => {
  const { userEmail } = req.query;

  try {
    const texts = await SavedText.find({ userEmail: userEmail });
    if (!texts) {
      return res.status(404).json({ message: "No texts found for the given user." });
    }
    res.status(200).json(texts);
  } catch (error) {
    console.error("Error fetching texts:", error);
    res.status(500).json({ message: "Failed to fetch texts" });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;

    await user.save();

    sendResetEmail(email, resetToken);

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const sendResetEmail = (toEmail, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mazecomphero@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: "mazecomphero@gmail.com",
    to: toEmail,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending reset email:", error);
    } else {
      console.log("Reset email sent:", info.response);
    }
  });
};

app.get("/api/leaderboard", async (req, res) => {
  const { type } = req.query;
  try {
    let sortCriteria = {};
    if (type === "software") {
      sortCriteria = { softwareScore: -1 };
    } else if (type === "hardware") {
      sortCriteria = { hardwareScore: -1 };
    }

    const leaderboardData = await User.find().sort(sortCriteria);
    res.status(200).json(leaderboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/upload-to-bot", async (req, res) => {
  const { email } = req.body;
  const timestamp = new Date();

  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $set: { lastUploadToBotTimestamp: timestamp },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: `Upload to bot timestamp updated for user with email ${email}.` });
  } catch (error) {
    console.error("Error updating upload to bot timestamp:", error);
    res.status(500).json({ message: "Failed to update upload to bot timestamp." });
  }
});

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

    res.status(200).json({
      message: "Software score updated successfully",
      softwareScore: user.softwareScore,
    });
  } catch (error) {
    console.error("Error updating software score:", error);
    res.status(500).json({ message: "Failed to update software score" });
  }
});

const invalidateTokens = async () => {
  await Token.deleteMany({});
};

mongoose.connection.on('connected', invalidateTokens);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
