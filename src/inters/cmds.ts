import { BaseCommandInteraction, Interaction } from "discord.js";
import { Command } from "../classes/command";

interface Icmds{
   [key: string]: Command
}

let _cmds: Icmds = { };

/**
 * Путь к функции команды
 */
interface cmd_path{
   name: string,
   step?: string,
}

/**  
 * Создает команду для бота.
 * @param path Путь к функции команды
 * @param func Исполняемая функция команды.
*/
export function command(path: cmd_path, func: Function){
   if(!path.step)
      path.step = "main";

   if((path.name in _cmds) && (path.step in _cmds[path.name].steps)){
      _cmds[path.name].add_step(path.step, func);
      
      console.log(`[cmds] Replaced command '${path.name}::${path.step}'`);
   }
   else{
      _cmds[path.name] = new Command(path.name)
            .add_step(path.step, func);
      
      console.log(`[cmds] Created command '${path.name}::${path.step}'`);
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
export function get_command(name: string): Function{
   if(!(name in _cmds))
      return _undefined_cmd;
   return _cmds[name].steps["main"];
};

/**
 * Инициализировать команды
 */
export function init_cmds(){
   // Импорт команд
   require("../commands/ping");
   require("../commands/foo");

   // Предупреждение если в команде нету шага main
   for(let key of Object.keys(_cmds)){
      if("main" in _cmds[key].steps)
         continue;

      console.log(`[cmds] Undefined main of '${_cmds[key].name}'`);
      console.log(`       Command cannot be executed!`);
   }
}