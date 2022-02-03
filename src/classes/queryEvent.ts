interface IEvents{
   [key: string]: QueryEvent
}

export class QueryEvent{
   _listeners: Function[];

   constructor(){
      this._listeners = [];
   }
   emit(...args: any[]): void{
      let listener = this._listeners.shift();
      if(!listener) return;
      listener(...args);
   }
   add(listener: Function){
      this._listeners.push(listener);
   }
   remove(listener_toRemove: Function){
      let index = this._listeners.indexOf(listener_toRemove);
      if(index < 0)
         throw new Error("Cannot remove a not existing listener from QueryEvent.");
      this._listeners.splice(index, 1);
   }
   isEmpty(): boolean{
      return this._listeners.length === 0;
   }
}
export class QueryEventEmitter{
   _events: IEvents;

   constructor(){
      this._events = {};
   }
   emit(name: string, ...args: any[]){
      if(!(name in this._events))
         throw new Error(`Attempted to emit QueryEvent "${name}", which not exitsts.`);
      this._events[name].emit(...args);
   }
   on(name: string, listener: Function){
      if(!(name in this._events))
         this._events[name] = new QueryEvent();
      this._events[name].add(listener);
   }
}