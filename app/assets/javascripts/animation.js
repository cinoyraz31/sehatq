$(document).ready(function() {

	//disable scrolling dengan spacebar
	//---------------------------------------------------------------
	$('body, .sidebar .simplebar-scroll-content').on('keydown', function(e) {
		if(e.keyCode == 32 && e.target == document.body) {
			e.preventDefault();
		}
	});

	function createCookie(name,value,days, option) {
	    if (days) {
	        var date = new Date();
	        if( option == 'mydiv' ) {
	            date.setTime(date.getTime()+(days*24*60*60*1000)); // expire based on total days
	        } else {
	            date.setTime(date.getTime()+(2*60*60*1000)); // expire after 2 hours
	        }
	        
	        var expires = "; expires="+date.toGMTString();
	    }
	    else var expires = "";
	    document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	}

	function eraseCookie(name) {
	    document.cookie = name + '=; Max-Age=0'
	}

	function highlightStr(keyword, string){
		if(keyword && string){
			var newKeyword	= keyword.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
			var pattern		= new RegExp("(" + newKeyword + ")", "gi");

			var newString = string.replace(pattern, "<span style='color:#000;font-weight:700;'>$1</span>");
				newString = newString.replace(/(<span>[^<>]*)((<[^>]+>)+)([^<>]*<\/span>)/,"$1</span>$2<span>$4");

			return newString;
		}
	}

	// lock window when showing searchbar
	//---------------------------------------------------------------
	// $('.btn-search').click(function() {
	// 	$('body').css('overflow-y', 'hidden');
	// 	formWrap.removeClass('got-keyword');
	// });
	$('#btn-search-close').click(function() {
		// suggestionForm.blur().val('');
		clearSearch.hide();
		setTimeout(function() {
			$('body').css('overflow-y', 'visible');
		}, 500);
	});


	//toggle group
	//---------------------------------------------------------------
	$('.page-group-name').on("click", function(e) {
		$('body').addClass('group-list-open');
		$('.account-info, .switch-project').removeClass('open');
		$('.account-btn, #drop').attr("aria-expanded", "false");
		$('.search-group input[type="text"]').focus();
		e.stopPropagation();
	});

	//remove toggle group when click anywhere
	$('body').on('click', function(e) {
		if (!$('.search-group input[type="text"],.group-list-action,.group-list-block').is(e.target) && $('.search-group input[type="text"],.group-list-action,.group-list-block').has(e.target).length == 0) {
			$('body').removeClass('group-list-open');
		}
	});


	//show sidebar
	//---------------------------------------------------------------
	// $(document).on("click", ".main-bar li", function(e) {
	// 	var tab = $(this).find('a').attr('href');
	// 	if ($(this).hasClass('has-submenu')) {
	// 		$('.sidebar').addClass('its-expand open');
	// 		$(tab).addClass('its-opened');
	// 		$(tab).siblings().removeClass("its-opened");
	// 		$(this).find('a').addClass("active");
	// 		$(this).siblings().find("a").removeClass("active");
	// 	} else {
	// 		$('.sidebar').removeClass('its-expand open');
	// 		$(this).find('a').addClass("active");
	// 		$(this).siblings().find("a").removeClass("active");
	// 	}
	// });
	$(document).on("click", ".main-bar li", function(event) {
			var tab = $(this).find('a').attr('href');

			if ($(this).hasClass('has-submenu')) {
					event.preventDefault();
					$('.sidebar').addClass('its-expand open');
					$(tab).addClass('its-opened');
					$(tab).siblings().removeClass("its-opened");
					$(this).find('a').addClass("active");
					$(this).siblings().find("a").removeClass("active");
			} else {
				// event.preventDefault();
				// $('.sidebar').removeClass('its-expand open');
				// $(this).find('a').addClass("active");
				// $(this).siblings().find("a").removeClass("active");

				return true;
			}
	});


	// remove Class "its-expand" on sidebar when mouse to menuicon
	//---------------------------------------------------------------
	// $('.main-bar > ul').on('mouseenter', function() {
	// 	if ($('.sidebar').hasClass('open')) {
	// 		$('.sidebar').removeClass('open');
	// 	}
	// });
	// $('body > .content').on('mouseenter', function() {
	// 	if ($('.sidebar').hasClass('its-expand')) {
	// 		$('.sidebar').addClass('open');
	// 	}
	// });


	//toggle menu responsive
	//---------------------------------------------------------------
	// update 1 may
	var removeOpen = function(){
		$('.sidebar').removeClass('open');
		$('.sidebar').removeClass('its-expand');
	}
	if ($(window).width() < 1023) {
		$('.expanded-menu').click(function() {
			$('.sidebar').toggleClass('open-sp');
			$('.main-bar li').addClass('active');
			removeOpen();
		});
		$('body').on('click', function(e) {
			if (!$('.expanded-bar .simplebar-content > ul').is(e.target) && $('.expanded-bar .simplebar-content > ul').has(e.target).length == 0) {
				removeOpen();
			}
		});
	}


	//close menu when click account (window < 768px)
	//---------------------------------------------------------------
	$('.account-info, .switch-project').click(function() {
		$('.sidebar').removeClass('open-sp');
	});


	//Replace text menu category
	//---------------------------------------------------------------
	var replaceText = $('#replaceMenu').children().filter('a');
	var changeText = $('#changeMenu').children();
	
	changeText.click(function(e) {
		e.preventDefault();
		$('ul#search-group li').removeClass('active');
		$('ul#search-group > li#replaceMenu').addClass('active');
		var menuList = $(this).text();
		replaceText.text(menuList).append('<span class="prm-arrow-bottom"></span>');
	});

	//hapus list active dropdown
	// $('#search-group li a').click(function(){
	// 	$('#changeMenu li').removeClass('active');
	// });


	//Autocomplete Trigger
	//---------------------------------------------------------------
	var suggestionForm = $('#suggestionForm');
	var clearSearch = $('.clear-hint');
	var formWrap = $('form.search-form');
	var txtNotFound = $('.search-notfound');
	var searchCaption = $('.search-default');

	suggestionForm.prop("disabled", true);
	clearSearch.hide();
	txtNotFound.hide();

	// ambil data dari JSON
	var autoCari;
	// var cari = $.ajax({
	// 				'async': false,
	// 				'global': false,
	// 				'url': '/js/cari.json',
	// 				'dataType': "json",
	// 				'sortResults': false,
	// 				'success': function (data) {
	// 					autoCari = data;
	// 				}
	// 			});
	
	// button clear kolom pencarian
	clearSearch.click(function(e) {
		e.preventDefault();
		$(this).hide();
		suggestionForm.val('').focus();
		formWrap.removeClass('got-keyword');
		txtNotFound.hide();
		searchCaption.show();
	});

	// show tombol clear pada pencarian
	suggestionForm.on('focus', function(){
		$(this).keyup(function(){
			if($(this).val().length === 0) {
				clearSearch.hide();
				txtNotFound.hide();
				searchCaption.show();
				formWrap.removeClass('got-keyword');
			}
			else {
				clearSearch.show();
				$('.input-group,.ui-autocomplete-input').removeClass('ui-autocomplete-loading');
			}
		});
	});

	// show pencarian berdasarkan tab
	var searchTab = $('ul#search-group li a');
	searchTab.on('click', function() {
		var test = $(this);
		var data_target = test.data('search');
		var keyword = suggestionForm.val().toString().toLowerCase();
		var results = '';

		$('.search-find-result').html(0);

		autoCari = $.checkUndefined(autoCari, []);
		// $('.search-find-result-all').html(autoCari.length);

		if(data_target == 'artikel') {
			$.each(autoCari, function( index, value ) {
				var resNama = (autoCari[index].hasOwnProperty('label') === true) ? autoCari[index].label : 'No Found';
				var resKategori = (autoCari[index].hasOwnProperty('kategori') === true) ? autoCari[index].kategori : 'No Found';
				var resContent = (autoCari[index].hasOwnProperty('content') === true) ? autoCari[index].content : 'No Found';
				var resType = (autoCari[index].hasOwnProperty('type') === true) ? autoCari[index].type : 'No Found';
				var resUrl = (autoCari[index].hasOwnProperty('url') === true) ? autoCari[index].url : 'No Found';
				var resTag = (autoCari[index].hasOwnProperty('tag') === true) ? autoCari[index].tag : 'No Found';

				var content = resContent.toLowerCase();
				var nama = resNama.toLowerCase();
				var kategori = resKategori.toLowerCase();
				var tag = resTag.toString().toLowerCase();

				if( nama.indexOf(keyword) >= 0 && data_target == kategori || resType=='Article' && (content.indexOf(keyword) >= 0 || tag.indexOf(keyword) >= 0) ) {
				//	var keywordTmp = keyword.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
				//	var pattern = new RegExp("("+keywordTmp+")", "gi");
				//	resNama = resNama.replace(pattern, "<span style='color:#000;font-weight:700;'>$1</span>");
				//	resNama = resNama.replace(/(<span>[^<>]*)((<[^>]+>)+)([^<>]*<\/span>)/,"$1</span>$2<span>$4");
				//	resContent = resContent.replace(pattern, "<span style='color:#000;font-weight:700;'>$1</span>");
				//	resContent = resContent.replace(/(<span>[^<>]*)((<[^>]+>)+)([^<>]*<\/span>)/,"$1</span>$2<span>$4");

					resNama = highlightStr(keyword, resNama);
					resContent = highlightStr(keyword, resContent);
					resTag = highlightStr(keyword, resTag);

					results+= '<li>';
					results+='\
						<h4 class="sr-keyword margin-bottom-2"><a href="'+resUrl+'">'+resNama+'</a></h4>\
						<p>'+resContent+'</p>\
						<div class="sr-cat margin-bottom-3">\
							<div class="disinblock margin-right-1">\
								<label for="">Kategori: </label>\
								<a href="'+resUrl+'">'+value.kategori+'</a>\
							</div>\
						</div>\
						<div class="sr-info">\
							<div class="disinblock margin-right-1">\
								<label for="">Status: </label>\
								<span class="cblack2">'+value.status+'</span>\
							</div>\
						</div>\
						<div class="sr-info">\
							<div class="disinblock margin-right-1">\
								<label for="">Dibuat pada: </label>\
								<span class="cblack2">'+value.created+'</span>\
							</div>\
						</div>\
					';

					if(resTag){
						results+= '\
							<div class="sr-info margin-top-3">\
								<div class="disinblock margin-right-1">\
									<label for="">Tag: </label>\
									<span class="cblack2">'+resTag+'</span>\
								</div>\
							</div>\
						';
					}

					results+= '</li>';

					var tmpCount = $.convertNumber($('.search-find-result-'+value.kategori).html(), 'int', 0);
					$('.search-find-result-'+value.kategori).html(tmpCount+1);
				}
			});
		}
		else {
			$.each(autoCari, function( index, value ) {
				var resNama = (autoCari[index].hasOwnProperty('label') === true) ? autoCari[index].label : 'No Found';
				var resKategori = (autoCari[index].hasOwnProperty('kategori') === true) ? autoCari[index].kategori : 'No Found';
				var resUrl = (autoCari[index].hasOwnProperty('url') === true) ? autoCari[index].url : 'No Found';

				var nama = value.label.toString().toLowerCase();
				var content = $.checkUndefined(value.content, '');
				var kategori = value.kategori.toString().toLowerCase();
				
				if( nama.indexOf(keyword) >= 0 && data_target == kategori) {
				//	var keywordTmp = keyword.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
				//	var pattern = new RegExp("("+keywordTmp+")", "gi");
					var labelTmp = value.label;

				//	resNama = resNama.replace(pattern, "<span style='color:#000;font-weight:700;'>$1</span>");
				//	resNama = resNama.replace(/(<span>[^<>]*)((<[^>]+>)+)([^<>]*<\/span>)/,"$1</span>$2<span>$4");

					resNama = highlightStr(keyword, resNama);

					results += '<li>\
									<h4 class="sr-keyword margin-bottom-2"><a href="'+resUrl+'">'+resNama+'</a></h4>\
									<div class="sr-cat margin-bottom-3">\
										<div class="disinblock margin-right-1">\
											'+content+'\
											<label for="">Kategori: </label>\
											'+value.kategori+'\
										</div>\
									</div>\
								</li>';

					var tmpCount = $.convertNumber($('.search-find-result-'+value.kategori).html(), 'int', 0);
					$('.search-find-result-'+value.kategori).html(tmpCount+1);
				}
			});
		}

		if (results != '') {
			formWrap.removeClass('got-hint');
			formWrap.addClass('got-keyword');
			$('.result-'+data_target).html(results);
		}
		else {
			$('.result-'+data_target).html('<h4>No results found</h4>');
		}

		$('.input-group,.ui-autocomplete-input').removeClass('ui-autocomplete-loading');
	});

	var _callAlertMsg = function () {
		$('.sidebar-search .error-message').remove();
		$('.search-form .input-box > .container').append('<span class="error-message">Masukan minimal 3 character</span>');
	}

	//hit enter tampil ke hasil pencarian
	suggestionForm.keypress(function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			if(suggestionForm.val().length < 3) {
				searchCaption.hide();

				_callAlertMsg();
			}
			else {
				$('[href="#all"]').trigger('click');
				$('.search-find-result-all').html(autoCari.length);
			}
		}
	});

	suggestionForm.blur(function(e) {
		e.preventDefault();

		var value = suggestionForm.val();

		if( value.length < 3 ) {
			if( value != '' ) {
				searchCaption.hide();
			}

			_callAlertMsg();
		} else if( value != '' ) {
			$('[href="#all"]').trigger('click');
			$('.search-find-result-all').html(autoCari.length);
		}
	});

	//tampil semua pencarian
	$('[href="#all"]').on('click', function() {
		formWrap.addClass('got-keyword');
		var keyword= suggestionForm.val().toString().toLowerCase();
		var results = '';

		$('.search-find-result').html(0);

		autoCari = $.checkUndefined(autoCari, []);
		// $('.search-find-result-all').html(autoCari.length);

		$.each(autoCari, function(index, value) {
			var resNama = (autoCari[index].hasOwnProperty('label') === true) ? autoCari[index].label : 'No Found';
			var resContent = (autoCari[index].hasOwnProperty('content') === true) ? autoCari[index].content : 'No Found';
			var resType = (autoCari[index].hasOwnProperty('type') === true) ? autoCari[index].type : 'No Found';
			var resUrl = (autoCari[index].hasOwnProperty('url') === true) ? autoCari[index].url : 'No Found';
			var resTag = (autoCari[index].hasOwnProperty('tag') === true) ? autoCari[index].tag : 'No Found';

			var nama = resNama.toLowerCase();
			var content = resContent.toLowerCase();
			var tag = resTag.toString().toLowerCase();

		//	if(nama.indexOf(keyword) >= 0 && resType=='Article' || content.indexOf(keyword) >= 0 && resType=='Article') {

			if(resType == 'Article' && (nama.indexOf(keyword) >= 0 || content.indexOf(keyword) >= 0 || tag.indexOf(keyword) >= 0)) {
			//	var keywordTmp = keyword.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
			//	var pattern = new RegExp("("+keywordTmp+")", "gi");

			//	resNama = resNama.replace(pattern, "<span style='color:#000;font-weight:700;'>$1</span>");
			//	resNama = resNama.replace(/(<span>[^<>]*)((<[^>]+>)+)([^<>]*<\/span>)/,"$1</span>$2<span>$4");
			//	resContent = resContent.replace(pattern, "<span style='color:#000;font-weight:700;'>$1</span>");
			//	resContent = resContent.replace(/(<span>[^<>]*)((<[^>]+>)+)([^<>]*<\/span>)/,"$1</span>$2<span>$4");

				resNama = highlightStr(keyword, resNama);
				resContent = highlightStr(keyword, resContent);
				resTag = highlightStr(keyword, resTag);

				results+= '<li>';
				results+= '\
					<h4 class="sr-keyword margin-bottom-2"><a href="'+resUrl+'">'+resNama+'</a></h4>\
					<p>'+resContent+'</p>\
					<div class="sr-cat margin-bottom-3">\
						<div class="disinblock margin-right-1">\
							<label for="">Kategori: </label>\
							<a href="'+resUrl+'">'+value.kategori+'</a>\
						</div>\
					</div>\
					<div class="sr-info">\
						<div class="disinblock margin-right-1">\
							<label for="">Status: </label>\
							<span class="cblack2">'+value.status+'</span>\
						</div>\
					</div>\
					<div class="sr-info">\
						<div class="disinblock margin-right-1">\
							<label for="">Dibuat pada: </label>\
							<span class="cblack2">'+value.created+'</span>\
						</div>\
					</div>\
				';

				if(resTag){
					results+= '\
						<div class="sr-info margin-top-3">\
							<div class="disinblock margin-right-1">\
								<label for="">Tag: </label>\
								<span class="cblack2">'+resTag+'</span>\
							</div>\
						</div>\
					';
				}

				results+= '</li>';

				var tmpCount = $.convertNumber($('.search-find-result-'+value.kategori).html(), 'int', 0);
				$('.search-find-result-'+value.kategori).html(tmpCount+1);
			}
			else if (nama.indexOf(keyword) >= 0 || content.indexOf(keyword) >= 0) {
			//	var keywordTmp = keyword.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
			//	var pattern = new RegExp("("+keywordTmp+")", "gi");
				var content = $.checkUndefined(value.content, '');

			//	resNama = resNama.replace(pattern, "<span style='color:#000;font-weight:700;'>$1</span>");
			//	resNama = resNama.replace(/(<span>[^<>]*)((<[^>]+>)+)([^<>]*<\/span>)/,"$1</span>$2<span>$4");

				resNama = highlightStr(keyword, resNama);

				results += '<li>\
								<h4 class="sr-keyword margin-bottom-2"><a href="'+value.url+'">'+resNama+'</a></h4>\
								<div class="sr-cat margin-bottom-3">\
									<div class="disinblock margin-right-1">\
										'+content+'\
										<label for="">Kategori: </label>\
										'+value.kategori+'\
									</div>\
								</div>\
							</li>';

				var tmpCount = $.convertNumber($('.search-find-result-'+value.kategori).html(), 'int', 0);
				$('.search-find-result-'+value.kategori).html(tmpCount+1);
			}
		});

		if (results != '') {
			formWrap.removeClass('got-hint');
			formWrap.addClass('got-keyword');
			$('.result-semua').html(results);
			replaceText.text('Lainnya ').append('<span class="prm-arrow-bottom"></span>');
			
			// if( $('#search-group li.active > a').attr('data-toggle') == 'dropdown' ) {
			// 	$('#search-group li.active ul.drop-content li.active a').click();
			// }
			// else {
			// 	$('#search-group li.active a').click();
			// }
		}
		else {
			$('.result-semua').html('<h4>No results found</h4>');
			formWrap.removeClass('got-keyword');
			txtNotFound.show();
			searchCaption.hide();
			
			$('.input-group,.ui-autocomplete-input').removeClass('ui-autocomplete-loading');
		}
		
		$('.sidebar-search .error-message').remove();
		searchLog(keyword);
	});

	//menampung history pencarian
	function searchLog(srcLog) {
		srcLog = $.checkUndefined(srcLog, null);

		if( srcLog != null ) {
			$('ul.searchLog').prepend('<li><a href="' + srcLog + '">' + srcLog + '</a></li>');
		} else {
    		var tmp = readCookie("searchlog");

    		if( tmp == 'undefined' ) {
    			tmp = '';
    		}

    		$('ul.searchLog').html(tmp);
		}

		var li_count = $('ul.searchLog li').length;

		if (li_count > 5) {
			$('ul.searchLog li:last-child').remove();
		}

		$('.sidebar-search .recent-search').show();
        createCookie('searchlog', $('ul.searchLog').html(), '1', 'mydiv');
	}

	//menampilkan pencarian sebelumnya
	$(document).on("click","ul.searchLog a",function(e) {
		e.preventDefault();
		var sLog = $(this).text();
		suggestionForm.val(sLog);
		clearSearch.show();
		$('[href="#all"]').trigger('click');
		formWrap.addClass('got-keyword');
		$('.input-group,.ui-autocomplete-input').removeClass('ui-autocomplete-loading');
	});

	//suggestion pencarian

	if( suggestionForm.length > 0 ) {
		var data_url = $.checkUndefined(suggestionForm.attr('data-url'), '/ajax/search/');

		suggestionForm.autocomplete({
			source: function( request, response ) {
			//	re-register (biar refresh attribute nya)
				var self = $('#suggestionForm');
				var data_type = $.checkUndefined(self.attr('data-type'));
				var data_field = $.checkUndefined(self.attr('data-field'));
				var post_data = {
					term : request.term, 
				};

				if(typeof data_type != 'undefined'){
					post_data = $.extend({ type : data_type }, post_data);
				}

				if(typeof data_field != 'undefined'){
					post_data = $.extend({ field : data_field }, post_data);
				}

				$.ajax({
					'type': 'post', 
					'async': false,
					'global': false,
					'url': data_url,
					'dataType': "json",
					'sortResults': false,
		          	'data': post_data,
					'success': function (data) {
						autoCari = data;
						response( data );

						$('.input-group,.ui-autocomplete-input').removeClass('ui-autocomplete-loading');
						$('.search-find-result-all').html(autoCari.length);
					},
				});
			},
			// source: '/ajax/search/',
			// source: autoCari,
			minLength: 3,
			// messages: {
			// 	noResults: '',
			// 	results: function() {}
			// },
			select: function(event, ui) {
				if(ui.item) {
					$(event.target).val(ui.item.value);
				}
				// $('[href="#all"]').trigger('click');
				$(this).blur();
				$('.search-find-result-all').html(1);
			},
			search: function(){
				$('.input-group').addClass('ui-autocomplete-loading');
				clearSearch.hide();

				setTimeout(function(){
					$('.input-group,.ui-autocomplete-input').removeClass('ui-autocomplete-loading');
				},3000);
			},
			open: function(event, ui){
			//	trigger custom event
				$('body').trigger('search:rendered');
			}, 
			response: function(){
				setTimeout(function(){
					$('.input-group,.ui-autocomplete-input').removeClass('ui-autocomplete-loading');
					clearSearch.show();
				},500);
				if($(suggestionForm).val().length===0){
					clearSearch.hide();
				}

			//	trigger custom event
				$('body').trigger('search:done');
			},
		})
		// .focus(function() {
		// 	$(this).autocomplete("search");
		// })
		.keyup(function (e) {
			if(e.which === 13) {
				$(".ui-menu-item, .ui-menu").hide();
			}
		})
		.autocomplete("instance")._renderItem = function(ul, item) {
			// highlighting match text
			item.label = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong style='color:#000000;'>$1</strong>");
			// suggestion result
			return $("<li>")
				.append(
						'<div class="container">'+
							'<h4 class="sr-keyword">'+
								'<span>'+item.label+'</span>'+
							'</h4>'+
						'</div>'
					)
					.appendTo(ul);
		};
	}

	// JS untuk menampilkan kolom pencarian
	//---------------------------------------------------------------
	var mainContainer = document.querySelector('.main-wrap'),
		openCtrl = $('.btn-search'),
		closeCtrl = document.getElementById('btn-search-close'),
		searchContainer = document.querySelector('.sidebar-search'),
		floatBtn = $('.ga-wrapper');

	function init() {
		initEvents();
	}

	function initEvents() {
		openCtrl.off('click').click(function() {
			openSearch();
			$('body').css('overflow-y', 'hidden');
			formWrap.removeClass('got-keyword');
		});
		
		closeCtrl.addEventListener('click', closeSearch);
		document.addEventListener('keyup', function(ev) {
			// escape key.
			if (ev.keyCode == 27) {
				closeSearch();
				floatBtn.removeClass('open');
			}
		});
	}

	function shortCut(){
		$('body').on('keyup', function(e) {
			var tag = e.target.tagName.toLowerCase();
			if($('body').hasClass('modal-open') && $('div').hasClass('modal-backdrop')){
				switch(e.keyCode) { 
					case 32:
						e.preventDefault();
					break;

					case 107:
						e.preventDefault();
					break;

					case 187:
						e.preventDefault();
				}
			}
			else if (tag !== 'input' && tag !== 'textarea') {
				$('body').click();
				switch(e.keyCode) { 
					case 32: //spacebar key
						e.preventDefault();
						openSearch();
					break;

					case 107: //add atau +
						e.preventDefault();
						floatBtn.addClass('open');
					break;

					case 187: // tombol "=""
						e.preventDefault();
						floatBtn.addClass('open');
				}
			}
		});
	}

	function openSearch() {
	//	trigger custom event
		$('body').trigger('search:show');

		mainContainer.classList.add('main-wrap--overlay');
		closeCtrl.classList.remove('btn--hidden');
		searchContainer.classList.add('search--open');
		setTimeout(function() {
			$(searchContainer).find('.input-box-trigger').focus();
		}, 500);
		$('.search-notfound').hide();
		$('.search-default').show();
		$('body').css('overflow-y', 'hidden');
		$('#suggestionForm').focus();
		suggestionForm.prop("disabled", false);

	//	trigger custom event
		$('body').click().trigger('search:shown');
	}

	function closeSearch() {
	//	trigger custom event
		$('body').trigger('search:hide');

		mainContainer.classList.remove('main-wrap--overlay');
		closeCtrl.classList.add('btn--hidden');
		searchContainer.classList.remove('search--open');
		$('#suggestionForm').val('');
		$('.clear-hint').hide();
		$('form.search-form').removeClass('got-keyword');
		$('.search-notfound').hide();
		$('.search-default').show();
		$('body').css('overflow-y', 'visible');
		suggestionForm.prop("disabled", true);

	//	trigger custom event
		$('body').trigger('search:hidden');
	}
	
	if( $('.sidebar-search').length > 0 ) {
		init();
	}

	shortCut();
	searchLog();
});


// update 4 may
$(window).load(function(){
	hoverSideBar();
	stopDropdownBs();
});

function hoverSideBar(){
	$('.main-bar > ul,.main-bar .simplebar-content > ul').on('mouseenter', function() {
		if ($('.sidebar').hasClass('open')) {
			$('.sidebar').removeClass('open');
		}
	});
	$('.content').on('mouseenter', function() {
		if ($('.sidebar').hasClass('its-expand')) {
			$('.sidebar').addClass('open');
		}
	});
}

function stopDropdownBs(){
	$('.switch-project .drop-content').click(function(e){
		e.stopPropagation()
	});
}