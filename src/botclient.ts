import { Client, Intents } from "discord.js";

export let botclient: Client = new Client({
   intents: [ Intents.FLAGS.GUILDS ]
});