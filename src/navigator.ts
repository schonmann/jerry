import "./array"
class StackNavigator{
    private map:Object = new Object();
    private prePushListeners:Array<Function> = new Array<Function>();
    private prePopListeners:Array<Function> = new Array<Function>();
    private postPushListeners:Array<Function> = new Array<Function>();
    private postPopListeners:Array<Function> = new Array<Function>();
    private stack:Array<Element> = new Array<Element>();
    private createEmptyPage(div:HTMLDivElement){
        var next = div;
        if(!next){
            next = document.createElement("div");    
        }
        next.classList.add('m-page');
        next.classList.remove('screen');
        next.style.zIndex =(1 + this.stack.length).toString();
        this.stack.push(next);
        next.style.transform="translate3d(0px,0px,0px)";
    }

    public pushPage(id:string){
        if(!this.map[id]){
            this.map[id] = document.getElementById(id);
        }
        this.call("prepush",this.map[id]);
        this.createEmptyPage(this.map[id]);
        this.call("postpush",this.map[id]);
    }

    private call(event:string,div:HTMLDivElement){
        switch (event) {
            case "prepush":
                this.prePushListeners.each((f)=>f(div));
                break;
            case "prepop":
                this.prePopListeners.each((f)=>f(div));
                break;
            case "postpush":
                this.postPushListeners.each((f)=>f(div));
                break;
            case "postpop":
                this.postPopListeners.each((f)=>f(div));
                break;
            default:
                throw ("event not exist!");
        }
    }

    public popPage(){
        var toRemove = this.stack.pop() as HTMLDivElement;
        this.call("prepop",toRemove);
        toRemove.addEventListener("transitionend",()=>{
            this.unmount(toRemove);
        },true);
        toRemove.style.transform="translate3d(100%,0px,0px)";
        this.call("postpop",toRemove);
    };

    private unmount(toRemove){
        toRemove.classList.add('screen');
        toRemove.classList.remove('m-page');
        toRemove.removeEventListener("transitionend",()=>{this.unmount(toRemove)});
    }

}