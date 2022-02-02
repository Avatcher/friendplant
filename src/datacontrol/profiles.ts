import { Profile } from "../classes/profile";
import { GuildMember } from "discord.js";
import { EventEmitter } from "events";
import * as fs from "fs";
import { Transaction } from "../classes/transaction";
import { botclient } from "../botclient";

interface Ireserved{
   [key: string]: {
      is_reserved: boolean,
      free_event: QueueEvent
   }
}
interface IProfilePath{
   guild_id: string;
   member_id: string;
}

class QueueEvent{
   queue: Function[];

   constructor(){
      this.queue = [];
   }

   async call(...args: any[]): Promise<void>{
      let listener: Function|undefined = this.queue.shift();
      if(!listener)
         return;
      await listener(...args);
   }
   add(func: Function){
      this.queue.push(func);
   }
}

let _reservations: Ireserved = {};


function _get_key(profile: GuildMember|Profile): string{
   if(profile instanceof GuildMember)
      return `${profile.guild.id}:${profile.id}`;
   return `${profile.guild_id}:${profile.user_id}`;
}
/**
 * Зарезервировать профиль пользователя.
 * Запрещает доступ к профилю в дргих командах.
 * @param member Пользователь профиля
 */
function _reserve(profile: GuildMember|Profile): void{
   const key: string = _get_key(profile);
   if(key in _reservations){
      _reservations[key].is_reserved = true;
      return;
   }   
   _reservations[key] = {
      is_reserved: true,
      free_event: new QueueEvent()
   };
}
/**
 * Освободить профиль, открыть доступ всем командам. 
 * @param profile Профиль для освобождения
 */
function _free(profile: Profile){
   const key: string = _get_key(profile);
   _reservations[key].is_reserved = false;
   
   console.log(`[dat] '${key}' activated Free-Event.`);
   console.log(`      listeners: '${_reservations[key].free_event.queue.length}'`);

   _reservations[key].free_event.call({
      guild_id: profile.guild_id,
      member_id: profile.user_id
   });}

/**
 * Зарезервирован ли профиль.
 * @param member Пользователь профиля
 * @returns true - зарезервирован, false - свободный доступ
 */
function _is_reserved(member: GuildMember): boolean{
   const key: string = _get_key(member);
   return (key in _reservations) && _reservations[key].is_reserved;
}

/**
 * Записан ли сервер в базе данных
 * @param g_id ID сервера
 * @returns true - записан, false - нет
 */
function _is_guild_exists(g_id: string): boolean{
   return fs.existsSync(`./data/profiles/${g_id}`);
}
/**
 * Записан ли профиль в базе данных
 * @param member Пользователь профиля.
 * @returns true - записан, false - нет
 */
function _is_profile_exists(member: GuildMember): boolean{
   return _is_guild_exists(member.guild.id)
       && fs.existsSync(`./data/profiles/${member.guild.id}/${member.id}.json`);
}

/**
 * Получить профиль из файла.
 * @param member Пользователь профиля.
 * @returns Профиль пользователя.
 */
function _parse_profile(member: GuildMember): Profile{
   if(!_is_guild_exists(member.guild.id))
      fs.mkdirSync(`./data/profiles/${member.guild.id}`);
   
   if(!_is_profile_exists(member)){
      let profile = new Profile(member);
      let json: string = JSON.stringify(profile);
      
      fs.writeFileSync(`./data/profiles/${member.guild.id}/${member.id}.json`, json);
      return profile;
   }
   
   let filestr: string = fs.readFileSync(
      `./data/profiles/${member.guild.id}/${member.id}.json`,
      { encoding: "utf-8" }
   );

   let profile_obj: Object = JSON.parse(filestr);
   profile_obj = Object.setPrototypeOf(profile_obj, Profile.prototype);
   (profile_obj as Profile).history.map(trans =>{
      trans = Object.setPrototypeOf(trans, Transaction.prototype);
      trans.time = new Date(trans.time);
      return trans as Transaction;
   });

   return profile_obj as Profile;
}


/////////////////////
// ВНЕШНИЙ ИНТЕРФЕЙС


export async function get_profile_byID(guild_id: string, user_id: string): Promise<Profile>{
   let member:GuildMember|undefined = botclient.guilds.cache.get(guild_id)
                                    ?.members.cache.get(user_id);
   if(!member)
      throw new Error(`Cannot find user by IDs ${guild_id}:${user_id}`);
   return get_profile(member);
}
/**
  * Получить и зарезервировать профиль пользователя.
  * @param member Пользователь профиля.
  * @returns Профиль.
  */
export async function get_profile(member: GuildMember): Promise<Profile> {
   const key: string = _get_key(member);
   let mem_obj: any

   return new Promise((resolve, reject) => {
      if(!_is_reserved(member)){
         _reserve(member);
         resolve(_parse_profile(member));
         return;
      }

      _reservations[key].free_event.add(() => {
         _reserve(member);
         resolve(_parse_profile(member));
      });
   
      console.log(`[dat] '${key}' added a listener.`);
      console.log(`      listeners: '${_reservations[key].free_event.queue.length}'`);
   })
}

/**
  * Освободить профиль от резервации.
  * @param profile Профиль
  */
export async function free_profile(profile: Profile): Promise<void>{
   _free(profile);
}

/**
  * Сохранить профиль в базу данных.
  * @param profile Профиль.
  */
export async function save_profile(profile: Profile): Promise<void> {
   if(!fs.existsSync(`./data/profiles/${profile.guild_id}`))
      fs.mkdirSync(`./data/profiles/${profile.guild_id}`);
   let json: string = JSON.stringify(profile);

   fs.writeFileSync(`./data/profiles/${profile.guild_id}/${profile.user_id}.json`, json);
}