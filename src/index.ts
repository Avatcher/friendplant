import { BaseCommandInteraction, Client, CommandInteraction, Intents, Interaction, MessageEmbed } from "discord.js";
import { get_command, init_cmds } from "./inters/cmds";
import { config } from "./config";
import { botclient } from "./botclient";

import * as readline from "node:readline";
import { InteractionResponseType } from "discord-api-types";

botclient.once("ready", async () => {
   if(config.bot_activity.length != 0){
      botclient.user?.setActivity({
         name: config.bot_activity,
         type: 'PLAYING'
      });
   }

   init_cmds();
   console.log("[bot] Bot is ready! --------------\n");
});

botclient.on("interactionCreate", async (inter: Interaction)=> {
   if(!inter.isCommand()) return;
   await get_command(inter.commandName)(inter)
      .catch(error=>{
         console.error(error);

         let embed = new MessageEmbed()
            .setTitle(":name_badge: Произошла ошибка!")
            .setDescription(`\`\`\`\n${error}\n\`\`\``)
            .setColor("RED");

         inter.reply({ embeds: [ embed ]});
      });
});

botclient.login(config.bot_token);