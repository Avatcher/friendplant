import { BaseCommandInteraction, MessageEmbed } from "discord.js";
import { command } from "../inters/cmds";
import { botclient } from "../botclient";

const desc: string = `
Сделано со стараниями и любовью для сервера Crumden.
**[Присоединяйтесь к нашему серверу!](https://discord.gg/TMQByx7bkx)**

Написано на языке **TypeScript**
Версия Node.js "**${process.version}**"
Вы также можете посмотреть код
бота в моем репозитории **[вот здесь](https://github.com/Avatcher/friendplant)**

Автор бота: Avatcher#0546`;

const answer = new MessageEmbed()
   .setColor("#5865F2")
   .setTitle("Friendplant v.3.0.0")
   .setDescription(desc);

command("info", async (inter)=>{
   inter.reply({ embeds: [answer] });
});