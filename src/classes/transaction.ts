
interface ITransactionTexts{
   preview: string
   desc: string|null,
}

export class Transaction{
   amount: number;
   preview: string;
   desc: string|null;
   time: Date;

   constructor(){
      this.amount = 0;
      this.preview = "Неизвестно";
      this.desc = null;
      this.time = new Date(Date.now());
   }

   setAmount(amount: number): Transaction{
      this.amount = amount;
      return this;
   }
   setPreview(text: string): Transaction{
      this.preview = text;
      return this;
   }
   setDescription(text: string|null): Transaction{
      this.desc = text;
      return this;
   }
   setTime(time: Date){
      this.time = time;
      return this;
   }

   fcount(): string{
      if(this.amount > 0)
         return "+"+this.amount;
      return this.amount.toString();
   }
   ftime(): string{
      const utc = (this.time.getTime() / 1000).toFixed(0);
      return `<t:${utc}>`;
   }

   have_desc(): boolean{
      return this.desc != null;
   }
}