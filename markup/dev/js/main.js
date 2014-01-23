var ui = {};

ui.initElems = [];
ui.init = function(){
	var i;
	for (i=0; i<this.initElems.length; i++){
		this[this.initElems[i]]();
	}
};
$(function () {
	ui.init();
});
ui.compare = function () {
	var productList = $('.compare-list td:first-child'),
		titles = $('.compare__titles');
		titleList = $('td',titles),
		compare = $('.compare'),
		frame = $('.compare__frame'),
		list = $('.compare-list'),
		prev = compare.find('.compare__prev'),
		next = compare.find('.compare__next');
	if (compare.size()){
		$(window).load(function () {
			productList.each(function (i) {
				titleList.eq(i).height(productList.eq(i).height());
			});
			titles.addClass('ready');
		});

		if ("Sly" in window){
			var sly = (new Sly(frame,{
				horizontal: 1,
				speed: 300,
				touchDragging: 1
			},{
				'load':function () {
					if (list.width()>frame.width()){
						prev.add(next).show();
					} else {
						prev.add(next).hide();
					}
				}
			}).init());
			$(window).resize(function () {
				sly.reload();
			});
			prev.click(function (e) {
				sly.slideBy(-253);
				e.preventDefault();
			});
			next.click(function (e) {
				sly.slideBy(253);
				e.preventDefault();
			});
		}
	}
	$(document).on('click','.compare-list__remove-btn',function  (e) {
		var index = $(this).closest('td').index()+1;
		list.find('td:nth-child('+index+')').remove();
		sly.reload();
		e.preventDefault();
	});
}
ui.initElems.push("compare");
ui.menuExpand = function () {
	$('.menu').on('click','.menu__expander', function () {
		$(this).closest('.menu__title').toggleClass('active');
	});	
};
ui.initElems.push("menuExpand");
ui.miniCart = function () {
	var miniCart = $('.mini-cart');
	miniCart.on("click",'.mini-cart__opener', function () {
		miniCart.toggleClass('mini-cart_active');
	});
	miniCart.on('click','.mini-cart__delete', function () {
		$(this).closest('.mini-cart__list-item').remove();
	});
	$(document).on('click',function (e) {
		if (!$(e.target).closest('.mini-cart').size()){
			miniCart.removeClass('mini-cart_active');
		}
	});
}
ui.initElems.push("miniCart");
ui.productPopupGallery = function () {
	$('.product-popup__gallery').roundabout({
		"childSelector": "img",
		"minScale": 0.3
	});
}
ui.initElems.push("productPopupGallery");

