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


var styleTpl = '.qdp-container{position:absolute;width:211px;min-height:183px;font-size:12px;font-family: Tahoma;border:1px solid #ccc;padding:1px;z-index:999;user-select: none;-webkit-user-select: none;}.qdp-container ul,.qdp-container li{list-style: none;padding:0px;margin:0px;}.qdp-bar{height:18px;border: 1px solid #EDEDED;background: #F1F1F1 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAABkCAYAAABHLFpgAAAAI0lEQVQYlWP4+fPnfyYGBgaGIUT8//+fkBiCS7oETjuGCQEAOoIcmZfyoHUAAAAASUVORK5CYIIvKiAgfHhHdjAwfDM2OTUzYjI0MmU1NzNlMWE3OTgzMTMzMjlmZDg1MDEyICov) 50% 50% repeat-x;color: #222;font-weight: bold;width: 201px;position: relative;padding:4px;}.qdp-bar select{width: 72px;margin: 0px 5px;height:18px;vertical-align: middle;outline: none;}.qdp-prev,.qdp-next{display: block;cursor: pointer;margin:1px;font-family: Menlo, "Courier New",Courier,monospace;}.qdp-prev{float:left;}.qdp-next{float:right;}.qdp-bar ul{position:absolute;}.qdp-year{margin-left: 24px;position: relative;top: 1px;}.qdp-days{margin-top: 6px;}.qdp-days li{float:left;height:22px;width:30px;text-align:center;font-weight: bold;margin-top:6px;}.qdp-dates{clear:both;}.qdp-dates li{float:left;width:19px;height:20px;padding: 1px;margin:1px;text-align: right;line-height: 20px;text-align:right;line-height: 20px;padding-right: 6px;}.qdp-date-item{background:#E6E6E6 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAGQCAYAAABvWArbAAAANUlEQVQ4je3LMQoAIBADwb38/6t5wFXaWAiCtUiaYZvF9hBACOFbuntVVe11B0CSjjeE8BwThQIJ8dhEl0YAAAAASUVORK5CYIIvKiAgfHhHdjAwfDJkMmY3OGEyZjJlYzlhZmNlMzM2YTQ4MGFkYzhhYmEwICov) 50% 50% repeat-x;border:1px solid #D3D3D3;cursor: pointer;color: #555;}.qdp-empty{background:#fff;border:1px solid #fff;}.qdp-date-item:hover{border:1px solid #707070;}.qdp-disable{background:#EAEAEA;border:1px solid #D3D3D3;cursor: not-allowed;color:#D4D4D4;}.qdp-today{border:1px solid #ccc;background: #FFF;}.qdp-selected{border:1px solid #707070;}';
var barTpl = '<a class="qdp-prev"  data-evt="prev">&#9668;</a><label class="qdp-year"></label><%=year%><select><% for(var i=0,mon;mon = months[i];i++){ %><option  data-evt="onmonth" value="<%=i%>"><%=mon%></option><% } %></select><%=month%><a class="qdp-next"  data-evt="next">&#9658;</a>';
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
var isInit = false;
var groups = {};
var index = 0;
var inputs = [];

function DatePicker(element){

	var that = this;

	this.id = ++index;
	this.element = element;
	this.date = new Date();
	this.begin = 0;
	this.end = 32495136761757;
	this.callback = null;
	this.selected = null;

	this.containerEl = document.createElement('div');
	this.containerEl.style.display = "none"
	

	this.barEl = document.createElement('div');
	this.dayEl = document.createElement('ul');
	this.dateEl = document.createElement('ul');
	this.clearEl = document.createElement('div');

	this.containerEl.appendChild(this.barEl);
	this.containerEl.appendChild(this.dayEl);
	this.containerEl.appendChild(this.dateEl);
	this.containerEl.appendChild(this.clearEl);

	this.containerEl.className = "qdp-container"
	this.barEl.className = "qdp-bar"
	this.dayEl.className = "qdp-days"
	this.dateEl.className = "qdp-dates"
	this.clearEl.style.clear = "both";

	this.dayEl.innerHTML = lib.tmpl(dayTpl,{days:language.days})

	this.barEl.innerHTML = lib.tmpl(barTpl,language);

	this.yearEl = this.barEl.getElementsByTagName('label')[0];
	this.monthEl = this.barEl.getElementsByTagName('select')[0];

	this.monthEl.onchange = function(){
		that.setMonth(this.value);
	}

	lib.event(this.barEl,"click",{
		"prev":function(){
			that.setYear(that.date.getFullYear()-1);
		},
		"next":function(){
			that.setYear(that.date.getFullYear()+1);
		}
	})
	lib.event(this.dateEl,"click",{
		"ondate":function(){
			var d = this.innerText;
			that.setDate(d);
		}
	})

	element.parentNode.appendChild(this.containerEl);

	lib.on(element,"click",function(){
		var timestamp =  element.getAttribute("timestamp");
		var begin = element.getAttribute("begin");
		var end = element.getAttribute("end");
		var group = element.getAttribute("group");
		that.show(
			function(str,date){
				element.value = str;
				element.setAttribute("timestamp",+date);
				that.influence(group);
			},
			{
				timestamp:timestamp,
				begin:begin,
				end:end
			}
		);
	})
	lib.on(document.documentElement,"click",function(evt,target){
		evt = evt || window.event;
		target = evt.target || evt.srcElement;
		if(!that.containerEl.contains(target) && target !== element){
			that.hide();
		}
	})

	element.setAttribute("qdp",this.id);

	var defaultTime = element.getAttribute("timestamp")
	if(defaultTime){
		this.selected = defaultTime*1;
		element.value = new Date(this.selected).toLocaleDateString();
	}
}

