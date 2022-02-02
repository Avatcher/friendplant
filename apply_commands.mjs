import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "./build/config.js";

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
   new SlashCommandBuilder()
      .setName("get_emojis")
      .setDescription("Получить список всех используемых ботом эмодзи."),
   new SlashCommandBuilder()
      .setName("profile")
      .setDescription("Посмотреть свой профиль."),
   new SlashCommandBuilder()
      .setName("transfer")
      .setDescription("Перевести средства на чужой счет")
      .addUserOption(option => option
         .setName("to_user")
         .setDescription("Пользователь кому переведутся деньги")
         .setRequired(true)
      )
      .addIntegerOption(option => option
         .setName("amount")
         .setDescription("Объем переведенных средств")
         .setMinValue(1)
         .setRequired(true)
      )
].map(cmd => cmd.toJSON());
console.log(commands);

const rest = new REST({version: '9'})
   .setToken(config.bot_token);

rest.put(Routes.applicationCommands(config.bot_clientid), { body: commands })
   .then(() => console.log("[cmds] Succesfully applied commands."))
   .catch(console.error);