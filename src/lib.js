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

lib.on =  function (elem, event, fn) {
		if (elem.addEventListener)  // W3C
			elem.addEventListener(event, fn, true);
		else if (elem.attachEvent) { // IE
			elem.attachEvent("on"+ event, fn);
		}
};
;(function(){
	
	var _defaultGetEventkeyFn = function(elem){
		return elem.getAttribute("data-evt");
	};
	
	//默认判断是否有事件的函数
	var _defalutJudgeFn = function(elem){
		return !!elem.getAttribute("data-evt");
	};

	var getEvent = function(evt) {
		var evt = window.event || evt, c, cnt;
		if (!evt && window.Event) {
			c = arguments.callee;
			cnt = 0;
			while (c) {
				if ((evt = c.arguments[0]) && typeof (evt.srcElement) != "undefined") {
					break;
				} else if (cnt > 9) {
					break;
				}
				c = c.caller;
				++cnt;
			}
		}
		return evt;
	};

	

	var preventDefault = function(evt) {
		evt = getEvent(evt);
		if (!evt) {
			return false;
		}
		if (evt.preventDefault) {
			evt.preventDefault();
		} else {
			evt.returnValue = false;
		}
	}
	
	/**
	 * 在事件触发时，取得想要的元素
	 * @param evt 事件对象
	 * @param topElem 查找的最终祖先节点，从事件起始元素向上查找到此元素为止
	 * @param judgeFn 判断是否目标元素的函数
	 */
	var getWantTarget = function(evt,topElem, judgeFn){
		
		judgeFn = judgeFn || this.judgeFn || _defalutJudgeFn;
		
		var _targetE = evt.srcElement || evt.target;
		
		while( _targetE  ){
			
			if(judgeFn(_targetE)){
				return _targetE;
			}
			
			if( topElem == _targetE ){
				break;
			}
		
			_targetE = _targetE.parentNode;
		}
		return null;
	};
	/**
	 * 通用的绑定事件处理
	 * @param {Element} 要绑定事件的元素
	 * @param {String} 绑定的事件类型
	 * @param {Object} 事件处理的函数映射
	 * @param {Function} 取得事件对应的key的函数
	 */
	lib.event = function(topElem, type, dealFnMap, getEventkeyFn){
		
		getEventkeyFn =  getEventkeyFn || _defaultGetEventkeyFn;
		
		var judgeFn  = function(elem){
			return !!getEventkeyFn(elem);
		};

		var hdl = function(e){
			/**
			 * 支持直接绑定方法
			 */
			var _target = getWantTarget(e, topElem, judgeFn),_hit = false;
			
			if(_target){
				var _event = getEventkeyFn(_target);
				var _returnValue;


				if(Object.prototype.toString.call(dealFnMap)==="[object Function]"){
					_returnValue = dealFnMap.call(_target,e,_event);
					_hit = true
				}
				else{
					if( dealFnMap[_event]){
						_returnValue = dealFnMap[_event].call(_target, e)
						_hit = true;
					}
				}
				if(_hit){
					if(!_returnValue){
						if(e.preventDefault)
			                e.preventDefault();
			            else
			                e.returnValue = false
					}
				}
				
			}
			
		}
		lib.on(topElem, type, hdl);
		
	};	
})();