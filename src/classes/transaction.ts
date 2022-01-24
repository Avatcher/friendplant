
interface ITransactionTexts{
   preview: string
   desc: string,
}

export class Transaction{
   _count: number;
   preview: string;
   desc: string|null;
   time: Date;

   constructor(count: number, texts: ITransactionTexts, time: Date = new Date(Date.now())){
      this._count = count;
      this.preview = texts.preview;
      this.desc = texts.desc;
      this.time = time;
   }

   fcount(): string{
      if(this._count > 0)
         return "+"+this._count;
      return "-"+this._count;
   }
}