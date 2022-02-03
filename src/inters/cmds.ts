import { BaseCommandInteraction, CommandInteraction, Interaction, MessageEmbed } from "discord.js";
import { config } from "../config";
import * as fs from "fs";

interface  ICommandsList{
   [key: string]: (iter: CommandInteraction)=> Promise<void>
}

let _cmds: ICommandsList = {};

/**  
 * Создает команду для бота.
 * @param name Имя команды
 * @param func Исполняемая функция команды.
*/
export function command(name: string, func: (inter: CommandInteraction)=> Promise<void>){

   if(name in _cmds){
      _cmds[name] = func;
      console.log(`[cmds] Replaced command '${name}'`);
   }
   else{
      _cmds[name] = func;
      console.log(`[cmds] Created command '${name}'`);
   }
}

const needAdmin_embed = new MessageEmbed()
   .setTitle(":no_entry_sign: Ты - не он.")
   .setColor("RED");

export function adminCommand(name: string, func: (inter: CommandInteraction)=> Promise<void>){
   let editedfunc = async (inter: CommandInteraction)=>{
      if(inter.user.id != config.adminId){
         await inter.reply({embeds:[needAdmin_embed], ephemeral: true});
         return;
      }
      await func(inter);
   }
   command(name, editedfunc);
}

const _undefined_cmd = async function(inter: BaseCommandInteraction){
   console.log(`[cmds] Used undefined command '${inter.commandName}'.`)
   inter.reply(`Command is undefined.`)
};

/**
 * Получить команду класса Command
 * @param name Имя команды
 * @returns Команда
 */
export function get_command(name: string): (inter: CommandInteraction)=> Promise<void>{
   if(!(name in _cmds))
      return _undefined_cmd;
   return _cmds[name];
};

/**
 * Инициализировать команды
 */
export function init_cmds(){
   // Импорт команд
   let command_files = fs.readdirSync("./build/commands");
   for(let file of command_files)
      require(`../commands/${file}`);
}