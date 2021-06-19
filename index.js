const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')

const client = new Discord.Client();
const token = fs.readFileSync('token.txt', 'utf8');

console.log('Connecting to Discord...');
var connectStart = Date.now();
client.on('ready', () => {
    var connectTime = Date.now() - connectStart;
    console.log(`Connected in ${connectTime}ms - Logged in as: ${client.user.tag}`);
});

client.on('message', message => {
    // check if the bot is mentioned
    if (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`)) {
        var requestStart = Date.now();
        request({
            url: 'http://petittube.com/',
            // deliberately using http instead of https for fastest response
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; PetitTubeBot/1.0; +https://github.com/InTheMainframe/PetitTubeBot)',
            },
        }, (error, response, html) => {
            var responseTime = Date.now() - requestStart;
            // an expected iframe tag would look like:
            // <iframe width="630" height="473" src="https://www.youtube.com/embed/dQw4w9WgXcQ?version=3&f=videos&app=youtube_gdata&autoplay=1" frameborder="0" allowfullscreen></iframe>
            // with the youtube embed link being the src attribute, and the example video id being dQw4w9WgXcQ
            var $ = cheerio.load(html); // the whole page as html
            var embedLink = $('iframe').attr('src'); // the embed link (containing the video id)
            var prefix = 'https://www.youtube.com/embed/';
            var suffix = '?version=3&f=videos&app=youtube_gdata&autoplay=1'; // the useless parts of the embed link to ignore
            var videoID = embedLink.substring(prefix.length).slice(0, -suffix.length); // leaves us with the video id
            var videoLink = 'https://www.youtube.com/watch?v=' + videoID; // make a normal youtube link we can send
            message.channel.send(`${videoLink} - Loaded in ${responseTime}ms`);
        });
    }
});

client.login(token);
