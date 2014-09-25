

var styleTpl = DATE.PICKER.STYLE;
var barTpl = DATE.PICKER.BAR;
var dayTpl = DATE.PICKER.DAY;
var dateTpl = DATE.PICKER.DATE;

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
function iterate(){
	inputs = document.getElementsByTagName("input");
	for(var i=0,ipt;ipt = inputs[i];i++){
		if(ipt.getAttribute("type") == "date"){
			ipt.type = "text";
			bind(ipt);
		}
	}
}
if(!require){
	lib.on(window,'load',function(){
		iterate();
	})
}

exports.toggle = function(){
	iterate(inputs);
}
