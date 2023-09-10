const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/discord_database', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

const userSchema = new mongoose.Schema({
    userid: String,
    username: String,
    gold: { type: Number, default: 0 }, // Initialize default values
    pepos: { type: Number, default: 0 } // Initialize default values
});

const User = mongoose.model('User', userSchema);

// Create a route to handle incoming data from the Discord bot
app.post('/storeUserID', async (req, res) => {
    const { userId, username, gold, pepos } = req.body;
    console.log(userId, username, gold, pepos);

    try {
        let user = await User.findOne({ userid: userId });

        if (!user) {
            user = new User({
                userid: userId,
                username: username,
                gold: gold,
                pepos: pepos
            });
        } else {
            user.username = username;

            if (!isNaN(gold) && !isNaN(pepos)) {
                user.gold += gold;
                user.pepos += pepos;
            } else {
                // Handle invalid data here, such as returning an error response.
                return res.status(400).json({ message: 'Invalid gold or pepos value' });
            }
        }

        await user.save();
        res.status(200).json({ message: 'User data updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(5000, () => {
    console.log('Server running on port 5000');
});
