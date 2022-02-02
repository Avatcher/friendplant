const config_path: string = "./data/config.json";
import { botclient } from "./botclient";
import { Guild } from "discord.js";
import * as fs from "fs";

interface Iconfig {
   [key: string]: any,

   bot_token: string,
   bot_clientid: string,
   bot_caseguild: string,
   bot_activity: string,
}
interface Iemojis{
   [key: string]: string,

   sparkle: string,
   exp: string,
   loading: string,

   typescript: string,
   paper: string,
   medal1: string,
   medal2: string,
   medal3: string,
   medal4: string,
   normal: string,
   radiate: string
}

if(!fs.existsSync(config_path)){
   console.log(`[err] Cannot access '${config_path}' file.`)
   process.exit(1);
}

const config_str: string  = fs.readFileSync(config_path, { encoding: "utf-8" });
const config: Iconfig = JSON.parse(config_str);

for(const name in config){
   if(config[name])
      continue;
   console.log(`[err] Cannot get property '${name}' from '${config_path}' file.`);
   process.exit(1);
}

let emojis_temp: any = {};

botclient.once("ready", async ()=>{
   const FPcase: Guild|undefined = botclient.guilds.cache.get(config.bot_caseguild);
   if(!FPcase){
      console.log("[emj] Cannot find Friendplant-Case guild,");
      console.log("      Probably incorrect guild_id in config.json.");
      process.exit(1);
   }
   FPcase.emojis.cache.map(emoji => {
      if(!emoji.name)
         return;
      emojis_temp[emoji.name] = emoji.toString();
      console.log(`[emj] Loaded emoji '${emoji.name}'`);
   });
});

const emojis: Iemojis = <Iemojis>emojis_temp;

export { emojis };
export { config };