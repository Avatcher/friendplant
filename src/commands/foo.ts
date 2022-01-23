import { BaseCommandInteraction, GuildMember } from "discord.js";
import { command } from "../inters/cmds";
import { get_profile, save_profile, free_profile } from "../datacontrol/profiles_control";

function sleep(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

command({name: "foo"}, async (iter: BaseCommandInteraction)=>{
   await iter.reply("Getting your profile...");

   let profile = await get_profile(<GuildMember>iter.member);
   
   await iter.editReply("Doing something with your profile...");
   await sleep(5000);

   await free_profile(profile);

   await iter.editReply("Done!");
});