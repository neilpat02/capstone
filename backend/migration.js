require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./User');

async function addFieldsToUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const users = await User.find();
        for (const user of users) {
            let needsUpdate = false;
            if (user.softwareScore === undefined) {
                user.softwareScore = 0;
                needsUpdate = true;
            }
            if (user.hardwareScore === undefined) {
                user.hardwareScore = 0;
                needsUpdate = true;
            }
            // Instead of checking for undefined, force update or set a past default date
            if (user.lastUploadToBotTimestamp === null || user.lastUploadToBotTimestamp === undefined) {
                user.lastUploadToBotTimestamp = new Date("1970-01-01"); // Setting a default past date
                needsUpdate = true;
            }

            if (needsUpdate) {
                // Mark as modified if necessary
                user.markModified('lastUploadToBotTimestamp');
                await user.save();
                console.log(`Updated user ${user.email}`);
            }
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

addFieldsToUsers();
