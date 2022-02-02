import { Guild, GuildMember } from "discord.js";
import { save_profile } from "../datacontrol/profiles"
import { Transaction } from "./transaction";
import { botclient } from "../botclient";

export class Profile{
   [key: string]: any;
   user_id: string;
   guild_id: string;

   money: number;
   lost_money: number;
   history: Transaction[];

   constructor(member: GuildMember){
      this.user_id = member.id;
      this.guild_id = member.guild.id;
      this.money = 20;
      this.lost_money = 0;
      this.history = [
         new Transaction(+20)
            .set_preview("Стартовый капитал")
            .set_description(null)
      ];
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
      this.money += trans.count;
      if(trans.count < 0)
         this.lost_money += -trans.count;

      if(this.history.length >= 8)
         this.history.shift();
      this.history.push(trans);
   }
}