ui.initShortMenu = function () {
	var shortMenu = $('#short-menu'),
		topDistance = 220,
		$body = $(document.body);
	if (shortMenu.size()) {
		$(window).scroll(function () {
			var $this = $(this);
			if ($this.scrollTop()>=topDistance) {
				$body.addClass('short-menu_active');
			} else {
				$body.removeClass('short-menu_active');
			}
		});
	}
}
ui.initElems.push("initShortMenu");
ui.slider = function () {
	var slider = $('.promo-slider');
	slider.each(function () {
		var list = $('.promo-slider__item',this),
			switchers = $('.promo-slider__switch-item'),
			progress = $('.promo-slider__progress').hide();
		switchers.on('click',function (e) {
			var $this = $(this);
			list.removeClass('promo-slider__item_active').eq($this.index()).addClass('promo-slider__item_active');
			switchers.removeClass('promo-slider__switch-item_active');
			$this.addClass('promo-slider__switch-item_active');
			e.preventDefault();
		});
	});
};
ui.initElems.push('slider');
ui.filterSelects = function () {
	$document = $(document);
	$('.filter-select').each(function (i){
		var $this = $(this);
		if ($(this).find(".filter-select__search").size()) {
			initSelect.call(this, "search");
			return true;
		}
		if ($(this).is(".filter-select_range")){
			initSelect.call(this, "range");
			return true;
		}
		initSelect.call(this,"default")
	}).on('change:filterSelect', function (e) {
		if (e.value) {
			$(this).attr('data-value',e.value).find(".filter-select__opener",this).attr('title',e.text).find('span').text(e.text);
		} else {
			$(".filter-select__opener",this).attr('title',e.text).find('span').text(e.text);
		}
		if (e.closeSelect){
			$(this).removeClass('filter-select_active');
			//here some functions for filter products
		}
	});
	$document.on('keydown', function (e) {
		if ([38,40,13,27,32].indexOf(e.keyCode)>=0 && $document.data("activeSelect")){
			$document.data("activeSelect").trigger({
				type:"keydown:filterSelect",
				keyCode: e.keyCode
			});
			e.preventDefault();
		}
	});
	$document.on('click','.filter-select__opener', function (e) {
		var $this = $(this),
			filterSelect = $this.closest('.filter-select');
		if (filterSelect.hasClass('filter-select_active')){
			$document.data('activeSelect').removeClass('filter-select_active').find('.filter-select__list-item_hover').removeClass('filter-select__list-item_hover');
			$.removeData($document,'activeSelect');
		} else {
			if ($document.data('activeSelect')){
				$document.data('activeSelect').removeClass('filter-select_active').find('.filter-select__list-item_hover').removeClass('filter-select__list-item_hover');
			}
			$document.data('activeSelect', filterSelect.addClass('filter-select_active'));
			filterSelect.find('input:first').focus();
		}
		e.preventDefault();
	}).on('click', function (e) {
		if (!($(e.target).closest('.filter-select').size()) && $document.data('activeSelect')) {
			$document.data('activeSelect').removeClass('filter-select_active').find('.filter-select__list-item_hover').removeClass('filter-select__list-item_hover');
			$.removeData($document,'activeSelect');
		}
	});
	function initSelect(type) {
		var $this = $(this),
			sly,
			frame;
		$this.addClass('filter-select_active');
		if ("Sly" in window){
			frame = $this.find('.filter-select__drop-frame');
			sly = new Sly(frame,{
				scrollBy:45,
				scrollBar: $("<div class='filter-select__scroll'><div class='filter-select__scroll-btn'></div></div>").appendTo(frame),
				dragHandle:    1,
				minHandleSize: 20,
				dynamicHandle: 1,
				clickBar:      0,
				syncSpeed:     0.5
			},{
				'load':function () {
					if (frame.height()>=frame.children().outerHeight(true)){
						frame.addClass('scroll_disabled');
					} else {
						frame.removeClass('scroll_disabled');
					}
				}
			}).init();
		}
		switch(type){
			case "search": 
				(function() {
					var totalList = [],
						listHolder = $this.find('.filter-select__list'),
						active = "";
					$this.find('.filter-select__list-item').each(function(i) {
						var _this = $(this);
						totalList.push({
							'text': _this.text(),
							'value': _this.attr('data-value')
						});
					});
					$this.on("oninput" in window ? "input":"keyup",'.filter-select__search-input', function (e) {
						var val = this.value.toLowerCase().trimLeft(),
							i=0,
							string,
							index,
							HTML = "";
						if (val){
							$(this).parent().addClass('filter-select__input-wrap_active');
						} else {
							$(this).parent().removeClass('filter-select__input-wrap_active');
						}
						for (;i<totalList.length; i++){
							index = totalList[i].text.toLowerCase().indexOf(val);
							if (index>=0){
								HTML += "<li data-value='"+totalList[i].value+"' class='filter-select__list-item"+(totalList[i].value==active?" filter-select__list-item_active":"")+"'>"+totalList[i].text.substr(0, index) + "<b>"+totalList[i].text.substr(index,val.length)+"</b>"+totalList[i].text.slice(index+val.length)+"</li>";
							}
						}
						listHolder.html(HTML);
						sly.reload();
					}).on("click",".filter-select__list-item", function (e) {
						var _this = $(this);
						_this.addClass('filter-select__list-item_active').siblings().removeClass('filter-select__list-item_active');
						active = _this.attr('data-value');
						$this.trigger({
							type: "change:filterSelect",
							value: active,
							text: _this.text(),
							closeSelect: true
						});
						e.preventDefault();
					}).on('keydown:filterSelect', function (e) {
						var hoverElem = $this.find('.filter-select__list-item_hover'),
							activeElem = $this.find('.filter-select__list-item_active');
						switch(e.keyCode){
							case 38:
								if (hoverElem.size()) {
									if (hoverElem.prev().size())
										hoverElem = hoverElem.removeClass("filter-select__list-item_hover").prev().addClass('filter-select__list-item_hover');
								} else {
									if (activeElem.size()){
										if (activeElem.prev().size()){
											hoverElem = activeElem.prev().addClass('filter-select__list-item_hover');
										} else {
											hoverElem = activeElem.addClass('filter-select__list-item_hover');
										}
									} else {
										hoverElem = $this.find('.filter-select__list-item:first').addClass('filter-select__list-item_hover');
									}
								}
								sly.toCenter(hoverElem);
								break;
							case 40:
								if (hoverElem.size()) {
									if (hoverElem.next().size()){
										hoverElem = hoverElem.removeClass("filter-select__list-item_hover").next().addClass('filter-select__list-item_hover');
									}
								} else {
									if (activeElem.size()){
										if (activeElem.next().size()){
											hoverElem = activeElem.next().addClass('filter-select__list-item_hover');
										} else {
											hoverElem = activeElem.addClass('filter-select__list-item_hover');
										}
									} else {
										hoverElem = $this.find('.filter-select__list-item:first').addClass('filter-select__list-item_hover');
									}
								}
								sly.toCenter(hoverElem);
								break;
							case 13:
								if (hoverElem.size()) {
									hoverElem.removeClass('filter-select__list-item_hover');
									hoverElem.trigger('click');
								}
								break;
							case 27:
								$this.find('.filter-select__opener').trigger('click');
						}
					});
				})();
				break;
			case "range":
				(function () {
					var currency = $this.find('.filter-select__currency:first').text(),
						from = $this.find('.filter-select__range-input_from'),
						to = $this.find('.filter-select__range-input_to'),
						opener = $this.find('.filter-select__opener'),
						startText = opener.text();

					to.add(from).on("oninput" in window ? "input":"keyup", function () {
						if (this.value.length>12){
							this.value = this.value.slice(0,12);
						} else {
							var value = parseInt(this.value);
							this.value = isNaN(value) ? "" : value;
							if (this.className.indexOf("filter-select__range-input_from")>=0) {
								from.val(this.value);
							} else {
								to.val(this.value);
							}
							render(from.val(), to.val(),false);
						}
					}).change(function() {
						var c;
						if (from.val() && to.val() && (Number(from.val())>Number(to.val()))) {
							c = from.val();
							from.val(to.val());
							to.val(c);
							render(from.val(), to.val(), false);
						}
					});
					$this.on('change','input.radio', function () {
						var _this = $(this),
							values;
						if (_this.prop('checked')){
							if (this.value.indexOf('-')>=0){
								values = this.value.split('-');
								from.val(values[0]);
								to.val(values[1]);
							} else {
								if (this.value[0] == ">"){
									from.val(this.value.slice(1));
									to.val("");
								}
								if (this.value[0] == "<"){
									to.val(this.value.slice(1));
									from.val("");
								}
							}
							render(from.val(), to.val(), true);
						}
					}).on('keydown:filterSelect', function (e) {
					switch(e.keyCode){
						case 13:
						case 27:
							$this.find('.filter-select__opener').trigger('click');
					}
				});
					function render (from,to, closeSelect) {
						var string,
							value,
							c;
						if (from && to){
							value = from+"-"+to;
							string = from+" - "+to+" "+currency;
						} else {
							if (from){
								value = ">"+from;
								string = "От "+from + " " + currency;
							} else {
								if (to){
									string = "До " + to + " " + currency;
									value = "<"+to;
								} else {
									string = startText;
									value = "";
								}
							}
						}
						$this.trigger({
							type: "change:filterSelect",
							value: value,
							text: string,
							closeSelect: closeSelect
						});
					}
				})();
				break;
			default: 
				$this.on("click",".filter-select__list-item", function (e) {
					var _this = $(this);
					_this.addClass('filter-select__list-item_active').siblings().removeClass('filter-select__list-item_active');
					$this.trigger({
						type: "change:filterSelect",
						value: _this.attr('data-value'),
						text: _this.text(),
						closeSelect: true
					});
					e.preventDefault();
				}).on('keydown:filterSelect', function (e) {
					var hoverElem = $this.find('.filter-select__list-item_hover'),
						activeElem = $this.find('.filter-select__list-item_active');
					switch(e.keyCode){
						case 38:
							if (hoverElem.size()) {
								if (hoverElem.prev().size())
									hoverElem = hoverElem.removeClass("filter-select__list-item_hover").prev().addClass('filter-select__list-item_hover');
							} else {
								if (activeElem.size()){
									if (activeElem.prev().size()){
										hoverElem = activeElem.prev().addClass('filter-select__list-item_hover');
									} else {
										hoverElem = activeElem.addClass('filter-select__list-item_hover');
									}
								} else {
									hoverElem = $this.find('.filter-select__list-item:first').addClass('filter-select__list-item_hover');
								}
							}
							sly.toCenter(hoverElem);
							break;
						case 40:
							if (hoverElem.size()) {
								if (hoverElem.next().size()){
									hoverElem = hoverElem.removeClass("filter-select__list-item_hover").next().addClass('filter-select__list-item_hover');
								}
							} else {
								if (activeElem.size()){
									if (activeElem.next().size()){
										hoverElem = activeElem.next().addClass('filter-select__list-item_hover');
									} else {
										hoverElem = activeElem.addClass('filter-select__list-item_hover');
									}
								} else {
									hoverElem = $this.find('.filter-select__list-item:first').addClass('filter-select__list-item_hover');
								}
							}
							sly.toCenter(hoverElem);
							break;
						case 13:
							if (hoverElem.size()) {
								hoverElem.removeClass('filter-select__list-item_hover');
								hoverElem.trigger('click');
							}
							break;
						case 27:
							$this.find('.filter-select__opener').trigger('click');
					}
				});
		}
		$this.removeClass('filter-select_active');
	}
}
ui.initElems.push("filterSelects");

ui.countInput = function () {
	$(document).on('click','.count-input__more',function (e) {
		var inp = $(this).siblings('input');
		inp.val(newCountValue(inp.val(),1));
		e.preventDefault();
	});
	$(document).on('click','.count-input__less',function (e) {
		var inp = $(this).siblings('input');
		inp.val(newCountValue(inp.val(),-1));
		e.preventDefault();
	});
	$(document).on('change','.count-input input',function () {
		var inp = $(this);
		inp.val(newCountValue(inp.val(),0));
	});
}
function newCountValue(value, inc) {
	var val = parseInt(value)+inc;
	if (isNaN(val)){
		if(inc>0)
			return inc;
		return 0;
	} else {
		if (val<0)
			val = 0;
		return val;
	}
}
ui.initElems.push('countInput');
ui.visualFix = function () {
	//nav arrow
	$('#nav .nav__arrow').each(function () {
		var $this = $(this);
		$this.css({
			'margin-left': $this.parent().width()/2-$this.width()/2
		});
	});
}
ui.initElems.push("visualFix");