let restify = require('restify');
let line = require("@line/bot-sdk");


const LINE_CONFIG = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

let server = restify.createServer();
server.listen(process.env.PORT || 3000, function() {
  console.log("Node is running...");
});

server.use(line.middleware(LINE_CONFIG));

server.post('/webhook', (req, res, next) => {
    res.send(200);
    console.log(req.body);
    });

let bot = new line.Client(LINE_CONFIG);
server.post('/webhook', (req, res, next) => {

    res.send(200);

    let events_processed = [];

    req.body.events.map((event) => {

        if (event.type == "message" || event.message.type == "text"){

            if (event.message.text == "こんにちは"){

                events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "これはこれは"
                }));
            }
        }
    });


    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} events processed.`);
        }
    );
});
