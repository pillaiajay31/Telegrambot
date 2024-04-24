const fs = require("fs");
const axios = require('axios')
const Telegram = require("node-telegram-bot-api");
var MY_TOKEN = "7093442130:AAHpLGwyALwDPC48CAFrppyHR7H37kDo8KU";
const bot = new Telegram(MY_TOKEN, { polling: true });

const { axiosInstance } = require("./lib/axios");

function sendMessage(chatId, messageText) {
    bot.sendMessage(chatId, messageText);
}

async function sendImage(messageObj, imageUrl) {
    return axiosInstance.post("sendPhoto", {
        chat_id: await messageObj.chat.id,
        photo: imageUrl,
    });
}

async function weather(cityName) {
    try {
        const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=13df68293dc06abdbe2603aa87e4a2ff`
        );
        const data = response.data;
        const weather = data.weather[0].description;
        const temperature = data.main.temp - 273.15;
        const city = data.name;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const windSpeed = data.wind.speed;
        const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;
        return message;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return "City not found. Please check the city name and try again.";
        } else {
            return "An error occurred while fetching weather data. Please try again later.";
        }
    }
}

async function sendRandomMemes(messageObj) {
    const { default: fetch } = await import('node-fetch');
    const randomImageUrl = await fetch('https://meme-api.com/gimme');
    const jsonImage = await randomImageUrl.json();

    return axiosInstance.post("sendPhoto", {
        chat_id: messageObj.chat.id,
        photo: jsonImage.url,
    });
}


async function  handleMessage(messageObj) {
    const messageText = messageObj.text || "";
    const lowerMessage = messageText.toLowerCase();

    if (messageText.charAt(0) === "/") {
        const parts = lowerMessage.split(" ");
        const command = parts[0].substr(1);
        const args = parts.slice(1);

        switch (command) {
            case "start":
                sendMessage(
                    messageObj.chat.id, "Hey this bot is build by Ajay Pillai \nCurrent workings commands are:\n/WhatsApp \n/LinkedIn \n/Github \n/aboutme\n/RandomMemes \n/Weather"
                );
                break;
            case "linkedin":
                sendMessage(
                    messageObj.chat.id, "Networking is key to success. Let's connect on LinkedIn! \nClick Here: https://www.linkedin.com/in/ajay-pillai-35304b202/"
                );
                break;
            case "github":
                sendMessage(
                    messageObj.chat.id, "My GitHub profile is where I showcase my coding journey. Join me! \nClick Here: https://github.com/pillaiajay31"
                );
                break;
            case "whatsapp":
                sendMessage(
                    messageObj.chat.id, "WhatsApp is my go-to for quick conversations. Connect with me there! \nClick Here: https://wa.me/9712300963?text=Hello,%20Ajay"
                );
                break;
            case "aboutme":
                sendMessage(
                    messageObj.chat.id, "~I'm Ajay Pillai, a B.Tech CSE student at Parul University\n~I'm passionate about technology and love learning new things.\n~I've completed internships as a:\n~Software Developer (Dec 2023 - Current), at iTechnoSol Inc\n~Backend Registration at TiEcon Vadodara (15 days Internship),and\n~Admin Executive at Parul University (Dec 2021 - April 2022)."
                );
                break;
            case "randommemes":
                sendRandomMemes(messageObj);
                break;
            case "weather":
                if (args.length > 0) {
                    const cityName = args.join(" ");
                    try {
                        const weatherMessage = await weather(cityName);
                        sendMessage(
                            messageObj.chat.id,
                            weatherMessage
                        );
                    } catch (error) {
                        sendMessage(
                            messageObj.chat.id,
                            "An error occurred while fetching weather data. Please try again later."
                        );
                    }
                } else {
                    sendMessage(
                        messageObj.chat.id,
                        "Please enter a city name after the /weather command, like this: /weather London"
                    );
                }
                break;
            default:
                sendMessage(
                    messageObj.chat.id, "Unrecognized command. Say what?"
                );
                break;
        }
    } else {
        sendMessage(messageObj.chat.id, messageText);
    }
}

bot.on("message", handleMessage);

module.exports = { handleMessage };
