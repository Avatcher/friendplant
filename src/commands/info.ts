import { BaseCommandInteraction, MessageEmbed } from "discord.js";
import { command } from "../inters/cmds";
import { botclient } from "../botclient";

const desc: string = `
Сделано со стараниями и любовью для сервера Crumden.
**[Присоединяйтесь к нашему серверу!](https://discord.gg/TMQByx7bkx)**

**Автор бота:** Avatcher#0546
**Язык программирования:** TypeScript
**Node.js версия:** ${process.version}
`

const answer = new MessageEmbed()
   .setColor("#5865F2")
   .setTitle("Friendplant v.3.0.0")
   .setDescription(desc);

command("info", async (inter)=>{
   inter.reply({ embeds: [answer] });
});