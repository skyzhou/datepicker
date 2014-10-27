;(function(global,factory){
	if(typeof global.define === 'function'){
		global.define(factory);
	}
	else{
		global.qdp = {};
		factory(null,global.qdp)
	}
}(window,function(require,exports){