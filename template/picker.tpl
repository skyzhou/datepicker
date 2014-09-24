<template name="DATE.PICKER.BAR">
	<a class="qdp-prev"  data-evt="prev">&#9668;</a>
	<label class="qdp-year"></label><%=year%>
	<select>
		<% for(var i=0,mon;mon = months[i];i++){ %>
			<option  data-evt="onmonth" value="<%=i%>"><%=mon%></option>
		<% } %>
	</select><%=month%>
	<a class="qdp-next"  data-evt="next">&#9658;</a>
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
		<li class="<%=item.cls%>"  data-evt="<%=item.evt%>"><%=item.date%></li>
	<% } %>
</template>