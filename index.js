let restify = require("restify");
let line = require("@line/bot-sdk");
let apiai = require("apiai-promisified");

const LINE_CONFIG = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};
const APIAI_CLIENT_ACCESS_TOKEN = process.env.APIAI_CLIENT_ACCESS_TOKEN;

let server = restify.createServer();
server.listen(process.env.PORT || 3000, function() {
    console.log("Node is running.");
});

server.use(line.middleware(LINE_CONFIG));

let bot = new line.Client(LINE_CONFIG);
let nlp = new apiai(APIAI_CLIENT_ACCESS_TOKEN, {language: "ja"});

server.post('/webhook', (req, res, next) => {

    res.send(200);

    let events_processed = [];

    req.body.events.map((event) => {

        if (event.type == "message" || event.message.type == "text"){
            events_processed.push(
                nlp.textRequest(event.message.text, {sessionId: event.source.userId}).then(
                    (response) => {
                        console.log(`The action is ${response.result.action}.`);
                        let reply_message;

                        if (response.result.action == "change"){
                                reply_message = `${response.result.parameters.change}`;
                            }
                        else if (response.result.action == "input.unknown"){
                            reply_message = response.result.fulfillment.speech;
                        }

                        return bot.replyMessage(event.replyToken, {
                            type: "text",
                            text: reply_message
                        });
                    }
                )
            );
        }
    });


    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} events processed.`);
        },
        (error) => {
            console.log(error);
        }
    );
});
