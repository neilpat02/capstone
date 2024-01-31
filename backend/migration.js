// migration.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./User'); // Assuming this is your User model

async function addScoreFieldToUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Fetch all users
        const users = await User.find();

        // Iterate over each user and add the 'score' field if it doesn't exist
        for (const user of users) {
            if (typeof user.score === 'undefined') {
                user.score = 0; // Set default score
                await user.save(); // Save the user document
            }
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}

addScoreFieldToUsers();
