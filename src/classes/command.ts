import { BaseCommandInteraction } from "discord.js";

interface IStep{
   [key: string]: Function;
}

export class UndefinedStepError{
   step: string;

   constructor(step: string){
      this.step = step;
   }
}

/**
 * Команда бота
 */
export class Command{
   name: string;
   steps: IStep;

   constructor(name: string){
      this.name = name;
      this.steps = { };
   }

   async next(key: string, data: any = undefined){
      if(!(key in this.steps))
         throw new UndefinedStepError(key);   
      
      await this.steps[key].call(this, data);
   }

   add_step(step: string, func: Function): Command{
      this.steps[step] = func;
      return this;
   }
}