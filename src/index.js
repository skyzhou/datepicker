

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

	var labels = pBar.getElementsByTagName('label');
	pYear = labels[0];
	pMonth = labels[1];

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
		pMonth.innerHTML = month+1;

		pDate.innerHTML = lib.tmpl(dateTpl,{
			dates:dates,
			emptys:emptys
		})
	}

	document.body.appendChild(pMain);

	lib.click('prev',function(){
		dDate.setMonth(dDate.getMonth()-1)
		that.render()
	})
	lib.click('next',function(){
		dDate.setMonth(dDate.getMonth()+1)
		that.render()
	})
	lib.click('ondate',function(){
		dDate.setDate(this.innerText);
		pOption.callback(dDate);
		that.hide();
	})
}

lib.ready(function(){
	
	lib.insertStyle(styleTpl);

	panel = new Panel();

	inputs = document.getElementsByTagName("input");
	iterate();

	lib.on("click",function(evt){

		var target = this,dpid = target.getAttribute("dpid"),group,timestamp,cid;
	
		if(panel.contains(this)){
			return;
		}
		else if(dpid){

			var rect = lib.getClientRect(target);
			panel.show({
				x:rect.left,
				y:rect.top+rect.height+10,
				timestamp:target.getAttribute("timestamp")*1,
				begin:target.getAttribute("begin"),
				end:target.getAttribute("end"),
				range:target.getAttribute('range'),
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
				}
			})
		}
		else{
			panel.hide();
		}
	})
})

exports.trigger = iterate;
