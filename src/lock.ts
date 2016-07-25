class Lock {
    private _isLock:boolean = false;
    private _schedList = [];

    private  unlock() {
        this._isLock = false;
        if(this._schedList.length > 0){
            var _toExec = this._schedList.pop();
            try{
                _toExec(this.unlock);
            }catch(e){
                this.unlock();
            }
        }
    }
    public sched(callback:Function){
        if(this._isLock === true){
            this._schedList.push(callback);
        }else{
            this._isLock = true;
            try{
                callback(this.unlock); 
            }catch(e){
                this.unlock();
            }
        }
    }

}
