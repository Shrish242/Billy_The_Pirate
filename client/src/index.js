const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
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
let xp = Math.floor(Math.random() * 200);
let level = 1;

const places = [
    'Port Royal',
    'Sampania',
    'Tortuga',
    'Padres Del Fuego',
    'Kings Landing',
    'Winterfell',
    'Skyfloor',
    'The Wall',
    'The Heaven',
    'The Hell',
    'The Final Destination',
    'The Ending Cave',
];

const characters = [
    'Bug De La Muerte',
    'Alvin The Chipmunk',
    'The Black Shadow',
    'The hunted Pirate',
    'Doffy de Quiny',
    'The hound',
    'Tyrion',
    'Alessandro Lucca',
    'Sekhio The Master',
    'Zoro The Pirate Hunter',
];

const items = [
    'Meat',
    'A ship',
    'A boat',
]

const weapons = [
    'A cannon',
    'A rifle',
    'Black Sword',
    'Delina Sword',
    'Axe',
    'Bow & Arrow',
    'Knife',
]

const crewmember = [
    'A crew-member: Sworsdman',
    'A crew-member: Sniper',
    'A crew-member: Cook',
    'A crew-member: Doctor',
    'A crew-member: Navigator',
    'A crew-member: Mechanic',
    'A crew-member: Helsmann',
    'A crew-member: Fighter',
    'A crew-member: Pet',
]

const devilfruit = [
    'A devil fruit: Gomu Gomu no Mi : Model Sun God',
    'A devil fruit: Bara Bara no Mi : Model Bear',
    'A devil fruit: Sube Sube no Mi : Model Slippery',
    'A devil fruit: Bomu Bomu no Mi : Model Bomb',
    'A devil fruit: Kilo Kilo no Mi : Model Ton',
    'A devil fruit: Hana Hana no Mi : Sprout',
    'A devil fruit: Doru Doru no Mi : Wax',
    'A devil fruit: Baku Baku no Mi : Model Alpaca',
    'A devil fruit: Mane Mane no Mi : Clone',
    'A devil fruit: Toge Toge no Mi : Spikes',
]

const rareitems = [
    'A final Map',
    'A Map Reader',
    'Healing Potion',
    'A treasure',
    '100M chest',
    'A 5 storey ship',
    'A 10 storey ship',

]

const rarestofall = [
    'Final Treasure',
]

// Define a cooldown map to keep track of user cooldowns
const cooldowns = new Map();

client.on('ready', () => {
    console.log(`${client.user.tag} is ready!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore messages from bots

    if (message.content === 'Set Sail') {
        message.reply(`***You are ready to sail ${message.author.username}***`);
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
            message.reply('***You are already a pirate.***');
        }
    } else if (message.content === 'hunt') {
        const now = Date.now();
        const cooldownTime = 30 * 60 * 1000; // 30 minutes in milliseconds

        if (cooldowns.has(message.author.id)) {
            const lastTime = cooldowns.get(message.author.id);
            const timeRemaining = cooldownTime - (now - (lastTime || 0));

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
            message.reply(`***You found ${pepos} pepos and ${gold} gold and increased your xp by ${xp}***`);
        } catch (error) {
            console.error('Error sending hunt results to backend:', error);
            message.reply('***An error occurred while processing your request.***');
        }
    } else if (message.content === '2') {
        message.reply(`***You are at ${places[0]}***`);
    } else if (message.content === 'raid') {
        message.reply(`***You are raiding ${places[0]}***`);
    } else if (message.content === 'bank') {
        const userId = message.author.id;

        try {
            const response = await axios.get(`http://localhost:5000/getUserBankInfo/${userId}`);
            const { pepos, gold, xp } = response.data;
            message.reply(`***You have ${pepos} pepos and ${gold} gold in your vault with ${xp} xp***`);
        } catch (error) {
            console.error('Error fetching user bank info:', error);
            message.reply('***An error occurred while fetching your bank info.***');
        }
    } else if (message.content === 'fight') {
        const fight1 = Math.floor(Math.random() * 10);
        message.reply(`***⚔️The fighter is getting ready⚔️***`);
        if (fight1 >= 1 && fight1 <= characters.length) {
            message.reply(`***You are fighting ${characters[fight1 - 1]}***`);
        }
    } 
    else if (message.content === 'travel') {
        const travel1 = Math.floor(Math.random() * places.length);
        message.reply(`***🚢The ship is getting ready🚢***`);
        if (travel1 >= 0 && travel1 < places.length) {
            if (pepos < 100 || gold < 100) {
                axios.post('http://localhost:5000/storeUserID', {
                    userId: message.author.id,
                    username: message.author.username,
                    pepos: -100,
                    gold: -5,
                    xp: 0,
                });
                message.reply(`***You are travelling to ${places[travel1]}***`);
            } else {
                message.reply(`***You don't have enough pepos or gold to travel***`);
            }
        }
    }
    else if ( message.content === 'explore'){
        const explore1 = Math.floor(Math.random() * 600);
        if(explore1 >= 0 && explore1 < 10){
            exploreitems = Math.floor(Math.random() * items.length);
        if(exploreitems >= 0 && exploreitems < items.length){     
            message.reply(`***You found ${items[exploreitems]}***`);
        }
        }
        else if(explore1 >= 10 && explore1 < 20){
            exploreweapons = Math.floor(Math.random() * weapons.length);
        if(exploreweapons >= 0 && exploreweapons < weapons.length){
            message.reply(`***You found ${weapons[exploreweapons]}***`);
        }
        }
        else if(explore1 >= 20 && explore1 < 30){
            explorecrewmember = Math.floor(Math.random() * crewmember.length);
        if(explorecrewmember >= 0 && explorecrewmember < crewmember.length){
            message.reply(`***You found ${crewmember[explorecrewmember]}***`);
        }
        }
        else if(explore1 >= 30 && explore1 < 40){
            exploredf = Math.floor(Math.random() * devilfruit.length);
        if(exploredf >= 0 && exploredf < devilfruit.length){
            message.reply(`***You found ${devilfruit[exploredf]}***`);
        }
    }
        else if(explore1 >= 40 && explore1 < 50){
            explorerareitems = Math.floor(Math.random() * rareitems.length);
        if(explorerareitems >= 0 && explorerareitems < rareitems.length){
            message.reply(`***You found ${rareitems[explorerareitems]}***`);
        }
    }
        else if(explore1 >= 50 && explore1 < 60){
            explorerarestofall = Math.floor(Math.random() * rarestofall.length);
        if(explorerarestofall >= 0 && explorerarestofall < rarestofall.length){
            message.reply(`***You found ${rarestofall[explorerarestofall]}***`);
        }
    }
    else if(explore1 >= 60 && explore1 < 100){
        message.reply(`***You found 200 pepos***`);
    }
        else {
            message.reply(`***You found nothing***`);
        }
    }


    const userId = message.author.id;

    try {
        const response = await axios.get(`http://localhost:5000/getUserBankInfo/${userId}`);
        const { xp } = response.data;
        if (xp >= 1000 && xp < 1100) {
            message.reply(`***You reached level ${level + 1}***`);
        }
    } catch (error) {
        console.error('Error fetching user bank info:', error);
        message.reply('***An error occurred while fetching your bank info.***');
    }
});

client.login(process.env.TOKEN);
