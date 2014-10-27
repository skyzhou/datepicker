;(function(global,factory){
	if(typeof global.define === 'function'){
		global.define(factory);
	}
	else{
		global.qdp = {};
		factory(null,global.qdp)
	}
}(window,function(require,exports){
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

		var callback = function(evt,target){
			evt = evt || window.event;
			target = evt.target || evt.srcElement;
			fn.call(target,evt)
		}

		if (elem.addEventListener)  // W3C
			elem.addEventListener(event, callback, true);
		else if (elem.attachEvent) { // IE
			elem.attachEvent("on"+ event, callback);
		}
};

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
      this.on(document,'DOMContentLoaded', trigger); 
      this.on(window,'load', trigger); 
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


var styleTpl = '.qdp-container{position:absolute;width:211px;min-height:183px;font-size:12px;font-family: Tahoma;border:1px solid #D1D1D1;padding:1px;z-index:9999;user-select: none;-webkit-user-select: none;background: #fff;}.qdp-container ul,.qdp-container li{list-style: none;padding:0px;margin:0px;}.qdp-arrow{position:absolute;display:block;width:0;height:0;border-color:transparent;border-style:solid;border-width:11px;left:50%;margin-left:-11px;border-top-width:0;border-bottom-color:#D1D1D1;top:-12px}.qdp-bar{height: 20px;background: #f7f7f7;color: #404a58;font-weight: bold;width: 201px;position: relative;padding: 10px 5px;}.qdp-bar select{width: 72px;margin: 0px 5px;height:18px;vertical-align: middle;outline: none;}.qdp-prev,.qdp-next{display: block;cursor: pointer;margin:1px;color:#ababab;font-family: Menlo, "Courier New",Courier,monospace;}.qdp-prev{float:left;}.qdp-next{float:right;}.qdp-bar ul{position:absolute;}.qdp-year{margin-left: 24px;position: relative;top: 1px;}.qdp-days{margin-top: 6px;color:#91959c;}.qdp-days li{float:left;height:22px;width:30px;text-align:center;font-weight: bold;margin-top:6px;}.qdp-dates{clear:both;}.qdp-dates li{float: left;width: 19px;height: 18px;padding: 1px;margin: 3px;text-align: center;line-height: 19px;padding-right: 2px;}.qdp-date-item{border:1px solid #fff;cursor: pointer;color: #171d25;}.qdp-empty{border:1px solid #fff;}.qdp-date-item:hover{background:#f7f7f7;color: #171d25;}.qdp-disable{border:1px solid #fff;cursor: not-allowed;color:#a2a2a2;}.qdp-today{border:1px solid #0071ce;color: #0071ce;}.qdp-selected,.qdp-selected:hover{border:1px solid #0071ce;background:#0071ce;color:#fff;}';
var barTpl = '<div class="qdp-arrow"></div><div class="qdp-arrow" style="border-bottom-color: #f7f7f7;top: -10px;"></div><a class="qdp-prev"  data-evt="prev">&lt;</a><label class="qdp-year"></label><%=year%><select><% for(var i=0,mon;mon = months[i];i++){ %><option  data-evt="onmonth" value="<%=i%>"><%=mon%></option><% } %></select><%=month%><a class="qdp-next"  data-evt="next">&gt;</a>';
var dayTpl = '<% for(var i=0,day;day = days[i];i++){ %><li><%=day%></li><% } %>';
var dateTpl = '<% for(var i=0;i<emptys;i++){ %><li  class="qdp-empty">&nbsp;</li><% } %><% for(var i=0,item;item=dates[i];i++){ %><li class="<%=item.cls%>"  data-evt="<%=item.evt%>"><%=item.date%></li><% } %>';

var languages = {
	"zh-cn":{
		months:["一","二","三","四","五","六","七","八","九","十","十一","十二"],
		days:["一","二","三","四","五","六","日"],
		year:"年",
		month:"月"
	},
	"zh-tw":{
		months:["壹","贰","叁","肆","伍","陆","柒","捌","玖","拾","拾壹","拾贰"],
		days:["壹","贰","叁","肆","伍","陆","日"],
		year:"年",
		month:"月"
	},
	"en-us":{
		months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
		days:["Mon","Tues","Wed","Thur","Fri","Sat","Sun"],
		year:"&nbsp;",
		month:"&nbsp;"
	}
}

var nl = (navigator.language||navigator.browserLanguage||"en-us").toLowerCase();
var language = languages[nl]?languages[nl]:languages['en-us'];

var milliseconds = 86400000;
var groups = {};
var index = 1;
var inputs = [];
var panel = null;
var max = 32495136761757;
var hdls = {change:{}};

function influence(option){
	var timestamp = option.timestamp;
	var group = option.group;
	var dpid = option.dpid;

	var begin = '',end='';

	for(var i=0,element;element = groups[group][i];i++){
		//该节点可能已经不存在
		if(!document.documentElement.contains(element)){
			groups[group].splice(i,1);
			i--;
		}
		else{
			var iDpid = element.getAttribute('dpid');
			if(iDpid !== dpid){
				if(iDpid < dpid){
					end = timestamp;
				}
				else{
					begin = timestamp-milliseconds
				}
				element.setAttribute("begin",begin);
				element.setAttribute("end",end);
			}
		}
	}
}

function bind(element){

	element.setAttribute("dpid",++index);
	element.type = "text";

	var timestamp = element.getAttribute("timestamp");

	var begin = element.getAttribute("begin");
	var end = element.getAttribute("end");

	if(timestamp){
		element.value = lib.format(new Date(timestamp*1));
	}

	if(!begin){
		begin = 0;
	}
	if(!end){
		end = max;
	}

	element.setAttribute('range',[begin,end].join(','))

	var group = element.getAttribute("group");

	if(group){
		if(!groups[group]){
			groups[group] = [];
		}
		groups[group].push(element);
	}

}
function iterate(){
	for(var i=0,item;item = inputs[i];i++){
		if(item.getAttribute("type") === "date" && item.nodeName.toLowerCase() === "input"){
			bind(item);
		}
	}
}

function Panel(){
	
	var that = this,pMain,pBar,pDay,pDate,pYear,pMonth,pOption,dOption,dDate;

	/**
	 *创建选择器面板
	 */
	pMain = document.createElement('div');
	pMain.style.display = "none"


	pBar = document.createElement('div');
	pDay = document.createElement('ul');
	pDate = document.createElement('ul');

	pMain.appendChild(pBar);
	pMain.appendChild(pDay);
	pMain.appendChild(pDate);

	pMain.className = "qdp-container"
	pBar.className = "qdp-bar"
	pDay.className = "qdp-days"
	pDate.className = "qdp-dates"

	pDay.innerHTML = lib.tmpl(dayTpl,{days:language.days})

	pBar.innerHTML = lib.tmpl(barTpl,language);

	pYear = pBar.getElementsByTagName('label')[0];
	pMonth = pBar.getElementsByTagName('select')[0];

	dOption = {
		timestamp:+new Date(),
		callback:function(){},
		x:0,
		y:0,
		begin:0,
		end:max,
		range:[0,max]

	}

	pOption = {};

	this.show = function(option){
		for(var p in dOption){
			pOption[p] = option[p] || dOption[p];
		}

		dDate = new Date(pOption.timestamp);

		this.render();
		pMain.style.left = pOption.x+'px';
		pMain.style.top = pOption.y+'px';

		pMain.style.display = "block"
	}
	this.hide = function(){
		pMain.style.display = "none"
	}
	this.contains = function(element){
		return pMain.contains(element);
	}

	this.render = function(){
		var parts = lib.parseDate(dDate);

		var year = parts.year;
		var month = parts.month;
		var count = parts.count;
		var emptys = parts.emptys;
		var first = parts.first;
		var last = parts.last;

		var today = new Date();
		var current = -1;
		var dates = [];

		var begin = pOption.begin;
		var end = pOption.end;
		var range = pOption.range.split(',');

		if(begin < range[0]){
			begin = range[0];
		}

		if(end > range[1]){
			end = range[1];
		}

		if(today > first && today < last){
			current = today.getDate();
		}

		for(var i=0;i<count;i++){
			var timestamp = first+i*milliseconds,date = i+1,cls = 'qdp-date-item',evt = "ondate",offset;

			if(timestamp < begin || timestamp > end){
				cls = 'qdp-disable';
				evt = "ondisable"
			}
			if(current == i+1){
				cls += " qdp-today";
			}
		
			offset = pOption.timestamp - timestamp;
			if(offset >0 && offset < milliseconds){
				cls += " qdp-selected";
			}

			dates.push({date:date,cls:cls,evt:evt});
		}

		pYear.innerHTML = year;
		pMonth.selectedIndex = month;

		pDate.innerHTML = lib.tmpl(dateTpl,{
			dates:dates,
			emptys:emptys
		})
	}

	document.body.appendChild(pMain);

	pMonth.onchange = function(){
		dDate.setMonth(this.value);
		that.render()
	}

	lib.event(pBar,"click",{
		"prev":function(){
			dDate.setFullYear(dDate.getFullYear()-1)
			that.render()
		},
		"next":function(){
			dDate.setFullYear(dDate.getFullYear()+1)
			that.render()
		}
	})
	lib.event(pDate,"click",{
		"ondate":function(){
			dDate.setDate(this.innerText);
			pOption.callback(dDate);
			that.hide();
		}
	})
}

lib.ready(function(){
	
	lib.insertStyle(styleTpl);

	panel = new Panel();

	inputs = document.getElementsByTagName("input");
	iterate();

	lib.on(document.documentElement,"click",function(evt){

		var target = this,dpid = target.getAttribute("dpid"),group,timestamp,cid;
	
		if(panel.contains(this)){
			return;
		}
		else if(dpid){

			var rect = lib.getClientRect(target);
			panel.show({
				x:rect.left,
				y:rect.top+rect.height+10,
				timestamp:this.getAttribute("timestamp")*1,
				begin:this.getAttribute("begin"),
				end:this.getAttribute("end"),
				range:this.getAttribute('range'),
				callback:function(date){
					timestamp = +date;
					target.setAttribute('timestamp',timestamp);
					target.value = lib.format(date);

					if(group = target.getAttribute("group")){
						influence({
							group:group,
							timestamp:+date,
							dpid:dpid
						})
					}

					cid = target.getAttribute('cid');
					if(cid && hdls.change[cid]){
						hdls.change[cid].call(target,timestamp);
					}
				}
			})
		}
		else{
			panel.hide();
		}
	})
})


exports.trigger = iterate;
exports.change = function(cid,fn){
	hdls.change[cid] = fn;
}

}));