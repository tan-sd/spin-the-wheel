import constants as keys
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# def main():
#     updater = Updater(keys.API_KEY, use_context=True)
#     dp = updater.dispatcher
#     dp.add_handler(CommandHandler('spin', spin_wheel))

#     updater.start_polling()
#     updater.idle()

BOT_USERNAME = '@sd_spin_bot'

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Hello there! I'm a bot. What's up?")

def handle_response(text: str) -> str:
    # chat_id = update.message.chat_id

    # context.bot.send_document(chat_id, document=blob, filename='wheel.gif')

    # update.message.reply_text("Hello, its working!")

    processed: str = text.lower()

    if 'hello' in processed:
        return "It's working!"
    return "I don't understand!"
 
    # return "Hello, its working!"

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Get basic info of the incoming message
    message_type: str = update.message.chat.type
    text: str = update.message.text

    # Print a log for debugging
    print(f'User ({update.message.chat.id}) in {message_type}: "{text}"')

    # React to group messages only if users mention the bot directly
    if message_type == 'group':
        # Replace with your bot username
        if BOT_USERNAME in text:
            new_text: str = text.replace(BOT_USERNAME, '').strip()
            response: str = handle_response(new_text)
        else:
            return  # We don't want the bot respond if it's not mentioned in the group
    else:
        response: str = handle_response(text)

    # Reply normal if the message is in private
    print('Bot:', response)
    await update.message.reply_text(response)

if __name__ == '__main__':
    print("Starting bot...")

    app = Application.builder().token(keys.API_KEY).build()
    app.add_handler(CommandHandler("spin", start_command))
    app.add_handler(MessageHandler(filters.TEXT, handle_message))
    app.run_polling()