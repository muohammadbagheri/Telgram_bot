const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const TOKEN = "7444335261:AAEd8AW_2ljTgPIUaAX3xmEBUgiy10X0gD4";
const CHANNEL = "@agahiha24";

app.post("/", async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) return res.sendStatus(200);

  const text = message.text;
  const chatId = message.chat.id;

  // ارسال به کانال
  await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: CHANNEL,
    text: `آگهی جدید:

${text}`
  });

  // پاسخ به کاربر
  await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: chatId,
    text: "آگهی شما دریافت شد و به کانال ارسال شد."
  });

  res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Bot server is running on port " + PORT);
});
