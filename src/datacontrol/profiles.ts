import { Guild, GuildMember } from "discord.js";
import { QueryEvent, QueryEventEmitter } from "../classes/queryEvent";
import * as fs from "node:fs";
import { Profile, ReadonlyProfile } from "../classes/profile";
import { Transaction } from "../classes/transaction";
import { blockQuote } from "@discordjs/builders";

class ProfileTimeoutError extends Error{
   constructor(message: string){
      super(message);
      this.name = "ProfileTimeoutError"
   }
}

let profilesInfo: {
   [key: string]: {
      isReserved: boolean,
      freeEvent: QueryEvent
   }
} = {};

function _getKey(member: GuildMember): string{
   return `${member.guild.id}:${member.id}`;
}
function _existsGuild(guild_id: string){
   return fs.existsSync(`./data/profiles/${guild_id}`);
}
function _existsProfile(member: GuildMember): boolean{
   return _existsGuild(member.guild.id)
       && fs.existsSync(`./data/profiles/${member.guild.id}/${member.id}.json`);
}
function _parseProfile(member: GuildMember): Profile{
   if(!_existsGuild(member.guild.id))
      fs.mkdirSync(`./data/profiles/${member.guild.id}`);
   if(!_existsProfile(member)){
      let profile = new Profile(member);
      let json    = JSON.stringify(profile);
      fs.writeFileSync(`./data/profiles/${member.guild.id}/${member.id}.json`, json, {encoding: "utf-8"});
      
      return profile;
   }
   let json: string = 
      fs.readFileSync(`./data/profiles/${member.guild.id}/${member.id}.json`, {encoding: "utf-8"});
 
   let profile = JSON.parse(json);
   
   profile = Object.setPrototypeOf(profile, Profile.prototype);
   (profile as Profile).history.map(trans => {
      trans = Object.setPrototypeOf(trans, Transaction.prototype);
      trans.time = new Date(trans.time);
      return trans;
   });
 
   return profile;
}
function _setReserve(key: string, reserved: boolean){
   if(!(key in profilesInfo))
      profilesInfo[key] = {
         isReserved: reserved,
         freeEvent: new QueryEvent()
      }
   profilesInfo[key].isReserved = reserved;
}
function _isReserved(key: string): boolean{
   return profilesInfo[key].isReserved;
}
function _free(key: string){
   _setReserve(key, false);
   console.log(`activated free QueryEvent for "${key}"`);
   profilesInfo[key].freeEvent.emit();
}
async function _getProfile(member: GuildMember, ms: number = -1): Promise<Profile>{
   const key = _getKey(member);

   return new Promise((resolve, reject)=>{
      if(ms > 0){
         setTimeout(()=>{
            reject(new ProfileTimeoutError(`Cannot get profile "${key}" for ${ms}ms`));
            return;
         }, ms);
      }

      let returnResult = function(){
         _setReserve(key, true);
         let profile = _parseProfile(member);
         resolve(profile);
      }

      if(!(key in profilesInfo)){
         profilesInfo[key] = {
            isReserved: true,
            freeEvent: new QueryEvent()
         };
         returnResult();
         return;
      }

      if(_isReserved(key))
         profilesInfo[key].freeEvent.add(returnResult);
      else
         returnResult();
   });
}
async function _saveProfile(profile: Profile): Promise<void>{
   if(!_existsGuild(profile.guildId))
      fs.mkdirSync(`./data/profiles/${profile.guildId}`);
   let json = JSON.stringify(profile);
   fs.writeFileSync(`./data/profiles/${profile.guildId}/${profile.userId}.json`, json);
}

export namespace datacntl{

   /**
    * Результат дії функції doTransaction
    */
   export enum TransactionResult{
      /**
       * Транзакція пройшла успішно!
       */
      Success = "Success",
      /**
       * Недостатньо коштів для здіснення транзакції.
       */
      NoMoney = "NoMoney",
      /**
       * Минуло занадто багато часу, транзакцію відминено.
       */
      Timeout = "Timeout"
   }

   /**
    * Посилає запрос до бази данних для здійснення транзакції.
    * @param member Користувач профілю.
    * @param trans Транзакція.
    * @param ms Ліміт часу на здійснення транзакції.
    */
   export async function doTransaction(member: GuildMember, trans: Transaction, ms: number = -1): Promise<TransactionResult>{
      let profile: Profile;
      try{
         profile = await _getProfile(member, ms);
      }
      catch(error){
         if(error instanceof ProfileTimeoutError)
            return TransactionResult.Timeout;
         throw error;
      }

      if(trans.amount < 0 && profile.enoughMoney(trans.amount)){
         if(profile.enoughMoney(trans.amount))
            profile.lostMoney += -trans.amount;
         else{
            _free(profile.getKey());
            return TransactionResult.NoMoney;
         }
      }
      profile.money += trans.amount;
      profile.addHistory(trans);

      await _saveProfile(profile);
      _free(profile.getKey());

      return TransactionResult.Success;
   }

   /**
    * Повертає незміняємий профиль користувача.
    * @param member Користувач профілю.
    */
   export async function getProfile(member: GuildMember): Promise<ReadonlyProfile>{
      let profile = await _parseProfile(member);
      return profile as ReadonlyProfile;
   }
}

export function block(member: GuildMember){
   let key = _getKey(member);
   _setReserve(key, true);
}