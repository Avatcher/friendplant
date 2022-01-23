import * as fs from "fs";
const config_path: string = "./data/config.json";

interface Iconfig {
   bot_token: string,
   bot_clientid: string
}


if(!fs.existsSync(config_path)){
   console.log(`[err] Cannot access '${config_path}' file.`)
   process.exit(1);
}

const config_str: string  = fs.readFileSync(config_path, { encoding: "utf-8" });
const config_obj: Iconfig = JSON.parse(config_str);

if(!config_obj.bot_token){
   console.log(`[err] Cannot get bot_token from '${config_path}' file.`);
   process.exit(1);
}
if(!config_obj.bot_clientid){
   console.log(`[err] Cannot get bot_clientid from '${config_path}' file.`);
   process.exit(1);
}

export const { bot_token, bot_clientid } = config_obj;