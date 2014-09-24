<template name="DATE.PICKER.STYLE">
	.qdp-container{
		position:absolute;
		width:211px;
		min-height:183px;
		font-size:12px;
		font-family: Tahoma;
		border:1px solid #ccc;
		padding:1px;
		z-index:999;
		user-select: none;
		-webkit-user-select: none;
	}
	.qdp-container ul,.qdp-container li{
		list-style: none;
		padding:0px;
		margin:0px;
	}
	.qdp-bar{
		height:18px;
		border: 1px solid #EDEDED;
		background: #F1F1F1 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAABkCAYAAABHLFpgAAAAI0lEQVQYlWP4+fPnfyYGBgaGIUT8//+fkBiCS7oETjuGCQEAOoIcmZfyoHUAAAAASUVORK5CYIIvKiAgfHhHdjAwfDM2OTUzYjI0MmU1NzNlMWE3OTgzMTMzMjlmZDg1MDEyICov) 50% 50% repeat-x;
		color: #222;
		font-weight: bold;
		width: 201px;
		position: relative;
		padding:4px;
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
		float:left;
		width:19px;
		height:20px;
		padding: 1px;
		margin:1px;
		text-align: right;
		line-height: 20px;
		text-align:right;
		line-height: 20px;
		padding-right: 6px;
	}
	.qdp-date-item{
		background:#E6E6E6 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAGQCAYAAABvWArbAAAANUlEQVQ4je3LMQoAIBADwb38/6t5wFXaWAiCtUiaYZvF9hBACOFbuntVVe11B0CSjjeE8BwThQIJ8dhEl0YAAAAASUVORK5CYIIvKiAgfHhHdjAwfDJkMmY3OGEyZjJlYzlhZmNlMzM2YTQ4MGFkYzhhYmEwICov) 50% 50% repeat-x;
		border:1px solid #D3D3D3;
		cursor: pointer;
		color: #555;
	}
	.qdp-empty{
		background:#fff;
		border:1px solid #fff;
	}
	.qdp-date-item:hover{
		border:1px solid #707070;
	}
	.qdp-disable{
		background:#EAEAEA;
		border:1px solid #D3D3D3;
		cursor: not-allowed;
		color:#D4D4D4;
	}
	.qdp-today{
		border:1px solid #ccc;
		background: #FFF;
	}
	.qdp-selected{
		border:1px solid #707070;
	}
</template>	