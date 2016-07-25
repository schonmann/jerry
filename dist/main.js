Array.prototype.select = function (key) {
    var newList = [];
    for (var i = 0; i < this.length; i++) {
        var obj = {};
        obj[key] = this[i][key];
        newList.insert(i, obj);
    }
    return newList;
};
Array.prototype.insert = function (index, item) {
    this.splice(index, 1, item);
};
Array.prototype.clear = function () {
    this.length = 0;
};
Array.prototype.removeAt = function (index) {
    this.splice(index, 1);
};
Array.prototype.empty = function (query) {
    if (typeof (query) === "function") {
        return this.where(query).length === 0;
    }
    return this.length === 0;
};
Array.prototype.any = function (query) {
    if (typeof (query) === "function") {
        return this.where(query).length > 0;
    }
    return this.length > 0;
};
Array.prototype.removeFirst = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == item) {
            this.splice(i, 1);
            return item;
        }
    }
};
Array.prototype.removeAll = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == item) {
            this.splice(i, 1);
        }
    }
};
Array.prototype.equals = function (array) {
    var a1 = JSON.stringify(this);
    var a2 = JSON.stringify(array);
    return a1 === a2;
};
Array.prototype.seekAndDestroy = function (w) {
    var founds = [];
    for (var i = 0; i < this.length; i++) {
        if (typeof (w) === "function" && w(this[i])) {
            this.removeAt(i);
            i--;
        }
        else if (this[i] === w) {
            this.removeAt(i);
            i--;
        }
    }
};
Array.prototype.where = function (w) {
    var founds = [];
    for (var i = 0; i < this.length; i++) {
        if (w(this[i])) {
            founds.push(this[i]);
        }
    }
    return founds;
};
Array.prototype.each = function (callback) {
    for (var i = 0; i < this.length; i++) {
        var r = callback(this[i], i);
        if (r == false)
            break;
    }
};
Array.prototype.map = function (callback) {
    var map = [];
    for (var i = 0; i < this.length; i++) {
        var r = callback(this[i], i);
        map.push(r);
    }
    return map;
};
Array.prototype.contains = function (array) {
    if (!array)
        return false;
    if (this.length == 0)
        return false;
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
Array.prototype.last = function () {
    if (this.length > 0) {
        return this[this.length - 1];
    }
    return null;
};
Array.prototype.update = function (array, callback) {
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
};
Array.prototype.innerFor = function (innerArray, callback) {
    for (var i = 0; i < this.length; i++) {
        for (var j = 0; j < innerArray.length; j++) {
            if (callback(this[i], innerArray[j])) {
                return;
            }
        }
    }
};
Array.prototype.sum = function (callback) {
    var acc = 0;
    for (var i = 0; i < this.length; i++) {
        acc += callback(this[i]);
    }
    return acc;
};
Array.prototype.first = function (callback) {
    if (typeof (callback) === "function") {
        for (var i = 0; i < this.length; i++) {
            if (callback(this[i])) {
                return this[i];
            }
        }
    }
    else {
        if (this.length > 0) {
            return this[0];
        }
        return null;
    }
};
Array.prototype.findIndex = function (callback) {
    for (var i = 0; i < this.length; i++) {
        if (callback(this[i])) {
            return i;
        }
    }
};
Array.prototype.groupBy = function (key) {
    if (typeof (key) === "function" || typeof (key) === "string") {
        var array = [];
        for (var i = 0; i < this.length; i++) {
            var position, keyValue;
            if (typeof (key) === "string") {
                if (this[i][key] === undefined)
                    throw "Invalid key arg";
                keyValue = this[i][key];
            }
            else {
                keyValue = key(this[i]);
            }
            position = array.findIndex(function (x) { return x.Key === keyValue; });
            if (position !== undefined) {
                array[position].Values.push(this[i]);
            }
            else {
                array.push({ Key: keyValue, Values: [this[i]] });
            }
        }
        return array;
    }
};
NodeList.prototype.each = function (callback) {
    for (var i = 0; i < this.length; i++) {
        var ret = callback(this[i]);
        if (ret === false)
            break;
    }
};
NodeList.prototype.hasClass = function (className) {
    for (var i = 0; i < this.classList; i++) {
        var cname = this.classList[i];
        if (cname === className)
            return true;
    }
    return false;
};
var Model = (function () {
    function Model() {
    }
    return Model;
}());
var JerryStorage = (function () {
    function JerryStorage(schema) {
        this.cache = new Object();
        this.schema = "default";
        this.dropTable = function (table) {
            delete window.localStorage[table];
            delete this.cache[table];
        };
        this.schema = schema;
    }
    JerryStorage.printStatus = function () {
        for (var x in localStorage)
            console.log(x + "=" + ((localStorage[x].length * 2) / 1024 / 1024).toFixed(2) + " MB");
    };
    JerryStorage.prototype._set = function (table, data) {
        this.cache[table] = data;
        window.localStorage.setItem(table, data);
    };
    JerryStorage.prototype._get = function (table) {
        if (this.cache[table]) {
            return this.cache[table];
        }
        this.cache[table] = window.localStorage.getItem(table);
        return this.cache[table];
    };
    JerryStorage.prototype.get = function (table) {
        var data = null;
        data = this._get(table);
        if (data === null) {
            if (table === "users")
                data = [];
            else {
                var key = this.schema;
                data = {};
                data[key] = [];
                this._set(table, JSON.stringify(data));
                return [];
            }
        }
        else {
            if (typeof (data) === "string" && data !== "") {
                data = JSON.parse(data);
            }
            if (typeof (data) === "string" && data === "") {
                return [];
            }
            if (table !== "users") {
                var key = this.schema;
                if (typeof (data[key]) === "undefined") {
                    data[key] = [];
                    this._set(table, JSON.stringify(data));
                }
                return data[key];
            }
        }
        return data;
    };
    JerryStorage.prototype.where = function (table, condition) {
        return this.getByKey(table).where(condition);
    };
    JerryStorage.prototype.any = function (table, condition) {
        return this.getByKey(table).any(condition);
    };
    JerryStorage.prototype.getByKey = function (table) {
        return this.get(table);
    };
    JerryStorage.prototype.findById = function (table, id) {
        var result = this.getByKey(table).where(function (reg) { reg.id == id; });
        if (result.any())
            return result[0];
        return null;
    };
    JerryStorage.prototype.delete = function (table, obj) {
        this.transaction(table, function (data) {
            if (typeof (obj) === "function") {
                data.seekAndDestroy(obj);
            }
            else {
                data.seekAndDestroy(function (n) { return n.id === obj.id; });
            }
        });
    };
    JerryStorage.prototype.transaction = function (table, operation) {
        var data = this.get(table);
        operation(data);
        this.persistData(table, data);
    };
    ;
    JerryStorage.prototype.save = function (table, object) {
        if (typeof (object["id"]) === "undefined") {
            object.id = this.guid();
        }
        this.transaction(table, function (data) {
            data.seekAndDestroy(function (n) { return n.id === object.id; });
            data.insert(0, object);
        });
        return object.id;
    };
    ;
    JerryStorage.prototype.persistData = function (table, data) {
        if (table !== "users") {
            var key = this.schema;
            var db = JSON.parse(window.localStorage.getItem(table));
            db[key] = data;
            this._set(table, JSON.stringify(db));
        }
        else {
            this._set(table, JSON.stringify(data));
        }
    };
    ;
    JerryStorage.prototype.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    ;
    return JerryStorage;
}());
var Lock = (function () {
    function Lock() {
        this._isLock = false;
        this._schedList = [];
    }
    Lock.prototype.unlock = function () {
        this._isLock = false;
        if (this._schedList.length > 0) {
            var _toExec = this._schedList.pop();
            try {
                _toExec(this.unlock);
            }
            catch (e) {
                this.unlock();
            }
        }
    };
    Lock.prototype.sched = function (callback) {
        if (this._isLock === true) {
            this._schedList.push(callback);
        }
        else {
            this._isLock = true;
            try {
                callback(this.unlock);
            }
            catch (e) {
                this.unlock();
            }
        }
    };
    return Lock;
}());
/**
 * Verify if object at the specified key is defined. If not, initialize it.
 *
 * @param {Object} object Target object.
 * @param {string} key Object key.
 * @param init Value to initialize.
 *
 */
function ifNDef(object, key, init) {
    try {
        if (!isDef(object[key]))
            object[key] = init;
    }
    catch (e) {
        return true;
    }
}
;
function isDef(variable) {
    try {
        return typeof (variable) !== 'undefined';
    }
    catch (e) {
        return false;
    }
}
;
function nDef(variable) {
    return !isDef(variable);
}
function isFunc(_function) {
    return typeof (_function) === "function";
}
;
function isStr(str) {
    return typeof (str) === "string";
}
;
function validstring(str) {
    return str && typeof (str) === "string" && str !== "";
}
;
function isNum(number) {
    return typeof (number) === "number";
}
;
String.prototype.replaceAll = function (v1, v2) {
    return this.split(v1).join(v2);
};
String.prototype.startsWith = function (searchstring, position) {
    position = position || 0;
    return this.indexOf(searchstring, position) === position;
};
if (typeof Element.prototype.matches !== 'function') {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector || function matches(selector) {
        var element = this;
        var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
        var index = 0;
        while (elements[index] && elements[index] !== element) {
            ++index;
        }
        return Boolean(elements[index]);
    };
}
if (typeof Element.prototype.closest !== 'function') {
    Element.prototype.closest = function closest(selector) {
        var element = this;
        while (element && element.nodeType === 1) {
            if (element.matches(selector)) {
                return element;
            }
            element = element.parentNode;
        }
        return null;
    };
}
