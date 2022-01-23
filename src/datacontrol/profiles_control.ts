import { Profile } from "../classes/profile";
import { GuildMember } from "discord.js";
import { EventEmitter } from "events";
import * as fs from "fs";

interface Ireserved{
   [key: string]: {
      [key: string]: boolean
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

let _reserved: Ireserved = {};
let freeEvent: QueueEvent = new QueueEvent();

/**
 * Зарезервировать профиль пользователя.
 * Запрещает доступ к профилю в дргих командах.
 * @param member Пользователь профиля
 */
function _reserve(g_id: string, m_id: string): void{
   if(!(g_id in _reserved))
      _reserved[g_id] = {};
   _reserved[g_id][m_id] = true;
}
/**
 * Освободить профиль, открыть доступ всем командам. 
 * @param profile Профиль для освобождения
 */
function _free(profile: Profile){
   _reserved[profile.guild_id][profile.user_id] = false;
   freeEvent.call({
      guild_id: profile.guild_id,
      member_id: profile.user_id
   });
   console.log("'free' event");
}

/**
 * Зарезервирован ли профиль.
 * @param member Пользователь профиля
 * @returns true - зарезервирован, false - свободный доступ
 */
function _is_reserved(member: GuildMember): boolean{
   return _reserved[member.guild.id]
       && _reserved[member.guild.id][member.id];
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
   
   let profile: Profile;

   if(!_is_profile_exists(member)){
      profile = new Profile(member);
      let json: string = JSON.stringify(profile);
      
      fs.writeFileSync(`./data/profiles/${member.guild.id}/${member.id}.json`, json);
      return profile;
   }
   
   let filestr: string = fs.readFileSync(
      `./data/profiles/${member.guild.id}/${member.id}.json`,
      { encoding: "utf-8" }
   );
   profile = JSON.parse(filestr);
   return profile;
}


/////////////////////
// ВНЕШНИЙ ИНТЕРФЕЙС

/**
  * Получить и зарезервировать профиль пользователя.
  * @param member Пользователь профиля.
  * @returns Профиль.
  */
export async function get_profile(member: GuildMember): Promise<Profile> {
   return new Promise((resolve, reject) => {
      if(!_is_reserved(member)){
         _reserve(member.guild.id, member.id);
         console.log("momental get!");
         resolve(_parse_profile(member));
      }
      else{
         let listener = function(path: IProfilePath){
            //console.log(`free event gotcha. '${path.guild_id}:${path.member_id}'`)
            if((path.guild_id !== member.guild.id) || (path.member_id !== member.id)){
               console.log(`  Not my profile. I need '${member.guild.id}:${member.id}'`);
               return;
            }
            _reserve(member.guild.id, member.id);
            console.log("event get!");
            resolve(_parse_profile(member));       
         }

         freeEvent.add(listener);
      }
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