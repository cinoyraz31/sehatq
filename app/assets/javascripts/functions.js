//  set global ckeditor configurations
var loadInterval;
var expInterval;

//  each contain custom set of tools / functions
if(typeof CKEDITOR != 'undefined'){
    window.__editorConfigs = {
        'full'  : {
            filebrowserImageBrowseUrl: window.ckeditorBrowseUrl + '&type=images',
        }, 
        'short' : {
            toolbar : [
                {
                    name    : 'styles',
                    items   : [ 'Format' ]
                },
                {
                        name: 'insert',
                    items: ['Youtube']
                },
                { 
                    name    : 'basicstyles',
                    groups  : [ 'basicstyles', 'cleanup', 'blocks' ],
                    items   : [ 'Bold', 'Italic', 'Underline', 'Blockquote', 'Link', 'Table', 'Image' ]
                },
                {
                    name    : 'paragraph',
                    groups  : [ 'list', 'indent', 'blocks', 'align', 'bidi' ],
                    items   : [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-' ]
                },
                [ 'Undo', 'Redo' ],
            ],
            removePlugins   : 'elementspath',
            resize_enabled  : true,
            filebrowserImageBrowseUrl: window.ckeditorBrowseUrl + '&type=images',
        }, 
    //  add new custom set below
    };
}

(function ( $ ) {
    $.owlCarousel = function(options){
        var settings = $.extend({
            obj             : $('.owl-carousel'), 
            margin          : 10,
            items           : 3,
            dotsEach        : true, 
            center          : false, 
            loop            : false,
            nav             : false,
            dotsContainer   : false, 
            navContainer    : false, 
            navElement      : 'a', 
            navText         : ['<i class="prmd-arrow-straight-left"></i>', '<i class="prmd-arrow-straight-right"></i>']
        }, options);

        if(settings.obj.length && typeof $.fn.owlCarousel == 'function'){
        //  create onchange listener
            settings.obj.on('initialized.owl.carousel resized.owl.carousel changed.owl.carousel', function(event){
                if(!event.namespace) return;

                var carousel            = $(event.target);
                var dataNavContainer    = $(carousel.data('nav-container'));
                var dataDotsContainer   = $(carousel.data('dots-container'));
                var bullets             = dataDotsContainer.find('.owl-dot');
                var eventType           = event.type;

                if(eventType == 'changed' && dataNavContainer.length){
                    var counter = dataNavContainer.find('.counter');

                    if(counter.length){
                        var totalPages      = event.page.count;
                        var itemsPerPage    = event.page.size;
                        var currentPage     = event.page.index;

                        var totalItems      = event.item.count;
                        var currentItem     = event.item.index;
                        var displayText     = 0;

                    //  kalo pake loop : true jadi miss calculate index nya
                        var isLoop = $.checkUndefined(settings.loop, false);
                        if(isLoop){
                            currentItem = event.item.index - event.relatedTarget._clones.length / 2;

                            if( (currentItem + 1) > totalItems || (currentItem + 1) == 0 ){
                                currentItem = totalItems - (currentItem % totalItems);
                            }
                        }

                        if(totalItems){
                            if(itemsPerPage > 1){
                                var maxItemIndex = currentItem + itemsPerPage;

                                displayText = (currentItem + 1) + ' - ' + maxItemIndex;
                            }
                            else{
                                displayText = currentItem + 1;
                            }
                        }

                        if(isNaN(currentItem) === false){
                        //  di owl .active itu semua item yang di display
                            var activeItems = carousel.find('.owl-item').not('.cloned');

                            if(activeItems.eq(currentItem)){
                                activeItems.eq(currentItem).addClass('owl-active').siblings().removeClass('owl-active');
                            }
                        }

                        counter.text(displayText + ' / ' + totalItems);
                    }
                }

                if(eventType == 'initialized' && dataDotsContainer.length){
                    if(bullets.length){
                        bullets.css({
                            'width' : (97.5 / bullets.length) + '%', 
                        });
                    }
                }
            });

            settings.obj.each(function(){
                var self = $(this);

                var dataNavContainer    = self.data('nav-container');
                var dataDotsContainer   = self.data('dots-container');

                var configs = settings;

            //  remove unused property
                delete configs.obj;

                if(dataNavContainer){
                    configs = $.extend(configs, { navContainer : dataNavContainer });
                }

                if(dataDotsContainer){
                    configs = $.extend(configs, { dotsContainer : dataDotsContainer });
                }

            //  initialize
                self.owlCarousel(configs);

            //  custom indicator
                var dotsIndicator = $(self.data('dots-indicator'));
                if(dotsIndicator.length){
                    var indicators = dotsIndicator.find('.owl-indicator');
                    if(indicators.length){
                        indicators.on('click', function(event){
                            var indicator       = $(this);
                            var indicatorIndex  = indicators.index(indicator);

                            self.trigger('to.owl.carousel', indicatorIndex);

                        //  toggle indicator
                            indicator.addClass('active').siblings().removeClass('active');
                        });
                    }
                }
            });

            return settings.obj;
        }
    }

    $.multipleCheckDropdown = function(options){
        var settings = $.extend({
            obj                     : $('.select2-checkbox'), 
            placeholder             : 'Pilih', 
            minimumResultsForSearch : 10, 
            wrapperClass            : 'checkbox-button', 
        }, options);

        if(settings.obj.length && typeof $.fn.select2 == 'function'){
        //  wajib multiple (paksa)
            settings.obj.prop('multiple', true).each(function(){
                var self = $(this);
                var selectOptions = {
                    closeOnSelect           : false,
                    allowClear              : true,
                    minimumResultsForSearch : settings.minimumResultsForSearch,
                    placeholder             : settings.placeholder,
                };

                var select2 = self.select2(selectOptions);
            });
        }
    }

    // $.multipleCheckDropdown();

    if( $('.regionId').length > 0 ){
        $.generateLocation();
    }
        
    if( $('#gmap-rku, .map').length > 0 ) {
        $.gmapLocation();
    }

    $.rebuildFunction();
    $.rebuildDelegate();
    // $.daterangepicker();
    $.showHide();
    $.disabledSubmit();
    $.actionPopover();
    $.callInterval();
    $.titleFilter();
    $.ajaxCreative();
    $.fileupload();
    $.orderAbs();
    $.membershipToggle();
    $.affixScroll();
    $.masonry();
    $.triggerGoogle();
    $.googleCal();
    $.googleVisitor();
    $.sameHeight();

    if($('#overview-visitor').length > 0){
        var toggle_session = $('.tab-session');
        var toggle_bounce = $('.tab-bounce');

        toggle_session.click(function(){
            var self = $(this);
            $('#bounces').hide();
            $('#sessions').show();

            toggle_bounce.removeClass('active');
            self.addClass('active');
        });
        toggle_bounce.click(function(){
            var self = $(this);
            $('#sessions').hide();
            $('#bounces').show();

            toggle_session.removeClass('active');
            self.addClass('active');
        });
    }

    if($('.display-principle').length > 0){
        $('.display-principle').click(function(){
            var self = $(this);
            var val = self.val();
            var checked = self.is(':checked') ;
        });
    }

    $( "body" ).delegate( '.show-hide', "change", function() {
        var self = $(this);
        var target = self.data('target');
        var checked = self.is(':checked') ;

        $(target).slideToggle();
    });

    if($('#interval-ajax-load').length > 0){
        var self = $('#interval-ajax-load');
        var url = self.attr('data-url');
        var interval = self.attr('data-interval');

        setInterval(function(){redirect_page(url)}, interval);
    }

    function redirect_page(url){
        window.location.href = url;
    }

    // $( "body" ).delegate( '.sidebar .main-bar a', 'click', function() {
    //     var self = $(this);
    //     var all_menu = $('.sidebar .main-bar a');
    //     var parents = self.parents('.main-bar');
    //     // var title_menu = $('.sidebar.its-expand .main-bar span:last-child');
    //     var child = $('.sidebar .expanded-bar');
    //     var target = self.attr('href');
    //     var interval = 400;
    // $( "body" ).delegate( '.sidebar .main-bar a', 'click', function() {
    //     var self = $(this);
    //     var all_menu = $('.sidebar .main-bar a');
    //     var parents = self.parents('.main-bar');
    //     // var title_menu = $('.sidebar.its-expand .main-bar span:last-child');
    //     var child = $('.sidebar .expanded-bar');
    //     var target = self.attr('href');
    //     var interval = 400;

    //     if( !$(target).is(':visible') && $(target).length > 0 && target != '#' ) {
    //         if( !parents.hasClass('open') ) {
    //             interval = 0;
    //         }

    //         $.menuHide({
    //             all_menu: all_menu,
    //             parents: parents,
    //             // title_menu: title_menu,
    //             child: child,
    //         });

    //         setTimeout(function() {
    //             // Change Selected
    //             all_menu.removeClass('active');
    //             parents.addClass('open');
    //             self.addClass('active');
    //             // title_menu.hide();
    //             child.find(target).addClass('open');
    //         }, interval);
    //     } else {
    //         $.menuHide({
    //             all_menu: all_menu,
    //             parents: parents,
    //             // title_menu: title_menu,
    //             child: child,
    //         });
    //     }
    // });

    if(typeof CKEDITOR != 'undefined'){
    //  init full editor
        if($( '.ckeditor' ).length){
            // $( '.ckeditor' ).ckeditor( window.__editorConfigs['full'] );
            CKEDITOR.replace( 'ckeditor', window.__editorConfigs['full']);

            __setEditorConfig();
        }

    //  init short editor
        if($( '.ckeditor-short' ).length){
            $( '.ckeditor-short' ).each(function (i, elem) {
                var self    = $(elem);
                var width   = $.checkUndefined(self.attr('data-width'), 300);
                var config  = $.extend({
                    height : width,
                }, window.__editorConfigs['short']);

                // self.ckeditor(config);
                CKEDITOR.replace( elem, config);
            });

            $( "body" ).delegate( '.ckeditor-view', "click", function(e) {
                $('textarea.ckeditor-short').each(function () {
                    var $textarea = $(this);
                //  CKEDITOR.instances[$textarea.attr('id')].execCommand( 'source' );

                    var inputID         = $.checkUndefined($textarea.attr('id'));
                    var inputName       = $.checkUndefined($textarea.attr('name'));
                    var instanceName    = inputID ? inputID : inputName;

                    CKEDITOR.instances[instanceName].execCommand( 'source' );
                });
            });

            __setEditorConfig();
        }

        function __setEditorConfig(){
        	CKEDITOR.on('instanceReady', function(event){
				var editor = event.editor;

				if(typeof editor != 'undefined'){
					var ruleFunction = function(element){
						element.attributes.class = 'cke-element';
						return element;
					}

					var rules = {
						u			: ruleFunction, 
						ul			: ruleFunction, 
						ol			: ruleFunction, 
						em			: ruleFunction, 
						strong		: ruleFunction, 
						blockquote	: ruleFunction, 
					};

					editor.dataProcessor.dataFilter.addRules({
						elements : rules, 
					});

					editor.dataProcessor.htmlFilter.addRules({
						elements: rules, 
					});
				}
			});
        }
    }

    $( "body" ).delegate( '.switch-project .drop-content a', "click", function() {
        var self = $(this);
        var target = self.attr('href');

        location.href = target;

        return false;
    });

    $('.func-type-unit').delegate( document , "change", function() {
        var self = $(this);

        var val = self.val();
        
        if(val == 6){
            $('.beds-rules').show();
            $('.beds-rules').removeClass('hide');
        }else{
            $('.beds-rules').hide();
            $('.beds-rules').addClass('hide');
        }

        if(val == 1){
            $('.level-rules').hide();
        }else{
            $('.level-rules').show();
        }
    });

    $('body').delegate( '.func-add-content', "click", function(e) {
        var self = $(this);

        var box         = self.data('box'); 
        var copy        = self.data('copy');
        var tag         = $.checkUndefined(self.data('tag'), 'li');
        var class_tag   = $.checkUndefined(self.data('class-tag'), '');
        var rebuild_function   = $.checkUndefined(self.data('price-function', ''));

        var target = $(box);

        var content = $(copy).html();

        if(tag != 'li'){
            target.append('<'+tag+' class="'+class_tag+'">'+content+"</"+tag+">");    
        }else{
            target.append('<li class="items">'+content+"</div>");    
        }

        if(rebuild_function != ''){
            $.inputNumber();
            $.inputPrice();
        }
    });

    $('body').delegate( '.field-delete-custom', "click", function(e) {
        var self = $(this);
        var class_to_be_delete = $.checkUndefined(self.data('target'), '.items');

        self.parents(class_to_be_delete).remove();
    });

    $('#gallery-images').delegate( '.primary-button', "click", function(e) {
        var self = $(this);
        var target = self.data('target');
        var data_value = self.data('value');

        var class_delete = '.delete-media-gallery';
        var parent_class = 'li[data-item="'+data_value+'"]';

        if($(target).length > 0){
            $(target).val('gallery');
            $('.primary-button').text('Jadikan Foto Utama');
            
            self.text('Foto Utama');

            var parents = self.parents(parent_class);

            $(class_delete).show();

            parents.find(target).val('primary');

            var movement = parents.wrapAll();

            movement.prependTo('#gallery-images');
        }

        e.preventDefault();
    });

    $('#gallery-images').delegate( '.primary-button-inventory', "click", function(e) {
        var self = $(this);
        var target = self.data('target');
        var data_value = self.data('value');

        var parent_class = 'li[data-item="'+data_value+'"]';
        var warpper = ".emailLayoutWrapper";
        var parents = self.parents(parent_class);
        var selected = parents.find('.selected').length;

        if($(target).length > 0){
            if(selected > 0){
                self.text('Pilih');
                parents.find(warpper).removeClass('selected');
                parents.find(target).attr('disabled', 'disabled');
            }else{
                self.text('Batalkan');            
                parents.find(warpper).addClass('selected');
                parents.find(target).removeAttr('disabled');
            }
        }
        e.preventDefault();
    });

    $('body').delegate( '.max-blok-find-stock', "change", function(e) {
        var self = $(this);
        var data_value = self.val();
        var target = $('.block-stock-unit');

        if(data_value != ''){
            target.hide();
        }else{
            target.show();
        }
    });

    $('body').delegate('.blok-find-stock', 'change', function(){
        var self = $(this);

        var val = self.val();

        if(val != ''){
            $('.photo-box').addClass('hide');
        }else{
            $('.photo-box').removeClass('hide');
        }
    });

    $('.trigger-print').click(function(){
        window.print();
    });

    if($( ".draggable" ).length > 0){
        var is_move = false;
        var x_position = new Array();
        var x_position_mobile = new Array();
        var y_position = new Array();
        var y_position_mobile = new Array();

        $( ".draggable" ).draggable({
            cursor: "crosshair",
            handle: 'path',
            drag : function(event, ui){
                var self = $(this);
                var box = self.data('box');
                var type = self.data('type');
                var id = self.data('value');

                var thisPos = self.position();
                var parentPos = self.parents(box).position();

                var selfX = parseInt(ui.position.left);
                var selfY = parseInt(ui.position.top);

                x_position[id] = selfX - parseInt(parentPos.left);
                y_position[id] = selfY - parseInt(parentPos.top);

                var x = parseInt(x_position[id]);
                var y = parseInt(y_position[id]);

                if(selfX == x && selfY == y){
                    is_move = false;
                }else{
                    is_move = true;
                }

                var text = 'translate('+String(x)+' '+String(y)+')';

                event.target.setAttribute('transform', text);

                if(type == 'desktop'){
                    if($('.handle-coor-x').length > 0){
                        $('.handle-coor-x').val(String(x));
                    }
                    if($('.handle-coor-y').length > 0){
                        $('.handle-coor-y').val(String(y));
                    }
                }else if(type == 'dialog'){
                    if($('.handle-coor-dialog-x').length > 0){
                        $('.handle-coor-dialog-x').val(String(x));
                    }
                    if($('.handle-coor-dialog-y').length > 0){
                        $('.handle-coor-dialog-y').val(String(y));
                    }
                }
                    
            },
            stop:function(){
                var self = $(this);

                var id = self.data('value');

                var x = parseInt(x_position[id]);
                var y = parseInt(y_position[id]);

                if(self.hasClass('update-coordinat')){
                    if(is_move){
                        var url = self.data('url');

                        if(typeof url != 'undefined' && url != ''){
                            url = url+'/'+String(x)+'/'+String(y);
                            console.log(url)
                            $.post(url, function(data, status){});
                        }
                    }
                }
            }
        }).bind('mousedown', function(event, ui){
            $(event.target.parentElement).append( event.target );

            is_move = false;
        }).bind('mouseup', function(event, ui){
            if(!is_move){
                var self = $(this);
                var parent = self.parent();
                
                if(parent.hasClass('ajax-link')){
                    parent.trigger('click');
                }
            }
        });
    }

    $('body').delegate( '.func-dialog-direction', "change", function(e) {
        var self = $(this);
        var data_value = self.val();
        var target = $('.diolog-form-box');

        if(data_value == ''){
            target.hide();
        }else{
            target.show();
        }
    });

    $('body').delegate( '.mousetrigger', 'hover', function(e) {
        var self = $(this);
        var target = self.data('target');
        console.log(target)
        $(target).trigger('mouseover');
    });

    $('body').delegate( '#tabUpload .btn-group a[role="tab"]', 'click', function(e) {
        var self = $(this);
        $('#tabUpload .btn-group a[role="tab"]').removeClass('active');

        self.addClass('active');
    });

    $('body').delegate( '.get-filereader', 'change', function(e) {
        var self = $(this);
        var parent = self.parent('div');

        var fullPath = self.val();
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }

            var file_label = parent.find('span.file-label');

            if(file_label.length < 1){
                parent.append('<span class="file-label disblock">'+filename+'</span>');
            }else{
                file_label.text(filename);
            }
        }
    });

    $('body').delegate( '.func-type-payment', 'change', function(e) {
        var self = $(this);
        var data_value = self.val();

        var price_target        = $('#price-header');
        var dp_target           = $('#down-payment-box');
        var hard_cash_target    = $('#hard-cash-box');
        var max_period_target   = $('#max-period');
        var max_period_hint_box   = $('#max-period-hint-box');
        var rate_box_target     = $('#rate-box');
        var period_installment_box_target = $('#period-down-payment');
        var recalculate         = $('#recalculate-header-box');
        var unit_of_time_box    = $('#unit-of-time-box');
        var recalculate_hint    = $('#recalculate-hint');

        var val_installment     = $('.installment-max').val();

        if(data_value == 1 || data_value == 2){
            max_period_target.show();

            if(data_value == 1){
                if(val_installment > 0){
                    hard_cash_target.show();
                }else{
                    hard_cash_target.hide();
                }

                unit_of_time_box.show();
                dp_target.hide();
                recalculate.css('display', 'inline-block');
                max_period_hint_box.show();
            }else{
                recalculate.hide();
                hard_cash_target.hide();
                dp_target.show();
                max_period_hint_box.hide();
                unit_of_time_box.hide();
            }

            rate_box_target.hide();
            period_installment_box_target.hide();
            recalculate_hint.hide();
        }else{
            max_period_target.hide();
            hard_cash_target.hide();
            max_period_hint_box.hide();
            unit_of_time_box.hide();

            if(data_value == 3){
                dp_target.show();
                period_installment_box_target.show();
                recalculate.css('display', 'inline-block');
                recalculate_hint.show();
            }else{
                dp_target.hide();
                period_installment_box_target.hide();
                recalculate.hide();
                recalculate_hint.hide();
            }

            if(data_value == 4){
                rate_box_target.show();
                dp_target.show();
            }else{
                rate_box_target.hide();
            }
        }

        generateFormPeriodeInstallment(0, null, 'style1');

        priceTypePayment();
    });

    function priceTypePayment(){
        var price_target        = $('#price-header');
        var price_stock_unit    = $('#price-stock-unit').val();
        var func_type_payment   = $('.func-type-payment').val();

        if(price_stock_unit != '' || func_type_payment == 1 || func_type_payment == 3){
            price_target.show();
        }else{
            price_target.hide();
        }
    }

    $('body').delegate( '.installment-max', 'change', function(e) {
        var self = $(this);
        var data_value = self.val();
        var func_type_payment = $('.func-type-payment').val();
        var unit_of_time = $('#unit-of-time').val();

        if(func_type_payment == 1){
            generateFormPeriodeInstallment(data_value, unit_of_time, 'style1');
        }
    });

    $('body').delegate( '.period-down-payment', 'change', function(e) {
        var self = $(this);
        var data_value = self.val();
        var func_type_payment = $('.func-type-payment').val();
        var unit_of_time = $('#unit-of-time').val();

        if(func_type_payment == 3){
            generateFormPeriodeInstallment(data_value, false, 'style2');
        }
    });

    $('body').delegate( '#unit-of-time', 'change', function(e) {
        var self = $(this);
        var unit_of_time = self.val();
        var raw_unit = unit_of_time;

        switch(unit_of_time) {
            case 'day':
                unit_of_time = 'hari';
                break;
            case 'week':
                unit_of_time = 'minggu';
                break;
            case 'year':
                unit_of_time = 'tahun';
                break;
            default:
                unit_of_time = 'bulan';
                raw_unit = 'month';
        }

        $('.periode-label').text(unit_of_time);
        $('.periode-input-hidden').val(raw_unit);
    });

    function generateFormPeriodeInstallment(max, unit_of_time, style){
        var target_list = $('.installment-period-zone .items');
        var max_current = target_list.length;
        var hard_cash_target    = $('#hard-cash-box');
        var raw_unit = unit_of_time;

        if(max > 0){
            hard_cash_target.show();
        }else{
            hard_cash_target.hide();
        }

        if(unit_of_time == null || unit_of_time == ''){
            unit_of_time = 'bulan';
            raw_unit = 'month';
        }else{
            switch(unit_of_time) {
                case 'day':
                    unit_of_time = 'hari';
                    break;
                case 'week':
                    unit_of_time = 'minggu';
                    break;
                case 'year':
                    unit_of_time = 'tahun';
                    break;
                default:
                    unit_of_time = 'bulan';
            }
        }
        
        if(max_current < max){
            max = max - 1;
            for (var i = 0; i <= max; i++) {
                var id = 'items-installment-'+i;
                
                if($('#'+id).length <= 0){
                    if(style == 'style1'){
                        content = '<div class="row items margin-bottom-1" id="'+id+'">'+
                            '<div class="col-sm-6 padding-right-1">'+
                                '<input type="hidden" name="data[ProductTypePaymentDetail][periode]['+i+']" class="periode-input-hidden"  value="'+raw_unit+'">'+
                                '<div class="input-group margin-bottom-3">'+
                                    '<label for="ProductTypePaymentDetailNumberPeriode" class="input-group-addon at-left periode-label">'+unit_of_time+'</label>'+
                                    '<input name="data[ProductTypePaymentDetail][number_periode]['+i+']" class="input-flex input-number" placeholder="ke" type="text" id="ProductTypePaymentDetailNumberPeriode'+i+'" value="'+(i+1)+'">'+
                                '</div>'+
                            '</div>'+
                            '<div class="col-sm-6 padding-left-1">'+
                                '<input name="data[ProductTypePaymentDetail][price]['+i+']" class="fullwidth input-price list-price-installment" placeholder="Harga" type="text" id="ProductTypePaymentDetailPrice">  </div>'+
                        '</div>';
                    } else if(style == 'style2'){
                        content = '<div class="row items margin-bottom-1" id="'+id+'">'+
                            '<div class="col-sm-12 padding-right-1">'+
                                '<input type="hidden" name="data[ProductTypePaymentDetail][periode]['+i+']" class="periode-input-hidden"  value="'+raw_unit+'">'+
                                '<input type="hidden" name="data[ProductTypePaymentDetail][number_periode]['+i+']" value="'+(i+1)+'">'+
                                '<div class="input-group margin-bottom-3">'+
                                    '<label for="ProductTypePaymentDetailNumberPeriode" class="input-group-addon at-left periode-label">'+unit_of_time+' ke '+(i+1)+'</label>'+
                                    '<input name="data[ProductTypePaymentDetail][price]['+i+']" class="input-flex input-price list-price-installment" placeholder="ke" type="text" id="ProductTypePaymentDetailNumberPeriode'+i+'">'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                    }

                   $('.installment-period-zone').append(content);
                }
            }
        }else{
            var elem = $('.installment-period-zone .items');

            elem.each(function(idx){
                var self = $(this);

                if((idx+1) > max){
                    self.remove();
                }
            });


        }

        $.inputPrice();
    }

    $('body').delegate( '.recalculate-installment', 'click', function(e) {
        var self = $(this);
        var data_value = self.val();
        var price_head_input = $('.price-head-input').val();
        var installment_max_input = $('.installment-max').val();
        var period_down_payment = $('.period-down-payment').val();

        var func_type_payment = $('.func-type-payment').val();

        if(price_head_input == 0 || price_head_input == ''){
            alert_msg('Harap isi harganya terlebih dahulu');
        }else if(func_type_payment == 1 && (installment_max_input == 0 || installment_max_input == '')){
            alert_msg('Harap isi maksimal cicilan');
        }else if(func_type_payment == 3 && (period_down_payment == 0 || period_down_payment == '')){
            alert_msg('Harap isi lama cicilan DP');
        }else{
            price_head_input = price_head_input.replace(/,/g, '');

            var division = installment_max_input;

            var allow = true;
            if(func_type_payment == 3){
                var type_dp = $('#type-dp').val();
                var value_for_dp = $('#value-for-dp').val();

                value_for_dp = value_for_dp.replace(/,/g, '');

                if(type_dp == 'percentage'){

                    if(value_for_dp > 100){
                        allow = false;
                        alert('DP tidak boleh lebih dari 100%')
                    }

                    if(value_for_dp != 0){
                        value_for_dp = price_head_input * (value_for_dp/100);
                    }else{
                        value_for_dp = price_head_input;
                    }
                }

                price_head_input = value_for_dp;

                division = period_down_payment;
            }
            
            if(allow){
                max = parseInt(division) - 1;
                price_head_input = parseFloat(price_head_input) / parseInt(division);
                for (var i = max; i >= 0; i--) {
                    $('#items-installment-'+i+' .list-price-installment').val(price_head_input);
                }

                $.inputPrice();
            }
        }
    });

    $('body').delegate( '.payment-channel', 'change', function(e) {
        var self = $(this);
        var value = self.val();

        var target = $('#tenor-box');

        if(value == 15 || value == '15'){
            target.removeClass('hide');
        }else{
            target.addClass('hide');
        }
    });

    $('body').delegate( '.pointer-collapse', 'click', function(e) {
        var self = $(this);
        var value = self.val();

        var target_class = '.box-authorize-permission';

        var parent = self.parent('.box-authorize');
        var class_hide = parent.find(target_class).hasClass('hide');
        
        $(target_class).addClass('hide');        

        if(class_hide){
            parent.find(target_class).removeClass('hide');
        }else{
            parent.find(target_class).addClass('hide');    
        }
    });

    $('body').delegate( '.func-schema-payment-method', 'change', function(e) {
        var self = $(this);
        var value = self.val();

        var target = $('.box-toggle-dp');
        var target_val = $('.box-toggle-dp [type="checkbox"]').prop('checked');
        var box_dp_input = $('.dp-input-box');
        var price_installment_box = $('.price-installment-box');
        var type_dp = $('#type-dp');
        var rate_box = $('#rate-box');
        var box_toggle_price_installment = $('.box-toggle-price-installment');

        if(value == 2){
            target.show();

            box_dp_input.show();
            
            type_dp.show();
            rate_box.hide();
            box_toggle_price_installment.show();
            price_installment_box.show();
        }else{
            if(value == 3){
                box_dp_input.show();
                rate_box.show();
                box_toggle_price_installment.show();
                price_installment_box.hide();
            }else{
                box_dp_input.hide();
                type_dp.show();
                rate_box.hide();
                box_toggle_price_installment.hide();
                price_installment_box.show();
            }

            target.hide();
        }
    });

    $( "body" ).delegate( '.trigger-input-range', "keyup", function() {
        var self = $(this);
        var target = self.attr('data-target-range');

        var control  = $(target);

        // var range_val = control.val();
        var range_val = $.convertNumber(control.html().replace(/\%|\#/g, ''));

        var max = control.attr('max');
        var target_from = control.attr('data-target-from-range');
        var target_to   = control.attr('data-target-to-range');
        var target_input_range   = control.attr('data-target-input-range');

        from_no_extension = target_from.replace(/\.|\#/g, '');
        to_no_extension = target_to.replace(/\.|\#/g, '');

        var from_value = $(target_from).val();
        from_value = parseInt(from_value.replace(/,/g, ''));

        var to_value = $(target_to).val();
        to_value = parseInt(to_value.replace(/,/g, ''));

        if($(self).hasClass(from_no_extension)){
            total_dp_price = from_value * (range_val/100);
            total = parseFloat(range_val);

            if(from_value != 0){
                $(target_to).val($.formatNumber(total_dp_price, 0));
            }
            
        }else if(self.hasClass(to_no_extension)){
            if(from_value != 0){
                total = (to_value * 100) / from_value;

                if(total <= max){
                    var temp_total = $.formatNumber(total, 2);

                    $(target_input_range).val(temp_total);
                }else if(total > max){
                    $(target_to).val(from_value);

                    $(target_input_range).val(max);
                }else{
                    $(target_to).val(0);

                    $(target_input_range).val(0);
                }
            }
        }

        if(total <= max){
            var temp_total = total.toFixed(2);
            var split = temp_total.split('.');
            
            if(split[1] == '00'){
                total = parseInt(total);
            }else{
                total = temp_total;
            }

            $('.range-slide_value').text(total+'%');
        }else if(total > max){
            $('.range-slide_value').text('100%');
        }else{
            $('.range-slide_value').text('0%');
        }

        return false;
    });

    var dokuForm = $('#doku-payment-form');
    if(dokuForm.length > 0){
        dokuForm.submit();
    }

    if($('.carousel').length > 0){
    //  $('.carousel').carousel({
    //      interval: false
    //  });
    }

    if($('.minimizemap').length > 0){
        var mapWrap = $('.unit-image-wrapper .minimap');
        $(mapWrap).click(function(){
            $(this).addClass('fullscreenmap');
        });

        $(document).on('click', '.minimizemap', function(){
            $(this).parent('.minimap').removeClass('fullscreenmap');
        })
    }

    $('.action-print').click(function(){
        window.print();
    });

    var hashTag = window.location.hash;
    var idxOf = hashTag.indexOf('#scroll-item');
    var loadJXHR;

    if( idxOf >= 0 ) {
        var target = $(hashTag);
        var topPos  = 0;

        if(target.length){
            topPos = target.offset().top;
        }

        $('html, body').stop().animate({
            'scrollTop': topPos - 120,
        }, 500, 'swing');
    }

    $( "body" ).delegate( '.payment-method-trigger', "click", function() {
        var self = $(this).find('a');
        var target = self.attr('href');

        $(target).find('li').removeClass('active');

        var real_target = $(target+' li:first-child');

        real_target.addClass('active');

        var val = real_target.find('a').data('payment-method');

        $('#product-payment-method-id').val(val);
    });

    $( "body" ).delegate( '.target-payment-method', "click", function() {
        var self = $(this);

        self.parent('ul').find('li').removeClass('active');

        var val = self.data('payment-method');

        $('#product-payment-method-id').val(val);
    });

    $( "body" ).delegate( '.down-payment-type', "change", function() {
        var self = $(this);

        var target = self.data('target');
        var value = self.val();

        if(value == 'normal'){
            $(target).attr('data-decimal', 0);
        }else{
            $(target).attr('data-decimal', 2);
        }
    });

    $( "body" ).delegate( '.additional-toggle-content', "click", function() {
        var self = $(this);
        
        var target = self.attr('data-target-additional');
        var reverse = self.attr('data-additional-reverse');

        if(target != ''){
            if( self.is(':checked') ) {
                if(reverse == 'true'){
                    $(target).fadeOut();
                }else{
                    $(target).fadeIn();
                }
            }else{
                if(reverse == 'true'){
                    $(target).fadeIn();
                }else{
                    $(target).fadeOut();
                }
            }
        }
    });

    $( "body" ).delegate( '.quick-update-trigger', "click", function() {
        var self = $(this);
        var parent_target = self.parents('.quick-update-box');
        var box_target = parent_target.find('.quick-update-form');

        if($(box_target).hasClass('hide')){
            $(box_target).removeClass('hide');
        }else{
            $(box_target).show();
        }

        self.hide();
    });

    $( "body" ).delegate( '.back-quick-update', "click", function() {
        var self = $(this);
        var parent_target = self.parents('.quick-update-box');
        var box_target = parent_target.find('.quick-update-form');
        var link_target = parent_target.find('.quick-update-trigger');

        box_target.addClass('hide');
        link_target.show();
    });

    $( "body" ).delegate( '.submit-quick-update', "click", function() {
        var self = $(this);
        var parent_target = self.parents('.quick-update-box');
        var box_target = parent_target.find('.quick-update-form');
        var link_target = parent_target.find('.quick-update-trigger');

        var target_field = box_target.find('input');

        var url = $.checkUndefined(target_field.attr('data-url'));
        var data_wrapper_write = target_field.attr('data-wrapper-write');
        var formData = target_field.serialize();

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            beforeSend  : function() {
                $.loadingbar_progress('beforeSend');
            },
            success: function(result) { 
                var contentHtml = $(result).filter(data_wrapper_write).html();

                if(typeof contentHtml == 'undefined' ) { 
                    contentHtml = $(result).find(data_wrapper_write).html();
                    $(data_wrapper_write).html(contentHtml);
                }else{
                    alert('Terjadi kesalahan, silahkan ulangi beberapa saat lagi');
                }

                box_target.addClass('hide');
                link_target.show();

                $.inputPrice();
            }
        }).always(function() {
            $.loadingbar_progress('always');
        });
    });

    if($('.countdown-timer').length > 0){
        var times = $('.times-expired').val();
        var periode_max_expired = $('.periode-max-expired').val();

        if(periode_max_expired == null && periode_max_expired == ''){
            periode_max_expired = 5;
        }

        if(times != ''){
            var current_date = new Date();
            var max_expire = current_date.setMinutes(current_date.getMinutes() + parseInt(periode_max_expired));

            var check_cookie = checkCookie('max_expire');
            var cookie_time = getCookie('cookie_time');

            if(check_cookie && cookie_time == times){
                max_expire = getCookie('max_expire');
            }else{
                setCookie('max_expire', max_expire);
                setCookie('cookie_time', times);
            }

            countDownTimer(max_expire);
        }
    }

    if($('.delete-cookie').length > 0){
        deleteCookie('max_expire');
    }

    function countDownTimer(max_expired){
        expInterval = setInterval(function() {
            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = max_expired - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // If the count down is finished, write some text 
            if (distance < 0) {
                deleteCookie('max_expire');

                window.location.href = '/transactions/expiring_cart';
            }else{
                var text = '';
                if(days != 0 || days != '0'){
                    text += pad(days, 2) + " hari ";
                }
                if(hours != 0 || hours != '0'){
                    text += pad(hours, 2) + " jam ";
                }
                if(minutes != 0 || minutes != '0'){
                    text += pad(minutes, 2) + " menit ";
                }
                if(seconds != 0 || seconds != '0'){
                    text += pad(seconds, 2) + " detik";
                }

                $('.countdown-timer').html( text );
            }
        }, 1000);
    }

    function pad (str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    }

    setInterval(function(){
        if( $('.wrapper-alert .alert-wrapper.open').length > 0 ) {
            if(!$('.wrapper-alert .alert-wrapper.open').hasClass('no-hide')){
                $('.wrapper-alert .alert-wrapper.open').fadeOut('normal', function() {
                    $(this).empty();
                });
            }
        }
    }, 5000);

    if($('.new-window').length > 0){
        $('.new-window').click(function(){
            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var self = $(this);
            var h = $.checkUndefined(self.data('height'), 500);
            var w = $.checkUndefined(self.data('width'), 500);
            var href = self.attr('href');
            var title = self.attr('title');

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;

            window.open(href, title, 'width='+w+',height='+h+',top='+top+',left='+left);

            return false;
        });
    }

    if($('.term-conditions-default').length > 0){
        $('.term-conditions-default').click(function(){
            var self = $(this);
            var target_copy = self.data('target-copy');
            var target = self.data('target');

            var val = $(target_copy).html();
            var target = $(target);

            if(confirm('Jika terdapat syarat & ketentuan sebelumnya, akan digantikan oleh syarat & ketentuan default. Apakah Anda yakin ingin melanjutkan proses?')){
                target.val(val);
            }
        });
    }

    if($('.check-unit-availibility').length > 0){
        loadInterval = setInterval(function(){ 
            var id = $('.check-unit-availibility').data('id');

            var check_cookie = checkCookie('max_expire');

            $.get('/backprocess/transactions/check_unit_availability/'+id, function(data){
                if(data.status == 'error'){
                    clearInterval(loadInterval);

                    switch(data.error_type){
                        case 1: 
                            if(check_cookie){
                                alert(data.msg);    
                            }else{
                                alert('Waktu pemesanan unit Anda telah berakhir, silakan pilih ulang unit yang diinginkan');
                            }

                            clearInterval(expInterval);
                            window.location.href = '/backprocess/transactions/destroy_cart';
                        break;
                        case 2: 
                            clearInterval(expInterval);

                            if(confirm(data.msg)){
                                window.location.href = '/backprocess/transactions/updating_cart';
                            }else{
                                window.location.href = '/backprocess/transactions/destroy_cart';
                            }
                        break;
                    }
                }

                return false;
            }, 'json');
        }, 5000);
    }

    if($('.prefix-nup').length > 0){
        $('.prefix-nup').keyup(function(){
            var prefix = $('.prefix-nup').val();
            var digit = $.checkUndefined($('.digit-nup').val(), 5);

            if(prefix == ''){
                prefix = 'PRM';
            }

            var target = $('.example-prefix-nup');
            var text = 'Contoh: '+prefix+'-'+pad (1, digit);

            target.text(text);

            $('.digit-nup').trigger('blur');
        });
    }

    if($('.digit-nup').length > 0){
        $('.digit-nup').blur(function(){
            var prefix = $('.prefix-nup').val();
            var digit = $.checkUndefined($('.digit-nup').val(), 5);

            if(prefix == ''){
                prefix = 'PRM';
            }

            var target = $('.example-digit-nup');

            var max_text = '';
            for (var i = digit; i > 0; i--) {
                max_text += '9';
            }

            var text = prefix+'-'+pad (1, digit)+' sampai '+prefix+'-'+max_text;

            target.text(text);
        });
    }

    $.autoFillForm = function( options ) {
        var autoFillInput = {
            "name" : {
                'value' : [
                    'Roy Martin',
                    'Howard Jason',
                    'Paul Pogba',
                    'Eugene Lary',
                    'Johnny Depp',
                    'Jacqueline Joli',
                    'Shirley Burry',
                ],
                'relation' : {
                    "email" : [
                        'Roy@Martin@yapmail.com',
                        'Howard@Jason@yapmail.com',
                        'Paul@Pogba@yapmail.com',
                        'Eugene@Lary@yapmail.com',
                        'Johnny@Depp@yapmail.com',
                        'Jacqueline@Joli@yapmail.com',
                        'Shirley@Burry@yapmail.com',
                    ],
                },
            },
            "full_name" : {
                'value' : [
                    'Roy Martin',
                    'Howard Jason',
                    'Paul Pogba',
                    'Eugene Lary',
                    'Johnny Depp',
                    'Jacqueline Joli',
                    'Shirley Burry',
                ],
                'relation' : {
                    "email" : [
                        'Roy.Martin@yapmail.com',
                        'Howard.Jason@yapmail.com',
                        'Paul.Pogba@yapmail.com',
                        'Eugene.Lary@yapmail.com',
                        'Johnny.Depp@yapmail.com',
                        'Jacqueline.Joli@yapmail.com',
                        'Shirley.Burry@yapmail.com',
                    ],
                },
            },
            "phone" : {
                'value' : [
                    '086596532632',
                    '081200032641',
                    '082245632000',
                    '085654632141',
                    '085631563241',
                    '089632547412',
                    '089965452365',
                ],
            },
            "no_hp" : {
                'value' : [
                    '086596532632',
                    '081200032641',
                    '082245632000',
                    '085654632141',
                    '085631563241',
                    '089632547412',
                    '089965452365',
                ],
            },
            "message" : {
                'value' : [
                    'Hallo, saya tertarik dengan project Anda, mohon hubungi saya',
                    'Saya ingin mendapatkan informasi tentang project ini, tolong hubungi saya',
                ],
            },
            "gender_id" : {
                'value' : [
                    '0',
                    '1',
                ],
            },
            "message_category_id" : {
                'value' : [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                ],
            },
            "address" : {
                'value' : [
                    'JL. Raya Siabung. No.3/B',
                    'JL. Kemanggisan Raya No.38-39, Vicstoria Residence',
                    'JL. Budi Raya No.12/P, Budi Squere',
                    'JL. Anggrek Kusuma Np.12 Blok.D',
                ],
            },
            "region_id" : {
                'value' : [
                    '33',
                    '29',
                    '31',
                    '21',
                ],
                'relation' : {
                    "city_id" : [
                        '277',
                        '169',
                        '184',
                        '104',
                    ],
                    "subarea_id" : [
                        '7303',
                        '3453',
                        '3857',
                        '2035',
                    ],
                    "zip" : [
                        '12840',
                        '80571',
                        '33783',
                        '42352',
                    ],
                },
            },
            "payment_channel" : {
                'value' : [
                    '15',
                    '04',
                ],
            },
            "identity_number" : {
                'value' : [
                    '21000006845643658',
                    '31000006845643658',
                    '41000006845643658',
                    '51000006845643658',
                    '61000006845643658',
                    '71000006845643658',
                    '81000006845643658',
                ],
                'relation' : {
                    "email" : [
                        'Roy.Martin@yapmail.com',
                        'Howard.Jason@yapmail.com',
                        'Paul.Pogba@yapmail.com',
                        'Eugene.Lary@yapmail.com',
                        'Johnny.Depp@yapmail.com',
                        'Jacqueline.Joli@yapmail.com',
                        'Shirley.Burry@yapmail.com',
                    ],
                },
            },
        };

        // Skip form pencarian
        $('.btn-search input[type="text"],.ui-autocomplete-input').addClass('search-autocomplete');

        // Declare input form yg bisa di auto fill
        var inputs = $('form input[type="text"]:not(.search-autocomplete):not(#suggestionForm),form textarea,form [type="tel"],form [type="email"],form select');
        var onfocus = true;

        if( inputs.length > 0 ) {
            $('.gear-trigger').fadeIn();

            $('.gear-trigger > a').off('click').click(function(){
                if( $('.gear-trigger').hasClass('active') ) {
                    $('.gear-trigger').removeClass('active');
                } else {
                    $('.gear-trigger').addClass('active');
                }

                return false;
            });

            $('.gear-wrapper a.reset').off('click').click(function(){
                inputs.val('');
                return false;
            });

            $('.gear-wrapper a.auto').off('click').click(function(){
                var tempRelation = [];

                inputs.each(function(){
                    var self = $(this);
                    var val = $(this).val();
                    var name = $.checkUndefined(self.attr('name'), null);

                    if( name != null && val == '' ) {
                        var idx = name.indexOf('][');
                        var len = name.length;
                        
                        var field_name = name.substring(idx+2, len-1);
                        var dummy_arr = $.checkUndefined(autoFillInput[field_name], []);
                        var dummy_value = $.checkUndefined(dummy_arr['value'], null);
                        var dummy_relations = $.checkUndefined(dummy_arr['relation'], null);

                        if( dummy_value != null ) {
                            if( onfocus == true ) {
                                self.focus();
                                onfocus = false;
                            }

                            var idx_dummy = Math.floor(Math.random()*dummy_value.length);
                            var dummy = $.checkUndefined(dummy_value[idx_dummy], null);

                            if( dummy_relations != null ) {
                                $.each(dummy_relations, function(i, obj){ 
                                    // var idx_dummy_relation = Math.floor(Math.random()*obj.length);
                                    var relation = $.checkUndefined(obj[idx_dummy], null);

                                    tempRelation[i] = relation;

                                    if( i == 'city_id' && self.hasClass('regionId') ) {
                                        var locations_trigger = self.parents('.locations-trigger');
                                        
                                        locations_trigger.find('.currCityID').val(relation);
                                    }
                                });
                            }

                            self.val(dummy);

                            if( self.is("select") ) {
                                self.trigger('change');
                            }
                        } else {
                            var relation = $.checkUndefined(tempRelation[field_name], null);

                            if( relation != null ) {
                                self.val(relation);

                                if( field_name == 'subarea_id' && self.hasClass('subareaId') ) {
                                    var locations_trigger = self.parents('.locations-trigger');
                                    
                                    locations_trigger.find('.currSubareaID').val(relation);
                                }

                                if( self.is("select") ) {
                                    self.trigger('change');
                                }
                            }
                        }
                    }
                });

                onfocus = true;
                return false;
            });
        }
    }

    $.infinityLoad();
    $.autoFillForm();

    $(document).click(function(e){
        var target = $(e.target);

        if( target.parents('.wrapper-highlight-overly').length == 0 && target.parents('#myModal').length == 0 && !$('.daterangepicker.dropdown-menu').is(':visible') && !target.hasClass('applyBtn') && !target.hasClass('cancelBtn') ) {
            $.highlightOverlyOff();
        }
    });

    if($('.modal-custom').length > 0){
        $('.modal-custom').click(function(){
            var target = $(this).data('target');
            
            $(target).modal({
                show: true,
                backdrop:true,
                keyboard:false,
            });
        });
    }

    if($('.handling-push-value').length > 0){
        $('.handling-push-value').change(function(){
            var self = $(this);
            console.log(self)
            var val = self.val();
            var target = self.data('target');
            console.log(target)

            $(target).attr('data-custom-source-url', val);
        });
    }

    $( "body" ).delegate( '.managment-stock-change', "change", function() {
        var self = $(this);
        var checked = self.is(':checked') ;
        var url = self.attr('data-url') ;

        if(typeof checked == 'boolean' && checked == true){
            value = 1;
        }else{
            value = 0;
        }

        url += '/value:'+value;

        if(typeof url == 'undefined'){
            alert('Terjadi kesalahan ketika request data')
        }else{
            var allow = false;
            if(value == 0){
                if(confirm('Dengan menghilangkan tanda centang maka pengaturan sebelumnya akan hilang. Apakah Anda yakin ingin menghilangkan data sebelumnya?')){
                    allow = true;
                }
            }else{
                allow = true;
            }

            if(allow){
                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    success: function(result){
                        var msg = result.msg;
                        var status = result.status;

                        if(status == 'error'){
                            alert(msg)

                            if(checked == true || checked == 'true'){
                                checked = false;
                            }else{
                                checked = true;
                            }
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');

                        if(checked == true || checked == 'true'){
                            checked = false;
                        }else{
                            checked = true;
                        }

                        self.prop('checked', checked);
                    }
                });
            }else{
                if(checked == true || checked == 'true'){
                    checked = false;
                }else{
                    checked = true;
                }

                self.prop('checked', checked);
            }
        }
    });

    if($('.alert-submit').length > 0){
        $('.alert-submit').click(function(){
            var self = $(this);
            var alert = $.checkUndefined(self.attr('data-alert'), '');
            var continue_event_target = $.checkUndefined(self.attr('data-continue-event'), '');
            var continue_event_target_trigger = $.checkUndefined(self.attr('data-continue-event-trigger'), '');

            if(alert != ''){
                $('#alert-message-dialog').text(alert);

                document.getElementById('agree-alert-dialog').onclick = function(){
                    continue_event(continue_event_target, continue_event_target_trigger);
                }

                document.getElementById('cancel-alert-dialog').onclick = function(){
                    $('#direct-to').val(1);
                    
                   continue_event(continue_event_target, continue_event_target_trigger);
                }

                $('#alert-dialog-custom').modal({
                    show: true,
                    backdrop:true,
                    keyboard:true,
                });   
            }

            function continue_event(continue_event_target, trigger){
                $(continue_event_target).trigger(trigger);
            }
        });
    }
}( jQuery ));