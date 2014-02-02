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
ui.basket = function () {
	var basket = $('.basket');
	basket.each(function () {
		var table = $('.basket__table',this),
			totalPriceElem = $('.basket__total-price'),
			currency = $(this).attr('data-currency'),
			totalPrice;
		$('.basket__table',this).on('click','.delete-btn',function (e) {
			$(this).closest('tr').remove();
			totalPrice = 0;
			table.find('.basket__sum').each(function () {
				totalPrice += Number($(this).text().replace(/[^0-9]/g,""));
			});
			totalPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			e.preventDefault();
		}).find('.count-input input').on('change.count',function (e) {
			var tr = $(this).closest('tr'),
				price = (Number(tr.find('.basket__price').text().replace(/[^0-9]/g,""))*e.value).toString();
			if (!isNaN(Number(price)))
				tr.find('.basket__sum').text(price.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			totalPrice = 0;
			table.find('.basket__sum').each(function () {
				totalPrice += Number($(this).text().replace(/[^0-9]/g,""));
			});
			totalPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
		});
	});
}
ui.initElems.push("basket");
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
ui.footerMap = function () {
	var timer,
		map = $('.footer-map');
	map.hover(function () {
		timer = setTimeout(function () {
			map.addClass('footer-map_active');
		}, 1000);
	}, function () {
		clearTimeout(timer);
		map.removeClass('footer-map_active');
	});
	map.on('click','.map-popup__close',function (e) {
		$(this).closest('.map-popup').hide();
		e.preventDefault();
	});
};
ui.initElems.push("footerMap");
ui.gallery = function () {
	var gallery = $('.gallery');
	gallery.each(function () {
		var list = $('.gallery__list',this),
			items = $('.gallery__item',list),
			frame = $('.gallery__frame',this),
			switchers = $('.gallery__switchers-item',this),
			width = 0;
		items.each(function  () {
			width += $(this).width();
		});
		list.css({
			'width':width,
			'left':list.offset().left - items.eq(0).offset().left + (frame.width()-items.eq(0).width())/2
		});
		switchers.on('click',function (e) {
			var $this = $(this);
			if (!$this.hasClass('gallery__switchers-item_active')){
				slideTo($this.index());
			}
			e.preventDefault();
		});
		items.on('click',function (e) {
			var $this = $(this);
			if (!$this.hasClass('gallery__item_active')){
				slideTo($this.index());
				e.preventDefault();
			}
		});
		function slideTo(index){
			switchers.removeClass('gallery__switchers-item_active').eq(index).addClass('gallery__switchers-item_active');
			items.removeClass('gallery__item_active').eq(index).addClass('gallery__item_active');
			list.css({
				'left':list.offset().left - items.eq(index).offset().left + (frame.width()-items.eq(index).width())/2
			});
		}
	});
};
ui.initElems.push("gallery");
ui.menuExpand = function () {
	$('.menu').on('click','.menu__expander', function () {
		var $this = $(this),
			title = $this.closest('.menu__title'),
			menu = title.closest('.menu');
		if(title.hasClass('active')){
			title.removeClass('active');
		} else {
			menu.find('.menu__title').removeClass('active');
			title.addClass('active');
		}
	});	
};
ui.initElems.push("menuExpand");
ui.miniCart = function () {
	var miniCart = $('.mini-cart');
	miniCart.on("click",'.mini-cart__opener', function (e) {
		miniCart.toggleClass('mini-cart_active');
		e.preventDefault();
	});
	$(document).on('click',function (e) {
		if (!$(e.target).closest('.mini-cart').size() && !$(e.target).is('.mini-cart__delete')){
			miniCart.removeClass('mini-cart_active');
		}
	});
	miniCart.each(function () {
		var $this = $(this),
			yourorder = $this.is('.your-order'),
			list = $('.mini-cart__list-item',this),
			costsPriceElem = $('.mini-cart__costs-total .mini-cart__costs-price',this), 
			totalPriceElem = $('.mini-cart__total-price',this),
			currency = $this.attr('data-currency'),
			totalPrice,
			deliveryPrice;
		$(this).on('click','.mini-cart__delete',function (e) {
			$(this).closest('.mini-cart__list-item').remove();
			totalPrice = 0;
			list = $this.find('.mini-cart__list-item').each(function () {
				var elem = $(this);
				totalPrice += Number(elem.find('.mini-cart__price').text().replace(/[^0-9]/g,"")) * Number(elem.find('.count-input input').val());
			});
			if (yourorder){
				costsPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
				deliveryPrice = Number($this.find('.mini-cart__delivery-price').text().replace(/[^0-9]/g,""));
				deliveryPrice = deliveryPrice ? deliveryPrice : 0;
				totalPriceElem.text((totalPrice+deliveryPrice).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			} else {
				totalPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			}
			e.preventDefault();
		}).find('.count-input input').on('change.count',function (e) {
			totalPrice = 0;
			list.each(function () {
				var elem = $(this);
				totalPrice += Number(elem.find('.mini-cart__price').text().replace(/[^0-9]/g,"")) * Number(elem.find('.count-input input').val());
			});
			if (yourorder){
				costsPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
				deliveryPrice = Number($this.find('.mini-cart__delivery-price').text().replace(/[^0-9]/g,""));
				deliveryPrice = deliveryPrice ? deliveryPrice : 0;
				totalPriceElem.text((totalPrice+deliveryPrice).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			} else {
				totalPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			}
		});
	});
}
ui.initElems.push("miniCart");
ui.productPopupGallery = function () {
	var productGeneral = $('.product-general'),
		popupId = "product-visual-popup",
		galleryList,
		switchersList,
		popupGallery,
		popupGalleryList;
	if (productGeneral.size()){
		galleryList = productGeneral.find('.product-general__visual-item');
		switchersList = productGeneral.find('.product-general__switchers-item');
		popupGallery = $('.product-popup__gallery');
		popupGalleryList = popupGallery.find('.product-popup__gallery-item');
		switchersList.on('click',function (e) {
			var $this = $(this);
			if ($this.hasClass('active')){
				ui.popup.open(popupId);
				popupGalleryList.eq($this.index()).trigger('click');
			} else {
				switchersList.removeClass('active');
				$this.addClass('active');
				galleryList.removeClass('active').eq($this.index()).addClass('active');
			}
			e.preventDefault();
		})
		$(window).load(function(){
			var popupHolder = $('#'+popupId).show().parent().show();
			popupGallery.roundabout({
				"childSelector": ".product-popup__gallery-item",
				"minScale": 0.3
			});
			popupHolder.hide().find('#'+popupId).hide();
		});
	}
}
ui.initElems.push("productPopupGallery");
(function () {
	function addMediaQueryClasses() {
		(function checkWidth () {
			var body = $(document.body);
			if (body.width()>1440 && !body.hasClass('w1440')) {
				body.addClass('w1440');
			}
			if (body.width()<=1440 && body.hasClass('w1440')) {
				body.removeClass('w1440');
			}
		})();
		$(window).resize(checkWidth);
	};
	if (!mediaQueriesEnabled()){
		addMediaQueryClasses();
	}
})();
function mediaQueriesEnabled (){
    return (window.matchMedia || window.msMatchMedia);
};
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
			switchers = $('.promo-slider__switch-item',this),
			progressElem = $('.promo-slider__progress',this),
			progressValElem = progressElem.children(),
			progressTimer,
			progress = 0,
			progressTimeUpdate = 30,
			autoslide = 7000,
			progressStep = progressTimeUpdate*100 / autoslide,
			hover = false;

		switchers.on('click',function (e) {
			changeSlide($(this));
			e.preventDefault();
		});
		function changeSlide(elem){
			var $this = isNaN(Number(elem)) ? elem : switchers.eq(elem),
				index = isNaN(Number(elem)) ? elem.index() : elem;

			list.removeClass('promo-slider__item_active').eq(index).addClass('promo-slider__item_active');
			switchers.removeClass('promo-slider__switch-item_active');
			$this.addClass('promo-slider__switch-item_active');
			progressElem.css({
				'left': $this.offset().left-$this.parent().offset().left
			});
			clearInterval(progressTimer);
			progress = 0;
			progressValElem.width(0);
			if (!hover)
				progressTimer = setInterval(progressUpdate,progressTimeUpdate);
		}
		function progressUpdate () {
			progress += progressStep;
			progressValElem.css({'width':progress+"%"});
			if (progress>100){
				var active = switchers.filter(".promo-slider__switch-item_active");
				if (active.next().size()){
					changeSlide(active.index()+1);
				} else {
					changeSlide(0);
				}
			}
		}
		$(this).hover(function () {
			hover = true;
			clearInterval(progressTimer);
		},function () {
			progressTimer = setInterval(progressUpdate,progressTimeUpdate);
			hover = false;
		});
		switchers.eq(0).trigger('click');
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
		var inp = $(this).siblings('input'),
			min = Number(inp.attr('data-min')),
			max = Number(inp.attr('data-max'));
		inp.val(newCountValue(inp.val(),1,min,max));
		inp.trigger({
			'type':'change.count',
			'value':inp.val()
		});
		e.preventDefault();
	});
	$(document).on('click','.count-input__less',function (e) {
		var inp = $(this).siblings('input'),
			min = Number(inp.attr('data-min')),
			max = Number(inp.attr('data-max'));
		inp.val(newCountValue(inp.val(),-1,min,max));
		inp.trigger({
			'type':'change.count',
			'value':inp.val()
		});
		e.preventDefault();
	});
	$(document).on('change','.count-input input',function () {
		var inp = $(this),
			min = Number(inp.attr('data-min')),
			max = Number(inp.attr('data-max'));
		inp.val(newCountValue(inp.val(),0,min,max));
		inp.trigger({
			'type':'change.count',
			'value':inp.val()
		});
	});
	function newCountValue(value, inc,min,max) {
		var val = parseInt(value)+inc;
		if (isNaN(val)){
			if(min)
				return min;
			return 0;
		} else {
			if (min && val<min)
				val = min;
			if (max && max <val)
				val = max;
			return val;
		}
	}
}
ui.initElems.push('countInput');

