import { BaseCommandInteraction, GuildMember, MessageEmbed, EmbedField } from "discord.js";
import { datacntl } from "../datacontrol/profiles"
import { command } from "../inters/cmds"
import { Interaction } from "discord.js"
import { emojis } from "../config"

command("profile", async (inter)=> {
   let member = inter.member as GuildMember;
   let profile = await datacntl.getProfile(member);

   let history_text: string = "";
   if(profile.history.length == 0)
      history_text = "История пуста...";
   else
      for(const trans of profile.history)
      history_text = `${trans.ftime()}◑︎ \`${trans.fcount()}\`${emojis.sparkle}◑︎ ${trans.preview}\n` + history_text;

   let res_embed = new MessageEmbed()
      .setTitle(`${emojis.normal} Профиль`)
      .setColor("BLURPLE")
      .setAuthor({
         name: member.user.username+"#"+member.user.discriminator,
         iconURL: member.displayAvatarURL(),
         url: "https://discordapp.com/users/"+member.id
      })
      .setFooter({
         text: `key: ${profile.guildId}:${profile.userId}`
      })
      .addFields(
         { 
            name: `Баланс: \`${profile.money}\`${emojis.sparkle}`,
            value: `Потрачено: \`${profile.lostMoney}\`${emojis.sparkle}`
         },
         {
            name: `${emojis.paper} История транзакций`,
            value: history_text
         }
      );

   await inter.reply({ embeds: [res_embed]});
});