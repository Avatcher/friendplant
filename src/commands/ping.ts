import { BaseCommandInteraction, Interaction } from "discord.js";
import { command } from "../inters/cmds";

command("ping", async (inter: BaseCommandInteraction) => {
   inter.reply("Pong!");
   
   
});