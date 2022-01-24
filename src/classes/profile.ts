import { Guild, GuildMember } from "discord.js";
import { save_profile } from "../datacontrol/profiles"
import { Transaction } from "./transaction";
import { botclient } from "../botclient";

export class Profile{
   user_id: string;
   guild_id: string;

   money: number;

   constructor(member: GuildMember){
      this.user_id = member.id;
      this.guild_id = member.guild.id;
      this.money = 20;
   }

   get_member(): GuildMember|undefined{
      return this.get_guild()?.members.cache.get(this.user_id);
   }
   get_guild(): Guild|undefined{
      return botclient.guilds.cache.get(this.guild_id);
   }

   enough_money(count: number): boolean{
      return this.money >= count;
   }
   do_transaction(trans: Transaction): void{
      
   }
}