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