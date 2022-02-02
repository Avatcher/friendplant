import { GuildMember, MessageEmbed } from "discord.js";
import { get_profile, save_profile, free_profile } from "../datacontrol/profiles"
import { command } from "../inters/cmds";
import { emojis } from "../config"
import { Transaction } from "../classes/transaction";

const is_bot_embed = new MessageEmbed()
   .setTitle(":robot: Нельзя сделать перевод боту!")
   .setDescription("На самом деле они просто пользуются\nдругой валютой. Зубами, если конкретней.")
   .setColor("BLUE");

const less_zero_embed = new MessageEmbed()
   .setTitle("Не будьте столь жадными!")
   .setDescription("Количество переводимых средств не может быть меньше нуля,\nэто работает слегка не так...")
   .setColor("RED");

const from_profile_embed = new MessageEmbed()
   .setTitle(`${emojis.loading} Подождите...`)
   .setDescription("Ваш профиль сейчас уже где-то используеться,\nно должен скоро освободиться!")
   .setColor("BLURPLE");

const in_profile_embed = new MessageEmbed()
   .setTitle(`${emojis.loading} Подождите...`)
   .setDescription("Профиль для перевода сейча уже где-то используеться,\nно должен скоро освободиться!")
   .setColor("BLURPLE");

const not_enough_embed = new MessageEmbed()
   .setTitle("Недостаточно средств!")
   .setDescription("Может вы ошиблись циферкой?")
   .setColor("RED");

command("transfer", async (inter)=>{
   let member_to = inter.options.getMember("to_user") as GuildMember;
   if(member_to.user.bot){
      await inter.reply({embeds: [is_bot_embed], ephemeral: true});
      return;
   }
   
   let amount = inter.options.getInteger("amount") as number;
   if(amount <= 0){
      await inter.reply({embeds: [less_zero_embed], ephemeral: true});
      return;
   }

   let member_from = inter.member as GuildMember;

   await inter.reply({embeds: [from_profile_embed]});
   let profile_from = await get_profile(member_from);
   if(profile_from.money < amount){
      await inter.editReply({embeds: [not_enough_embed]});
      free_profile(profile_from);
      return;
   }

   await inter.editReply({embeds: [in_profile_embed]});
   let profile_to   = await get_profile(member_to);

   profile_from.do_transaction(
      new Transaction(amount*-1)
         .set_preview(`Перевод к ${member_to}`)
   );
   profile_to.do_transaction(
      new Transaction(amount)
         .set_preview(`Перевод от ${member_from}`)
   );

   await save_profile(profile_from);
   await save_profile(profile_to);

   await free_profile(profile_from);
   await free_profile(profile_to);

   await inter.editReply({embeds: [
      new MessageEmbed()
         .setTitle(":white_check_mark: Транзакция прошла успешно!")
         .setDescription(`${member_from} **---- \`${amount}\`${emojis.sparkle} --->**  ${member_to}`)
         .setColor("GREEN")
   ]});
});