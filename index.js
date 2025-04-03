const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  telegramId: String,
  phone: String,
  name: String,
  registered: Boolean
});

const adSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  phone: String,
  imageId: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Ad = mongoose.model('Ad', adSchema);

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ telegramId: chatId });

  if (!user) {
    await User.create({ telegramId: chatId, registered: false });
    bot.sendMessage(chatId, 'خوش آمدید! لطفاً شماره همراه خود را وارد کنید:');
  } else {
    bot.sendMessage(chatId, 'شما قبلاً ثبت‌نام کرده‌اید. برای ارسال آگهی، عنوان آگهی را بنویسید.');
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ telegramId: chatId });
  if (!user || user.registered) return;

  user.phone = msg.text;
  user.registered = true;
  await user.save();
  bot.sendMessage(chatId, 'ثبت‌نام شما با موفقیت انجام شد!');
});
