enum DBR_Type{
   RESERVE,
   CHANGE,
}

class DB_Request{
   type: DBR_Type;

   constructor(type: DBR_Type){
      this.type = type;
      
   }
}

class DB{
   path: string;

   constructor(path: string){
      this.path = path;

   }


}

class DB_Cell{

}