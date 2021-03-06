interface Array<T> {
    groupBy(obj: any): any[];
    findIndex(callback:Function) : Number;
    first<T>(callback:Function) : T;
    sum(callback:Function) : Number;//
    innerFor(innerArray:Array<Object>,callback:Function);//
    update<T>(array:Array<T>,callback:Function);//
    last():Object;//
    contains<T>(array:Array<T>):Boolean;//
    map(callback:Function):Array<Object>;//
    each(callback:Function);//
    where<T>(callback:Function):Array<T>;//
    seekAndDestroy(w:Function);//
    equals<T>(array:Array<T>):Boolean;//
    removeAll<T>(item:T);//
    removeFirst<T>(item:T);//
    any(query:Function):Boolean;//
    empty(query:Function):Boolean;//
    removeAt(index:Number);//
    clear();//
    insert<T>(index:Number,item:T);//
    select(key:string):Array<Object>;//
}

Array.prototype.select = function (key:string):Array<Object> {
    var newList = [];
    for (var i = 0; i < this.length; i++) {
        var obj = {};
        obj[key] = this[i][key];
        newList.insert(i,obj);
    }
    return newList;
};
Array.prototype.insert = function<T> (index:Number, item:T) {
    this.splice(index, 1, item);
};

Array.prototype.clear = function () {
    this.length = 0;
};

Array.prototype.removeAt = function (index:Number) {
    this.splice(index, 1);
};

Array.prototype.empty = function (query:Function):Boolean {
    if (typeof (query) === "function") {
        return this.where(query).length === 0;
    }
    return this.length === 0;
};

Array.prototype.any = function (query:Function):Boolean {
    if (typeof(query) === "function") {
        return this.where(query).length > 0;
    }
    return this.length > 0;
};

Array.prototype.removeFirst = function<T> (item:T) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == item) {
            this.splice(i, 1);
            return item;
        }
    }
};

Array.prototype.removeAll = function <T> (item:T) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == item) {
            this.splice(i, 1);
        }
    }
};

Array.prototype.equals = function<T> (array:Array<T>) :Boolean{
    var a1 = JSON.stringify(this);
    var a2 = JSON.stringify(array);

    return a1 === a2;
}

Array.prototype.seekAndDestroy = function (w:Function) {
    var founds = [];
    for (var i = 0; i < this.length; i++) {
        if (typeof(w) === "function" && w(this[i])) {
            this.removeAt(i);
            i--;
        }else if(this[i]===w){
            this.removeAt(i);
            i--;
        }
    }
};

Array.prototype.where = function <T> (w:Function) : Array<T> {
    var founds = [];
    for (var i = 0; i < this.length; i++) {
        if (w(this[i])) {
            founds.push(this[i]);
        }
    }
    return founds;
};


Array.prototype.each = function (callback:Function) {
    for (var i = 0; i < this.length; i++) {
        var r = callback(this[i], i);
        if (r == false) break;
    }
};

Array.prototype.map = function (callback:Function) : Array<Object> {
    var map = [];
    for (var i = 0; i < this.length; i++) {
        var r = callback(this[i], i);
        map.push(r);
    }
    return map;
};

Array.prototype.contains = function<T> (array:Array<T>):Boolean {
    if (!array) return false;
    if (this.length == 0) return false;
    var temp = [];
    var a = array;
    var b = this;
    if (array.length > this.length) {
        a = this;
        b = array;
    }

    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
            if (b[j] == a[i]) {
                temp.push(b[j]);
                break;
            }
        }
    }
    return a.equals(temp);

};

Array.prototype.last = function () : Object {
    if (this.length > 0) {
        return this[this.length - 1];
    }
    return null;
};

Array.prototype.update = function<T> (array:Array<T>, callback:Function) {
    var i = 0;
    var j = 0;
    for (i = 0; i < array.length; i++) {
        for (j = 0; j < this.length; j++) {
            if (callback(this[j], array[i])) {
                break;
            }
        }
        this[j] = array[i];
    }
}
Array.prototype.innerFor = function (innerArray:Array<Object>, callback:Function) {
    for (var i = 0; i < this.length; i++) {
        for (var j = 0; j < innerArray.length; j++) {
            if (callback(this[i], innerArray[j])) {
                return;
            }
        }
    }
}


Array.prototype.sum = function (callback:Function) : Number{
    var acc:Number = 0;
    for (var i = 0; i < this.length; i++) {
        acc += callback(this[i]);
    }
    return acc;
};

Array.prototype.first = function<T> (callback:Function) : T {
    if (typeof(callback) === "function") {
        for (var i = 0; i < this.length; i++) {
            if (callback(this[i])) {
                return this[i];
            }
        }
    } else {
        if (this.length > 0) {
            return this[0];
        }
        return null;
    }
};


Array.prototype.findIndex = function (callback:Function) :Number{
    for (var i = 0; i < this.length; i++) {
        if (callback(this[i])) {
            return i;
        }
    }
};

Array.prototype.groupBy = function (key:any):any[] {
    if(typeof(key) === "function" || typeof(key) === "string"){
        var array = [];
        for (var i = 0; i < this.length; i++) {
            var position, keyValue;
            if(typeof(key) === "string"){
                if(this[i][key] === undefined) throw "Invalid key arg";
                keyValue = this[i][key];
            }else{
                keyValue = key(this[i]);
            }
            position = array.findIndex(function (x) { return x.Key === keyValue });
            if (position !== undefined) {
                array[position].Values.push(this[i]);
            } else {
                array.push({ Key: keyValue, Values: [this[i]] });
            }
        }
        return array;
    }
};
