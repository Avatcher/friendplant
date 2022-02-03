import { GuildMember, MessageEmbed } from "discord.js";
import { command } from "../inters/cmds";
import { emojis } from "../config"
import { Transaction } from "../classes/transaction";
import { datacntl } from "../datacontrol/profiles";

const is_bot_embed = new MessageEmbed()
   .setTitle(":robot: Нельзя сделать перевод боту!")
   .setDescription("На самом деле они просто пользуются\nдругой валютой. Зубами, если конкретней.")
   .setColor("BLUE");

const less_zero_embed = new MessageEmbed()
   .setTitle("Не будьте столь жадными!")
   .setDescription("Количество переводимых средств не может быть меньше нуля,\nэто работает слегка не так...")
   .setColor("RED");

const timeout_embed = new MessageEmbed()
   .setTitle(":clock2: Превышено время ожидания!")
   .setDescription("Транзакция отменена.\nПопробуйте еще раз позже.")
   .setColor("RED");

command("transfer", async (inter)=>{
   let member_to = inter.options.getMember("to_user") as GuildMember;
   if(member_to.user.bot){
      await inter.reply({embeds: [is_bot_embed], ephemeral: true});
      return;
   }
   let member_from = inter.member as GuildMember;
   
   let amount = inter.options.getInteger("amount") as number;
   if(amount <= 0){
      await inter.reply({embeds: [less_zero_embed], ephemeral: true});
      return;
   }

   await inter.deferReply();
   
   let res = await datacntl.doTransaction(member_from,
      new Transaction()
         .setAmount(-amount)
         .setPreview(`Перевод к ${member_to}`),
   5000);
   
   switch(res){
      case datacntl.TransactionResult.NoMoney: {
         await inter.editReply({embeds:[
            new MessageEmbed()
               .setTitle("Недостаточно средств!")
               .setDescription(`Транзакция отменена.\nНа вашем счету менее \`${amount}\`${emojis.sparkle}`)
               .setColor("RED")
         ]});
         return;
      }
      case datacntl.TransactionResult.Timeout: {
         await inter.editReply({embeds:[timeout_embed]});
         return;
      }
   }

   datacntl.doTransaction(member_to,
      new Transaction()
         .setAmount(amount)
         .setPreview(`Перевод от ${member_from}`),
   );

   await inter.editReply({embeds: [
      new MessageEmbed()
         .setTitle(":white_check_mark: Транзакция прошла успешно!")
         .setDescription(`${member_from} **---- \`${amount}\`${emojis.sparkle} --->**  ${member_to}`)
         .setColor("GREEN")
   ]});
});