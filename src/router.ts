import './dom'
import './util'
import './array'
class Router {
    private static  lastUserAction : Date = new Date();
    private static q(query:string,root) : NodeListOf<Element>{
        if (typeof (root) === "undefined")
            return document.querySelectorAll(query);
        else return root.querySelectorAll(query);
    }
    constructor (){
        document.addEventListener("DOMContentLoaded", function (event) {
            Router.run(document);
        });
         document.addEventListener("DOMNodeInserted", function (event) {
            this.handle((<Element>event.target).parentNode);
            this.executeOnSelect((<Element>event.target).parentNode);
            return false;
        });
    }
    public static run(context){
        this.executeOnLoad(context);
        this.executeOnSelect(context);
        this.handle(context);
    }

    private static executeOnSelect(root) {      
        
        var onSelectExecute = this.q("[jerry-select]", root);
        if(typeof(onSelectExecute) !== "undefined"){
            onSelectExecute.each(function (elem) {
                this.execRouter(elem, "jerry-select");
            });
        }
        
        
        var onSetExecute = this.q("[jerry-set]", root);
        if(typeof(onSetExecute)!=="undefined"){
            onSetExecute.each(function (elem) {
                this.execRouter(elem, "jerry-set");
            });
        }
    }

    private static  executeOnLoad(root) {
        var onLabelExecute = this.q("[jerry-label]", root);
        onLabelExecute.each(function (elem) {
            this.execRouter(elem, "jerry-label");
        });        
        
        var onloadExecute = this.q("[jerry-load]", root);
        onloadExecute.each(function (elem) {
            this.execRouter(elem, "jerry-load");
        });
    }

    private static  exec(root,event){
        var onloadExecute = this.q("["+event+"]", root);
        onloadExecute.each(function (elem) {
            this.execRouter(elem, event);
        });
    }

    public static  emit = function(root,event){
        this.exec(root,event);
    }

private static handle(node) {
        this.handleEvent(node, 'jerry-touch', ['click']);
        this.handleEvent(node, 'jerry-tap', ['mousedown']);
        this.handleEvent(node, 'jerry-change', ['change']);
        this.handleEvent(node, 'jerry-set', ['change']);
        this.handleEvent(node, 'jerry-keyup', ['keyup']);
        this.handleEvent(node, 'jerry-focus', ['focusin']);
    }

private static  isUserAction(elem){
        if(elem.attributes["jerry-touch"]) return true;
        if(elem.attributes["jerry-tap"]) return true;
        if(elem.attributes["jerry-change"]) return true;
        if(elem.attributes["jerry-set"]) return true;
        if(elem.attributes["jerry-select"]) return true;
        if(elem.attributes["jerry-keyup"]) return true;
        if(elem.attributes["jerry-focus"]) return true;
        return false
    }
    private static execRouter(elem, event) {
        if (!elem.attributes[event]) return;
        if(this.isUserAction(elem))
            this.lastUserAction = new Date();
        var toExec = elem.attributes[event].nodeValue;
        var $me = elem;
        var $result = null; 
        if (elem.attributes["jerry-label"]) {
            $result = eval(toExec);
            $me.innerHTML = $result;
        }
        else if (elem.attributes["jerry-result"]) {
            $result = eval(toExec);
            var toRender = elem.attributes["jerry-result"].nodeValue;
            eval(toRender);
        }
        else if (elem.attributes["jerry-set"]) {
            var _exec = elem.getAttribute('jerry-set');
            if(eval(elem.attributes["jerry-set"]) && !validstring($me.value)){
                var r = eval(_exec);
                if(typeof(r) !== "undefined" && r !== null){
                    $me.value = r;    
                }
                
            }
            else{
                eval(_exec + " = '" + $me.value+"'");
            }
            
        }else{
            $result = eval(toExec); 
        }
        
        if (elem.attributes["jerry-select"]) {
            var _exec = elem.getAttribute('jerry-select');
            if(_exec.indexOf("$callback") > 0){
               var $callback = function (list){
                   this.loadOpts(list,$me);
                   var value = eval(elem.getAttribute("jerry-set"));
                   if(!value && list[0]){
                      eval(elem.getAttribute("jerry-set") + " = '" + list[0].value+"'");  
                   }
                   if(elem.attributes["jerry-set"]){
                       var lop = $me.options;
                       for(var i=0;i<lop.length;i++){
                           if(lop[i].value === value){
                               lop[i].selected = true;
                           }
                       }
                   }
               };
               $result = eval(_exec);
            }else{
               var _exec = elem.getAttribute('jerry-select');
               $result = eval(_exec);     
               this.loadOpts($result,$me);
               var value = eval(elem.getAttribute("jerry-set"));
               if(!value && $result[0]){
                  eval(elem.getAttribute("jerry-set") + " = '" + $result[0].value+"'");  
               }
               if(elem.attributes["jerry-set"]){
                 var lop = $me.options;
                 for(var i=0;i<lop.length;i++){
                   if(lop[i].value === eval(elem.getAttribute("jerry-set"))){
                      lop[i].selected = true;
                   }
                 }
                }
            }
        }
        if($result !== null && typeof($result)!== "undefined"){
             if (elem.attributes["jerry-render-template"]){
                /*var templateId = elem.getAttribute("jerry-render-template");
                var source = document.getElementById(templateId).innerHTML;
                //var template = Handlebars.compile(source);
                var html = template($result);
                var dest = document.getElementById(elem.getAttribute("id"));
                dest.innerHTML = html;*/
             }
        }
    }
    private static  loadOpts($result,$me){
        var opts = "";
        for(var i = 0; i < $result.length;i++){
           if($result[i].name && $result[i].value){
              opts += "<option value='"+$result[i].value+"' >"+$result[i].name+"</option>";
           }else{
              opts += "<option value='"+i+"' >"+$result[i]+"</option>";
           }   
        }
        $me.innerHTML = opts;
    }
    private static  handleEvent(page:string, jerryEvent:string, domEvents:Array<string>) {
        this.q('[' + jerryEvent + ']', page).each(function (node) {
            function execRouteCallBack(event) {
                this.execRouter(node, jerryEvent);
            }
            domEvents.each(function (event) {
                if(typeof(node["on"+event]) !== "undefined"){
                    node["on"+event] = execRouteCallBack;
                    return false;
                }                
            });
        });
    };
    public static  isIdle = function(){
        var now = new Date();
        if(this.lastUserAction === null) return false;
        var delta =now.getTime() - this.lastUserAction.getTime();
        return delta > (1000*60*1)//1 minute to Idle
    };

    public static active = function(callback:Function){
        if(!this.isIdle()){
            callback();
        }
    };
}

