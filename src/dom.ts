
interface NodeList{
    each(callback:Function);
    hasClass(className:string):Boolean;
}
NodeList.prototype.each = function(callback){
    for(var i = 0; i < this.length; i++){
        var ret = callback(this[i]);
        if(ret === false) break;
    }
};
NodeList.prototype.hasClass = function(className){
    for(var i = 0; i < this.classList; i++){
        var cname = this.classList[i];
        if(cname === className) return true;
    }
    return false;
};