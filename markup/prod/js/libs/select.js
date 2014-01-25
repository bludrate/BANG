$(function init(){
	var select = $('select.select');
	if(select.size()) select.select();
});
$.fn.select=function(o){
	var callMethod=$.fn.select.method;
	if(typeof o=="string" && o in $.fn.select.method){
		var select=$(this);
		callMethod[o](select);
		return select;
	}
	if(!("method" in $.fn.select)){
		$.fn.select.method={
			"destroy":function(select){
				if(select.data('customized')){
					select.off('change.select');
					$(document).off('click.select');
					select.each(function(){
						$(this).data('customSelect').off('click.select').remove();
					});
					select.removeData();
				}else{
					throw new Error('объект не проинициализирован');
				}
			},
			"enable":function(select){
				if(select.data('disable')){
					select.attr('disabled',false);
					select.data('customSelect').first().on('click.select',select.data('openerHandler')).removeClass('disabled');
				}
			},
			"disable":function(select){
				if(!select.data('disable')){
					select.data('disable',true);
					select.attr('disabled',true);
					select.data('openerHandler',$._data(select.data('customSelect').first().get(0),"events").click[0].handler);
					select.data('customSelect').first().off('click').addClass('disabled');
				}
			}
		};
		callMethod=$.fn.select.method;
	}
	o=$.extend({
			"list":"ul",
			"item":"li",
			"openerClass":"select-opener",
			"icoClass":"ico",
			"selectedClass":"selected",
			"activeItemClass":"active",
			"dropDownClass":"select-dropdown",
			"style":"dropdown", //popup,dropdown
			"transferClass":true,
			"dropdownHasBorder":false
		},o);
		var select=[],
			body=$('body'),
			openerHTML=$('<a class="'+o.openerClass+'"><span class="'+o.icoClass+'"></span><span class="'+o.selectedClass+'"></span></a>'),
			dropdownHTML=$('<div class='+o.dropDownClass+'>'+
								'<div class="top">'+
									'<div class="l"></div>'+
									'<div class="r"></div>'+
								'</div>'+
								'<div class="c-holder">'+
									'<div class="c appendHere">'+
									'</div>'+
								'</div>'+
								'<div class="bottom">'+
									'<div class="l"></div>'+
									'<div class="r"></div>'+
								'</div>'+
							'</div>');
		$(this).each(function(i){
			if(!$(this).data('customized')){
				select.push(this);
			}
		});
		if(select.length){
			$(select).each(function(){
				var opener = openerHTML.clone(),
					nativeSelect = $(this),
					title=nativeSelect.find("option[title]").text(),
					options=nativeSelect.find("option[title]").attr('disabled',true).end().find('option'),
					optionSize = options.size() - 1,
					dropdown = dropdownHTML.clone(),
					list = "<" + o.list + ">";
				if (nativeSelect.attr('class')) {
					var clases = nativeSelect.attr('class').split(' ');
					for (var i=0; i<clases.length; i++) {
						dropdown.addClass('drop-'+clases[i]);
					}
				}
				nativeSelect.find('option').each(function(i, data){
					if($(this).attr('title')){
						list += "<" + o.item + " style='display:none;'>" + data.childNodes[0].nodeValue + "</" + o.item + ">";
					}else{
						list += "<" + o.item + ($(this).attr('class') ? " class='"+$(this).attr('class')+"' ": "") + "><a href='#'>" + data.childNodes[0].nodeValue + "</a></" + o.item + ">";
					}
					if (i == optionSize) {
						list += "</" + o.list + ">";
					}
				});
				list = $(list);
				dropdown = dropdown.find('.appendHere').removeClass('appendHere').append(list).end();
				opener.insertAfter(nativeSelect);
				$("."+o.selectedClass,opener).text(nativeSelect.find('option:selected').text());
				body.append(dropdown);
				(o.dropdownHasBorder) ? dropdown.width(opener.width()) : dropdown.width(opener.outerWidth());
				(o.transferClass) ? opener.addClass(nativeSelect.attr('class')) : '';
				
				$(this).data('customSelect', opener.add(dropdown));
				$(this).data('customized', true);
				var listItems = list.find(">" + o.item),
					dropdownWidth = dropdown.outerWidth(),
					dropdownHeight = dropdown.outerHeight();
					selectedByHover='',
					selected='',
					prev = '';
				nativeSelect.on("change.select", function(e, selectedIndex,dontHide){
					if (!selectedIndex && selectedIndex !== 0) 
						selectedIndex = options.filter(':selected').index();
						prev = listItems.filter("."+o.activeItemClass).removeClass(o.activeItemClass);
					listItems.eq(selectedIndex).addClass(o.activeItemClass);
					options.removeAttr('selected').eq(selectedIndex).attr('selected', true);
					selected=options.filter(':selected');
					selectedByHover=selected;
					$("."+o.selectedClass,opener).text(selected.text());
					if (prev.attr('class')) {
						opener.removeClass(prev.attr('class'));
					}
					if (selected.attr('class')) {
						opener.addClass(selected.attr('class'));
					}
					if(!dontHide){
						dropdown.hide();
						opener.removeClass('active');
						$(document).off('keydown.select');
					}
				}).trigger("change.select");
				if(title){
					$("."+o.selectedClass,opener).text(title);
					nativeSelect.trigger('change.select',[options.filter(':selected').index()]);
				}
				listItems.click(function(e){
					nativeSelect.trigger("change.select", [$(this).index()]);
					dropdown.hide();
					opener.removeClass('active');
					e.preventDefault();
				});
				listItems.hover(function(){
					selectedByHover=$(this);
				},function(){
					selectedByHover="";
				});
				opener.click(function(e){
					if(dropdown.is(':hidden')){
						dropdown.show();
						alignDropDown();
						$(document).off('keydown.select');
						$(document).on('keydown.select',function(e){
							if(e.keyCode==13 && selectedByHover){
								nativeSelect.trigger("change.select",[selectedByHover.index()]);
							}
							if(e.keyCode==38 && selected.prev().size() && !selected.prev().is(':disabled')){
								nativeSelect.trigger("change.select",[selected.prev().index(),true]);
								if(o.style=="popup"){
									alignDropDown();
								}
							}else if(e.keyCode==40 && selected.next().size() && !selected.next().is(':disabled')){
								nativeSelect.trigger("change.select",[selected.next().index(),true]);
								alignDropDown();
							}
						});
						opener.addClass('active');
					}
				});
				$(window).on('resize.select', function(){
					if (dropdown.is(':visible')){
						alignDropDown();
					}
				});
				$(document).on('click.select', function(e){
					if (!$(e.target).closest(dropdown).size() && !$(e.target).closest(opener).size()) {
						dropdown.hide();
						opener.removeClass('active');
						$(document).off('keydown.select');
					}
				});
				function alignDropDown(){
					if(o.style=="dropdown"){
						var top = opener.offset().top + opener.outerHeight(),
							left = opener.offset().left;
						if(top + dropdownHeight > $(window).height() + $(window).scrollTop() && top - dropdownHeight - opener.outerHeight() > 0){
							dropdown.css({
								'top': top - dropdownHeight - opener.outerHeight(),
								'left': left
							});
						}else{
							dropdown.css({
								'top': top,
								'left': left
							});
						}
					}else{
						var top = opener.offset().top-listItems.filter("."+o.activeItemClass).position().top,
							left = opener.offset().left;
						dropdown.css({
							'top': top,
							'left': left
						});
					}
				}
				if(nativeSelect.is(':disabled')) nativeSelect.select('disable');
			});
		}else{
			throw Error('селект/ы уже проинициализирован/ы');
		}
}