ui.tabset = function () {
	$(document).on('click','.tabcontrol__item',function (e) {
		var $this = $(this);
		if (!$this.hasClass('active')){
			$this.addClass('active').siblings().removeClass('active');
			$this.closest('.tabset').find('>.tab').removeClass('active')
				.eq($this.index()).addClass('active');
		}
		e.preventDefault();
	});
}
ui.initElems.push('tabset');

ui.inlineSelect = function () {
	var opened;
	$(document).on('click','.inline-select__opener',function (e) {
		var $this = $(this);
		if (opened && !opened.is($this.parent())){
			opened.removeClass('active');
			opened = undefined;
		}
		$this.parent().toggleClass('active');
		if ($this.parent().hasClass('active')){
			opened = $this.parent();
		}
		e.preventDefault();
	}).on('click',function (e) {
		if (opened && !$(e.target).closest('.inline-select').size()){
			opened.removeClass('active');
			opened = undefined;
		}
	});
}
ui.initElems.push('inlineSelect');

ui.searchList = function () {
	var searchList = $('.search-list');
	searchList.each(function() {
		var searchInput = $(".search-list__field input",this),
			totalList = [],
			list =  $('>ul',this),
			listItems = list.children().remove();
		listItems.each(function () {
			totalList.push($('.search-list__text',this).text());
		});
		searchInput.on("oninput" in window ? "input":"keyup", inputChanged);
		function inputChanged() {
			var val = this.value.toLowerCase().trimLeft(),
				i=0,
				string,
				index,
				result = $([]),
				findedElem;
			if (val){
				$(this).parent().addClass('filter-select__input-wrap_active');
			} else {
				$(this).parent().removeClass('filter-select__input-wrap_active');
			}
			for (;i<totalList.length; i++){
				index = totalList[i].toLowerCase().indexOf(val);
				if (index>=0){
					findedElem = listItems.eq(i).clone();
					findedElem.find('.search-list__text').html(totalList[i].substr(0, index) + "<b>"+totalList[i].substr(index,val.length)+"</b>"+totalList[i].slice(index+val.length));
					result = result.add(findedElem);
				}
			}
			list.html(result);
		};
		inputChanged.call(searchInput[0]);
	});
}
ui.initElems.push('searchList');

