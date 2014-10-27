<template name="DATE.PICKER.STYLE">
	.qdp-container{
		position:absolute;
		width:211px;
		min-height:183px;
		font-size:12px;
		font-family: Tahoma;
		border:1px solid #D1D1D1;
		padding:1px;
		z-index:9999;
		user-select: none;
		-webkit-user-select: none;
		background: #fff;
	}
	.qdp-container ul,.qdp-container li{
		list-style: none;
		padding:0px;
		margin:0px;
	}

	.qdp-arrow{
		position:absolute;
		display:block;
		width:0;
		height:0;
		border-color:transparent;
		border-style:solid;
		border-width:11px;
		left:50%;
		margin-left:-11px;
		border-top-width:0;
		border-bottom-color:#D1D1D1;
		top:-12px
	}

	.qdp-bar{
		height: 20px;
		background: #f7f7f7;
		color: #404a58;
		font-weight: bold;
		width: 201px;
		position: relative;
		padding: 10px 5px;
	}
	.qdp-bar select{
		width: 72px;
		margin: 0px 5px;
		height:18px;
		vertical-align: middle;
		outline: none;
	}
	.qdp-prev,.qdp-next{
		display: block;
		cursor: pointer;
		margin:1px;
		color:#ababab;
		font-family: Menlo, "Courier New",Courier,monospace;
	}
	.qdp-prev{
		float:left;
	}
	.qdp-next{
		float:right;
	}
	.qdp-bar ul{
		position:absolute;
	}
	.qdp-year{
		margin-left: 24px;
		position: relative;
		top: 1px;
	}
	.qdp-days{
		margin-top: 6px;
		color:#91959c;
	}
	.qdp-days li{
		float:left;
		height:22px;
		width:30px;
		text-align:center;
		font-weight: bold;
		margin-top:6px;
	}
	.qdp-dates{
		clear:both;
	}
	.qdp-dates li{
		float: left;
		width: 19px;
		height: 18px;
		padding: 1px;
		margin: 3px;
		text-align: center;
		line-height: 19px;
		padding-right: 2px;
	}
	.qdp-date-item{
		border:1px solid #fff;
		cursor: pointer;
		color: #171d25;
	}
	.qdp-empty{
		border:1px solid #fff;
	}
	.qdp-date-item:hover{
		background:#f7f7f7;
		color: #171d25;
	}
	.qdp-disable{
		border:1px solid #fff;
		cursor: not-allowed;
		color:#a2a2a2;
	}
	.qdp-today{
		border:1px solid #0071ce;
		color: #0071ce;
	}
	.qdp-selected,.qdp-selected:hover{
		border:1px solid #0071ce;
		background:#0071ce;
		color:#fff;
	}
</template>	