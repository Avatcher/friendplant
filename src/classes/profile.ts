import { Guild, GuildMember } from "discord.js";
import { Transaction } from "./transaction";
import { botclient } from "../botclient";

export class Profile{
   userId: string;
   guildId: string;

   money: number;
   lostMoney: number;
   history: Array<Transaction>;

   constructor(member: GuildMember){
      this.userId = member.id;
      this.guildId = member.guild.id;
      this.money = 20;
      this.lostMoney = 0;
      this.history = [
         new Transaction()
            .setAmount(+20)
            .setPreview("Стартовый капитал")
      ];
   }

   getMember(): GuildMember|undefined{
      return this.getGuild()?.members.cache.get(this.userId);
   }
   getGuild(): Guild|undefined{
      return botclient.guilds.cache.get(this.guildId);
   }
   getKey(): string{
      return `${this.guildId}:${this.userId}`;
   }
   enoughMoney(count: number): boolean{
      return this.money >= count;
   }
   addHistory(trans: Transaction){
      if(this.history.length >= 8)
         this.history.shift();
      this.history.push(trans);
   }  
}

export type ReadonlyProfile = Readonly<Omit<Profile, "addHistory">>;