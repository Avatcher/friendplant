
interface ITransactionTexts{
   preview: string
   desc: string|null,
}

export class Transaction{
   count: number;
   preview: string;
   desc: string|null;
   time: Date;

   constructor(count: number, time: Date = new Date(Date.now())){
      this.count = count;
      this.preview = "Неизвестно";
      this.desc = null;
      this.time = time;
   }

   set_preview(text: string): Transaction{
      this.preview = text;
      return this;
   }
   set_description(text: string|null): Transaction{
      this.desc = text;
      return this;
   }

   fcount(): string{
      if(this.count > 0)
         return "+"+this.count;
      return this.count.toString();
   }
   ftime(): string{
      const utc = (this.time.getTime() / 1000).toFixed(0);
      return `<t:${utc}>`;
   }

   have_desc(): boolean{
      return this.desc != null;
   }
}