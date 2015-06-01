<template name="DATE.PICKER.BAR">
	<div class="qdp-arrow"></div>
	<div class="qdp-arrow" style="border-bottom-color: #f7f7f7;top: -10px;"></div>
	<a class="qdp-prev"  data-click="prev">&lt;</a>
	<label class="qdp-year"></label><%=year%>
	<label class="qdp-month"></label><%=month%>
	<a class="qdp-next"  data-click="next">&gt;</a>
</template>	

<template name="DATE.PICKER.DAY">
	<% for(var i=0,day;day = days[i];i++){ %>
	<li><%=day%></li>
	<% } %>
</template>	

<template name="DATE.PICKER.DATE">
	<% for(var i=0;i<emptys;i++){ %>
	<li  class="qdp-empty">&nbsp;</li>
	<% } %>
	<% for(var i=0,item;item=dates[i];i++){ %>
		<li class="<%=item.cls%>"  data-click="<%=item.evt%>"><%=item.date%></li>
	<% } %>
</template>