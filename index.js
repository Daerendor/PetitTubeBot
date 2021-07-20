const Discord = require("discord.js"),
    client = new Discord.Client(),
    request = require("request"),
    cheerio = require("cheerio"),
    fs = require("fs"),
    token = fs.readFileSync("token.txt", "utf8").trim();

console.log("Connecting to Discord...");
let start = Date.now();
client.on("ready", () => {
    console.log(`Connected in ${Date.now() - start}ms - Logged in as: ${client.user.tag}`);
});

client.on("message", async msg => {
    let x = client.user.id,
        mentioned = msg.content.startsWith(`<@${x}>`) || msg.content.startsWith(`<@!${x}>`);
    if (mentioned) {
        msg.channel
            .send({
                embed: {
                    description: "⏳ Loading... ⏳",
                    color: "#ff0000",
                },
            })
            .then(sentMsg => {
                let t = Date.now();
                request(
                    {
                        url: "http://petittube.com/",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (compatible; PetitTubeBot/1.0; +http://github.com/jlij/PetitTubeBot)",
                        },
                    },
                    (err, resp, html) => {
                        if (err) return msg.reply(`Uh oh, a request error D:\n\`${err}\``).catch();
                        let r = Date.now() - t,
                            idPref = "https://www.youtube.com/embed/",
                            idSuff = "?version=3&f=videos&app=youtube_gdata&autoplay=1",
                            link =
                                "https://www.youtube.com/watch?v=" +
                                cheerio
                                    .load(html)("iframe")
                                    .attr("src")
                                    .substring(idPref.length)
                                    .slice(0, -idSuff.length);

                        sentMsg.edit(`${link} - Loaded in ${r}ms`).catch();
                    }
                );
            })
            .catch();
    }
});

client.login(token);