DatePicker.prototype.setMonth = function(m){
	this.date.setMonth(m);
	this.render();
}
DatePicker.prototype.setYear = function(y){
	this.date.setFullYear(y)
	this.render();
}
DatePicker.prototype.setDate = function(d){
	this.date.setDate(d);
	this.render();
	this.callback(this.date.toLocaleDateString(),this.date);
	this.hide();
}
DatePicker.prototype.render = function(option){

	option = option || {};

	var parts = lib.parseDate(this.date);

	var year = parts.year;
	var month = parts.month;
	var count = parts.count;
	var emptys = parts.emptys;
	var first = parts.first;
	var last = parts.last;

	var today = new Date();
	var current = -1;
	var dates = [];

	if(today > first && today < last){
		current = today.getDate();
	}

	for(var i=0;i<count;i++){
		var timestamp = first+i*86400000,date = i+1,cls = 'qdp-date-item',evt = "ondate",offset;
		if(timestamp < this.begin || timestamp > this.end){
			cls = 'qdp-disable';
			evt = "ondisable"
		}
		if(current == i+1){
			cls += " qdp-today";
		}
		if(this.selected){
			offset = this.selected - timestamp;
			if(offset >0 && offset < milliseconds){
				cls += " qdp-selected";
			}
		}
		dates.push({date:date,cls:cls,evt:evt});
	}

	this.yearEl.innerHTML = year;
	this.monthEl.selectedIndex = month;
	this.dateEl.innerHTML = lib.tmpl(dateTpl,{
		dates:dates,
		emptys:emptys
	})
}
DatePicker.prototype.show = function(callback,option){
	option = option || {};

	if(option.timestamp){
		this.date = new Date(option.timestamp*1);
		this.selected = option.timestamp;
	}
	if(option.begin){
		this.begin = option.begin*1;
	}
	if(option.end){
		this.end = option.end*1;
	}

	this.callback = callback;
	this.render(option);
	this.containerEl.style.left = this.element.offsetLeft+"px";
	this.containerEl.style.top = this.element.offsetTop+this.element.offsetHeight+"px";
	this.containerEl.style.display = "block";
}
DatePicker.prototype.hide = function(){
	this.containerEl.style.display = "none"
}
DatePicker.prototype.setRange = function(begin,end){
	this.element.setAttribute("begin",begin);
	this.element.setAttribute("end",end);
}

DatePicker.prototype.influence = function(group){
	if(group){
		var timestamp = +this.date;
		for(var i=0,item;item = groups[group][i];i++){
			if(item.id < this.id){
				item.setRange("",timestamp);
			}
			else if(item.id > this.id){
				item.setRange(timestamp-milliseconds,"");
			}
		}
	}
}

function bind(element){
	if(!isInit){
		lib.insertStyle(styleTpl);
		isInit = true;
	}
	if(!element.getAttribute('qdp')){
		var group = element.getAttribute("group");
		var picker = new DatePicker(element);

		if(group){
			if(!groups[group]){
				groups[group] = [];
			}
			groups[group].push(picker);
		}
	}
}
function iterate(inputs){
	for(var i=0,ipt;ipt = inputs[i];i++){
		if(ipt.getAttribute("type") == "date"){
			ipt.type = "text";
			bind(ipt);
		}
	}
}
if(!require){
	lib.on(window,'load',function(){
		inputs = document.getElementsByTagName("input");
		iterate(inputs);
	})
}

exports.toggle = function(){
	iterate(inputs);
}

}));