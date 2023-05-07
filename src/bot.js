const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const { generateSpinWheel } = require("./createSpinWheel.js");

const bot = new TelegramBot(process.env.API_KEY, { polling: true });

const FRAME_DELAY_MS = 50;
const MAX_DURATION_MS = 5000;
const LAST_FRAME_DURATION_MS = 1000 / FRAME_DELAY_MS;
const MIN_ANGLE = 360;
const MAX_ANGLE = 360 * 8;
const DURATION = MAX_DURATION_MS / FRAME_DELAY_MS;

const styles = {
    canvas: {
        width: 300,
        height: 300,
    },
};

// Matches "/echo [whatever]"
bot.onText(/\/spin (.+)/, (msg, match) => {
    bot.on("polling_error", console.log);
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const fullCommand = match[1]; // the captured "whatever"
    const splitCommand = fullCommand.split(",").map((word) => word.trim());
    const numWords = splitCommand.length;

    if (numWords <= 1) {
        bot.sendMessage(chatId, "Please insert more than one word");
    } else {
        bot.sendMessage(chatId, "Wait ah. Generating wheel. 🎡");

        const randomEndAngle =
            Math.random() * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;

        const wheel = generateSpinWheel(
            splitCommand,
            randomEndAngle,
            DURATION,
            FRAME_DELAY_MS,
            styles.canvas.width,
            styles.canvas.height,
            LAST_FRAME_DURATION_MS
        );

        bot.sendDocument(chatId, wheel.getGif())
            .then((m) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        bot.deleteMessage(chatId, m.message_id)
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }, MAX_DURATION_MS + 1000);
                });
            })
            .then(() => {
                bot.sendPhoto(chatId, wheel.getLastFrame()).then(() => {
                    bot.sendMessage(chatId, `🏆: ${wheel.selectedOption}!`);
                });
            });
    }
});
