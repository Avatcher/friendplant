import { BaseCommandInteraction, GuildMember } from "discord.js";
import { command, adminCommand } from "../inters/cmds";
import { block } from "../datacontrol/profiles";

adminCommand("foo", async (inter: BaseCommandInteraction)=>{
   //block(inter.member as GuildMember);
   await inter.reply("amogus");
});