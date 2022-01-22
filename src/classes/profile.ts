import { Guild, GuildMember } from "discord.js";
import { botclient } from "../botclient";

export class Profile{
   user_id: string;
   guild_id: string;

   constructor(member: GuildMember){
      this.user_id = member.id;
      this.guild_id = member.guild.id;
   }

   get_member(): GuildMember|undefined{
      return this.get_guild()?.members.cache.get(this.user_id);
   }
   get_guild(): Guild|undefined{
      return botclient.guilds.cache.get(this.guild_id);
   }
}