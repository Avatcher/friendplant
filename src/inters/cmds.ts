import { BaseCommandInteraction, CommandInteraction, Interaction } from "discord.js";
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
export function command(name: string, func: (iter: CommandInteraction)=> Promise<void>){

   if(name in _cmds){
      _cmds[name] = func;
      console.log(`[cmds] Replaced command '${name}'`);
   }
   else{
      _cmds[name] = func;
      console.log(`[cmds] Created command '${name}'`);
   }
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