ui.popup = function(){
	var popups = $('.popup-holder'),
		_this = this.popup;
	popups.each(function() {
		_this.popupHolder = $(this);
		if (_this.popupHolder){
			var obj = _this;
			$(window).resize(function(){
				obj.resize();
			});
			//open
			$(document).on('click','a[rel^="popup"]',function(e){
				obj.open($(this).attr('rel').replace(/\]|popup\[/g, ""));
				e.preventDefault();
			});
			
			//close
			$(document).on('click','.popup-holder .bg, .popup-holder__bg, .popup .close, .popup a[rel="close"], .popup__close',function(e){
				obj.close();
				e.preventDefault();
			});
			
			//methods
			_this.open = function(id){
				var obj = this;
				var _popup = $('#'+id);
				if (_popup.size()) {
					if (obj.popupHolder.is(':visible')) {
						$('.popup:visible').fadeOut(200, function(){
							$(this).removeClass('active');
							_popup.addClass('active').fadeIn(200).css('top', _this.popupPosition(_popup));
							if(obj.popupHolder.height()<_popup.height() + 40) {
								obj.popupHolder.height(_popup.height() + 40);
							}
						});
					}
					else {
						obj.popupHolder.fadeIn(300);
						_popup.addClass('active').show().css('top', _this.popupPosition(_popup));
						if(obj.popupHolder.height()<_popup.height() + 40) {   //+40 - double margin
							obj.popupHolder.height(_popup.height() + 40);
						}
					}
				}
			};
			_this.close = function(){
				obj.popupHolder.fadeOut(300, function(){
					$('.popup').hide();
				});
			};
			_this.addOpenLink = function(links){
				links.click(function(e){
					obj.open($(this).attr('rel').replace(/\[|\]|popup/g, ""));
					e.preventDefault();
				});
			};
			_this.addCloseLink = function(links) {
				links.click(function(e){
					obj.close();
					e.preventDefault();
				});
			};
			_this.resize = function(){
				this.popupHolder.height($(document.body).height());
			};
			//ready
			_this.resize();
			if (_this.popupHolder.find('.popup.active').size()) {
				_this.popupHolder.find('.popup.active').css('top',_this.popupPosition(this.popupHolder.find('.popup.active')));
			}
			_this.popupHolder.addClass('ready');
			if (_this.popupReady) {
				_this.popupReady();
			};
		}
	});
	_this.popupPosition = function (popup) {
		var margin = 20,
			position = margin;
		if ($(window).height() > popup.outerHeight()+margin*2) {
			position = ($(window).height()-popup.outerHeight()-margin*2)/2 + $(window).scrollTop();
		} else {
			position = $(window).scrollTop()+margin;
		}
		if (position+popup.outerHeight()+margin > $('body').height() && $('body').height()>popup.outerHeight()+margin*2) {
			position = $('body').height() - popup.outerHeight()- margin;
		}
		return position;
	};
};

ui.initElems.push('popup');
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