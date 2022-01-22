import { Client, Intents, Interaction } from "discord.js";
import { command, get_command, init_cmds } from "./inters/cmds";
import { bot_token } from "./config";
import { botclient } from "./botclient";

botclient.once("ready", async () => {
   init_cmds();
   console.log("Bot is ready!");
});

botclient.on("interactionCreate", async (inter: Interaction)=> {
   if(inter.isCommand())
      return await get_command(inter.commandName)(inter);
});


botclient.login(bot_token);