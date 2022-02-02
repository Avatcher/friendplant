import { BaseCommandInteraction, GuildMember, MessageEmbed, EmbedField } from "discord.js";
import { get_profile, free_profile } from "../datacontrol/profiles"
import { command } from "../inters/cmds"
import { Interaction } from "discord.js"
import { emojis } from "../config"

const load_embed = new MessageEmbed()
   .setTitle(`${emojis.loading} Подождите...`)
   .setDescription("Ваш профиль сейчас уже где-то используеться,\nно должен скоро освободиться!")
   .setColor("BLURPLE");

command("profile", async (inter)=> {
   await inter.reply({ embeds: [load_embed]});
   let member = inter.member as GuildMember;
   let profile = await get_profile(member);

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
         text: `key: ${profile.guild_id}:${profile.user_id}`
      })
      .addFields(
         { 
            name: `Баланс: \`${profile.money}\`${emojis.sparkle}`,
            value: `Потрачено: \`${profile.lost_money}\`${emojis.sparkle}`
         },
         {
            name: `${emojis.paper} История транзакций`,
            value: history_text
         }
      );

   await inter.editReply({ embeds: [res_embed]});
   await free_profile(profile);
})