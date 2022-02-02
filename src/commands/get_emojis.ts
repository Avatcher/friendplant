import { BaseCommandInteraction } from "discord.js";
import { command } from "../inters/cmds";
import { emojis } from "../config";

command("get_emojis", async (inter)=>{
   await inter.deferReply();

   let text: string = `**The list of the emojis**\n`;
   for(let key in emojis){
      text += emojis[key] + " ";
   }

   await inter.editReply(text);
});