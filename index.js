let restify = require("restify");
let line = require("@line/bot-sdk");

const LINE_CONFIG = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

let server = restify.createServer();
server.listen(process.env.PORT || 3000, function() {
    console.log("Node is running.");
});

server.use(line.middleware(LINE_CONFIG));

let bot = new line.Client(LINE_CONFIG);

server.post('/webhook', (req, res, next) => {
    res.send(200);

        let events_processed = [];

        // イベントオブジェクトを順次処理。
        req.body.events.map((event) => {
            // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
            if (event.type == "message" || event.message.type == "text"){
                // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
                if (event.message.text == "こんにちは"){
                    // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                    events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "これはこれは"
                    }));
                }
            }
        });

        // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
        Promise.all(events_processed).then(
            (response) => {
                console.log(`${response.length} events processed.`);
            }
        );
    });
