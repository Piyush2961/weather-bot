const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = "5813477685:AAHrLpx1hVjepNcRzhQfOQaIYHPwss59J6w";
const appID = "6f48dbd9fdabe835716e7799ce8541b6";

const weatherEndpoint = (city) =>
  `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${appID}`;

const weatherIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;

const weatherHtmlTemplate = (name, main, weather, wind, clouds) =>
  `The weather in <b>${name}</b>:
<b>${weather.main}</b> - ${weather.description}
Temperature: <b>${main.temp} °C</b>
Pressure: <b>${main.pressure} hPa</b>
Humidity: <b>${main.humidity} %</b>
Wind: <b>${wind.speed} meter/sec</b>
Clouds: <b>${clouds.all} %</b>
`;

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true,
});

// Function that gets the weather by the city name
const getWeather = (chatId, city) => {
  const endpoint = weatherEndpoint(city);

  axios.get(endpoint).then(
    (resp) => {
      const { name, main, weather, wind, clouds } = resp.data;

      bot.sendPhoto(chatId, weatherIcon(weather[0].icon));
      bot.sendMessage(
        chatId,
        weatherHtmlTemplate(name, main, weather[0], wind, clouds),
        {
          parse_mode: "HTML",
        }
      );
    },
    (error) => {
      console.log("error", error);
      bot.sendMessage(
        chatId,
        `Ooops...I couldn't be able to get weather for <b>${city}</b>`,
        {
          parse_mode: "HTML",
        }
      );
    }
  );
};

// Listener (handler) for telegram's /weather event
bot.onText(/\/weather/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match.input.split(" ")[1];

  if (city === undefined) {
    bot.sendMessage(chatId, `Please provide city name`);
    return;
  }
  getWeather(chatId, city);
});

// Listener (handler) for telegram's /start event
// This event happened when you start the conversation with both by the very first time
// Provide the list of available commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at <b>Weather at any Time Bot</b>, Thank you for using my service
    
Available commands:

/weather <b>city</b> - shows weather for selected <b>city</b>
  `,
    {
      parse_mode: "HTML",
    }
  );
});
