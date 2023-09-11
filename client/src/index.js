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

        const pepos = Math.floor(Math.random() * 10);
        const gold = Math.floor(Math.random() * 5);
        const xp = Math.floor(Math.random() * 200);
        const level = 1;

const place = 'Port Royal';
const place1 = 'Sampania';
const place2 = 'Tortuga';
const place3 = 'Padres Del Fuego';
const place4 = 'Kings Landing';
const place5 = 'Winterfell';
const place6 = 'Skyfloor';
const place7 = 'The Wall';
const place8 = 'The Heaven';
const place9 = 'The Hell';
const place10 = 'The Final Destination';
const place11 = 'The Ending Cave';

const character1 = 'Bug De La Muerte';
const character2 = 'Alvin The Chipmunk';
const character3 = 'The Black Shadow';
const character4 = 'The hunted Pirate';
const character5 = 'Doffy de Quiny';
const character6 = 'The hound';
const character7 = 'Tyrion';
const character8 = 'Alessandro Lucca';
const character9 = 'Sekhio The Master';
const character10 = 'Zoro The Pirate Hunter';

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

        try {
            await axios.post('http://localhost:5000/storeUserID', {
                userId: message.author.id,
                username: message.author.username,
                pepos,
                gold,
                xp,
            });

            message.reply('***You are hunting for treasure***');
            message.reply(`***You found ${pepos} pepos and ${gold} gold and increased your xp by ${xp }***`);
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
            const { pepos, gold , xp } = response.data;
            message.reply(`***You have ${pepos} pepos and ${gold} gold in your vault with ${xp}xp***`);
        } catch (error) {
            console.error('Error fetching user bank info:', error);
            message.reply('***An error occurred while fetching your bank info.***');
        }
    }
    else if (message.content === 'fight'){
        const fight1 = Math.floor(Math.random() * 10);
        message.reply(`***⚔️The fighter is getting ready⚔️***`);
        if(fight1 == 1){
            message.reply(`***You are fighting ${character1}***`);
        }
        else if (fight1 == 2){
            message.reply(`***You are fighting ${character2}***`);
        }
        else if (fight1 == 3){
            message.reply(`***You are fighting ${character3}***`);
        }
        else if (fight1 == 4){
            message.reply(`***You are fighting ${character4}***`);
        }
        else if (fight1 == 5){
            message.reply(`***You are fighting ${character5}***`);
        }
        else if (fight1 == 6){
            message.reply(`***You are fighting ${character6}***`);
        }
        else if (fight1 == 7){
            message.reply(`***You are fighting ${character7}***`);
        }
        else if (fight1 == 8){
            message.reply(`***You are fighting ${character8}***`);
        }
        else if (fight1 == 9){
            message.reply(`***You are fighting ${character9}***`);
        }
        else if (fight1 == 10){
            message.reply(`***You are fighting ${character10}***`);
        }
    }

    const userId = message.author.id;
    try {
        const response = await axios.get(`http://localhost:5000/getUserBankInfo/${userId}`);
        const {  xp } = response.data;
        if(xp >= 500){
            message.reply(`***You reached level ${level + 1}***`);
        }
    } catch (error) {
        console.error('Error fetching user bank info:', error);
        message.reply('***An error occurred while fetching your bank info.***');
    }
    
});


client.login(process.env.TOKEN);
