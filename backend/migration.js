// migration.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./User'); // Assuming this is your User model

async function addScoreFieldsToUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Fetch all users
        const users = await User.find();

        // Iterate over each user and add the 'softwareScore' and 'hardwareScore' fields if they don't exist
        for (const user of users) {
            let updated = false;
            if (typeof user.softwareScore === 'undefined') {
                user.softwareScore = 0; // Set default software score
                updated = true;
            }
            if (typeof user.hardwareScore === 'undefined') {
                user.hardwareScore = 0; // Set default hardware score
                updated = true;
            }

            // Save the user document if it was updated
            if (updated) {
                await user.save();
                console.log(`Updated user ${user.email}`);
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

addScoreFieldsToUsers();
