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
}
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
ui.initElems.push('countInput');