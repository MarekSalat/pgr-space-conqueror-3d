/**
 * Created with IntelliJ IDEA.
 * User: Marek
 * Date: 16.10.13
 * Time: 16:47
 * To change this template use File | Settings | File Templates.
 */


function extend(_this, parent) {
    // We use an intermediary empty constructor to create an
    // inheritance chain, because using the super class' constructor
    // might have side effects.
    var construct = function () {};
    construct.prototype = parent.prototype;
    _this.prototype = new construct;
    _this.prototype.constructor = _this;
    _this.super = parent;
}

var _extends = _extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

interface Poolable {
    clone();
    init();
}

class Pool {
    pool = [];
    lastFree = 0;

    constructor(public size: number, public poolable: Poolable){
    }


    init () {
        if(this.lastFree >= this.pool.length) this.size += this.size;

        for (var i = this.lastFree; i < this.size; i++) {
            var tmp = this.poolable.clone();

            this.pool[i] = tmp;
        }
    }

    get(){
        if(this.lastFree >= this.pool.length){
            this.init();
        }
        var obj = this.pool[this.lastFree++];
        obj.init();

        return obj;
    }

    free(obj) {
        var idx = this.pool.indexOf(obj);

        if(idx < 0) return; // object was not there

        var lastUsed = this.lastFree-1;
        if(lastUsed < 0) return; // none from pool is in use

        // swap lastUsed with this
        var tmp = this.pool[idx];
        this.pool[idx] = this.pool[lastUsed];
        this.pool[lastUsed] = tmp;

        this.lastFree--;
    }
}


