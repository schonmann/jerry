class Model{
    public id:string;
}
class JerryStorage {
    constructor(schema:string){
        this.schema = schema;
    }
    
    static printStatus(){
        for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");
    }

    private cache : Object = new Object();
    private schema:string = "default";
    private _set(table:string,data:string){
        this.cache[table] = data;
        window.localStorage.setItem(table,data);
    }
    private _get(table){
        if(this.cache[table]){
            return this.cache[table];
        }
        this.cache[table] = window.localStorage.getItem(table);
        return this.cache[table];
    }
    public get(table:string){
        var data = null;
        data = this._get(table);
        if( data === null){
            if(table === "users") data = [];
            else{
                var key = this.schema;
                data = {};
                data[key] = [];
                this._set(table,JSON.stringify(data));
                return [];
            }
        }else{
            if(typeof(data)==="string" && data !== ""){
                data = JSON.parse(data);    
            }
            if(typeof(data)==="string" && data === ""){
                return [];
            }
            if(table !== "users"){
                var key = this.schema;
                if(typeof(data[key]) === "undefined"){
                    data[key] = [];
                   this._set(table,JSON.stringify(data));
                }
                return data[key];
            }
        }
        return data;
    }

    public where(table:string,condition:Function):Array<Model>{
        return this.getByKey(table).where(condition);
    }
    public any(table:string,condition:Function):Boolean{
        return this.getByKey(table).any(condition);
    }

    public getByKey(table){
        return this.get(table);
    }

     public findById(table:string,id:string):Object{
        var result = this.getByKey(table).where(function(reg) { reg.id == id});
        if(result.any()) return result[0];
        return null;
    }

    public delete(table:string,obj:Model){        
        this.transaction(table,function(data){
            if(typeof(obj) === "function"){
                data.seekAndDestroy(obj);
            }
            else{
                data.seekAndDestroy(function(n){ return n.id === obj.id});    
            }
            
        });                
    }

    public transaction(table:string,operation:Function){
        var data = this.get(table);
        operation(data);
        this.persistData(table,data);
    };


    public save(table:string,object:Model){ 
        if(typeof(object["id"]) === "undefined"){
            object.id = this.guid();
        }   
        this.transaction(table,function(data){
            data.seekAndDestroy(function(n){ return n.id === object.id});
            data.insert(0,object);
        });
        return object.id;
    };

    
    public dropTable = function(table:string){
        delete window.localStorage[table];
        delete this.cache[table];
    }

    public persistData(table:string,data:Array<Model>){
        if(table !== "users"){
            var key = this.schema;
            var db = JSON.parse(window.localStorage.getItem(table));
            db[key] = data;
            this._set(table,JSON.stringify(db));
        }else{
            this._set(table,JSON.stringify(data));    
        }
        
    };

    public guid() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
}