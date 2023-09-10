require('dotenv').config();
const axios = require('axios').default;
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});

const place = 'Port Royal';

// Define a cooldown map to keep track of user cooldowns
const cooldowns = new Map();

client.on('ready', () => {
    console.log(`${client.user.tag} is ready!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore messages from bots

    if (message.content === 'Set Sail') {
        message.reply('***Get ready to set sail. We are going for an adventure!***');
        message.reply('***1. Login into your username***');
        message.reply('***2. Continue your journey***');
    } else if (message.content === '1') {
        // Send userId and username to your backend server
        const userId = message.author.id;
        const username = message.author.username;

        try {
            await axios.post('http://localhost:5000/storeUserID', {
                userId,
                username,
            });
            message.reply(`***Welcome ${username} to our adventure!***`);
        } catch (error) {
            console.error('Error sending userId and username to backend:', error);
            message.reply('***You are already and pirate.***');
        }
    } else if (message.content === 'hunt') {
        const now = Date.now();
        const cooldownTime = 30 * 60 * 1000; // 30 minutes in milliseconds

        if (cooldowns.has(message.author.id)) {
            const lastTime = cooldowns.get(message.author.id);
            const timeRemaining = cooldownTime - (now - lastTime);

            if (timeRemaining > 0) {
                message.reply(`***You can't hunt again yet. Please wait ${(timeRemaining / (60 * 1000)).toFixed(1)} minutes.***`);
                return;
            }
        }

        // Set the current time as the last hunt time
        cooldowns.set(message.author.id, now);

        const pepos = Math.floor(Math.random() * 10);
        const gold = Math.floor(Math.random() * 5);

        try {
            await axios.post('http://localhost:5000/storeUserID', {
                userId: message.author.id,
                username: message.author.username,
                pepos,
                gold,
            });

            message.reply('***You are hunting for treasure***');
            message.reply(`***You found ${pepos} pepos and ${gold} gold***`);
        } catch (error) {
            console.error('Error sending hunt results to backend:', error);
            message.reply('***An error occurred while processing your request.***');
        }
    } else if (message.content === '2') {
        message.reply(`***You are at ${place}***`);
    }
    else if(message.content === 'raid'){
        message.reply(`***You are raiding ${place}***`);
    }
    else if (message.content === 'bank') {
        const userId = message.author.id;

        try {
            const response = await axios.get(`http://localhost:5000/getUserBankInfo/${userId}`);
            const { pepos, gold } = response.data;
            message.reply(`***You have ${pepos} pepos and ${gold} gold remaining***`);
        } catch (error) {
            console.error('Error fetching user bank info:', error);
            message.reply('***An error occurred while fetching your bank info.***');
        }
    }
});

client.login(process.env.TOKEN);
