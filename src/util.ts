/**
 * Verify if object at the specified key is defined. If not, initialize it. 
 * 
 * @param {Object} object Target object.
 * @param {string} key Object key.
 * @param init Value to initialize.
 * 
 */

function ifNDef(object, key, init) {
    try{
        if(!isDef(object[key]))
            object[key] = init;
    }catch(e){
        return true;
    }
};

function isDef(variable){
    try{
        return typeof(variable) !== 'undefined';
    }catch(e){
        return false;
    }
};

function nDef(variable){
    return !isDef(variable);
}

function isFunc(_function){
    return typeof(_function) === "function"
};

function isStr(str){
    return typeof(str) === "string";
};
function validstring(str){
    return str && typeof(str) === "string" && str !== "";
};

function isNum(number) {
    return typeof(number) === "number";
};
interface String{
    replaceAll(v1:string,v2:string):string;
    startsWith(searchstring:string,position:Number):Boolean;
}
String.prototype.replaceAll = function(v1,v2){
    return this.split(v1).join(v2);
}
String.prototype.startsWith = function(searchstring, position) {
    position = position || 0;
    return this.indexOf(searchstring, position) === position;
};

interface Element{
    matches(seletor:string):Boolean;
    closest(seletor:string):Element;
}
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
