$(document).on("click","span.radio,span.checkbox",function(){var a=$(this).prev("input");a.prop("checked",!a.prop("checked")).trigger("change")}),$(document).on("click","label",function(a){if(!$(a.target).hasClass("radio checkbox")){var b=$(this).find("input");b.prop("checked",!b.prop("checked")).trigger("change")}}),$(function(){$("input:radio").on("change",function(){$("input:radio[name="+$(this).attr("name")+"]").each(function(){$(this).prop("checked")?$(this).parent().addClass("checked"):$(this).parent().removeClass("checked")})}),$("input:checkbox").on("change",function(){$(this).prop("checked")?$(this).parent().addClass("checked"):$(this).parent().removeClass("checked")})}),Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){for(var c=b||0,d=this.length;d>c;c++)if(this[c]===a)return c;return-1}),"trim"in String.prototype||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),"trimLeft"in String.prototype||(String.prototype.trimLeft=function(){return this.replace(/^\s+/,"")}),"trimRight"in String.prototype||(String.prototype.trimRight=function(){return this.replace(/\s+$/,"")});