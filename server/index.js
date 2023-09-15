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
    pepos: { type: Number, default: 0 }, // Initialize default values
    xp : { type: Number, default: 0 },
    items : [String],
});

const User = mongoose.model('User', userSchema);

// Create a route to handle incoming data from the Discord bot
app.post('/storeUserID', async (req, res) => {
    const { userId, username, gold, pepos, xp, founditem } = req.body;
    console.log(userId, username, gold, pepos, xp, founditem);

    try {
        let user = await User.findOne({ userid: userId });

        if (!user) {
            user = new User({
                userid: userId,
                username: username,
                gold: gold,
                pepos: pepos,
                xp: xp,
                items : [founditem],
            });
        } else {
            user.username = username;

            if (!isNaN(gold) && !isNaN(pepos) && !isNaN(xp)) {
                user.gold += gold;
                user.pepos += pepos;
                user.xp += xp;
                user.items = founditem;

                // Check if user reached a new level
                // const newLevel = Math.floor(user.xp / 10000);
                // if (newLevel > user.level) {
                //     user.level = newLevel;
                // }

                // Add the items to the user's items array
                // if (Array.isArray(items)) {
                //     user.items = user.items.concat(items);
                // }
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

app.get('/getUserBankInfo/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({ userid: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { pepos, gold, xp } = user;
        res.status(200).json({ pepos, gold , xp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(5000, () => {
    console.log('Server running on port 5000');
});
