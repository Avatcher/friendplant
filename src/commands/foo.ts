import { BaseCommandInteraction, GuildMember } from "discord.js";
import { command } from "../inters/cmds";
import { get_profile, save_profile, free_profile } from "../datacontrol/profiles";
import { Profile } from "../classes/profile";

function sleep(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

command("foo", async (inter: BaseCommandInteraction)=>{
   await inter.reply("Getting your profile...");

   let profile = await get_profile(<GuildMember>inter.member);
   
   await inter.editReply("Doing something with your profile...");
   console.log(profile);
   console.log(Object.getPrototypeOf(profile));
   console.log("");
   console.log(Profile);
   await sleep(3000);

   await free_profile(profile);

   await inter.editReply("Done!");
});