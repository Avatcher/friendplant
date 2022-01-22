import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { bot_token, bot_id } from "./build/config.js";

const commands = [
   new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Проверка работает ли сейчас бот."),
   new SlashCommandBuilder()
      .setName("info")
      .setDescription("Получить информацию о боте."),
   new SlashCommandBuilder()
      .setName("foo")
      .setDescription("Тестовая команда. ( Не пробуйте использовать )"),
].map(cmd => cmd.toJSON());
//console.log(commands);

const rest = new REST({version: '9'})
   .setToken(bot_token);

rest.put(Routes.applicationCommands(bot_id), { body: commands })
   .then(() => console.log("[cmds] Succesfully applied commands."))
   .catch(console.error);