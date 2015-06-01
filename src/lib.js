var lib = {};
lib.tmpl = function(){
	var cache = {};
	function _getTmplStr(rawStr, mixinTmpl) {
		if(mixinTmpl) {
			for(var p in mixinTmpl) {
				var r = new RegExp('<%#' + p + '%>', 'g');
				rawStr = rawStr.replace(r, mixinTmpl[p]);
			}
		}
		return rawStr;
	};
	return function tmpl(str, data, opt) {
		opt = opt || {};
		var key = opt.key, mixinTmpl = opt.mixinTmpl, strIsKey = !/\W/.test(str);
		key = key || (strIsKey ? str : null);
		var fn = key ? cache[key] = cache[key] || tmpl(_getTmplStr(strIsKey ? document.getElementById(str).innerHTML : str, mixinTmpl)) :
		new Function("obj", "var _p_=[],print=function(){_p_.push.apply(_p_,arguments);};with(obj){_p_.push('" + str
			.replace(/[\r\t\n]/g, " ")
			.split("\\'").join("\\\\'")
			.split("'").join("\\'")
			.split("<%").join("\t")
			.replace(/\t=(.*?)%>/g, "',$1,'")
			.split("\t").join("');")
			.split("%>").join("_p_.push('")
		+ "');}return _p_.join('');");
		return data ? fn( data ) : fn;
	};
}();

lib.insertStyle = function(rules){
		var node=document.createElement("style");
		node.type='text/css';
		document.getElementsByTagName("head")[0].appendChild(node);
		if(rules){
			if(node.styleSheet){
				node.styleSheet.cssText=rules;
			}else{
				node.appendChild(document.createTextNode(rules));
			}
		}
		return node.sheet||node;
}
lib.parseDate = function(date){

	var copy = new Date(+date);
	var result = {};
	
	result.year = copy.getFullYear();
	result.month = copy.getMonth();
	result.date = copy.getDate();

	copy.setDate(1);
	result.emptys = copy.getDay() ? copy.getDay()-1:6;
	result.first = +new Date(result.year,result.month,copy.getDate());


	copy.setMonth(copy.getMonth()+1);
	copy.setDate(0);
	result.count = copy.getDate();
	result.last =  +new Date(result.year,result.month,copy.getDate());

	return result
}


lib.ready = function(fn){
	var fired = false;

    function trigger() {
      if (fired) return;
      fired = true;
      fn();
    }

    if (document.readyState === 'complete'){
      setTimeout(trigger);
    } else {
      this.addEventListener(document,'DOMContentLoaded', trigger); 
      this.addEventListener(window,'load', trigger); 
    }
}
lib.format = function(date){
	return date.toLocaleDateString().replace(/(\d{4}).(\d{2}).(\d{2})./,"$1/$2/$3");
}
lib.getClientRect  =function(elem){
	try {
	    var box =  elem.getBoundingClientRect(),rect = {};
	    //ie8- 没有width和height
	    if(box.width){
	    	rect = box;
	    	box.width = box.right-box.left;
	    	box.height = box.bottom - box.top;
	    }
	    else{
	    	rect = {
	    		top:box.top,
	    		right:box.right,
	    		bottom:box.bottom,
	    		left:box.left,
	    		width:box.right-box.left,
	    		height:box.bottom - box.top
	    	}
	    }
		return rect;
	} catch (e) {return {}} 
}
;(function(){
	
	var handlers = {};
	var clicks = {};

	var callback = function(e){

		var type = e.type;

		if(type == 'touchend'){
			type = 'click'
		}

		var target = e.target || e.srcElement;

		if(handlers[type] && handlers[type].length){
			var prevent = false;

			for(var i=0,hdl;hdl = handlers[type][i];i++){
				if(false === hdl.call(target,e)){
					prevent = true;
				}
			}
			
			if(prevent && e.preventDefault){
				e.preventDefault();
            	e.stopPropagation();
			}
		}
	}
	lib.addEventListener = function(element,type, callback){
		if (element.addEventListener)  // W3C
			element.addEventListener(type, callback, true);
		else if (elem.attachEvent) { // IE
			element.attachEvent("on"+ type, callback);
		}
	}
	////////////////////////
	lib.on = function(types,hdl){

		types = types.split(',');
		for(var i=0,type;type = types[i];i++){
			//第一次添加该类型则:
			//1
			if(!handlers[type]){
				handlers[type] = [];
			}
			//2
			if(handlers[type].length < 1){
				var element = document.documentElement;
				if (type === 'click' && 'ontouchstart' in element) {
					(function(){

						var x1=0,y1=0,x2=0,y2=0,flag = false;
						element.addEventListener('touchstart',function(e){

							var touch = e.touches[0];
							x1 = touch.pageX;
							y1 = touch.pageY;

							flag = false;

						})
						element.addEventListener('touchmove',function(e){
							
							var touch = e.touches[0];
							x2 = touch.pageX;
							y2 = touch.pageY;
							
							flag = true;
						})
						element.addEventListener('touchend',function(e){
							if(flag){
								var offset = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
								if(offset < 5){
									callback(e)
								}
							}
							else{
								callback(e)
							}
							
						})
					})()
				}
				else{
					lib.addEventListener(element,type,callback);	
				} 
				
			}

			handlers[type].push(hdl);
		}
	}
	lib.click = function(name,hdl){

		lib.on('click',function(e){
			var target = this;
			while(target && target.nodeType == 1){
				var name = target.getAttribute('data-click');
				if(name && clicks[name]){
					return clicks[name].call(this,target);
					break;
				}

				target = target.parentNode;
			}
		})

		lib.click = function(name,hdl){

			clicks[name] = hdl;
		}
		lib.click(name,hdl);
	}
})();