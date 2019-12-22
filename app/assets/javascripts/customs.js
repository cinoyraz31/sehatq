(function ( $ ) {
    var loadJXHR;

    if( $('[data-load="infinity"]').length > 0 ) {
        google.charts.load('current', {'packages':['corechart', 'bar']});
    }

    if($('.select-periode-picker').length > 0){
        $('.select-periode-picker').off('change').change(function(){
            var self = $(this);
            var value = self.val();
            var target = self.data('target');
            var trigger = self.data('trigger');

            var data_value = $(target).attr('data-value');
            data_value = $.parseJSON(data_value);

            var date_from = data_value[0];
            var date_to = data_value[1];

            var month_to = date_to[0];

            var margin = month_to - (value -1);
            date_from[0] = margin;

            if(margin < 1){
                margin = Math.abs(margin);
                var margin = 12 - margin;
                date_from[0] = margin;
                date_from[1] = date_to[1] - 1;
            } else {
                date_from[1] = date_to[1];
            }

            var setDateFrom = '['+date_from[0]+','+date_from[1]+']';
            var setDateTo = '['+date_to[0]+','+date_to[1]+']';

            var result = '['+setDateFrom+','+setDateTo+']';

            // return html;
            setFrom = $.setMonth(date_from);
            setEnd = $.setMonth(date_to);

            $(target).val(setFrom+' - '+setEnd);
            $(target).attr('data-value', result);

            if(typeof trigger == 'undefined'){
                _callRemoveTips();
                _callGenerateChart($('.reload[data-load="infinity"]'), 1, true);
            }else{
                $.directAjaxLink({
                    obj: $(target),
                });
            }
        });

        $.setMonth = function(date){
            var month = date[0];
            var result = false;

            switch(month){
                case 1 : result = 'Jan'; break;
                case 2 : result = 'Feb'; break;
                case 3 : result = 'Mar'; break;
                case 4 : result = 'Apr'; break;
                case 5 : result = 'May'; break;
                case 6 : result = 'Jun'; break;
                case 7 : result = 'Jul'; break;
                case 8 : result = 'Aug'; break;
                case 9 : result = 'Sep'; break;
                case 10 : result = 'Oct'; break;
                case 11 : result = 'Nov'; break;
                case 12 : result = 'Dec'; break;
            }

            return result+' '+date[1];
        }
    }

    function _callRemoveTips(){
        if( $('#wrapper-dashboard-parent-tips .tips-content').length > 0 ) {
            $('#wrapper-dashboard-parent-tips .tips-content li').remove();

            $('#wrapper-dashboard-parent-tips .tips-content').append('<div class="loader padding-2"><div class="loader-4"></div></div>');
        }
    }

    if( $('.chart-change, .ajax-change').length > 0 ) {
        $('.chart-change').off('change').change(function(){
            var self = $(this);
            var value = self.val();

            _callRemoveTips();
            _callGenerateChart($('.reload[data-load="infinity"]'), 1, true);

            if(value){
                $.formatDateChart(self, value);
            }
        });

        $.formatDateChart = function(self, value){
            var date_arr =value.split('-');
            var date_from = date_arr[0];
            var date_to = date_arr[1];

            date_from = $.splitDateChart(date_from);
            date_to = $.splitDateChart(date_to);

            var result = '['+date_from+','+date_to+']';
            // set to html
            self.val(value);
            self.attr('data-value', result);
        }

        $.splitDateChart = function(date = null){
            date = $.trim(date);
            var date_arr = date.split(' ');

            var month = date_arr[0];
            var year = date_arr[1];

            switch(month){
                case 'Jan' :
                    month = '1';
                    break;
                case 'Feb' :
                    month = '2';
                    break;
                case 'Mar' :
                    month = '3';
                    break;
                case 'Apr' :
                    month = '4';
                    break;
                case 'May' :
                    month = '5';
                    break;
                case 'Jun' :
                    month = '6';
                    break;
                case 'Jul' :
                    month = '7';
                    break;
                case 'Aug' :
                    month = '8';
                    break;
                case 'Sep' :
                    month = '9';
                    break;
                case 'Oct' :
                    month = '10';
                    break;
                case 'Nov' :
                    month = '11';
                    break;
                case 'Dec' :
                    month = '12';
                    break;
            }

            return '['+month+','+year+']';
        }
    }

    $.objKeys = function(obj){
        var keys = [];

        if(obj){
            for(key in obj){
                if(obj.hasOwnProperty(key)){
                    keys.push(key);
                }
            }
        }

        return keys;
    };

    $.getObjVal = function(strSelector){
        var object  = $(strSelector);
        var value   = '';

        if(object.length){
            if(object.is('input') || object.is('select') || object.is('textarea') || object.is('button')){
                if(object.is('input:radio')){
                    value = object.filter(':checked').val();
                }
                else{
                    value = object.val();
                }
            }
            else{
                value = object.html();
            }
        }
        else{
            value = strSelector;
        }

        return $.trim(value);
    }

    $.arrayIntersect = function(arr1, arr2){
        var results = [];

        if( ($.isArray(arr1) && $.isArray(arr2)) && (arr1.length && arr2.length) ){
            arr1 = arr1.sort();
            arr2 = arr2.sort();

            for(var i = 0, n = arr1.length, j = 0, k = arr2.length; (i < n) && (j < k); i ++){
                if(arr1[i] == arr2[j]){
                    results.push(arr1[i]);
                    j ++;
                }
                else if(arr1[i] > arr2[j]){
                    j ++;
                    i --;
                }
            }
        }

        return results;
    }

    $.isMobile = function(){
        var mobile = false; //initiate as false
    
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            mobile = true;
        }

        return mobile;
    };

    $.checkUndefined = function (value, _default) {
        if(typeof value == 'undefined' ) {
            value = _default;
        }

        return value;
    }

    // data dropdown regions, cities, areas
    
    var gmapRku = $('#gmap-rku, .map');
    var rkuAddress = $('#rku-address');
    var rkuAddress2 = $('#rku-address2');
    var rkuAddressNo = $('#rku-no-address');
    var rkuLatitude = $('#rku-latitude');
    var rkuLongitude = $('#rku-longitude');
    var rkuLocation = $('#rku-location');

    if( gmapRku.length > 0 && typeof google == 'object' && typeof google.maps == 'object') {
        var iconMarker = new google.maps.MarkerImage('https://s3-ap-southeast-1.amazonaws.com/rmhstatic/images/icons/map-marker.png',
            new google.maps.Size(45,60),
            new google.maps.Point(0,0),
            new google.maps.Point(22,40)
        );
        var facilitiesMarker = new google.maps.MarkerImage('https://s3-ap-southeast-1.amazonaws.com/rmhstatic/images/icons/facilities_marker.png',
            new google.maps.Size(20,20),
            new google.maps.Point(0,0),
            new google.maps.Point(13,32)
        );
        var rentMarker = new google.maps.MarkerImage('https://s3-ap-southeast-1.amazonaws.com/rmhstatic/images/icons/rent_marker.png',
            new google.maps.Size(20,20),
            new google.maps.Point(0,0),
            new google.maps.Point(13,32)
        );
        var soldMarker = new google.maps.MarkerImage('https://s3-ap-southeast-1.amazonaws.com/rmhstatic/images/icons/sold_marker.png',
            new google.maps.Size(20,20),
            new google.maps.Point(0,0),
            new google.maps.Point(13,32)
        );
        var shadow = new google.maps.MarkerImage('https://s3-ap-southeast-1.amazonaws.com/rmhstatic/images/icons/icon_map_shadow.png',
            new google.maps.Size(46,32),
            new google.maps.Point(0,0),
            new google.maps.Point(13,32)
        );
        var shape = {
            coord: [25,0,25,1,25,2,25,3,25,4,25,5,25,6,25,7,25,8,25,9,25,10,25,11,25,12,25,13,25,14,25,15,25,16,25,17,25,18,25,19,25,20,25,21,25,22,25,23,25,24,25,25,25,26,25,27,25,28,21,29,20,30,19,31,6,31,5,30,4,29,0,28,0,27,0,26,0,25,0,24,0,23,0,22,0,21,0,20,0,19,0,18,0,17,0,16,0,15,0,14,0,13,0,12,0,11,0,10,0,9,0,8,0,7,0,6,0,5,0,4,0,3,0,2,0,1,0,0,25,0],
            type: 'poly'
        };
        var propertyMarker;
    }

    var _callMultipleArea = function ( objCity ) {
        if( $('.multiple-area').length > 0 ) {
            var objMultipeArea = $('.multiple-area a.dropdown-toggle');
            var defaultTitleArea = objMultipeArea.attr('data-empty');
            var defaultTitleAreaParent = objMultipeArea.attr('data-empty-parent');
            var city_id = objCity.val();

            $('.multiple-area input[type="checkbox"]').prop('checked', false);
            $('.multiple-area ul.dropdown-menu').html('');

            if( city_id != '' ) {
                $('.multiple-area a.dropdown-toggle span.title').html(defaultTitleArea);
            } else {
                $('.multiple-area a.dropdown-toggle span.title').html(defaultTitleAreaParent);
            }
        }
    }

    var _callAllArea = function ( objCity ) {
        if( $('.all-area').length > 0 ) {
            var objMultipeArea = $('.all-area a.dropdown-toggle');
            var defaultTitleArea = objMultipeArea.attr('data-empty');
            var defaultTitleAreaParent = objMultipeArea.attr('data-empty-parent');
            var city_id = objCity.val();

            if( city_id != '' ) {
                $('.all-area a.dropdown-toggle span').html(defaultTitleArea);
            } else {
                $('.all-area a.dropdown-toggle span').html(defaultTitleAreaParent);
            }
        }
    }

    var resetLocation = function(settings, parents, param){
        var objCity = parents.find(settings.citySelector);
        var objSubarea = parents.find(settings.subareaSelector);
        var objZip = parents.find(settings.zipSelector);

        var cityChange = $.checkUndefined($(settings.locationRoot).attr('data-city-change'), 'true');

        if( param == 'region' ){
            if ( objCity.is( "select" ) ) {
                objCity.trigger('chosen:updated');

                if( cityChange == 'true' ) {
                    objCity.trigger('change');
                }
            }

            _callMultipleArea(objCity);
            _callAllArea(objCity);
        } else if( param == 'city' ){
            objSubarea.trigger('change');
            objSubarea.trigger('chosen:updated');

            _callMultipleArea(objCity);
            _callAllArea(objCity);
        } else if( param == 'subarea' ){
            objZip.val('');
        }
    }

    function _callGenerateLblLocation ( objLocation, value, empty ) {
        var emptyLabel = '';

        if ( objLocation.is( "select" ) ) {
            if( value != '' ) {
                var emptyLabel = $.checkUndefined(objLocation.attr('data-empty'), empty);
            } else {
                var emptyLabel = $.checkUndefined(objLocation.attr('data-empty-parent'), empty);
            }
            
            emptyLabel = $.replaceTag('<option value="">[%replacement%]</option>', emptyLabel);
        }
        
        return emptyLabel;
    }

    $.generateLocation = function( options ){
        var settings = $.extend({
            city_empty: 'Pilih Kota',
            area_empty: 'Pilih Area',
            locationRoot: '.locations-root',
            locationTrigger: '.locations-trigger',
            currentRegionID: '.currRegionID',
            currentCityID: '.currCityID',
            currentSubareaID: '.currSubareaID',
            regionSelector: '.regionId',
            citySelector: '.cityId',
            subareaSelector: '.subareaId',
            zipSelector: '.rku-zip',
            addr: rkuAddress,
            addr2: rkuAddress2,
            no: rkuAddressNo,
        }, options );

        var regionChange = $.checkUndefined($(settings.locationRoot).attr('data-region-change'), 'true');
        var cityChange = $.checkUndefined($(settings.locationRoot).attr('data-city-change'), 'true');
        var areaChange = $.checkUndefined($(settings.locationRoot).attr('data-area-change'), 'true');
        if( regionChange == 'true' && $(settings.regionSelector).length > 0 ) {
            // regions
            $(settings.regionSelector).off('change');
            $(settings.regionSelector).change(function(){
                var self = $(this);
                var region_id = self.val();

                var parents = self.parents(settings.locationTrigger);
                var data_remove = $.checkUndefined(self.attr('data-remove'), false);
                var data_target = $.checkUndefined(self.attr('data-target'), false);
                var data_empty_city = $.checkUndefined(self.attr('data-empty-city'), 'true');
                var data_trigger_change = $.checkUndefined(self.attr('data-trigger-change'), 'false');

                var objCity = parents.find(settings.citySelector);
            
                var value = $("option:selected", this).val();
                var text = $("option:selected", this).text();

                var option_cities = '';
                var filtered_cities = cities[value];
                var classCity = objCity.attr('class');
                var emptyLabel = '';
                var first_city_id = '';

                if( region_id != '' ) {
                    for (var i = 0; i < filtered_cities.length; i++) {
                        if( first_city_id == '' ) {
                            first_city_id = filtered_cities[i][0];
                        }

                        option_cities += '<option value="'+ filtered_cities[i][0] +'">' + filtered_cities[i][1] + '</option>';
                    }

                    parents.find(settings.currentRegionID).val(region_id);
                }

                if( data_empty_city == 'true' ) {
                    emptyLabel = _callGenerateLblLocation(objCity, region_id, settings.city_empty);
                }

                objCity.empty().append(emptyLabel + option_cities);
                
                if( data_empty_city == 'false' ) {
                    objCity.val(first_city_id);
                } else {
                    objCity.val('');
                }

                if( objCity.attr('data-role') == 'chosen-select' || objCity.hasClass('chosen-select') ) {                   
                    objCity.trigger('chosen:updated');
                }

                if( value != '' && gmapRku.length > 0 ) {
                    $.updateGMap({
                        map: gmapRku,
                        addr: $.getAddress(),
                    });
                }

                if( data_remove != false ) {
                    self.parents(settings.locationTrigger).find(data_remove).empty();
                }
                if( data_target != false ) {
                    self.parents(settings.locationTrigger).find(data_target).html( text );
                    objCity.attr('data-text-temp', text );
                }

                if( data_trigger_change == 'city' ) {
                    objCity.trigger('change');
                }

                resetLocation(settings, parents, 'region');
            });

            if( cityChange == 'true' ) {
                // cities
                $(settings.citySelector).off('change');
                $(settings.citySelector).change(function(){
                    var self = $(this);
                    var city_id = self.val();
                    var data_target = $.checkUndefined(self.attr('data-target'), false);

                    var parents = self.parents(settings.locationTrigger);
                    var objSubarea = parents.find(settings.subareaSelector);
                    var objRegion = parents.find(settings.regionSelector);
                    var objZip = parents.find(settings.zipSelector);
                    var miltipleArea = parents.find('.multiple-area');

                    var text_region = $("option:selected", parents.find(settings.regionSelector)).text();
                    var region_id = $("option:selected", parents.find(settings.regionSelector)).val();

                    var value = $("option:selected", this).val();
                    var text = $("option:selected", this).text();

                    if( data_target != false ) {
                        self.parents(settings.locationTrigger).find(data_target).html( text + ', ' + text_region );
                    }
                    
                    if( value == '' ){
                        var emptyLabel = _callGenerateLblLocation(objSubarea, city_id, settings.area_empty);
                        objSubarea.empty().append(emptyLabel);

                        resetLocation(settings, parents, 'city');
                    } else {
                        parents.find(settings.currentCityID).val(value);

                        if( miltipleArea.length > 0 ) {
                            if( region_id != '' ) {
                                var url = '/ajax/get_list_subareas/'+region_id+'/'+value+'/';

                                $.ajax({
                                    url: url,
                                    type: 'POST',
                                        beforeSend: function() {
                                            $.loadingbar_progress('beforeSend');
                                        },
                                    success: function(result) {
                                        miltipleArea.html(result);

                                        return false;
                                    },
                                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                                        alert('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');
                                        return false;
                                    }
                                }).always(function() {
                                    $.loadingbar_progress('always');
                                });
                            }
                        } else if( objSubarea.length > 0 ) {
                            $.ajaxUpdateElement($(this), objSubarea, '/ajax/get_subareas/'+region_id+'/'+city_id+'/', function() {
                                objSubarea.trigger('change');
                                objSubarea.trigger('chosen:updated');
                                objZip.val('');
                            });
                        }

                        if( gmapRku.length > 0 ) {
                            $.updateGMap({
                                map: gmapRku,
                                addr: $.getAddress(),
                            });
                        }
                    }
                });
            }

            if( areaChange == 'true' ) {
                // subareas
                $(settings.subareaSelector).off('change');
                $(settings.subareaSelector).change(function(){
                    var self = $(this);
                    var parents = self.parents(settings.locationTrigger);

                    var objZip = parents.find(settings.zipSelector);

                    if ( self.is( "select" ) ) {
                        var value = $("option:selected", this).val();
                    } else {
                        var value = self.val();
                    }

                    if( value == '' ){
                        resetLocation(settings, parents, 'subarea');
                    } else {
                        $.ajaxUpdateElement($(this), objZip, '/ajax/get_zip/'+value+'/');

                        $.updateGMap({
                            map: gmapRku,
                            addr: $.getAddress(),
                        });
                    }
                });
            }

            if( $(settings.regionSelector).length > 0 ) {
                $(settings.regionSelector).each(function(){
                    var self = $(this);
                    var parents = self.parents(settings.locationTrigger);
                    var region_id = $.checkUndefined(parents.find(settings.currentRegionID).val(), '');
                    var current_region_id = $.checkUndefined(parents.find(settings.currentRegionID).val(), '');
                    var optionRegion = '';

                    for (var i = 0; i < regions.length; i++) {
                        optionRegion += '<option value="'+ regions[i][0] +'">' + regions[i][1] + '</option>';
                    }

                    self.append(optionRegion);
                    self.val(region_id);

                    if( self.attr('data-role') == 'chosen-select' || self.hasClass('chosen-select') ) {
                        self.trigger('chosen:updated');
                    }

                    var objCity = parents.find(settings.citySelector);
                    var city_id = $.checkUndefined(parents.find(settings.currentCityID).val(), '');
                    var option_cities = '';
                    var emptyLabel = _callGenerateLblLocation(objCity, region_id, settings.city_empty);

                    if( current_region_id != '' ) {
                        var filtered_cities = cities[region_id];
                        for (var i = 0; i < filtered_cities.length; i++) {
                            option_cities += '<option value="'+ filtered_cities[i][0] +'">' + filtered_cities[i][1] + '</option>';
                        }
                    }

                    objCity.empty().append(emptyLabel + option_cities);
                    objCity.val(city_id);

                    if( objCity.attr('data-role') == 'chosen-select' || objCity.hasClass('chosen-select') ) {
                        objCity.trigger('chosen:updated');
                    }
                });
            }
        }

        if( settings.addr.length > 0 ) {
            settings.addr.off('blur');
            settings.addr.blur(function(){
                $.updateGMap({
                    map: gmapRku,
                    addr: $.getAddress(),
                });
            });

            settings.addr2.off('blur');
            settings.addr2.blur(function(){
                $.updateGMap({
                    map: gmapRku,
                    addr: $.getAddress(),
                });
            });

            settings.no.off('blur');
            settings.no.blur(function(){
                $.updateGMap({
                    map: gmapRku,
                    addr: $.getAddress(),
                });
            });

            $(settings.zipSelector).off('blur');
            $(settings.zipSelector).blur(function(){
                $.updateGMap({
                    map: gmapRku,
                    addr: $.getAddress(),
                });
            });
            
        }
    }

    $.gmapLocation = function ( options ) {
        var settings = $.extend({
            mapZoom: 16,
            gmap: gmapRku,
            latitude: rkuLatitude.val(),
            longitude: rkuLongitude.val(),
            locations: rkuLocation.val(),
        }, options );

        if(typeof google != 'undefined'){
            if( settings.locations != '' ) {
                settings.gmap.gmap3({
                    action:'init',
                    options:{
                        center: [settings.latitude, settings.longitude],
                        zoom: settings.mapZoom,
                        scrollwheel: false,
                        mapTypeControl: true,
                        mapTypeControlOptions: {
                            position: google.maps.ControlPosition.TOP_RIGHT
                        },
                        draggable: ($.isMobile()) ? false: true,
                    },
                    callback: function(results) {
                        $.addGMapMarker({
                            map: gmapRku,
                            locations: [settings.latitude, settings.longitude],
                        });
                    }
                });
            } else { 
                settings.gmap.gmap3({
                    action:'init',
                    options:{
                        zoom: settings.mapZoom,
                        scrollwheel: false,
                        draggable: ($.isMobile()) ? false: true,
                    },
                });
            }
        }
    };

    $.updateLocationData = function( options ) {
        var settings = $.extend({
            marker: '',
            latitude: rkuLatitude,
            longitude: rkuLongitude,
            locations: rkuLocation,
        }, options );

        if(settings.marker) {
            point = settings.marker.getPosition();
            settings.latitude.val(point.lat());
            settings.longitude.val(point.lng());
            settings.locations.val(point.lat() + ', ' + point.lng());
        }
    };

    $.addGMapMarker = function( options ) {
        var settings = $.extend({
            map: gmapRku,
            locations: '',
            infowindow: '',
            dragendPoin: $('#rku-dragend'),
            hideMarker: $('#rku-hide-map'),
            mapZoom: $('#rku-map-zoom'),
        }, options );
        var content = '<div id="mapwin_title">'+settings.infowindow+'</div>';
        var markerGMap = settings.map.gmap3({
            action:'get', 
            name:'marker',
            first: true
        });

        if(!markerGMap) {
            var isDrag = true;
            
            if(settings.dragendPoin.val() != 1){
                isDrag = false;
            }

            var isShowMarker = true;
            if(settings.hideMarker.val() == 1){
                isShowMarker = false;
            }
            var mapZoom = 16;
            if(settings.mapZoom.val() != null || settings.mapZoom.val() != 'undefined'){
                var mapZoom = parseInt(settings.mapZoom.val());
            }

            settings.map.gmap3({
                action: 'addMarker',
                latLng: settings.locations,
                map: {
                    center: true,
                    zoom: mapZoom,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                },
                scrollwheel: false,
                draggable: ($.isMobile()) ? false: true,
                marker: {
                    options: {
                        draggable: isDrag,
                        icon: iconMarker,
                        shadow: shadow,
                        shape: shape
                    },
                    events: {
                        dragend: function(marker, event, data){
                            $.updateLocationData({
                                marker: marker, 
                            });

                            settings.dragendPoin.val(1);
                        },
                        click: function(marker, event){
                            if( settings.infowindow != '' && typeof settings.infowindow != "undefined" ) {
                                $(this).gmap3({
                                action: 'addinfowindow',
                                anchor: marker,
                                options: {
                                 content: content
                                }
                             });
                            }
                        },
                    },
                    callback: function(marker) {
                        propertyMarker = marker;

                        $.updateLocationData({
                            marker: marker, 
                        });

                        marker.setVisible(isShowMarker);
                    }
                }
            });

        } else {
            updateGmapMarker({
                map: settings.map,
                marker: markerGMap,
                locations: settings.locations,
            });
        }
    };

    $.updateGmapMarker = function(options) {
        var settings = $.extend({
            map: gmapRku,
            marker: '',
            locations: '',
        }, options );

        settings.marker.setPosition(settings.locations);
        settings.map.gmap3({
            action:'panTo', 
            args:[settings.locations]
        });
        $.updateLocationData({
            marker: settings.marker, 
        });
    }

    $.updateGMap = function( options ) {
        var settings = $.extend({
            map: gmapRku,
            addr: '',
        }, options );

        if( settings.map.length > 0 ) {
            settings.map.gmap3({
                action: 'getlatlng',
                address: settings.addr,
                callback: function (results) {
                    if (results){
                        var location = results[0].geometry.location;

                        $(this).gmap3({
                            action: 'setCenter', 
                            args:[ location ],
                        });

                        if(!propertyMarker) {
                            $.addGMapMarker({
                                map: $(this), 
                                locations: location,
                            });
                        } else {
                            $.updateGmapMarker({
                                map: $(this), 
                                marker: propertyMarker,
                                locations: location,
                            });
                        }
                    }
                }
            });
        }
    };

    $.getAddress = function( options ) {
        var settings = $.extend({
            subarea: $('.subareaId option:selected'),
            city: $('.cityId option:selected'),
            region: $('.regionId option:selected'),
            country: $('#countryId option:selected'),
            zip: $('.rku-zip'),
            addr: rkuAddress,
            addr2: rkuAddress2,
            no: rkuAddressNo,
        }, options );

        var locations = '';
        var address = '';

        if( settings.subarea.val() != '' ) {
            locations = settings.subarea.text();
        }
        if( settings.city.val() != '' ) {
            if( locations != '' ) {
                locations += ', ';
            }
            locations += settings.city.text();
        }
        if( settings.region.val() != '' ) {
            if( locations != '' ) {
                locations += ', ';
            }
            locations += settings.region.text();
        }
        if( typeof settings.country.val() != 'undefined' && settings.country.val() != '' ) {
            if( locations != '' ) {
                locations += ', ';
            }
            locations += settings.country.text();
        }

        if(settings.addr.val()) {
            address = settings.addr.val().replace(/\r\n|\r|\n/g,", ");

            if( typeof settings.addr2.val() != 'undefined' && settings.addr2.val() != '' ) {
                address += ', ' + settings.addr2.val();
            }

            if( typeof settings.no.val() != 'undefined' && settings.no.val() != '' ) {
                address += ' No.' + settings.no.val();
            }

            if( locations != '' ) {
                address += ', ';
            }

            locations = address + locations;
        }

        if(typeof settings.zip.val() != 'undefined' && settings.zip.val()) {
            locations += ' ' + settings.zip.val();
        }

        return locations;
    }

    $.mapRoute = function(options){
        var settings = $.extend({
            gmap:gmapRku,
            obj: $('.coordinate-place'),
            objHover: $('.hover-coordinate-place'),
            originLatitude: $('#rku-latitude').val(),
            originLongitude: $('#rku-longitude').val(),
            hideMarker: $('#rku-hide-map'),
            dragendPoin: $('#rku-dragend'),
        }, options );

        if(settings.obj.length > 0){
            settings.obj.off('click');
            settings.obj.click(function(){
                var self = $(this);
                var destination_latitude = self.attr('data-latitude');
                var destination_longitude = self.attr('data-longitude');

                if(settings.hideMarker.val() != 1){
                    settings.gmap.gmap3({
                        action:'getroute',
                        options:{
                            origin: [settings.originLatitude, settings.originLongitude],
                            destination: [destination_latitude, destination_longitude],
                            travelMode: google.maps.DirectionsTravelMode.DRIVING
                        },
                        callback: function(results){
                            if (!results) return;
                            $(this).gmap3({
                                action:'adddirectionsrenderer',
                                map:{
                                    options:{
                                        zoom: 13,
                                        center: [settings.originLatitude, settings.originLongitude]
                                    }
                                },
                                directionrenderer:{
                                    options:{
                                        directions:results,
                                        suppressMarkers: true
                                    } 
                                },
                                polylineOptions: {
                                    strokeColor: "red"
                                }
                            });
                        }
                    });
                }
            });
        }

        if(settings.objHover.length > 0){
            settings.objHover.off('hover');
            settings.objHover.hover(function(){
                var self = $(this);
                var destination_latitude    = self.attr('data-latitude');
                var destination_longitude   = self.attr('data-longitude');
                var destination_title       = self.attr('data-title');
                var type                    = self.attr('data-type');
                var url                     = self.attr('href');

                var icon = facilitiesMarker;
                var data_content = new Array();

                data_content['title']       = destination_title;

                if(typeof type != 'undefined' && type != 'facility'){
                    if(type == 'sell-property'){
                        icon = soldMarker;
                    }else if(type == 'rent-property'){
                        icon = rentMarker;
                    }

                    var price       = self.attr('data-price');
                    var asset       = self.attr('data-asset');
                    var photo       = self.attr('data-photo');
                    

                    data_content['price']           = price;
                    data_content['property_asset']  = asset;
                    data_content['photo']           = photo;
                    data_content['link']            = url;
                }else{
                    var destination_category    = self.attr('data-category');
                    var destination_distance    = self.attr('data-distance');

                    data_content['category']    = destination_category;
                    data_content['distance']    = destination_distance;
                }

                var isDrag = true;

                if(settings.dragendPoin.val() != 1){
                    isDrag = false;
                }

                settings.gmap.gmap3({
                    action: 'addMarker',
                    latLng: [destination_latitude, destination_longitude],
                    map: {
                        zoom:13,
                        center: true,
                    },
                    marker: {
                        options: {
                            draggable: isDrag,
                            icon: icon,
                            shadow: shadow
                        },
                        events: {
                            click: function(marker, event){
                                mapInfowindow(this, marker, type, data_content);
                            },
                        }
                    },
                });
            });
        }
    }

    function mapInfowindow(thisobj, marker, type_content, fill_content){
        var content = '';
        var destination_title = $.checkUndefined(fill_content['title'], '');

        if(type_content == 'facility'){
            var destination_category = $.checkUndefined(fill_content['category'], '');
            var destination_distance = $.checkUndefined(fill_content['distance'], '');

            content = '<div class="phoney"><div id="mapwin_title">'+destination_title+'</div>'
                +'<div id="mapwin_category">'+destination_category+'</div>'
                +'<div id="mapwin_distance">'+destination_distance+'</div></div>';
        }else if(type_content == 'sell-property' || type_content == 'rent-property'){
            var price = $.checkUndefined(fill_content['price'], '');
            var property_asset = $.checkUndefined(fill_content['property_asset'], '');
            var photo = $.checkUndefined(fill_content['photo'], '');
            var link_property = $.checkUndefined(fill_content['link'], '');

            content = '<div class="phoney">'
                +'<div class="top-info"><h3>'+destination_title+'</h3>'
                +'<p class="price">'+price+'</p>'
                +'<p class="property-asset">'+property_asset+'</p></div>'
                +'<div class="photo-property"><img src="'+photo+'"></div>'
                +'<a href="'+link_property+'" class="btn md full-width with-bg green" target="blank">Lihat detail</a>'
                +'</div>';
        }

        if(content != ''){
            $(thisobj).gmap3({action : 'clear', name : 'infowindow'});
            $(thisobj).gmap3({
                action: 'addinfowindow',
                anchor: marker,
                options: {
                    content: content
                }
            });
        }
    }

    $.ajaxUpdateElement = function(el, target, url, callback, data) {
        $.ajax({
            url : url,
            type : 'POST',
            data : data,
            beforeSend: function() {
                $.loadingbar_progress('beforeSend');
            },
            success : function(data){
                if(target.is("select")) {
                    target.html($.trim(data));
                } else {
                    target.val($.trim(data));
                }
                if (typeof callback == "function") {
                    callback();
                }
                    
                var parents = el.parents('.locations-trigger');
                var subarea_id = $.checkUndefined(parents.find('.currSubareaID').val(), '');

                if( subarea_id != '' ) {
                    target.val(subarea_id);
                    target.trigger('change');
                }
            },
        }).always(function() {
            $.loadingbar_progress('always');
        });
    };

    $.loadingbar_progress = function( options, is_loadingbar, data_warpper_loader = false, warpper = '.table-responsive .table tbody', data_loader_icon = false ){
        is_loadingbar = $.checkUndefined(is_loadingbar, 'true');

        if( is_loadingbar == 'true' ) {
            switch (options) { 
                case 'beforeSend':
                    if(data_warpper_loader){
                        $(warpper).hide();
                        $(data_loader_icon).html('<div class="loader padding-2"><div class="loader-4"></div></div>');
                    } else {
                        $("body").append("<div id='loadingbar'></div>")
                        $("#loadingbar").addClass("waiting").append($("<dt/><dd/>"));

                        $("#loadingbar").width((50 + Math.random() * 30) + "%");
                    }
                break;
                case 'always':
                     $("#loadingbar").width("101%").delay(200).fadeOut(400, function() {
                         $(this).remove();
                     });
                break;
            }
        }
    };

    $.replaceTag = function (str, replacement, keyword) {
        keyword = $.checkUndefined(keyword, '[%replacement%]');

        return str.replace(keyword, replacement)
    }

    $.numberToString = function (str, replacement) {
        str = $.checkUndefined(str, replacement) + '';

        return str.replace(/,/g, '');
    }

    $.fileupload = function ( options ) {
        var settings = $.extend({
            objFileupload: $('#fileupload'),
            objFileuploadClass: $('.fileupload'),
        }, options );

        if( settings.objFileupload.length > 0 ) {
            var autoupload = $.checkUndefined(settings.objFileupload.attr('data-auto-upload'), 'true');
            var prependfiles = $.checkUndefined(settings.objFileupload.attr('data-prepend-files'), 'true');
            var removeFooter = $.checkUndefined(settings.objFileupload.attr('data-remove-footer'), 'true');
            autoupload = eval(autoupload);
            // prependfiles = eval(prependfiles);

            settings.objFileupload.fileupload({
                autoUpload: autoupload,
                prependFiles: prependfiles,
                removeFooter: removeFooter,
            });
        }else if( settings.objFileuploadClass.length > 0 ) {
            settings.objFileuploadClass.each(function () {
                var self = $(this);
                var drop_zone = $.checkUndefined(self.attr('data-drop-zone'), self);
                var autoupload = $.checkUndefined(self.attr('data-auto-upload'), 'true');
                autoupload = eval(autoupload);

                self.fileupload({
                    dropZone: $(drop_zone),
                    autoUpload: autoupload,
                });
            });
        }
    }

    $.uploadGallery = function( options ) {
        function template_media ( type, file, field ) {
            var field = $.checkUndefined(field, null);

            if( field != null ) {
                field = 'data[DocumentMedia]['+field+'][media_id][]';
            } else {
                field = 'data[DocumentMedia][media_id][]';
            }
            var itemImg = $.replaceTag(file.itemImg, file.thumb, 'sqm');

            switch(type) {
                case 'single':
                    var actionTmp = '';

                    if( file.action == 'true' ) {
                        actionTmp = '<div class="media-action small-text margin-vert-1 align-center">\
                            <a href="javascript:void(0);" data-value="'+file.id+'" class="cred delete-media-gallery">hapus</a>\
                        </div>';
                    }

                    contentMedia = '\
                    <li data-item="'+file.id+'" class="col-sm-12 margin-bottom-3">\
                        <div class="media-grid-attachment">\
                            <div class="media-grid-attachment-wrapper">\
                                <div class="media-grid-view">\
                                    '+itemImg+'\
                                </div>\
                            </div>\
                        </div>\
                        '+actionTmp+'\
                        <input type="hidden" name="'+field+'" value="'+file.id+'">\
                    </li>';
                break;
                case 'multiple-with-options':
                    var content_html = $('.selectbox-copy').html();

                    var template_content = '';
                    if(typeof content_html != 'undefined' && content_html != ''){
                        template_content = content_html.replace(new RegExp('{file.id}', 'g'), file.id).replace(new RegExp('{file.itemImg}', 'g'), file.itemImg);
                    }

                    contentMedia = template_content;
                break;
                case 'documents':
                    var media_categories = $.checkUndefined($('.selectbox-copy.document .media-category').html(), null);
                    var categories = '';

                    if( media_categories != null ) {
                        categories = media_categories;
                        categories = $.replaceTag(categories, 'data[DocumentMedia][document]', 'data[DocumentMedia][gallery]');
                    }

                    contentMedia = '\
                    <li data-item="'+file.id+'" class="col-xs-12 col-sm-6 col-md-6 col-lg-12 margin-bottom-3 padding-side-3">\
                        <div class="doc-icon">\
                            '+file.itemImg+'\
                        </div>\
                        <div class="doc-action">\
                            <p class="doc-title">'+file.title+'</p>\
                            '+categories+'\
                            <a href="/admin/media/download/'+file.id+'" class="small-text margin-right-4">download</a>\
                            <a href="javascript:void(0);" data-value="'+file.id+'"  class="small-text cred delete-media-gallery">hapus</a>\
                        </div>\
                        <input type="hidden" name="'+field+'" value="'+file.id+'">\
                    </li>';
                break;
                case 'videos':
                    contentMedia = '\
                    <li data-item="'+file.id+'" class="col-xs-6 col-sm-3 col-md-2 col-lg-6 margin-bottom-3">\
                        <div class="media-grid-attachment">\
                            <div class="media-grid-attachment-wrapper">\
                                <div class="media-grid-view">\
                                    '+file.itemImg+'\
                                </div>\
                            </div>\
                        </div>\
                        <div class="media-action small-text margin-vert-1">\
                            <a href="javascript:void(0);" data-value="'+file.id+'"  class="float-right cred delete-media-gallery">hapus</a>\
                        </div>\
                        <input type="hidden" name="'+field+'" value="'+file.id+'">\
                    </li>';
                break;
                case 'multiple-builder':
                    var media_type = $.checkUndefined($('.selectbox-copy.temp-multiple-builder .media-type').html(), null);
                    var types = '';

                    if( media_type != null ) {
                        types = media_type;
                        types = $.replaceTag(types, 'data[DocumentMedia][document]', 'data[DocumentMedia][gallery]');
                    }

                    contentMedia = '\
                    <li data-item="'+file.id+'" class="col-xs-6 col-sm-3 col-md-2 col-lg-6 margin-bottom-3">\
                        <div class="media-grid-attachment">\
                            <div class="media-grid-attachment-wrapper">\
                                <div class="media-grid-view">\
                                    '+file.itemImg+'\
                                </div>\
                            </div>\
                        </div>\
                        <div class="media-category">\
                            '+types+'\
                        </div>\
                        <div class="media-action small-text margin-vert-1">\
                            <a href="javascript:void(0);" data-value="'+file.id+'" class="cred delete-media-gallery">hapus</a>\
                        </div>\
                        <input type="hidden" name="'+field+'" value="'+file.id+'">\
                    </li>';
                break;
                default:
                    var actionTmp = '';

                    if( file.action == 'true' ) {
                        actionTmp = '<div class="media-action small-text margin-vert-1 align-center">\
                            <a href="javascript:void(0);" data-value="'+file.id+'" class="cred delete-media-gallery">hapus</a>\
                        </div>';
                    }

                    contentMedia = '\
                    <li data-item="'+file.id+'" class="col-xs-6 col-sm-3 col-md-2 col-lg-6 margin-bottom-3">\
                        <div class="media-grid-attachment">\
                            <div class="media-grid-attachment-wrapper">\
                                <div class="media-grid-view">\
                                    '+file.itemImg+'\
                                </div>\
                            </div>\
                        </div>\
                        '+actionTmp+'\
                        <input type="hidden" name="'+field+'" value="'+file.id+'">\
                    </li>';
                break;
            }

            return contentMedia;
        }

        $( "body" ).delegate( '.pick-gallery', "click", function(event) {
            var self = $(this);
            var disabled = $.checkUndefined(self.attr('disabled'), null);

            if( self.attr('disabled') !== 'disabled' ) {
                var medias = $('.media-grid-checkbox .check-option:checked');
                var contentMedia = '';
                var target = self.attr('data-target');
                var rel = self.attr('rel');
                var type = $.checkUndefined(self.attr('data-type'), 'multiple');
                var field = $.checkUndefined(self.attr('data-field'), null);
                var thumb = $.checkUndefined(self.attr('data-thumb'), 'sqm');
                var action = $.checkUndefined(self.attr('data-action'), 'true');
                var trigger = $.checkUndefined(self.attr('data-trigger'), 'false');

                if( medias.length > 0 ) {
                    $.each(medias, function(i, val) {
                        id = $(val).val();
                        var title = $(val).data('title');
                        
                        itemImg = $('.item-img[rel="'+id+'"]').html();
                        var objExists = $(target+' [data-item="'+id+'"]');
                        var file = {
                            id: id,
                            title: title,
                            itemImg: itemImg,
                            thumb: thumb,
                            action: action,
                        };

                        if( objExists.length == 0 ) {
                            switch(type) {
                                case 'single':
                                    contentMedia = template_media(type, file, field);
                                break;
                                case 'multiple-with-options':
                                    contentMedia += template_media(type, file, field);
                                break;
                                case 'documents':
                                    contentMedia += template_media(type, file, field);
                                break;
                                case 'videos':
                                    contentMedia += template_media(type, file, field);
                                break;
                                default:
                                    contentMedia += template_media(type, file, field);
                                break;
                            }
                        }
                    });

                    switch(type) {
                        case 'single':
                            $(target).html(contentMedia);
                        break;
                        default:
                            $(target).append(contentMedia);

                            var reindex = $.checkUndefined($(target).attr('data-reindex'));
                            if(reindex){
                                $.reindexList({
                                    obj     : $(target), 
                                    child   : $(target).find('li'), 
                                });
                            }

                            if( type == 'multiple-builder' ) {
                                $(target).find('li:last-child .download-url-placeholder').hide();
                            }
                        break;
                    }

                //  trigger pick event
                    $('body').trigger('media:picked');

                    if( trigger == 'ajax-form' ) {
                        getAjaxForm($('.ajax-form'));

                    //  trigger request event
                        $('body').trigger('media:ajax-requested');
                    }
                }

                $('#myModal').modal('hide');

            //  trigger close modal event
                $('body').trigger('media:modal-closed');
            }

            return false;
        });

        $( "body" ).delegate( '.delete-media-gallery', "click", function(event) {
            var self = $(this);
            var id = self.attr('data-value');
            var obj = self.closest('[data-item="'+id+'"]');

            if(obj.length){
                var parent  = self.closest('ul.gallery-ul');
                var reindex = $.checkUndefined(parent.attr('data-reindex'));

                obj.fadeOut( "fast", function() {
                    obj.remove();

                //  trigger remove event
                    $('body').trigger('media:removed');

                    if(parent.length && reindex){
                        $.reindexList({
                            obj     : parent, 
                            child   : parent.find('li'), 
                        });
                    }
                });
            }
        });
    }

    $.ajaxForm = function( options ) {
        var settings = $.extend({
            obj: $('.ajax-form'),
        }, options );

        settings.obj.off('submit').submit(function(){
            var self = $(this);
            getAjaxForm ( self );

            return false;
        });
    }

    var ajaxFormJXHR;
    function getAjaxForm ( self ) {
        if(ajaxFormJXHR){
            ajaxFormJXHR.abort();
        }

        var url = self.attr('action');
        var type = self.attr('data-type');
        var flag_alert = self.attr('data-alert');
        var data_ajax_type = self.attr('data-ajax-type');
        var formData = self.serialize();
        var data_wrapper_write = self.attr('data-wrapper-write');
        var data_wrapper_success = self.attr('data-wrapper-success');
        var data_pushstate = self.attr('data-pushstate');
        var data_url_pushstate = self.attr('data-url-pushstate');
        var data_reload = self.attr('data-reload');
        var data_reload_url = self.attr('data-reload-url');
        var data_close_modal = self.attr('data-close-modal');
        var data_scroll = self.attr('data-scroll');
        var data_scroll_top = $.convertNumber(self.attr('data-scroll-top'));
        var data_scroll_time = $.convertNumber(self.attr('data-scroll-time'), 'int', 2000);
        var data_location = $.checkUndefined(self.attr('data-location'), false);
        var data_location_additional = $.checkUndefined(self.attr('data-location-additional'), false);
        var data_trigger_click = $.checkUndefined(self.attr('data-trigger-click'), null);
        var data_reset_after_success = $.checkUndefined(self.attr('data-reset-after-success'), null);
        var data_to_url = $.checkUndefined(self.attr('data-to-url'), false);
        var data_wrapper_alert = $.checkUndefined(self.attr('data-wrapper-alert'), '.wrapper-alert');

        if( flag_alert != null ) {
            if ( !confirm(flag_alert) ) { 
                return false;
            }
        }

        if(typeof data_ajax_type == 'undefined' ) {
            data_ajax_type = 'html';
        }

        if(typeof data_wrapper_write == 'undefined' ) {
            data_wrapper_write = '#wrapper-write';
        }

        if(typeof data_pushstate == 'undefined' ) {
            data_pushstate = false;
        }

        if(typeof data_url_pushstate != 'undefined' ) {
            data_url_pushstate = url;
        }

        ajaxFormJXHR = $.ajax({
            url: url,
            type: 'POST',
            dataType: data_ajax_type,
            data: formData,
            beforeSend:function(){
                var button_submit = self.find('button[type="submit"]');

                button_submit.attr('disabled', 'disabled');
            },
            success: function(result) {
                if( type == 'content' ) {
                    var content = result;
                    var status = $(content).find('#msg-status').html();
                    var msg = $(content).find('#msg-text').html();
                    var to_url = $(content).find('#to-url').html();
                    var contentHtml = $(content).filter(data_wrapper_write).html();
                    var contentAlert = $(content).filter(data_wrapper_alert).html();

                    if(typeof contentHtml == 'undefined' ) {
                        contentHtml = $(content).find(data_wrapper_write).html();
                    }

                    if(data_trigger_click != null){
                        var trigger = $(data_trigger_click);
                        
                        $.directAjaxLink({
                            obj: trigger
                        });
                    }

                    if(typeof data_scroll != 'undefined' && data_scroll != 'false' ) {
                        var theOffset = $(data_scroll).offset();
                        $('html, body').animate({
                            scrollTop: theOffset.top + data_scroll_top,
                        }, data_scroll_time);
                    }


                    // UNDER DEVELOPMENT
                    // if( status == 'success' && data_reload == 'true' ) {
                        
                    if( ( status != 'error' && status != 'undefined' ) && data_reload == 'true' ) {
                        if(typeof data_reload_url == 'undefined' ) {
                            window.location.reload();
                        } else {
                            location.href = data_reload_url;
                        }
                    } else if( $(data_wrapper_write).length > 0 ) {
                         if(status == 'success' && typeof data_wrapper_success != 'undefined' && $(data_wrapper_success).length > 0 ) {
                            contentHtml = $(content).filter(data_wrapper_success).html();

                            if(typeof contentHtml == 'undefined' ) {
                                contentHtml = $(content).find(data_wrapper_success).html();
                            }

                            $(data_wrapper_success).html(contentHtml);
                            $.rebuildFunctionAjax( $(data_wrapper_success) );

                            if( data_pushstate != false ) {
                                window.history.pushState('data', '', data_url_pushstate);

                            }

                            if( data_close_modal == 'true' ) {
                                $('#myModal .close.btn').trigger("click");
                            }
                        } else {
                            $(data_wrapper_write).html(contentHtml);

                            if(contentAlert !=''){
                                $('.modal '+data_wrapper_alert).html(contentAlert);
                            }

                            $.rebuildFunctionAjax( $(data_wrapper_write) );

                            if(data_reset_after_success == 'true'){
                                self.find('input, select').val('');
                            }
                        }

                        if(status == 'success' && data_to_url != false && ( to_url != '' && to_url != 'undefined' )){
                            window.location.href = to_url;
                        }

                        if( data_location == 'true' ) {
                            if(data_location_additional == 'true'){
                                $.generateLocation({
                                    currentRegionID: $('#currRegionIDaditionals').val(),
                                    currentCityID: $('#currCityIDaditionals').val(),
                                    regionSelector: $('#regionIdAdditional'),
                                    citySelector: $('#cityIdAdditional'),
                                    subareaSelector: $('#subareaIdAdditional'),
                                    zipSelector: $('#rku-zip-Additional'),
                                });
                            }else{
                                $.generateLocation();
                            }
                        }
                    }
                }

                $.delayRemoveAlert();
                return false;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');
                return false;
            }
        }).done(function(){
            $.rebuildFunction();
        });

        return false;
    }

    $.ajaxLink = function( options ) {
        var settings = $.extend({
            obj: $('.ajax-link'),
            objChange: $('.ajax-change, .form-table-search .select-group-wrapper select'),
            objBlur: $('.ajax-blur'),
            objKeyup: $('.ajax-keyup,.form-table-search .content-input input,.table-header .dropdown-group #sorted'),
            objAttribute: $('.ajax-attribute'),
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.off('click');
            settings.obj.click(function(){
                var self = $(this);

                $.directAjaxLink({
                    obj: self,
                });

                return false;
            });
        }

        if( settings.objChange.length > 0 ) {
            settings.objChange.off('change');
            settings.objChange.change(function(){
                $(this).trigger('ajax-link:changed');

                var self = $(this);
                
                $.directAjaxLink({
                    obj: self,
                });

                return false;
            });

            settings.objChange.each(function(index, object){
                var object  = $(object);
                var reset   = $.checkUndefined(object.attr('data-reset'), false);

                if(reset === true || reset == 'true'){
                    object.find('option').prop('selected', function() {
                        return this.defaultSelected;
                    });
                }
            });
        }

        if( settings.objBlur.length > 0 ) {
            settings.objBlur.off('blur');
            settings.objBlur.blur(function(){
                var self = $(this);
                
                $.directAjaxLink({
                    obj: self,
                });

                return false;
            });
        }

        if( settings.objKeyup.length > 0 ) {
            settings.objKeyup.off('keyup').keyup(function(){
                var self = $(this);

                setTimeout( function(){
                    $.directAjaxLink({
                        obj: self,
                    });
                }, 1000 );

                return false;
            });
            settings.objKeyup.off('keypress').keypress(function(e){
                if (e.keyCode == 13) {
                    e.preventDefault();
                }
            });
        }

        if( settings.objAttribute.length > 0 ) {
            settings.objAttribute.off('change');
            settings.objAttribute.change(function(){
                var self = $(this);
                var addParam = $.checkUndefined(self.attr('data-params'), '');
                var href = $.checkUndefined(self.attr('data-href'), '/admin/ajax/attributes');

                if( addParam != '' ) {
                    addParam = '/' + addParam;
                }

                self.attr('href', href + '/' + self.val() + addParam + '/');
                
                $.directAjaxLink({
                    obj: self,
                });

                return false;
            });
        }
    }

    $.doActionEvent = function(json, event_id, document_id, model, url_referer){        
        if(event_id != ''){
            gapi.client.calendar.events.patch({
                'calendarId': 'primary',
                'eventId':event_id,
                'resource': json,
            });
            var request = gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId':event_id,
                'resource': json,
                'sendNotifications' : 'true',
            });
        } else {
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': json,
                'sendNotifications' : 'true',
            });
        }

        request.execute(function(add_event) {
            var event_id = add_event.id;
            console.log(add_event);

            if(event_id != ''){
                $.ajax({
                  type: "POST",
                  url: '/backprocess/settings/update_event/' + event_id + '/id:' + document_id + '/model:' + model + '/',
                  dataType: 'json',
                  success: function(result) {
                    return false;
                  },
                }).responseJSON;
            }
            
            if(url_referer != ''){
                window.location.href = url_referer;                    
            }
        });
    }

    $.linkSubmitForm = function( options ) {
        var settings = $.extend({
            obj: '.link-submit-form',
            objTriggerAlert : $('.data-trigger-alert'),
            objTriggerAlertOld : $('.old-data-trigger-alert'),
        }, options );

        $( "body" ).delegate( settings.obj, "click", function(event) {
            event.preventDefault();
            event.stopPropagation();

            var self = $(this);
            var disabled = $.checkUndefined(self.attr('disabled'), null);
            var parent = $.checkUndefined(self.attr('data-form'));
                parent = $(parent);

            if(parent.length && disabled == null ){
                var is_draft = false;
                var url = $(this).attr('href');
                var flag_alert = $(this).attr('data-alert');
                var draft = $(this).attr('data-draft');
                var draft_alert = $(this).attr('data-draft-alert');

                if( flag_alert != null && !confirm(flag_alert) ) {
                    return false;
                }

                if(draft == 'true'){
                    if ( !confirm(draft_alert) ) { 
                        return false;
                    }else{
                        url += '/draft:1';
                    }
                }

                if( settings.objTriggerAlertOld.length > 0 ) {
                    var old_data = settings.objTriggerAlertOld.val();
                    var new_alert = settings.objTriggerAlert.attr('data-alert');

                    if( settings.objTriggerAlert.attr('type') == 'radio' ) {
                        var new_data = settings.objTriggerAlert.filter(':checked').val();
                    } else if( settings.objTriggerAlert.attr('type') == 'select' ) {
                        var new_data = settings.objTriggerAlert.find('option:selected').val();
                    } else {
                        var new_data = settings.objTriggerAlert.val();
                    }

                    if( old_data != new_data ) {
                        if ( !confirm(new_alert) ) { 
                            return false;
                        }
                    }
                }

                parent.attr({
                    'action' : url, 
                    'method' : 'post', 
                }, url);

            //  jangan langsung di submit, karena event "onSubmit" nya ga akan detect
            //  http://stackoverflow.com/questions/645555/should-jquerys-form-submit-not-trigger-onsubmit-within-the-form-tag
            //  I was recently asked: "Why doesn't the form.onsubmit event get fired when I submit my form USING JAVASCRIPT?"
            //  The answer: Current browsers do not adhere to this part of the html specification. 
            //  The event ONLY FIRES when it is activated by a user - and does NOT FIRE WHEN ACTIVATED BY CODE.

                var submitButton = parent.find(':submit');

                self.attr('disabled', 'disabled');

                if(submitButton.length){
                    submitButton.prop('disabled', false).click();
                }
                else{
                    submitButton = $('<button type="submit"></button>');

                //  append to parent
                    parent.append(submitButton);
                    submitButton.hide().prop('disabled', false).click().remove();
                }
            }

            return false;
        });
    }

    // google visitor
    $.googleVisitor = function( options ){
        var settings = $.extend({
            obj: '.overview-traffic',
        }, options );

        if($(settings.obj).length > 0){
            var self = $(settings.obj);
            var data_source = self.data('source');

            var period_date = self.data('date');
            var before_period_date = self.data('before-date');

            $.ajax({
              type: "POST",
              url: '/backprocess/settings/googleID/visitor',
              dataType: 'json',
              success: function(result) {
                var google_client_id  = $.checkUndefined(result.google_client_id, false);  

                if(google_client_id != ''){
                    $.googleVisitorProcess(result, data_source, period_date, before_period_date);
                }
              }
            });

            $.googleVisitorProcess = function(result, source, period_date, before_period_date){

                (function(w,d,s,g,js,fjs){
                    g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(cb){this.q.push(cb)}};
                    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
                    js.src='https://apis.google.com/js/platform.js';
                    fjs.parentNode.insertBefore(js,fjs);js.onload=function(){g.load('analytics')};
                }(window,document,'script'));

                gapi.analytics.ready(function() {
                    var google_id = $.checkUndefined(result.google_client_id, false);
                    var view_analytic_id = $.checkUndefined(result.view_analytic_id, false);

                    var periode_from = $.checkUndefined(period_date.periode_date_from, false);
                    var periode_to = $.checkUndefined(period_date.periode_date_to, false);

                    var before_periode_from = $.checkUndefined(before_period_date.periode_date_from, false);
                    var before_periode_to = $.checkUndefined(before_period_date.periode_date_to, false);

                    $.isuthorization = function(){
                        gapi.analytics.auth.on('needsAuthorization', function() {
                            $.checkSignOut();
                        });
                    }

                    $.checkSignOut = function(){
                        $('#signout').hide();
                        $('.overview-traffic .report-wrapper').addClass('has-none');
                    }

                    gapi.analytics.auth.authorize({
                        container: 'auth-button',
                        clientid: google_id,
                    }, function(response){
                        console.log(response);
                    });

                    $.isuthorization();

                    $('#signout').on('click', function(event) {
                        gapi.analytics.auth.signOut();
                        $.checkSignOut();
                    });

                    gapi.analytics.auth.on('signIn', function() {
                        $('.overview-traffic .report-wrapper').removeClass('has-none');
                        $('#signout').show();
                    });

                    var viewSelector = new gapi.analytics.ViewSelector({
                        container: 'view-selector'
                    });

                    if(source == 'overview') {
                        // session
                        var sessions = new gapi.analytics.googleCharts.DataChart({
                            reportType: 'ga',
                            query: {
                              'dimensions': 'ga:date',
                              'metrics': 'ga:sessions',
                              'start-date': periode_from,
                              'end-date': periode_to,
                            },
                            chart: {
                              type: 'LINE',
                              container: 'sessions',
                            }
                        });
                        var before_session = new gapi.analytics.googleCharts.DataChart({
                            reportType: 'ga',
                            query: {
                              'dimensions': 'ga:date',
                              'metrics': 'ga:sessions',
                              'start-date': before_periode_from,
                              'end-date': before_periode_to,
                            },
                            chart: {
                              type: 'LINE',
                              container: 'before_sessions',
                            }
                        })
                        // end session

                        // bounces 
                        var bounceRates = new gapi.analytics.googleCharts.DataChart({
                            reportType: 'ga',
                            query: {
                              'dimensions': 'ga:sessionDurationBucket',
                              'metrics': 'ga:bounceRate',
                              'start-date': periode_from,
                              'end-date': periode_to,
                            },
                            chart: {
                              type: 'LINE',
                              container: 'bouncesRate',
                            }
                        });
                        var beforeBounceRates = new gapi.analytics.googleCharts.DataChart({
                            reportType: 'ga',
                            query: {
                              'dimensions': 'ga:sessionDurationBucket',
                              'metrics': 'ga:bounceRate',
                              'start-date': before_periode_from,
                              'end-date': before_periode_to,
                            },
                            chart: {
                              type: 'LINE',
                              container: 'beforeBounces',
                            }
                        });
                        var bounces = new gapi.analytics.googleCharts.DataChart({
                            reportType: 'ga',
                            query: {
                              'dimensions': 'ga:date',
                              'metrics': 'ga:bounces',
                              'start-date': periode_from,
                              'end-date': periode_to,
                            },
                            chart: {
                              type: 'LINE',
                              container: 'bounces',
                            }
                        });

                        gapi.analytics.auth.on('success', function(response) {
                            viewSelector.execute();
                        });

                        viewSelector.on('change', function(ids) {
                            var newIds = {
                                query: {
                                    ids: 'ga:' + view_analytic_id
                                }
                            }

                            // session
                            var id_current_session = '#count-session';
                            var id_before_session = '#count-before-session';

                            sessions.set(newIds).execute();
                            sessions.on('success', function(response){
                                var current = response.response.totalsForAllResults['ga:sessions'];
                                var current_count = $.formatNumber(current, 0);
                                $(id_current_session).html(current_count);

                                before_session.set(newIds).execute();
                                before_session.on('success', function(response){
                                    var before = response.response.totalsForAllResults['ga:sessions'];
                                    $(id_before_session).html(before);

                                    // calculate
                                    $.calculateMarginVisitor(current, before);
                                });

                            });

                            // bounces
                            var id_current_bounce = '#count-bounces';
                            var id_before_bounces = '#count-before-bounces';

                            bounceRates.set(newIds).execute();
                            bounceRates.on('success', function(response){
                                var count = response.response.totalsForAllResults['ga:bounceRate'];

                                beforeBounceRates.set(newIds).execute();
                                beforeBounceRates.on('success', function(response){
                                    var count_before = response.response.totalsForAllResults['ga:bounceRate'];
                                    
                                    $(id_before_bounces).html(count_before);

                                    // calculate
                                    $.calculateMarginBounces(count, count_before);
                                });
                            });
                            
                            bounces.set(newIds).execute();
                            bounces.on('success', function(response){
                            }); 

                            $.calculateMarginBounces = function(current, before){
                                var margin = current - before;

                                if(current < before){
                                    var arrow = 'arrow-down arrow-red';
                                } else {
                                    var arrow = 'arrow-up arrow-green';
                                }

                                result = (current / 100) * 100;
                                result = Math.abs(result.toFixed(2));
                                margin = Math.abs(margin.toFixed(2));

                                $(id_current_bounce).html(result+'%');
                                $('.value-bounce .indicator').addClass(arrow);
                                $('.value-bounce .percent').html(margin+'%');
                            }

                            $.calculateMarginVisitor = function(current, before){
                                var margin = current - before;

                                if(margin < 0){
                                    var arrow = 'arrow-down arrow-red';
                                } else {
                                    var arrow = 'arrow-up arrow-green';
                                }

                                result = (margin / before) * 100;
                                result = Math.abs(result.toFixed(2));

                                $('.value-session .indicator').addClass(arrow);
                                $('.value-session .percent').html(result+'%');
                            }
                        });
                    } else if(source == 'overview-detail') {   
                        // sessions
                        var mainChart = new gapi.analytics.googleCharts.DataChart({
                            query: {
                                'dimensions': 'ga:browser',
                                'metrics': 'ga:sessions',
                                'sort': '-ga:sessions',
                                'max-results': '10',
                                'start-date': periode_from,
                                'end-date': periode_to,
                            },
                            chart: {
                                type: 'TABLE',
                                container: 'main-chart-container',
                                options: {
                                    width: '100%'
                                }
                            }
                        });  

                        var breakdownChart = new gapi.analytics.googleCharts.DataChart({
                            query: {
                                'dimensions': 'ga:date',
                                'metrics': 'ga:sessions',
                                'start-date': periode_from,
                                'end-date': periode_to,
                            },
                            chart: {
                                type: 'LINE',
                                container: 'breakdown-chart-container',
                                options: {
                                    width: '100%'
                                }
                            }
                        });
                        // end sessions

                        // bounces rate
                        var mainChartBounce = new gapi.analytics.googleCharts.DataChart({
                            query: {
                                'dimensions': 'ga:browser',
                                'metrics': 'ga:bounces',
                                'sort': '-ga:bounces',
                                'max-results': '10',
                                'start-date': periode_from,
                                'end-date': periode_to,
                            },
                            chart: {
                                type: 'TABLE',
                                container: 'bounces-chart-container',
                                options: {
                                    width: '100%'
                                }
                            }
                        });

                        var breakdownChartBounces = new gapi.analytics.googleCharts.DataChart({
                            query: {
                                'dimensions': 'ga:date',
                                'metrics': 'ga:bounces',
                                'start-date': periode_from,
                                'end-date': periode_to,
                            },
                            chart: {
                                type: 'LINE',
                                container: 'bounces-breakdown-chart-container',
                                options: {
                                    width: '100%'
                                }
                            }
                        });
                        // end bounces rate

                        var mainChartRowClickListener;
                        var bounceMainChartRowClickListener;

                        gapi.analytics.auth.on('success', function(response) {
                            viewSelector.execute();
                        });
                        viewSelector.on('change', function(ids) {
                            var options = {
                                query: {
                                    ids: 'ga:' + view_analytic_id
                                }
                            }

                            // session set listener
                            if (mainChartRowClickListener) {
                              google.visualization.events.removeListener(mainChartRowClickListener);
                            }

                            mainChart.set(options).execute();
                            breakdownChart.set(options);

                            if (breakdownChart.get().query.filters) breakdownChart.execute();
                            // end session set listener

                            // bounce set listener
                            if (bounceMainChartRowClickListener) {
                              google.visualization.events.removeListener(bounceMainChartRowClickListener);
                            }

                            mainChartBounce.set(options).execute();
                            breakdownChartBounces.set(options);

                            if (breakdownChartBounces.get().query.filters) breakdownChartBounces.execute();
                            // end bounce set listener
                        });

                        mainChartBounce.on('success', function(response) {
                            var chart = response.chart;
                            var dataTable = response.dataTable;

                            // Store a reference to this listener so it can be cleaned up later.
                            bounceMainChartRowClickListener = google.visualization.events
                                .addListener(chart, 'select', function(event) {

                                // When you unselect a row, the "select" event still fires
                                // but the selection is empty. Ignore that case.
                                if (!chart.getSelection().length) return;

                                var row =  chart.getSelection()[0].row;
                                var browser =  dataTable.getValue(row, 0);
                                var options = {
                                    query: {
                                        filters: 'ga:browser==' + browser
                                    },
                                    chart: {
                                        options: {
                                            title: browser
                                        }
                                    }
                                };

                                breakdownChartBounces.set(options).execute();
                            });
                        });

                        mainChart.on('success', function(response) {

                            var chart = response.chart;
                            var dataTable = response.dataTable;

                            // Store a reference to this listener so it can be cleaned up later.
                            mainChartRowClickListener = google.visualization.events
                                .addListener(chart, 'select', function(event) {

                                // When you unselect a row, the "select" event still fires
                                // but the selection is empty. Ignore that case.
                                if (!chart.getSelection().length) return;

                                var row =  chart.getSelection()[0].row;
                                var browser =  dataTable.getValue(row, 0);
                                var options = {
                                    query: {
                                        filters: 'ga:browser==' + browser
                                    },
                                    chart: {
                                        options: {
                                            title: browser
                                        }
                                    }
                                };

                                breakdownChart.set(options).execute();
                            });
                        });
                    } else if(source == 'overview-compare') {
                        // gapi.analytics.auth.on('success', function(response) {
                        //     viewSelector.execute();
                        // });

                        // viewSelector.on('viewChange', function(ids) {
                        //     var options = {
                        //         ids: 'ga:' + view_analytic_id
                        //     }

                        //     renderChart(options.ids);
                        // });

                    }

                    function renderChart(ids) {
                        console.log(ids);
                    } 
                });
            }
        }
    }
    // end google visitor

    // google Calendar action
    $.triggerGoogle = function( options ){
        var settings = $.extend({
            obj: '.trigger-google-calendar',
        }, options );

        if($(settings.obj).length > 0){
            var self = $(settings.obj);
            var json = $.checkUndefined(self.data('form'), false);
            var url_referer = $.checkUndefined(self.data('referer'), false);

            var document_id = $.checkUndefined(json.document_id, false);
            var key_id = $.checkUndefined(json.key_id, false);
            var model = $.checkUndefined(json.model, false);

            $.googleCal('doAction', json, key_id, document_id, model, url_referer);
        }
    }
    // end google calendar

    $.googleAction = function(json){
        if(json != ''){
            var model = $.checkUndefined(json.model, false);
            var key_id = $.checkUndefined(json.key_id, false);
            var document_id = $.checkUndefined(json.document_id, false);
            var url_referer = $.checkUndefined(json.url_referer, false);

            $.googleCal('doAction', json, key_id, document_id, model, url_referer);
        }
    }

    $.callBack = function (action){
        if(action == 'google-cal'){
            $.googleCal();
        }
    }

    $.directAjaxLink = function( options ) {
        var settings = $.extend({
            obj: $('.ajax-link'),
            url: null,
            callback : null
        }, options );

        var valObj = settings.obj.val();
        var urlDefault = settings.obj.attr('href');
        var url = $.checkUndefined(settings.obj.attr('data-url'), urlDefault);
        var url_form = $.checkUndefined(settings.obj.attr('data-url-form'), false);

        if( settings.url != null ) {
            url = settings.url;
        }

        var parents = settings.obj.parents('.ajax-parent');
        var type = settings.obj.attr('data-type');
        var flag_alert = settings.obj.attr('data-alert');
        var data_ajax_type = settings.obj.attr('data-ajax-type');
        var data_wrapper_write = settings.obj.attr('data-wrapper-write');
        var data_wrapper_write_page = $.checkUndefined(settings.obj.attr('data-wrapper-write-page'), false);
        var data_wrapper_load = $.checkUndefined(settings.obj.attr('data-wrapper-load'), '.table-responsive .table tbody');
        var data_loader_icon = $.checkUndefined(settings.obj.attr('data-loader-icon'), '.table-responsive .filter-footer');
        var data_page_eval = $.checkUndefined(settings.obj.attr('data-page-eval'), false);
        var data_action = settings.obj.attr('data-action');
        var data_pushstate = settings.obj.attr('data-pushstate');
        var data_url_pushstate = settings.obj.attr('data-url-pushstate');
        var data_form = settings.obj.attr('data-form');
        var data_scroll = settings.obj.attr('data-scroll');
        var data_scroll_success = $.checkUndefined(settings.obj.attr('data-scroll-success'), null);
        var data_scroll_top = $.convertNumber(settings.obj.attr('data-scroll-top'));
        var data_scroll_time = $.convertNumber(settings.obj.attr('data-scroll-time'), 'int', 2000);
        var data_use_current = settings.obj.attr('data-use-current-value');
        var data_remove = $.checkUndefined(settings.obj.attr('data-remove'), false);
        var data_hide = $.checkUndefined(settings.obj.attr('data-hide'), false);
        var data_focus = $.checkUndefined(settings.obj.attr('data-on-focus'), false);
        var data_location = $.checkUndefined(settings.obj.attr('data-location'), false);
        var data_field_change = $.checkUndefined(settings.obj.attr('data-field-change'), false);
        var data_loadingbar = $.checkUndefined(settings.obj.attr('data-loadingbar'), 'true');
        var data_abort = $.checkUndefined(settings.obj.attr('data-abort'), false);
        var data_click = $.checkUndefined(settings.obj.attr('data-on-click'), null);
        var data_reload = $.checkUndefined(settings.obj.attr('data-reload'), null);
        var data_modal_source = $.checkUndefined(settings.obj.attr('data-modal-source'), null);
        var data_close_ajax = $.checkUndefined(settings.obj.attr('data-close-ajax'), null);
        var data_trigger_click = $.checkUndefined(settings.obj.attr('data-trigger-click'), null);
        var data_trigger_change = $.checkUndefined(settings.obj.attr('data-trigger-change'), null);
        var data_show_xhr_target = $.checkUndefined(settings.obj.attr('data-show-xhr-target'), null);
        var data_rebuild_svg = $.checkUndefined(settings.obj.attr('data-rebuild-svg'), null);
        var data_target_rebuild_svg = $.checkUndefined(settings.obj.attr('data-target-rebuild-svg'), null);
        var data_show_loading_bar = $.checkUndefined(settings.obj.attr('data-show-loading-bar'), null);
        var data_fade_out = $.checkUndefined(settings.obj.attr('data-fade-out'), null);
        var data_calendar_chart = $.checkUndefined(settings.obj.attr('data-calendar-chart'), null);
        var data_reload_chart = $.checkUndefined(settings.obj.attr('data-reload-chart'), null);
        var method = $.checkUndefined(settings.obj.attr('data-method'), 'get');

        // loader
        var data_warpper_loader = $.checkUndefined(settings.obj.attr('data-warpper-loader'), false)

        var data_change_value_support_from = $.checkUndefined(settings.obj.attr('data-change-value-support-from'), null);
        var data_change_value_support_to = $.checkUndefined(settings.obj.attr('data-change-value-support-to'), null);

        var data_replace = true;
        if(settings.obj.hasAttr('data-replace')){
            data_replace = settings.obj.data('replace');
            data_replace = typeof data_replace == 'string' ? eval(data_replace) : data_replace;
        }

        if(data_field_change.length > 0){
            var data_field = data_field_change.split(' ');    
        }
        
        var formData = false; 

        if( flag_alert != null ) {
            if ( !confirm(flag_alert) ) { 
                return false;
            }

        //  tambahan untuk fly-button-media (delete button)
            if(settings.obj.hasClass('fly-button-media')){
                settings.obj.hide();
            }
        }

        if(typeof data_ajax_type == 'undefined' ) {
            data_ajax_type = 'html';
        }

        if(typeof data_wrapper_write == 'undefined' ) {
            data_wrapper_write = '#wrapper-write';
        }

        if(typeof data_pushstate == 'undefined' ) {
            data_pushstate = false;
        }

        if(typeof data_url_pushstate == 'undefined' ) {
            data_url_pushstate = url;
        }

        if(typeof data_form != 'undefined' ) {
            var formData = $(data_form).serialize(); 

            if( url_form == 'true' ) {
                url = $(data_form).attr('action');
            }
        }

        if(typeof type == 'undefined' ) {
            type = 'content';
        }

        if(data_use_current){
            val = settings.obj.val();
            url += '?'+data_use_current+'='+val;

            data_user_select_attibute = $.checkUndefined(settings.obj.attr('data-user-select-attibute'), false);

            if(data_user_select_attibute != false){
                data_user_current_attibute = $.checkUndefined(settings.obj.attr('data-user-current-attibute'), false);
                selected = settings.obj.find('option:selected').attr(data_user_select_attibute);

                if(url && data_user_current_attibute){
                    url += "&"+data_user_current_attibute+'='+selected;
                }
            }
        }

        if( data_abort == 'true' && loadJXHR ){
            loadJXHR.abort();
        }

        var last_progress = 0;

        if(url != 'javascript:void(0)'){
            loadJXHR = $.ajax({
                url: url,
                type: method,
                dataType: data_ajax_type,
                data: formData,
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    if(data_show_xhr_target != null){
                        //Download progress
                        if (data_show_xhr_target == 'pageRenderRound' && typeof pageRenderRound === "function"){
                            pageRenderRound($(data_wrapper_write), 0, false);
                        }

                        xhr.addEventListener("progress", function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total;
                                
                                if (data_show_xhr_target == 'pageRenderRound' && typeof pageRenderRound === "function"){
                                    var count_progress = Math.round(percentComplete * 100);

                                    if(count_progress < 100){
                                        last_progress = count_progress;

                                        pageRenderRound($(data_wrapper_write), last_progress, false);
                                    }
                                }
                            }
                        }, false);
                    }

                    return xhr;
                },
                beforeSend  : function() {
                    $.loadingbar_progress('beforeSend', data_loadingbar, data_warpper_loader, data_wrapper_load, data_loader_icon);
                    if(data_show_loading_bar != null || data_show_loading_bar == 'true'){
                        $(data_wrapper_write).addClass('ajax-loading');
                        $(data_wrapper_write).find('.ajax-loading').removeClass('ajax-loading');
                    }

                    if( data_fade_out != false ) {
                        $(data_fade_out).fadeOut();
                    }
                },
                success: function(result) {   
                    // show table
                    $(data_wrapper_load).show();
				    //	menu fix ======================================================================================

					var sidebar		= $('.sidebar');
					var openedMenu	= sidebar.find('.expanded-bar ul.its-opened');
					var openedID	= openedMenu.attr('id');

				    //	===============================================================================================

					$.callBack(settings.callback);

					if(data_show_loading_bar != null || data_show_loading_bar == 'true'){
                        $(data_wrapper_write).removeClass('ajax-loading');
                    }

					var status	= '';//result.status;
					var msg		= '';//result.msg;

                    if( type == 'content' ) {
                        var contentHtml = $(result).filter(data_wrapper_write).html();
                        var hid_pushstate_url = $.checkUndefined($(result).find('#hid-pushstate-url').val(), data_url_pushstate);
                        var google_crm = $.checkUndefined($(result).find('.google-cal-crm'), false);
                        var json = $.checkUndefined(google_crm.data('form'), false);

                        // json google calendar
                        if(json != ''){
                            if(json.length > 0){
                                $.each(json, function(key, val){
                                    $.googleAction(val);
                                });
                            } else {
                                $.googleAction(json);
                            }
                        }
                        // end json google calendar

                        if( data_pushstate != false ) {
                            window.history.pushState('data', '', hid_pushstate_url);
                        }

                        if(typeof contentHtml == 'undefined' ) { 
                            contentHtml = $(result).find(data_wrapper_write).html();
                        }

                        if( data_field_change != false ) {
                            if(data_field.length > 0){
                                var i;
                                for (i = 0; i < data_field.length; ++i) {
                                    fieldChange = $(result).find(data_field[i]).val();
                                    data_field[i] = $.checkUndefined(data_field[i], false);

                                    if( data_field[i] == '.save-path'){
                                        var save_path = fieldChange;
                                    }

                                    if(data_field[i] == '.document-imb'){
                                        var split = fieldChange.split('.');
                                        $('.upload-imb').attr('disabled', false);

                                        if(fieldChange != ''){
                                            $('.show-imb').show();
                                            $('.preview-img').remove();
                                            if(split[1] == 'pdf'){
                                                $(data_field[i]).attr('src', "/img/pdf.png");
                                            }else{
                                                $(data_field[i]).attr('src', "/img/view/"+save_path+"/m"+fieldChange);
                                            } 
                                        }
                                    }else{
                                        $(data_field[i]).val(fieldChange);
                                    }
                                }
                            }
                        }

                        if(typeof data_scroll != 'undefined' && data_scroll != 'false' ) {
                            var theOffset = $(data_scroll).offset();
                            $('html, body').animate({
                                scrollTop: theOffset.top + data_scroll_top,
                            }, data_scroll_time);
                        }

                        if( data_remove != false ) {
                            $(data_remove).remove();
                        }
                        if( data_hide != false ) {
                            $(data_hide).hide();
                        }

                        if( data_page_eval == 'true' && data_wrapper_write_page != false ) {
                            data_wrapper_write_page = eval(data_wrapper_write_page);
                        }

                        if( $.isArray(data_wrapper_write_page) ) {
                            $.each( data_wrapper_write_page, function( i, val ) {
                                targetWrapper = $.checkUndefined(val[0]);
                                targetType = $.checkUndefined(val[1], 'html');
                                var contentPage = $.checkUndefined($(result).filter(targetWrapper).html(), null);

                                if( contentPage == null ) {
                                    contentPage = $.checkUndefined($(result).find(targetWrapper).html(), null);
                                }

                                if( $(targetWrapper).length > 0 && contentPage != null ) {
                                    switch(targetType) {
                                        case 'append':
                                            $(targetWrapper).append(contentPage);
                                        break;
                                        case 'html':
                                            $(targetWrapper).html(contentPage);
                                        break;
                                    }

                                    $.rebuildFunctionAjax( $(targetWrapper) );
                                }
                            });
                        } else {
                            if( data_wrapper_write_page != false ) {
                                var data_wrapper_arr = data_wrapper_write_page.split(',');

                                $.each(data_wrapper_arr, function(index, identifier){
                                    var targetWrapper = $.trim(identifier);
                                    var contentPage = $(result).filter(targetWrapper).html();

                                    if( typeof contentPage == 'undefined' ) {
                                        contentPage = $(result).find(targetWrapper).html();
                                    }

                                    if( $(targetWrapper).length > 0 ) {
                                        var isReplace = true;

                                        if(typeof data_replace == 'boolean'){
                                            isReplace = data_replace;
                                        }
                                        else if(typeof data_replace == 'object'){
                                            var skip = false;
                                            $.each(data_replace, function(key, val){
                                                if(skip == false && typeof val[identifier] != 'undefined'){
                                                    isReplace   = val[identifier];
                                                    skip        = true;
                                                }
                                            });
                                        }

                                        if(isReplace){
                                            $(targetWrapper).html(contentPage);
                                        }
                                        else{
                                            $(targetWrapper).append(contentPage);
                                        }

                                        $.rebuildFunctionAjax( $(targetWrapper) );
                                    }
                                });

                                $.rebuildFunction();
                                // $.rebuildDelegate();
                                
                                if( data_location == 'true' || data_action == 'input-file' ) {
                                    $.generateLocation();
                                }
                            } else if( $(data_wrapper_write).length > 0 ) {
                                if(data_show_xhr_target == 'pageRenderRound'){
                                    var this_booking_out = $('.booking-content');
                                    var remain_progress = 100 - last_progress ;

                                    setTimeout(function() {
                                        // setTimeout(function() {
                                            var last_plug_progress = 0;

                                            $(data_wrapper_write).html(contentHtml).waitForImages(function() {
                                                this_booking_out.addClass('animate-out');

                                                if(last_progress < 100){
                                                    pageRenderRound($(data_wrapper_write), 100, true);
                                                }

                                                setTimeout(function() {
                                                    $(data_wrapper_write).show();

                                                    this_booking_out.removeClass('animate-out');

                                                    $.rebuildFunctionAjax( $(data_wrapper_write) );
                                                    $.rebuildFunction();

                                                    $.copy_atrribute();

                                                    this_booking_out.addClass('animate-in');
                                                    $('.temp-base-bg').html('');

                                                    setTimeout(function() {
                                                        this_booking_out.removeClass('animate-in');
                                                    }, 400)
                                                }, 800)
                                            }).progress(function(loaded, count, success) {
                                                var count_last_progress = remain_progress * (loaded / count);
                                                last_progress = last_progress + parseInt(count_last_progress);
                                                
                                                if(last_progress >= 99){
                                                    last_progress = 99;
                                                }

                                                pageRenderRound($(data_wrapper_write), last_progress, true);
                                            });
                                        // }, 500)
                                    }, 600)
                                }else{
                                    $(data_wrapper_write).html(contentHtml);

                                    var include_target = $.checkUndefined($(result).find('.include-target'), '');

                                    if(include_target != ''){
                                        $('body').find('.include-target').each(function(index, element){
                                            var self_target = $(this);
                                            var include_target_content = self_target.data('include-target');

                                            var content_target = self_target.find(include_target_content).html();
                                            
                                            self_target.remove();

                                            $(include_target_content).html(content_target);
                                        });
                                    }

                                    $.rebuildFunctionAjax( $(data_wrapper_write) );
                                    $.rebuildFunction();
                                }

                                if(data_rebuild_svg != null && data_target_rebuild_svg != null){
                                    $(data_target_rebuild_svg).addClass('hide');

                                    $(data_rebuild_svg).each(function(index, element){
                                        var svgnumber = $(this).data('svgnumber');

                                        $(data_target_rebuild_svg+'[data-svgnumber= ' + svgnumber + ']').removeClass('hide');
                                    });
                                }

                                if( data_location == 'true' || data_action == 'input-file' ) {
                                    $.generateLocation();
                                }

                                if(data_action == 'input-file' ) {
                                    $.handle_input_file();
                                    $.option_image_ebrosur();
                                    $.updateLiveBanner('trigger-handle-agent-ebrosur', 'onload');
                                    $.limit_word_package();
                                    $.limit_word_package({
                                        obj: $('.desc-info-cls'),
                                        objCounter: $('.limit-character2'),
                                        objBody: false
                                    });
                                }
                            }
                        }

                        if(data_focus != false && $(data_focus).length > 0){
                            $(data_focus).focus();
                        }

                        if( data_click != null ) {
                            if( data_click.indexOf('[[') >= 0 ) {
                                var dataClickArr = eval(data_click);

                                if( $.isArray(dataClickArr) ) {
                                    $.each( dataClickArr, function( i, val ) {
                                        targetWrapper = $.checkUndefined(val[0], null);
                                        targetClick = $.checkUndefined(val[1], null);

                                        var targetFound = $.checkUndefined($(result).filter(targetWrapper).html(), null);

                                        if( targetFound == null ) {
                                            targetFound = $.checkUndefined($(result).find(targetWrapper).html(), null);
                                        }

                                        if( targetFound != null ) {
                                            $(targetClick).trigger('click');
                                        }
                                    });
                                }
                            } else if( $(data_click).length > 0 ) {
                                $(data_click).trigger('click');
                            }
                        }

                        if( data_reload == 'true' ) {
                            window.location.reload();
                        }

                        if( data_modal_source != null ) {
                            $('#myModal').attr('class', 'modal modal-body '+data_modal_source);
                        }

                        if( data_close_ajax != null ) {
                            $('#myModal').modal('hide');
                            $('#myModal').on('hidden.bs.modal', function () {
                                if( $(data_close_ajax).length > 0 ) {
                                    $.directAjaxLink({
                                        obj: $(data_close_ajax),
                                    });
                                }
                            });
                        }

                        if(data_trigger_click != null){
                            $(data_trigger_click).trigger('click');
                        }

                        if(data_trigger_change != null){
                            $(data_trigger_change).trigger('change');
                        }

                        if( data_calendar_chart != null ) {
                            var calendar_chart = $(data_calendar_chart).val();

                            if( calendar_chart != settings.obj.val() ) {
                                $(data_calendar_chart).val(settings.obj.val());
                                $(data_calendar_chart).trigger('keyup');
                            }
                        }

                        if(data_change_value_support_from != null && data_change_value_support_to != null){
                            if($(data_change_value_support_from).length > 0 && $(data_change_value_support_to).length > 0){
                                var from_val = $(data_change_value_support_from).val();

                                $(data_change_value_support_to).val(from_val);
                            }
                        }
                    }
                    else if(type == 'json'){

                    }

                    $('.error-full.alert').remove();
                    $.delayRemoveAlert();
                    $.highlightOverlyOn(settings.obj);

				    //	menu fix ======================================================================================

					if(openedMenu.length && typeof openedID != 'undefined'){
						sidebar.find('ul#' + openedID).addClass('its-opened').siblings().removeClass('its-opened');
					}
					else{
						sidebar.removeClass('open its-expand');
					}

					if(typeof hoverSideBar == 'function'){
						hoverSideBar();
					}

				    //	===============================================================================================

                    return false;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');
                    return false;
                }
            }).always(function() {
                $.loadingbar_progress('always', data_loadingbar);
            }).done(function(data){

                if(data_reload_chart != null){
                    $.formatDateChart(settings.obj, valObj);

                    var obj_chart = $(data_wrapper_write).find('.reload[data-load="infinity"]');
                    _callGenerateChart(obj_chart, 1, true);
                }
            });
        }
    }

    $.ajaxModal = function(options){
        var settings = $.extend({
            obj: $('.ajaxModal'),
            objId: '#myModal',
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.off('click');
            settings.obj.click(function(msg) {
                var self = $(this);
                var data_reload = self.attr('data-close');
                var data_close_click = $.checkUndefined(self.attr('data-close-click'), null);
                var data_source = $.checkUndefined(self.attr('data-source'), 'media');
                var data_obj = $.checkUndefined(self.attr('data-obj'), settings.objId);
                $('#myModal').attr('class', 'modal modal-body '+data_source);

                $.directAjaxModal({
                    obj: self,
                    objId: $(data_obj),
                });

                if( data_reload == 'reload' ) {
                    $(data_obj).on('hidden.bs.modal', function () {
                        window.location.reload();
                    });
                }
                if( data_close_click != null ) {
                    $(data_obj).on('hidden.bs.modal', function () {
                        $.directAjaxLink({
                            obj: $(data_close_click),
                        });
                    });
                }

                $(data_obj).on('hide.bs.modal', function (e) {
                    $(data_obj).html('');
                });

                return false;
            });

            $('.close-modal').off('click').click(function(event){
            	var objModal = $(this).closest('.modal');

            	if(objModal.length){
            		return objModal.modal('hide');
            	}
            });

		//	$('#myModal .close-modal').off('click');
		//	$('#myModal .close-modal').click(function(){
		//		$('#myModal').modal('hide');
		//		return false;
		//	});
        }
    }

    $.directAjaxModal = function(options){
        var settings = $.extend({
            obj: $('.ajaxModal'),
            objId: $('#myModal'),
        }, options );

        var vthis = $(settings.obj);

        if(typeof vthis == 'object' && vthis.length){
			var objModal = $(settings.objId);

			if(typeof objModal == 'object' && objModal.length){
			//	reset content
				objModal.find('.modal-body').html('');

				var url = vthis.attr('href');
                var alert_msg = vthis.attr('alert');
				var method = $.checkUndefined(vthis.attr('data-method'), 'POST');
				var data_form = $.checkUndefined(vthis.attr('data-form'), 'true');

				if( alert_msg != null ) {
					if( !confirm(alert_msg) ) {
						return false;
					}
				}

				var params_form = false;
				var dataRequest = false;

				if( data_form == 'true' && $('.form-target').length ) {
		            params_form = [];

		            $.each($('.form-target').serializeArray(), function(index) {
		                var cur = this;
		                if( cur.name != '_method' && cur.name.indexOf('checkbox_all') == -1 ) {
		                    params_form.push(cur);
		                }
		            });

		            dataRequest = { 'params' : params_form };
		        }

		        var ext = url.toString().split('.').pop();

		        if( $.inArray(ext, ['jpg', 'jpeg', 'png', 'gif']) !== -1 ) {
		            objModal.addClass('popup-images');
		            objModal.html('\
		            <div class="modal-dialog">\
		                <div class="modal-content">\
		                    <img src="'+url+'">\
		                    <button type="button" class="close" data-dismiss="modal" aria-label="Tutup"><span class="prm-cross-2"></span> Tutup</button>\
		                </div>\
		            </div>');

		            objModal.modal({
		                show: true,
		                backdrop:true,
		                keyboard:true,
		            });
		        } else {
		            $.ajax({
		                url: url,
		                type: method,
		                data: dataRequest,
		                success: function(response, status) {
		                    objModal.html(response);
		                    objModal.modal({
		                        show: true,
		                        backdrop:true,
		                        keyboard:true,
		                    });

		                    $.rebuildFunctionAjax( objModal );
		                    $.rebuildFunction();
		                    $.highlightOverlyOn(vthis);

		                    return false;
		                },
		                error: function(XMLHttpRequest, textStatus, errorThrown) {
		                    alert('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');
		                    return false;
		                }
		            });
		        }
			}
        }
    }

    $.disabledSubmit = function( options ) {
        var settings = $.extend({
            obj: $('form'),
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.off('submit').submit(function(){
                var self = $(this);
                var button = self.find('button[type="submit"],button[type="button"]');
                var idAttr = self.attr('id');
                var autoDisable = true;

            //  For some browsers, `attr` is undefined; for others,
            //  `attr` is false.  Check for both.
                if(typeof self.attr('data-auto-disable') !== typeof undefined && self.attr('data-auto-disable') !== false){
                    autoDisable = self.attr('data-auto-disable');
                }

                if( idAttr != 'form-report' && (autoDisable === true || autoDisable === 'true') ) {
                    button.attr('disabled', true);
                }
            });
        }
    }

    $.convertNumber = function(num, type, empty){
        if( typeof empty == 'undefined' ) {
            empty = 0;
        }

        if( typeof num != 'undefined' ){
            num = num.toString();
            num = num.replace(/,/gi, "").replace(/ /gi, "").replace(/IDR/gi, "").replace(/Rp/gi, "");

            if( typeof type == 'undefined' ) {
                type = 'int';
            }

            if( type == 'int' ) {
                num = num*1;
            } else if( type == 'float' ) {
                num = parseFloat(num);
            }

            if( type == 'int' || type == 'float' ) {
                if( isNaN(num) ) {
                    num = 0;
                }
            }
        } else {
            num = empty;
        }

        return num;
    }

    $.rebuildFunction = function(objWrapper){
        var ajaxLinkOpts = {};

        if(objWrapper){
        //  untuk iframe, objWrapper yang dipassing $('#sample-iframe').contents()
            ajaxLinkOpts = $.extend({
                obj             : $(objWrapper).find('.ajax-link'),
                objChange       : $(objWrapper).find('.ajax-change,.form-table-search table th select'),
                objBlur         : $(objWrapper).find('.ajax-blur'),
                objKeyup        : $(objWrapper).find('.ajax-keyup,.form-table-search table th input,.table-header .dropdown-group #sorted'),
                objAttribute    : $(objWrapper).find('.ajax-attribute'),
            }, ajaxLinkOpts);
        }

        var simplebars = $('[data-simplebar]');

        if(typeof $.fn.simplebar == 'function' && simplebars.length){
            simplebars.simplebar('recalculate').find('.simplebar-scroll-content');//.scrollTop(0);
        }

        $.postLink();
        $.nestable();
        $.menuCreatorList();
        $.listFilter();
        $.catcomplete();
        $.titleFilter();
        $.triggerSelectAll();
        $.selectAll();


        if(typeof $.owlCarousel == 'function'){
            $.owlCarousel({
                items           : 3, 
                loop            : true, 
                stagePadding    : 0, 
                margin          : 30, 
                lazyLoad        : true, 
                onInitialized   : function(event){
                var self            = $(event.target);
                var dotsContainer   = $(self.data('dots-container'));
                    var bullets = dotsContainer.find('.owl-dot');
                    if(bullets.length){
                        bullets.css({
                            'width' : (97.5 / bullets.length) + '%', 
                        });
                    }
                }, 
            });
        }

        $.colorPicker();
    //  $.disabledSubmit();
        $.ajaxLink(ajaxLinkOpts);
        $.ajaxModal();
        $.datePicker();
        $.daterangepicker();
        $.closePopover();

        if( $('.ajax-form').length > 0 ) {
            $('.ajax-form').off('submit');
            $.ajaxForm();
        }

        $.inputNumber();
        $.inputPrice();
        $.inputUrl();
        // $.hiddenTextFile();
        $.callPreloader();

        $.directModal();
        $.ajaxRenderSubject();
        $.callChoosen();

        $('.trigger-to-write a').off('click');
        $('.trigger-to-write a').click(function(a) {
            a.preventDefault();
            $('.foot-chat').addClass('got-trigger');
        });

        $('.trigger-custom-overflow').click(function(a) {
            a.preventDefault();
            $('.modal-body').addClass('overflow-auto');
        });

        if($('[data-toggle="popover"]').length > 0){
            $('[data-toggle="popover"]').popover();
        }

        if($('.func-type-plan').length > 0){
            $.func_type_plan();
        }

        $.tooltipBar();
        $.triggerEvent();

        $.copy_atrribute();
        $.filterInput();

        $.lazyLoad();
        $.modalSlideAnchor();
        $.popupWindow();
        $.autoSearch();
        $.highlightOverly();
        $.validate_input_number();
        $.select_dropdown();
        $.show_less_description();
        $.copyClipboard();
        $.rangeSlider();
        $.pickAll();
        $.triggerChangeCurrency();

        $.delayRemoveAlert();
        $.inputCounter();
        $.paymentDetail();
        $.paymentChannelHandler();
        $.voucherHandler();
        $.screenShot();
        $.input_to_calculate();

        $.box_up();
		$.lightzoom();
        $.deleteConfirm();
        $.chooseTipeSubject();
        $.getLabelNotice();
        $.pickPeriodeType();
        $.pickStaffSubject();
        $.pickACL();
        $.showSchool();
        $.calendarAdd();
        $.filterJquery();
        $.getRelatedACL();

        // init draggble
        $.sortable();
        $.draggable({
            'connectWith' : '.grouping-grid-exist, .grouping-grid-master'
        });
        $.droppable();
        $.sameHeight();
    }

    $.getRelatedACL = function(){
        if($('.get-related-acl').length > 0){
            $('.get-related-acl').change(function(){
                var self = $(this);
                var value = $.checkUndefined(self.val(), false);
                if( value == 'post' || value == 'patch' || value == 'put'){
                    $('.show-acl').fadeIn();
                } else {
                    $('.show-acl').fadeOut();
                }
            })
        }
    }

    $.calendarAdd = function(){
        if($('.calendar-add').length > 0){
            $('.calendar-add').change(function(){
                var self = $(this);
                var val = self.val();

                switch(val){
                    case 'holiday':
                        $('.select-school, .range-time').fadeOut();
                        $('.box-school').fadeIn();
                    break;
                    case 'academic':
                        $('.select-school, .range-time').fadeIn();
                        $('.box-school').fadeOut();
                    break;
                    default:
                        $('.select-school, .range-time, .box-school').fadeOut();
                    break;
                }
            });
        }
    }

    $.filterJquery = function(){
        if($('.filter-Jquery').length > 0){
            $('.filter-Jquery').keyup(function(){
                var self = $(this);
                var filter_text = self.val();
                filter_text = filter_text.toLowerCase();

                if(filter_text.length > 3){
                    $.each($('.item-jquery'), function(i, val) {
                        name = $(val).attr('data-name');
                        name = name.toLowerCase();

                        var match = name.match(filter_text);

                        if(match == null){
                            $(val).hide();
                        }

                    });
                } else {
                    $('.item-jquery').show();
                }

            });
        }
    }

    $.showSchool = function(){
        if($('.show-school').length > 0){
            $('.show-school').change(function(){
                var self = $(this);
                var val = $.checkUndefined(self.val(), false);
                var data_target = self.attr('data-target');

                if(val != 'PARENT' && val != ''){
                    $(data_target).fadeIn();
                } else {
                    $(data_target).fadeOut();
                }
            });
        }
    }

    $.pickACL = function(){
        if($('.pick-acl').length > 0){
            $('.pick-acl').click(function(){
                var self = $(this);
                var is_checked = self.is(':checked');
                var url = self.attr('data-url');

                url += '?flag=' + is_checked

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: false,
                    success: function(response, status) {
                        return false;
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');
                        return false;
                    }
                });
            })
        }
    }

    $.pickStaffSubject = function(){
        if($('.pick-staff-subject').length > 0){
            $('.pick-staff-subject').click(function(){
                var self = $(this);
                var is_checked = self.is(':checked');
                var url = self.attr('data-url');
                var subject_class_id = self.attr('data-subject');

                url += '?flag='+is_checked+'&subject_class_id='+subject_class_id                

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: false,
                    success: function(response, status) {
                        return false;
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');
                        return false;
                    }
                });
            });
        }
    }

    $.pickPeriodeType = function(){
        if($('.pick-periode-type').length > 0){
            $('.pick-periode-type').change(function(){
                var self = $(this);
                var value = self.val();
                var data_target = self.attr('data-target');

                if(value == ""){
                    $(data_target).fadeOut();
                }  else {
                    $(data_target).fadeIn();
                }
            });
        }
    }
    
    $.getLabelNotice = function(){
        if($('.get-label-notice').length > 0){
            $('.get-label-notice').change(function(){
                var self = $(this);
                var value = self.val();
                var data_target = self.attr('data-target')

                $('.notice-import').fadeOut();

                if(value){
                    $(data_target).fadeIn();
                
                    switch(value){
                        case 'subject':
                            $('.subject-notice').fadeIn();
                            break;
                        case 'content':
                            $('.content-notice').fadeIn();
                            break;
                    }

                } else {
                    $(data_target).fadeOut();
                }
            });
        }
    }

    $.chooseTipeSubject = function(){
        if($('.choose-tipe-subject').length > 0){
            $('.choose-tipe-subject').change(function(){
                var self = $(this);
                var value = self.val();
                var data_target = self.attr('data-target');
                
                switch(value){
                    case 'local':
                        $(data_target).fadeIn();
                        break;
                    default:
                        $(data_target).fadeOut();
                        break
                }
            });
        }
    }

    $.deleteConfirm = function(){
        if($('a[data-confirm], input[type=submit][data-confirm]').length > 0){
            $('a[data-confirm], input[type=submit][data-confirm]').click(function(){
                var self = $(this);
                var msg = self.attr('data-confirm');

                if(!confirm(msg)){
                    return false;
                }
            });
        }
    }

    $.lightzoom = function(options){
    	if(typeof $.fn.lightzoom == 'function'){
    		var settings = $.extend({
                obj : $('img.lightzoom-thumbnail'), 
            }, options);

    		settings.obj = $(settings.obj);

    		if(settings.obj.length){
				settings.obj.lightzoom({
					zoomPower : 2,    //Default
					glassSize : 200,  //Default
				});
    		}
		}
    }

    $.masonry = function(options){
        if(typeof $.fn.masonry == 'function'){
            var settings = $.extend({
                obj : $('.masonry'), 
            }, options);

            if(typeof settings.obj == 'string'){
                settings.obj = $(settings.obj);
            }

            if(settings.obj.length){
                var itemSelector    = $.checkUndefined(settings.obj.attr('data-item-selector'));
                var columnWidth     = $.checkUndefined(settings.obj.attr('data-column-width'));
                var masonryOpts     = {
                    percentPosition : true, 
                };

                if(itemSelector != ''){
                    masonryOpts = $.extend({
                        itemSelector : itemSelector, 
                    }, masonryOpts);
                }

                if(columnWidth != ''){
                    masonryOpts = $.extend({
                        columnWidth : columnWidth, 
                    }, masonryOpts);
                }

                settings.obj.masonry(masonryOpts);
            }
        }
    }

    $.lazyLoad = function(options){
        if(typeof $.fn.lazyload == 'function'){
            var settings = $.extend({
                obj : $('.lazy-image, div.detail-article img')
            }, options);

            var lazyImages = $(settings.obj);

            if(lazyImages.length){
            //  var lazyThumb = 'https://placehold.it/350x250/F0F0F0';
                var lazyThumb = '';

                lazyImages.each(function(){
                    var self            = $(this);
                    var defaultThumb    = self.attr('src');

                    if(self.hasClass('lazy-image')){
                    //  assigned lazyload images
                        if(typeof defaultThumb == 'undefined' || defaultThumb == ''){
                            self.attr('src', lazyThumb);
                        }
                    }
                    else{
                    //  article detail images
                        self.attr({
                            'src'           : lazyThumb, 
                            'data-original' : defaultThumb,
                        });
                    }

                //  var indicators  = self.closest('ul.carousel-indicators');
                    var parent      = self.closest('li, div');

                    parent.addClass('lazy-wrapper');

                    self.lazyload({
                        threshold       : 200, 
                        skip_invisible  : false, 
                        effect          : 'fadeIn', 
                    }).on('load', function(){
                        if(self.hasClass('lazy-image') && self.hasAttr('data-original')){
                            self.removeClass('lazy-image');
                        }

                    //  remove loading class from wrapper
                        parent.removeClass('lazy-wrapper');

                    //  retrigger masonry
                        $.masonry();
                    }).on('appear', function(){
                        var tagName = self.prop('tagName');

                        if(tagName.toLowerCase() != 'img'){
                        //  remove loading class from wrapper
                            parent.removeClass('lazy-wrapper');
                        }
                    });
                });
            }
        }
    }

    $.modalSlideAnchor = function(options){
        var settings = $.extend({
            obj : $('.modal-slide-anchor'), 
        }, options);

        if(typeof settings.obj == 'string'){
            settings.obj = $(settings.obj);
        }

        if(settings.obj.length){
            settings.obj.on('click', function(evt){
                evt.preventDefault();

                var self        = $(this);
                var anchor      = self.attr('href').substr(1);
                var carousel    = $(self.attr('data-carousel'));

                if(carousel.length && anchor){
                    var indicator = carousel.find('ul.carousel-indicators li[data-anchor-gallery=' + anchor + ']');
                    if(indicator.length){
                        indicator.trigger('click');
                    }
                }
            });
        }
    }

    $.rebuildFunctionAjax = function( obj ) {
        $.callChoosen({
            obj: obj.find('[data-role="select-tag"]'),
        });
        obj.find("[data-simplebar-direction]").each(function() {
            $(this).simplebar();
        })
        $.fileupload({
            objFileupload: obj.find('#fileupload'),
            objFileuploadClass: obj.find('.fileupload'),
        });
        $.daterangepicker({
            obj: obj.find('.date-range'),
            objOffPast: obj.find('.date-range-off-past'),
            objReservation: obj.find('.date-reservation'),
            objSchedule: obj.find('.date-schedule'),
            objCalendar: obj.find('.date-range-calendar'),
            objCustom: obj.find('.date-range-custom'),
            objSingle: obj.find('.date-range-single'),
            objSingleTime: obj.find('.date-timerange-time-single'),
        });
        $.recalcBs({
            obj: obj.find('a[data-toggle="tab"]'),
        });
        $.datePicker();

        var simplebars = $('body').find('[data-simplebar],[data-simplebar-direction]');
		if(simplebars.length){
			simplebars.simplebar('recalculate');
		}

        if(obj.find('.handle-toggle').length){
            obj.find('.handle-toggle').trigger('init');
            
            if(obj.find('.handle-toggle:checked').length){
                obj.find('.handle-toggle:checked').trigger('init');
            }
        }

        if(typeof $.kprTableRender == 'function'){
            $.kprTableRender({
                obj : obj.find('table[data-role="kpr-table"]'),
            });
        }
        
        $.handle_download_box();
    }

    $.titleFilter = function(options){
        var settings = $.extend({
            obj: $('.title-filter'),
        }, options );

        if(settings.obj.length > 0){
            settings.obj.keyup(function(){
                var self = $(this);
                var maxLength = $.checkUndefined(self.attr('maxlength'), false);
                var data_target = $.checkUndefined(self.data('target'), false);
                var data_parent = $.checkUndefined(self.data('parent'), false);

                var val = self.val().length;
                var current = maxLength - val;

                if(data_parent){
                    var parent = self.parents(data_parent).find(data_target).html(current);
                }else{
                    $(data_target).html(current);
                }
            });
        }
    }
    
    $.callInterval = function(options){
        var settings = $.extend({
            obj: $('.call-interval'),
            init: false,
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.each(function(){
                var self = $(this);
                var interval = self.data('interval');
                var data_wrapper_write = self.data('wrapper-write');
                var trigger = $(data_wrapper_write).find(('.trigger-interval')).val();

                setInterval(function(){
                    if( trigger == 'true' ) {
                         $.directAjaxLink({
                            obj: self,
                        });
                     }
                }, interval);
            });
        }
    }

    $.rebuildDelegate = function() {
        $.handle_toggle();
        $.linkSubmitForm();
        $.rowAdded();
        $.dropDownMenu();
        $.checkAll();
        $.callChoosen();
        $.uploadGallery();
        $._callLabelCheckbox();
        $.recalcBs();
        // $.daterangepicker();
    }

    $.editor = function(options){
        var settings = $.extend({
            obj              : $('.editor'), 
            type            : null, 
            keyupTrigger    : false, 
            keyupDelay      : 0, 
        }, options);

        if(typeof settings.obj == 'string'){
            settings.obj = $(settings.obj);
        }

        if(settings.obj.length && typeof CKEDITOR != 'undefined'){
            var editorSettings = {
                'short' : {
                    removePlugins   : 'elementspath',
                    resize_enabled  : false,
                    height          : 500,
                    toolbar         : [
                        {
                            name    : 'styles',
                            items   : [ 'Format' ]
                        },
                        { 
                            name    : 'basicstyles',
                            groups  : [ 'basicstyles', 'cleanup', 'blocks' ],
                            items   : [ 'Bold', 'Italic', 'Underline', 'Blockquote', 'Link', 'Table' ]
                        },
                        {
                            name    : 'paragraph',
                            groups  : [ 'list', 'indent', 'blocks', 'align', 'bidi' ],
                            items   : [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-' ]
                        },
                        [ 'Undo', 'Redo' ],
                    ],
                    filebrowserImageBrowseUrl: window.ckeditorBrowseUrl + '&type=images',
                }, 
                'compact' : {
                    removePlugins   : 'elementspath',
                    resize_enabled  : false,
                    height          : 500,
                    toolbar         : [
                        { 
                            name    : 'basicstyles',
                            groups  : [ 'basicstyles', 'cleanup', 'blocks' ],
                            items   : [ 'Bold', 'Italic', 'Underline', ]
                        },
                        {
                            name    : 'paragraph',
                            groups  : [ 'align', ],
                            items   : [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', ]
                        },
                    ],
                    filebrowserImageBrowseUrl: window.ckeditorBrowseUrl + '&type=images',
                }
            };

            settings.obj.each(function(index, object){
                var self        = $(object);
                var selfID      = $.checkUndefined(self.attr('id'));
                var selfName    = $.checkUndefined(self.attr('name'));
                var dataWidth   = $.checkUndefined(self.data('width'), '100%');
                var dataHeight  = $.checkUndefined(self.data('height'), '100%');
                var dataType    = $.checkUndefined(self.data('type'));
                var options     = $.checkUndefined(editorSettings[dataType], {});

                options = $.extend(true, options, {
                    height  : dataHeight, 
                    width   : dataWidth, 
                });

            //  initialize
                self.ckeditor(options);

            //  bind change event
                if(selfID || selfName){

                    var instanceName = selfID ? selfID : selfName;
                    if(typeof CKEDITOR.instances[instanceName] != 'undefined'){
                    //  change event called on keyup, so blur is used instead
                        CKEDITOR.instances[instanceName].on('blur', function(){
                            self.trigger('change');
                        });

                        if(settings.keyupTrigger && isNaN(settings.keyupDelay) === false){
                            CKEDITOR.instances[instanceName].on('change', function(){
                                delay(function(){
                                    self.trigger('keyup');
                                }, settings.keyupDelay);
                            }); 
                        }
                    }
                }
            });

            if(typeof __setEditorConfig == 'function'){
                __setEditorConfig();
            }

            $('body').on('click', '.ckeditor-view', function(event){
                settings.obj.each(function(e){
                    CKEDITOR.instances[$(this).attr('id')].execCommand('source');
                });
            });
        }
    }

    function _callHandleToggle ( self, value, event ) {
        var match = $.checkUndefined(self.attr('data-match'));
        var resetTarget = $.checkUndefined(self.data('reset-target'), true);
        var targetDisabled = $.checkUndefined(self.data('target-disabled'), null);
        var result = false;
        match = eval(match);

        // if(value && $.isArray(match) ) {
        if($.isArray(match) ) {
            $.each( match, function( i, val ) {
                target = $.checkUndefined(val[0]);
                dataMatch = $.checkUndefined(val[1]);
                type = $.checkUndefined(val[2]);
                reset = $.checkUndefined(val[3], 'true');
                // additionalTypes = $.checkUndefined(val[3], null);

                // if( additionalTypes != null ) {
                //     additionalType = $.checkUndefined(additionalTypes[0]);
                //     additionalVal = $.checkUndefined(additionalTypes[1]);
                //     additionalTarget = $.checkUndefined(additionalTypes[2]);
                // }

                if($(target).length){
                    var key = $.inArray( value, dataMatch );

                    if( key >= 0 ) {
                        result = true;
                        $(target).removeClass('hide');
                    } else {
                        result = false;
                    }

                    $('.handle-toggle-percentage').removeAttr('data-percentage');

                    if( value == 'percentage' ) {
                        var value_percentage = $.convertNumber($('.handle-toggle-percentage').val(), 'int');
                        $('.handle-toggle-percentage').attr('data-percentage', 'true');

                        if( value_percentage > 100 || value_percentage < 0 ) {
                            $('.handle-toggle-percentage').val(0);
                        }
                    }

                    switch (type) { 
                        case 'fade':
                            if( result ) {
                                $(target).fadeIn();
                            } else {
                                $(target).fadeOut();
                            }
                        break;
                        case 'slide':
                            if( result ) {
                                $(target).slideDown();
                            } else {
                                $(target).slideUp();
                            }
                        break;
                        default : 
                            if( result ) {
                                $(target).show();
                            } else {
                                $(target).hide();
                            }
                        break;
                    }

                //  force clear target value on change event
                    var inputs = $(target).find(':input');

                    if( reset == 'false' ) {
                      resetTarget = false;
                    } else {
                      resetTarget = $.inArray( event.type, ['change', 'click'] ) && resetTarget === true;
                    }

                    if(inputs.length){
                        if( !result && resetTarget == true){
                        // if( resetTarget == true){
                        //  reset all inputs value
                            inputs.each(function(index, element){
                                var type = $(this).attr('type');

                                if( $.inArray(type, ['checkbox', 'radio']) !== -1 ) {
                                    $(this).prop('checked', false);
                                } else {
                                    $(this).val('').prop('checked', false);
                                }
                            });
                        }

                        inputs.prop('disabled', !result);
                        $('[data-match-type="remove"]').remove();

                        if( targetDisabled != null ) {
                            $(targetDisabled).prop('disabled', !result);
                            
                            if( result && resetTarget && inputs.val() == '' && targetDisabled != null ) {
                                $(targetDisabled).each(function(index, element){
                                    var type = $(this).attr('type');

                                    if( type == 'checkbox' ) {
                                        $(this).prop('checked', false);
                                    } else {
                                        $(this).val('').prop('checked', false);
                                    }
                                });
                            }
                        }

                        var ckeditorInput = inputs.filter('.ckeditor-short, .ckeditor');
                        if(ckeditorInput.length && event.type != 'init'){
                            $._resetEditor(ckeditorInput);
                        }
                    }

                    // if( result && inputs.val() == '' && additionalTypes != null ) {
                    //     switch(additionalType) {
                    //         case 'disabled':
                    //             additionalVal = eval(additionalVal);

                    //             $(additionalTarget).find(':input').prop('disabled', additionalVal);
                    //         break;
                    //     }
                    // }

                    var innerToggles = $(target).find('.handle-toggle:visible, .handle-toggle-click:visible');

                    if(resetTarget && innerToggles.length){
                    //  re-trigger init toggle (karena di dalam element yang di toggle kemungkinan masih ada toggle yang kena reset)
                        innerToggles.trigger('init');
                    }
                }
                else{
                //  jangan return, looping jadi stop
                //  return false;
                }
            });
        }
    }

    $.handle_toggle = function(options){
        var settings = $.extend({
            obj: '.handle-toggle',
            objToggleClick: '.handle-toggle-click',
            objToggleContent: '.handle-toggle-content',
            objToggleText: '.handle-toggle-text',
            objDisplayToggle: '.display-toggle', 
        }, options );

        $( "body" ).delegate( settings.obj, "init change", function(event) {
            var self = $(this);
            var input_type = $.checkUndefined(self.attr('type'));
            var value = self.val();

            if( $.inArray(input_type, ['radio', 'checkbox']) !== -1 ) {
                if( !self.is(':checked') ) {
                    value = false;
                }
            }

            _callHandleToggle(self, value, event);
        });

        $( "body" ).delegate( settings.objToggleClick, "init click", function(event) {
            var self = $(this);
            var input_type = $.checkUndefined(self.attr('type'));
            var value = self.val();

            if( $.inArray(input_type, ['radio', 'checkbox']) !== -1 ) {
                if( !self.is(':checked') ) {
                    value = false;
                }
            }

            _callHandleToggle(self, value, event);
        });

        $('body').delegate(settings.objDisplayToggle, 'click', function(){
            var self = $(this);
            var target = $(self.data('target'));
            var clear = $.checkUndefined(self.data('clear'), false);

            if(target.length){
                var toggleClass = $.checkUndefined(self.data('class'), 'hide');

                if(clear === true){
                    target.attr('class', '');   
                }

                target.toggleClass(toggleClass);
            }
        });

        $( "body" ).delegate( settings.objToggleContent, "init click", function(event) {
            var self = $(this);
            
            var target = self.attr('data-target');
            var reverse = self.attr('data-reverse');
            var type = self.attr('data-type');
            
            if(target != ''){
                if( self.is(':checked') ) {
                    if(type == 'disabled-input'){
                        if(reverse == 'true'){
                            $(target+' input').attr('disabled', false);
                        }else{
                            $(target+' input').attr('disabled', true);
                        }
                    }else{
                        if(reverse == 'true'){
                            $(target).fadeOut();
                        }else{
                            $(target).fadeIn();
                        }
                    }
                } else {
                    if(type == 'disabled-input'){
                        if(reverse == 'true'){
                            $(target+' input').attr('disabled', true);
                        }else{
                            $(target+' input').attr('disabled', false);
                        }
                    }else{
                        if(reverse == 'true'){
                            $(target).fadeIn();
                        }else{
                            $(target).fadeOut();
                        }
                    }
                }

                if(gmapRku.length > 0){
                    map = gmapRku.gmap3('get');
                    google.maps.event.trigger(map, 'resize');
                }
            }
        });

        $( "body" ).delegate( settings.objToggleText, "init click", function(event) {
            var self = $(this);
            
            var target = self.attr('data-target');
            var reverse = self.attr('data-reverse');

            var first_text  = self.attr('data-text-first');
            var second_text = self.attr('data-text-second');

            if(target != ''){
                if( self.is(':checked') ) {
                    if(reverse == 'true'){
                        $(target).text(first_text);
                    }else{
                        $(target).text(second_text);
                    }
                } else {
                    if(reverse == 'true'){
                        $(target).text(second_text);
                    }else{
                        $(target).text(first_text);
                    }
                }
            }
        });

        //  trigger init event for first page load
        if($(settings.obj).length){
            $(settings.obj).trigger('init');
        }
        if($(settings.objToggleContent).length){
            $(settings.objToggleContent).trigger('init');
        }

        if($(settings.objToggleClick+'[type="radio"]:checked').length){
            $(settings.objToggleClick+'[type="radio"]:checked').trigger('init');
        } else if($(settings.objToggleClick).length){
            $(settings.objToggleClick).trigger('init');
        }
    }

    $.input_to_calculate = function(options){
        $('.input-text-number').delegate( '.to-calculate', "click", function(e) {
            var self = $(this);
            
            var trigger = self.data('trigger');
            var trigger_target = self.data('trigger-target');

            var parent = self.parent('.input-text-number');

            var operator = self.data('operator');
                
            var target = parent.children('.input-number');

            var max_length = parseInt($.checkUndefined(target.attr('maxlength'), 11));
            var disabled = $.checkUndefined(target.attr('disabled'), false);
            var max_value = $.checkUndefined(target.attr('data-max-value'), false);

            var total = target.val();

            if(total == ''){
                total = 0;
            }else{
                total = parseInt(total);
            }

            if(operator == "+"){
                total = total+1;
            }else if(operator == "-"){
                total = total-1;
            }

            if(total < 0){
                total = 0;
            }

            var total_length = String(total);
            var total_length = parseInt(total_length.length);

            if(total_length <= max_length && disabled != 'disabled'){
                if(max_value !== false && total > max_value){
                    total = max_value;
                }

                target.val(total);

                if(typeof trigger != 'undefined' && trigger != '' && typeof trigger_target != 'undefined' && trigger_target != ''){
                    $(trigger_target).trigger(trigger);
                }
            }

            if($('.digit-nup').length > 0){
                $('.digit-nup').trigger('blur');
            }

            e.preventDefault();
        });
    }

    $._resetEditor = function(options){
        var settings = $.extend({
            obj : $('.ckeditor, .ckeditor-short'), 
        }, options);

        if(typeof settings.obj == 'string'){
            settings.obj = $(settings.obj);
        }

        if(settings.obj.length && typeof CKEDITOR != 'undefined' && typeof CKEDITOR.instances != 'undefined'){
            settings.obj.each(function(){
                var input       = $(this);
                var inputID     = $.checkUndefined(input.attr('id'));
                var inputName   = $.checkUndefined(input.attr('name'));

            //  alert(input.text());
                var instanceName = inputID ? inputID : inputName;
                if(typeof CKEDITOR.instances[instanceName] != 'undefined'){
                    CKEDITOR.instances[instanceName].updateElement();
                    CKEDITOR.instances[instanceName].setReadOnly(false);
                }
                else{
                //  for elements that start with hidden visibility
                    var configs = {
                        on : {
                            instanceReady : function(evt){
                                CKEDITOR.instances[instanceName].setData(input.text());
                            }
                        }, 
                    };

                    if(typeof window.__editorConfigs == 'object' && typeof window.__editorConfigs['short'] == 'object'){
                        configs = $.extend(window.__editorConfigs['short'], configs);
                    }

                    CKEDITOR.replace(instanceName, configs);
                }
            });
        }
    }

/*
name    : flashNotice
params  :
    string  type        > type of flash notice, see types below for available types
    string  message     > message to be displayed
    bool    autoRender  > render flash directly after built (default true)
note    :
    untuk yang mau append di element (bukan flash modal), autoRender di kasih false
    nanti return balikannya silakan di append manual
*/

    $.flashNotice = function (type, message, autoRender, cssClass, closeToggle) {
        var types = ['info', 'success', 'warning', 'error', 'fail'];
        var flash = null;

        autoRender = $.checkUndefined(autoRender, true);

        if($.inArray(type, types) !== -1){
            type        = type == 'error' ? 'fail' : type;
            cssClass    = $.checkUndefined(cssClass, 'alert alert-' + type);

            var closeToggle = $.checkUndefined(closeToggle, $('<span></span>').attr({
                'class' : 'close-btn prm-cross-2', 
                'onclick' : 'this.parentElement.style.display=\'none\';', 
            }));

        //  generate element
            flash = $('<div></div>').attr({
                'class'     : cssClass, 
                'data-role' : 'flash-notice', 
            }).append(closeToggle);

        //  append message
            flash.append($('<p></p>').html(message)); 

            if(autoRender){
            //  modal
                var modal = $('#myModal').clone();
                    modal = $(modal);

            //  append flash to modal
                modal.html(flash);

            //  append modal to body
                $('body').append(modal);
                $('#flash-modal').modal('show');
            }
            else{
                return flash;
            }
        }
    };
  
    $.renderTemplate = function(templateSelector, targetSelector, jsonData, replaceTarget){
        var targetObject, template, htmlContent;

        if(typeof $.fn.render == 'function'){
            template = $.templates(templateSelector);
            htmlContent = template.render(jsonData);

            if(typeof targetSelector == 'object'){
                targetObject = targetSelector;
            }
            else{
                targetObject = $(targetSelector);
            }

            if(targetObject && targetObject.length){
            //  render template
                if(replaceTarget === true){
                    targetObject.replaceWith(htmlContent);  
                }
                else{
                    targetObject.html(htmlContent); 
                }

            //  custom event trigger
                var targetID = targetObject.attr('id');
                $('body').triggerHandler({
                    type        : 'template.rendered', 
                    element     : targetObject, 
                    elementID   : targetID, 
                });
            }
            else{
            //  no target found
                console.log(targetSelector + ' not found, returning template');
                return htmlContent;
            }
        }
    }

    $.colorPicker = function(options){
        var settings = $.extend({
            obj : $('.colorpicker-component'), 
        }, options);

        if(typeof $.fn.colorpicker == 'function' && settings.obj.length){
			$(document).on('scroll', function(){
				settings.obj.colorpicker('reposition');
			});

            settings.obj.each(function(){
                var self    = $(this);
                var input   = self.find(':input[data-role="color-input"]');
                var container = $.checkUndefined(input.attr('data-container'), '');

                if(input.length){
                    var color = input.val();

                //  set last color
                    input.attr('data-last-color', color);

                    var options = {
                        input           : input, 
                        format          : 'rgba',
                        component       : '[data-role="color-preview"]', 
                        colorSelectors  : {
                            'green'         : '#05a558', 
                            'yellow'        : '#f0b20a', 
                            'red'           : '#eb373e', 
                            'blue'          : '#006eff', 
                            'text'          : '#24242f', 
                            'text_2'        : '#505069', 
                            'label'         : '#9d9db4', 
                            'border'        : '#dfdfe8', 
                            'border_2'      : '#e9e9ef', 
                        }, 
                    };

                    if(color != ''){
                    //	set default color
                        options = $.extend({
                            color : color, 
                        }, options);
                    }

                    if(container != ''){
                        options = $.extend({
                            container : container, 
                        }, options);
                    }

					return self.colorpicker(options).on('showPicker hidePicker changeColor', function(event){
						var self	= $(this);
						var input	= self.find(':input[data-role="color-input"]');

						if(event.type == 'showPicker'){
						//	append color code input on first load
							var picker = $('.colorpicker.colorpicker-visible');

							if(picker.length && picker.find('button.colorpicker-reset').length <= 0){
								var template =	'<div class="colorpicker-addon margin-top-1">';
									template+=		'<input type="text" class="colorpicker-code"/>';
									template+= 		'<button type="button" class="colorpicker-reset">';
									template+=			'<i class="prm-trash prmd-trash cred"></i>';
									template+=		'</button>';
									template+=	'</div>';

								picker.append(template);

							//	bind event to newly created element
								var colorCode	= picker.find('.colorpicker-code');
								var colorReset	= picker.find('.colorpicker-reset');

								colorCode.val(self.colorpicker('getValue', '')).on('click touchstart mousedown change', function(event){
									if(event.type == 'change'){
										var currentColor = $(this).val();

										self.colorpicker('setValue', currentColor ? currentColor : 'transparent');
										input.val(currentColor).attr('value', currentColor);

									//	input.trigger('colorpicker:change');
									}
									else{
										$(this).focus();
									}
								});

								colorReset.on('click', function(event){
									colorCode.val(null).trigger('change');
								});
							}
						}
						else if(event.type == 'hidePicker'){
						//	desc    : custom "change" event untuk input nya, supaya nembak "change" nya sekali.
						//	note    : plugin color picker ini selalu trigger "change" setiap kali ada penggeseran slider warna.
						//	solusi  : untuk sekarang "change" di ganti dengan "colorpicker:change" yang di trigger saat color picker di tutup

							if(input.length){
								var currentColor	= self.colorpicker('getValue', '');
								var lastColor		= $.checkUndefined(input.attr('data-last-color'), '');

								if(currentColor != lastColor){
									input.attr('data-last-color', currentColor).trigger('colorpicker:change');
								}
							}
						}
						else{
						//	change color code value
							var picker		= $('.colorpicker.colorpicker-visible');
							var colorCode	= picker.find('.colorpicker-code');

							if(picker.length && colorCode.length){
								var currentColor = self.colorpicker('getValue', '');

								colorCode.val(currentColor);
							}
						}
                    });
                }
                else{
                    return false;
                }
            });
        }
    }

//  prevent dropdown from being closed when clicked
    $.menuCreatorList = function(options){
        var settings = $.extend({
            obj : $('.menu-creator-list .menu-creator-item'), 
        }, options);

        if(settings.obj.length){
            settings.obj.on({
                'shown.bs.dropdown' : function(event){
                    this.closable = false;
                },
                'click' : function(event){
                //  alert(event.target == this);
                    var target = $(event.target);
                    var parent = target.closest('[data-toggle=dropdown]');
                    var toggle = parent.length ? parent.data('toggle') : target.data('toggle');

                    this.closable = toggle == 'dropdown';
                },
                'hide.bs.dropdown' : function(event){
                    return this.closable;
                }
            });
        }
    }

//  B:JQUERY UTILITY FUNCTIONS /////////////////////////////////////////////////////////////////

//  type : utility function
//  desc : check if object has given attribute name

    $.fn.hasAttr = function(strAttribute){
        var attribute = this.attr(strAttribute);

        if(typeof attribute !== typeof undefined && attribute !== false){
            return true;
        }

        return false;
    };

    $.fn.switchPositionWith = function(selector){
        var other;

        if(typeof selector == 'object'){
            other = selector;
        }
        else{
            other = $(selector);
        }

        this.after(other.clone());
        other.after(this).remove();
    };

//  E:JQUERY UTILITY FUNCTIONS /////////////////////////////////////////////////////////////////

    if($('.delete-media').length > 0){
        $('.delete-media').click(function(){
            var self = $(this);
            var data_role = self.data('role');
            var formData = $(data_role).serialize();
            var url = self.data('url');

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: formData,
                success: function(result) {
                    window.location.href = url;
                }
            });
        });
    }

    $.rowAdded = function(options){
        var settings = $.extend({
            obj: '.field-added .add-item',
            objRemove: '.field-added .removed',
        }, options );

        $( "body" ).delegate( settings.obj, "click", function() {
            var self = $(this);

            var class_icon = 'span.icon-removed';

            var data_icon_removed = $.checkUndefined(self.data('icon-removed'), true);
            var design = $.checkUndefined(self.data('design'), true);
            var data_rel = $.checkUndefined(self.attr('data-rel'), null);
            var data_ajax = $.checkUndefined(self.attr('data-ajax'), null);
            var parentAdded = self.parents('.field-added');
            var temp = parentAdded.find('.field-copy');
            var subject_lists = parentAdded.find('.subject-list-items');

            if( data_ajax != null ) {
                var last_rel = $('.for-multiple.item .counter-title').last().html();
                var key = $('.for-multiple.item').length;
                if(last_rel){
                    last_rel = parseInt(last_rel);
                    last_rel = last_rel + 1;
                }
                data_ajax = data_ajax+'/'+last_rel+'/'+key+'/';
                    // obj.removeAttr('rel').attr(last_rel 'rel', ).find('ul').removeAttr('rel').attr( 'rel', last_rel);

                $.ajax({
                    url: data_ajax,
                    type: 'POST',
                        beforeSend: function() {
                            $.loadingbar_progress('beforeSend');
                        },
                    success: function(result) {
                        self.before(result);
                        $.rebuildFunction();
                        return false;
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');
                        return false;
                    }
                }).always(function() {
                    $.loadingbar_progress('always');
                });

            } else {
                if( $('select[data-role="chosen-select"],.chosen-select').length > 0 ) {
                    $('select[data-role="chosen-select"],.chosen-select').chosen("destroy");
                }

                var obj = temp.clone().insertBefore( parentAdded.find('.add-item') );
                var data_not_remove_select = $.checkUndefined(parentAdded.data('not-remove-select'), 'false');

                if(data_icon_removed){
                    var close_btn = 'prm-trash cred removed '
                    if(design){
                        close_btn += 'close-btn'
                    }
                    var object = obj.find(class_icon).addClass(close_btn);
                }

                obj.removeClass('field-copy')
                    .find('input[type="text"],input[type="hidden"],input[type="file"],textarea').val('')
                    .find('input[type="checkbox"]').prop('checked', false)
                    .find('.error-message').remove();
                obj.find('.form-group-error').remove();
                obj.find('.select2.select2-container.select2-container--default').remove();

                if(data_not_remove_select == 'false'){
                    obj.removeClass('field-copy')
                    .find('select').val('');
                }

                if($(subject_lists).length > 0){
                    obj.find('.subject-list-items').attr('name', 'theme[sub_themes_attributes][source_id]['+$(subject_lists).length+'][]');
                }
            }

            $.rebuildFunction();

            return false;
        });

        $( "body" ).delegate( settings.objRemove, "click", function() {
            var self = $(this);
            var item = self.parents('.item');
            item.remove();

            // change label slide
            $('.for-multiple.item').each(function(index, element){
                var idx = index + 1;
                $(this).find('.counter-title').text(idx);
            });


            $('.subject-list-items').each(function(index, element){
                $(this).attr('name', 'theme[sub_themes_attributes][source_id]['+ index +'][]')
            });

            // 
            return false;
        });
    }

    $.getDates = function(dt, reverse){
        reverse = $.checkUndefined(reverse, false);
        dtString = '';

        if( reverse == true ) {
            dtArr = dt.split('-');

            if( dtArr.length == 3 ) {
                y = dtArr[0];
                m = dtArr[1];
                d = dtArr[2];

                dtString = d + '/' + m + '/' + y;
            }
        } else {
            dtArr = dt.split('/');

            if( dtArr.length == 3 ) {
                d = dtArr[0];
                m = dtArr[1];
                y = dtArr[2];

                dtString = y + '-' + m + '-' + d;
            }
        }

        return dtString;
    }

    $.datePicker = function(options){
        var settings = $.extend({
            obj: $('.datepicker'),
            objInterval: $('.datepicker-interval'),
            objIntervalRange: $('.datepicker-interval-to'),
            objRange: $('.to-datepicker'),
            objDateTime: $('.datetimepicker'),
            objTime: $('.timepicker'),
            objMonth: $('.monthpicker'),
            objYear: $('.yearpicker'),
            objPeriode: $('.date-periode'),
            up: 'prm-angle-top',
            down: 'prm-angle-bottom',
            next: 'prm-angle-right',
            previous: 'prm-angle-left',
            clear: 'prm-trash',
            close: 'prm-cross'
        }, options );
        
        if( settings.obj.length > 0 ) {
            var data_viewmode = $.checkUndefined(settings.obj.attr('data-viewmode'), 'days');
            var format_date = $.checkUndefined(settings.obj.attr('data-format'), 'YYYY-MM-DD');

            settings.obj.datetimepicker({
                format: format_date,
                viewMode: data_viewmode,
                icons: {
                    up: settings.up,
                    down: settings.down,
                    previous: settings.previous,
                    next: settings.next,
                    clear: settings.clear,
                    close: settings.close,
                    time: "prm-time",
                    date: "prm-calendar",
                }
            });
        }

        if( settings.objIntervalRange.length > 0 ){
            var momentDate = false;
            var data_viewmode = $.checkUndefined(settings.objIntervalRange.attr('data-viewmode'), 'days');
            var format_date = $.checkUndefined(settings.objIntervalRange.attr('data-format'), 'YYYY/MM/DD');
            var data_date = $.checkUndefined(settings.objIntervalRange.attr('data-date'), false);

            if(data_date != false){
                momentDate = moment(new Date(data_date));
            }

            settings.objIntervalRange.datetimepicker({
                format: format_date,
                viewMode: data_viewmode,
                icons: {
                    up: settings.up,
                    down: settings.down,
                    previous: settings.previous,
                    next: settings.next,
                    clear: settings.clear,
                    close: settings.close,
                    time: "prm-time",
                    date: "prm-calendar",
                },
            }).on('dp.change', function (e){
                $.dp_change($(this), e.date, '.date-from', false);
            }).on("dp.show", function (e){
                var self = $(this);
                var data_date = $.checkUndefined(self.attr('data-date'), false);

                if(data_date != false){
                    self.data("DateTimePicker").minDate(moment(data_date));
                }
            });
        }

        if( settings.objInterval.length > 0 ) {
            var data_viewmode = $.checkUndefined(settings.objInterval.attr('data-viewmode'), 'days');
            var format_date = $.checkUndefined(settings.objInterval.attr('data-format'), 'YYYY/MM/DD');
            var data_date = $.checkUndefined(settings.objInterval.attr('data-date'), false);

            if(data_date != false){
                momentDate = moment(new Date(data_date));
            }

            settings.objInterval.datetimepicker({
                format: format_date,
                viewMode: data_viewmode,
                icons: {
                    up: settings.up,
                    down: settings.down,
                    previous: settings.previous,
                    next: settings.next,
                    clear: settings.clear,
                    close: settings.close,
                    time: "prm-time",
                    date: "prm-calendar",
                },
            }).on("dp.change", function (e){
                $.dp_change($(this), e.date, '.date-to');
            }).on("dp.show", function (e){
                var self = $(this);
                var data_date = $.checkUndefined(self.attr('data-date'), false);

                if(data_date != false){
                    self.data("DateTimePicker").minDate(moment(data_date));
                }
            });

        }

        if( settings.objRange.length > 0 ) {
            settings.objRange.datetimepicker({
                format: format_date,
                icons: {
                    up: 'prm-angle-top',
                    down: 'prm-angle-bottom',
                    next: 'prm-angle-right',
                    previous: 'prm-angle-left',
                    clear: 'prm-trash',
                    close: 'prm-cross',
                    time: "prm-time",
                    date: "prm-calendar",
                },
                useCurrent: false,
            });
            settings.obj.on("dp.change", function (e) {
                settings.objRange.data("DateTimePicker").minDate(e.date);

                var self = $(this);
                var currentDate = $.getDates(self.closest('div.row').find('.to-datepicker').val());
                var startDate = e.date.format("YYYY-MM-DD");
                var setDate = e.date.format("DD/MM/YYYY");

                if( startDate > currentDate ) {
                    self.closest('div.row').find('.to-datepicker').val(setDate);
                }
            });
            // settings.objRange.on("dp.change", function (e) {
            //  settings.obj.data("DateTimePicker").maxDate(e.date);
            // });
        }

        if( settings.objDateTime.length > 0 ) {
            var max_today = $.checkUndefined(settings.objDateTime.attr('data-maxToday'), 0);
            var dateshow = $.checkUndefined(settings.objDateTime.attr('data-dateshow'), 0);

            var default_param = {
                format: 'YYYY-MM-DD HH:mm',
                icons: {
                    up: 'prm-angle-top',
                    down: 'prm-angle-bottom',
                    next: 'prm-angle-right',
                    previous: 'prm-angle-left',
                    clear: 'prm-trash',
                    close: 'prm-cross',
                    time: "prm-time",
                    date: "prm-calendar",
                  
                },
                useCurrent: false,
                widgetPositioning:{
                    horizontal:'auto', 
                    vertical:'bottom', 
                }
            };

            if(max_today != 0){
                default_param = $.extend(default_param, {maxDate: $.now()});
            }

            if(dateshow != 0){
                default_param = $.extend(default_param, {defaultDate: $.now()});
            }

            settings.objDateTime.datetimepicker(default_param).on("dp.show", function (e){
                var self = $(this);
                var data_date = $.checkUndefined(self.attr('data-date'), false);

                if(data_date != false){
                    self.data("DateTimePicker").minDate(moment(data_date));
                }
            });
        }

        if( settings.objTime.length > 0 ) {
            settings.objTime.datetimepicker({
                format: 'HH:mm',
                icons: {
                    up: settings.up,
                    down: settings.down,
                    previous: settings.previous,
                    next: settings.next,
                    clear: settings.clear,
                    close: settings.close
                },
            });
        }

        if( settings.objMonth.length > 0 ) {
            settings.objMonth.datetimepicker({
                format: 'MMM YYYY',
                icons: {
                    up: settings.up,
                    down: settings.down,
                    previous: settings.previous,
                    next: settings.next,
                    clear: settings.clear,
                    close: settings.close
                },
            });

            if( !settings.objMonth.hasClass('datetimepicker-active') ) {
                settings.objMonth.addClass('datetimepicker-active');
                settings.objMonth.on("dp.change", function (e) {
                    var trigger = $.checkUndefined($(this).attr('data-trigger'), false);

                    if( trigger != false ) {
                        $.directAjaxLink({
                            obj: $(this),
                        });
                    }
                });
            }
        }

        if( settings.objYear.length > 0 ) {
            var default_param_year = {
                format: 'YYYY',
                viewMode: "years", 
            };

            // var min_year = $.checkUndefined(settings.objYear.attr('data-minyear'), 0);

            // if(min_year != 0){
            //     default_param_year = $.extend(default_param_year, {
            //         date: settings.objYear.val(),
            //         minDate: moment(new Date(min_year.toString()))
            //     });
            // }

            settings.objYear.datetimepicker(default_param_year);
        }

        if( settings.objPeriode.length > 0 ) {
            var dateMin = settings.objPeriode.attr('data-min');
            var dateMax = settings.objPeriode.attr('data-max');
            var dateVal = settings.objPeriode.attr('data-value');

            if(typeof dateMin != 'undefined' ) {
                dateMin = eval(dateMin);
            }
            if(typeof dateMax != 'undefined' ) {
                dateMax = eval(dateMax);
            }
            if(typeof dateMax != 'undefined' ) {
                dateVal = eval(dateVal);
            } else {
                dateVal = null;
            }

            settings.objPeriode.rangePicker({
                closeOnSelect:true,
                presets: false,
                months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                minDate : dateMin,
                maxDate : dateMax,
                setDate : dateVal
            });
        }
    }

    $.dateAddrebuild = function(self, date, flag){
        var date_pick = moment(date);
        
        var data_rel = self.data('rel');
        var data_parent = self.data('parent');
        var parent = $(data_parent+'[data-rel='+data_rel+']');
        var value = parent.find('.interval-value').val();
        var count_day = parent.find('.setting-interval').find('option:selected').attr('data-source');
        var count_day = count_day * value;

        flag = $.checkUndefined(flag, true);

        if(flag){
            count_day = count_day - 1;
        }else{
            count_day = (count_day -1) * -1;
        }

        date_pick = moment(date_pick).add(count_day, 'day');  

        if(date_pick == 'Invalid date'){
            date_pick = false;
        }

        return date_pick;
    }

    $.dp_change = function(self, date, classes, flag){
        var data_rel = self.data('rel');
        var data_parent = self.data('parent');
        var parent = $(data_parent+'[data-rel='+data_rel+']');

        var date_pick = $.dateAddrebuild(self, date, flag);

        date_pick = date_pick.format('DD/MM/YYYY');
        parent.find(classes).val(date_pick);

        var date_from = parent.find('.date-from').val();
        var date_to = parent.find('.date-to').val();

        if(date_from && date_to){
            var text_date = date_from+' s/d '+date_to;
            $('.periode-date[data-rel='+data_rel+']').html(text_date);
        }
    }

    $.datetimepicker = function( options ) {
        var settings = $.extend({
            obj: $('.datetimepicker'),
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.datetimepicker({ format: 'yyyy-mm-dd hh:ii' });
        }
    }

    $.dropDownMenu = function( options ) {
        var settings = $.extend({
            obj: '.drop-content ul',
            objColumnDropdown: '.columnDropdown input[type="checkbox"]',
            objReset: '.form-reset-filter',
            objAction: '.drop-table-menu .action-menu',
        }, options );

        $( "body" ).delegate( settings.obj, "click", function(e) {
            var self = $(this);

            if( self.find('input[type=checkbox]').length > 0 ){
                e.stopPropagation();
            }
        });
        
        $( "body" ).delegate( settings.objColumnDropdown, "click", function(e) {
            var self = $(this);
            var data_url = $.checkUndefined(self.attr('data-url'), false);
            var data_form = $.checkUndefined(self.attr('data-form'), false);

            if( self.attr('rel') == 'all' ) {
                $(settings.objColumnDropdown).prop('checked', self.prop('checked'));
            }

            var activeColumns = $(settings.objColumnDropdown).filter(function(){
                return $(this).prop('checked') && $(this).attr('rel') != 'all';
            });

            if(activeColumns.length == 0 && $('.colview-default').length > 0){
                activeColumns = $('.colview-default').val();
                activeColumns = $(activeColumns);

                if(activeColumns.length > 0){
                    activeColumns.prop('checked', true);
                }
            }

            var inActiveColumns = $(settings.objColumnDropdown).filter(function(){
                return !$(this).prop('checked') && $(this).attr('rel') != 'all';
            });

        //  checkall otomatis nyala kalo semua siblings di centang
            var isCheckAll = activeColumns.length >= (activeColumns.length + inActiveColumns.length);

            $('.columnDropdown input[rel="all"]').prop('checked', isCheckAll);

            activeColumns.map(function(){ 
                $('table .' + $(this).attr('rel')).css('display', 'table-cell').removeClass('hide');
            });

            inActiveColumns.map(function(){
                $('table .' + $(this).attr('rel')).hide();
            });

            if( data_url != false ) {
                var formData = false;

                if( data_form != false ) {
                    formData = $(data_form).serialize(); 
                }

                if( loadJXHR ){
                    loadJXHR.abort();
                }

                loadJXHR = $.ajax({
                    url: data_url,
                    data: formData,
                    type: 'POST',
                    success: function(result) {
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');
                        return false;
                    }
                });
            }
        });

        $( "body" ).delegate( settings.objReset, "click", function(e) {
            var objInput = $(settings.objReset).parents('tr').find('input,select');
            objInput.val('');
            
            if( objInput.length > 0 ) {
                var tag_name = objInput.get( 0 ).tagName;

                if(tag_name == 'SELECT'){
                    $(objInput.get( 0 )).trigger('change');
                }else{
                    $(objInput.get( 0 )).trigger('keyup');
                }
            } else {
                objInput.trigger('keyup');
            }
        });

        $( "body" ).delegate( settings.objAction, "click", function(e) {
            var self = $(this);

            if( self.hasClass('open') ) {
                self.removeClass('open');
            } else {
                self.addClass('open');
            }
        });
    }

    $.checkAll = function(options){
        var settings = $.extend({
            obj: '.checkAll',
            objTarget: '.check-option',
            objClick: '.button-action',
        }, options );

        var countChecked = function () {
            var count = 0;
            var count_all = $(settings.objTarget).length;
            var data_show = '.delete-overflow';

            $.each( $(settings.objTarget), function( i, val ) {
                var data_val = $(val);
                var parent = data_val.parents('.checkbox-button');
                var parent_name = $.checkUndefined(data_val.attr('data-parent'), 'tr');
                var parent_tr = data_val.parents(parent_name);
                
                parent_tr.removeClass('select checked');

                if( parent.find('input[type="checkbox"]').is(':checked') ) {
                    count += 1;

                    if( data_val.hasClass('trigger-bg') ) {
                        parent_tr.addClass('select checked');
                    }
                }
            });

            if( count > 0 ) {
                $('.main-action .data-action').removeClass('hide');

                if( $(data_show).length > 0 ) {
                    $(data_show).show();
                }

                $('.checkbox-media-submit').removeClass('disabled').prop('disabled', false).attr('disabled', false);
            }else{
                $('.main-action .data-action').addClass('hide');
                
                if( $(data_show).length > 0 ) {
                    $(data_show).hide();
                }

                $('.checkbox-media-submit').addClass('disabled').attr('disabled', 'disabled');
            }

            if(count_all > 0 && count_all == count){
                $(settings.obj).prop('checked', true);
            }else{
                $(settings.obj).prop('checked', false);
            }

            // $('.delete-overflow .counter span').html(count);
        }

        if( $(settings.obj).is(':checked') ) {
            $(settings.objTarget).prop('checked', true);
        }

        function checkAllFun(obj_checkall_target){
            if( obj_checkall_target.is(':checked') ) {
                $(settings.objTarget).prop('checked', true);
            } else {
                $(settings.objTarget).prop('checked', false);
            }

            countChecked();
        }

        $( "body" ).delegate( settings.obj, "click", function(e) {
            checkAllFun($(this));

            var trigger_target  = $.checkUndefined($(this).attr('data-trigger-target'), null);
            var trigger_event   = $.checkUndefined($(this).attr('data-trigger-event'), null);

            if(trigger_target != null && trigger_target != ''){
                $(trigger_target).trigger(trigger_event);
            }
        });

        $( "body" ).delegate( settings.objTarget, "click", function(e) {
            var data_type = $.checkUndefined($(this).attr('data-type'), null);
            var checked = $(this).is(':checked');

            if( data_type == 'single' ) {
                $(settings.objTarget).prop('checked', false);

                if( checked == true ) {
                    $(this).prop('checked', true);
                }
            }

            countChecked();
        });

        $( "body" ).delegate( settings.objClick, "click", function(e) {
            var self = $(this);
            var url = self.attr('href');
            var msg = self.attr('data-alert');
            var flagChecked = false;

            $.each( $(settings.objTarget), function( i, val ) {
                var selfEach = $(this);
                if( selfEach.is(':checked') ) {
                    flagChecked = true;
                }
            });

            if( flagChecked == true ) {
                if(typeof msg != 'undefined' ) {
                    if ( !confirm(msg) ) { 
                        return false;
                    }
                }
                self.parents('form').attr('action', url);
                self.parents('form').submit();
            } else {
                alert('Mohon centang salah satu data yang ada di table');
            }

            return false;
        });
    }

    $.sortable = function(options){
        var settings = $.extend({
            'obj' : $('[data-sortable="true"]'), 
            'options' : {}
        }, options);

        if(typeof $.fn.sortable == 'function' && settings.obj.length){
            var object = settings.obj;
            var dataRevert = object.hasAttr('data-revert') ? object.data('revert') : false;
            var dataIframeFix = object.hasAttr('data-iframefix') ? object.data('iframefix') : false;
            var sortOptions = {};

            if(settings.obj.hasClass('ui-sortable')){
            //  untuk pemanggilan ulang biar ga error, harus di destroy terus re-init lagi
            //  attribute data-options di generate pas sortable init
                sortOptions = settings.obj.data('options');
            //  canvasContents.find('body ul#dropbox').sortable('option', sortOptions);
            }
            else{
                sortOptions = {
                //  helper      : 'clone', // note : kalo pake ini css item-nya di strip
                    revert      : dataRevert,
                    iframeFix   : dataIframeFix, 
                    appendTo    : 'body', 
                    cancel      : 'li.disabled, li.fixed', // exclude item
                    zIndex      : 9999, 
                    placeholder : 'dropbox-placeholder', // css for the droppable box
                    start       : function(event, ui){
                        ui.item.attr('data-old-index', ui.item.index());
                    }, 
                    over        : function(event, ui){
                        var item = $(ui.helper);
                        var placeholder = $('.dropbox-placeholder');

                        if(placeholder.length){
                            placeholder.css('height', item.height());
                        }
                    }, 
                    update      : function(event, ui){
                        var item = $(ui.item);
                        var cancel = false;

                        if(item.hasClass('disabled')){
                            cancel = true;
                        }
                        else{
                            var newIndex = item.index();
                            var oldIndex = item.attr('data-old-index');
                            var moveStep = Math.abs(newIndex - oldIndex);

                            if(moveStep == 1){
                                var siblings = item.siblings();
                                var neighbor = $(this).children('li').eq( (newIndex < oldIndex ? (newIndex + 1) : (newIndex - 1)) );

                                if(neighbor.length){
                                    cancel = neighbor.hasClass('fixed');
                                }
                            }
                        }

                    //  cancel = false;
                        if(cancel){
                            $(this).sortable('cancel');
                        }
                        else{
                            var object = $(this);
                            var dataCallbacks = object.hasAttr('data-callbacks') ? object.data('callbacks') : null;

                            if(dataCallbacks){
                                if(dataCallbacks.indexOf(';') > -1){
                                    dataCallbacks = dataCallbacks.split(';');
                                }
                                else{
                                    dataCallbacks = { dataCallbacks };
                                }

                                $.each(dataCallbacks, function(index, fnName){
                                    var fn = window[fnName];

                                    if(typeof fn === 'function'){
                                        fn.apply(null, [ object, event, ui ]);
                                    }
                                });
                            } 
                        }
                    }, 
                };
            }

            if(settings.options){
            //  replace options kalo di passing
                sortOptions = $.extend(sortOptions, settings.options);
            }

            return object.sortable(sortOptions).attr('data-options', JSON.stringify(sortOptions)).disableSelection();
        }
    }

    $.draggable = function(options){
        var settings = $.extend({
            'obj' : $('[data-draggable="true"]'), 
            'connectWith' : null,
            'options' : {}, 
        }, options);

        if(typeof $.fn.draggable == 'function' && settings.obj.length){
            var object = settings.obj;
            var dataConnectWith = $.checkUndefined(object.data('connect-with'), settings.connectWith);
            var dataIframeFix = $.checkUndefined(object.data('iframefix'), false);
            var dataHelper = $.checkUndefined(object.data('helper'), 'original');
            var dataRevert = $.checkUndefined(object.data('revert'), false);

            var dragOptions = {
                cursor : 'move', 
                helper : dataHelper, 
                revert : dataRevert, 
                appendTo : document.body, 
            };

            if($(dataConnectWith).length){
                dragOptions = $.extend(dragOptions, {
                    connectToSortable : dataConnectWith, 
                    // helper : 'clone', 
                });
                
            }

            if(settings.options){
            //  replace options kalo di passing
                dragOptions = $.extend(dragOptions, settings.options);
            }

            object.draggable(dragOptions).disableSelection();
        }
    }

    $.droppable = function(options){
        var settings = $.extend({
            'obj' : $('[data-droppable="true"], [data-sortable="true"]'), 
        }, options);

        if(settings.obj.length){
            var object = settings.obj;
            object.sortable().droppable({
               drop: function( event, ui ) {
                var self = $(this);
                var obj = $(ui.draggable)
                var subject_group_id = $.checkUndefined(self.attr('data-group-id'), false)
                var subject_id = $.checkUndefined(obj.attr('data-subject-id'), false)

                var url = '/curriculum/pick_subject/' + subject_id + '/subject_group/' + subject_group_id
                
                $.ajax({
                  type: "GET",
                  url: url,
                  dataType: 'json',
                  success: function(result) {
                    // var google_client_id  = $.checkUndefined(result.google_client_id, false);
                    // if(google_client_id != ''){
                    //     $.googleProcess(result, type, json, key_id, document_id, model, url_referer);
                    // }
                  }
                }).always(function() {
                  $.loadingbar_progress('always');
                });
               }
            });
        }
    }

/*
    $.draggable = function(options){
        var settings = $.extend({
            'obj' : $('[data-draggable="true"]'), 
        }, options);

        if(typeof $.fn.draggable == 'function' && settings.obj.length){
            var object = settings.obj;
            var dataConnectWith = $.checkUndefined(object.data('connect-with'));
            var dataHelper = $.checkUndefined(object.data('helper'), 'original');
            var dataRevert = $.checkUndefined(object.data('revert'), false);

            var dragOptions = {
                helper : dataHelper, 
                revert : dataRevert, 
            };

            if($(dataConnectWith).length){
                dragOptions = $.extend(dragOptions, {
                    connectToSortable : dataConnectWith, 
                    helper : 'clone', 
                });
            }

            object.draggable(dragOptions).disableSelection();
        }
    }
*/

    $.inputCounter = function(options){
		var settings = $.extend({
			obj			: $(':input[data-role="input-counter"]'), 
			container	: '',
			text		: '%left dari %length karakter', // %length %maxlength %left
		}, options);

        if(settings.obj.length){
			settings.obj.each(function(index, object){
				var self		= $(object);
				var direction	= $.checkUndefined(self.data('direction'), 'decrement');
				var container	= $.checkUndefined(self.data('container'));

				if(!container){
					container = self.closest('[data-role="input-counter-wrapper"]').find('[data-role="counter-wrapper"]');
				}

				container = $(container);

				if(direction == 'decrement' && typeof $.fn.maxlength == 'function'){
				//	DECREMENT
                    container.html('');
					self.maxlength({
						counterContainer	: container, 
						text				: '%left dari %maxlength karakter',
					});
				}
				else{
				//	INCREMENT
					function updateIncrement(obj){
						var length	= $(obj).val().length;
						var text	= $.checkUndefined($(obj).data('text'), '');

						if(container.length){
							text = text.replace(/\B%(length)\b/g, $.proxy(function(match, p){
								return (p == 'length') ? length : 0;
							}, $(obj)));

							container.text(text);
						}
					}

					self.bind({
						'keyup change init': function(e){
							updateIncrement(this);
						},
						'cut paste drop': function(e){
							setTimeout($.proxy(function(){
								updateIncrement(this);
							}, this), 1);
						}
					}).trigger('init');
				}
			});
        }
    }

    $.nestable = function(options){
        var settings = $.extend({
            'obj' : $('div[data-role="nestable"]'), 
        }, options);

        if(settings.obj.length && typeof $.fn.nestable == 'function'){
            settings.obj.each(function(){
                var self = $(this);
                var dataGroup = $.checkUndefined(self.attr('data-group'), 0);
                var dataDepth = $.checkUndefined(self.attr('data-depth'), 5);
                var handleClass = $.checkUndefined(self.attr('data-handle'), 'dd-handle');
                var	autoInit = $.checkUndefined(self.data('init'), false);

                self.nestable({
                    group : dataGroup, 
                    maxDepth : dataDepth, 
                    expandBtnHTML : '', 
                    collapseBtnHTML : '', 
                    handleClass : handleClass, 
                }).off('change').on('change', function(){
                    var self = $(this);
                    var dataCallbacks = $.checkUndefined($(this).attr('data-callbacks'));

                    if(dataCallbacks){
                        if(dataCallbacks.indexOf(';') > -1){
                            dataCallbacks = dataCallbacks.split(';');
                        }
                        else{
                            dataCallbacks = { dataCallbacks };
                        }

                        $.each(dataCallbacks, function(index, fnName){
                            var fn = window[fnName];
                            if(typeof fn === 'function'){
                                fn.apply(null, [ self ]);
                            }
                        });
                    }
                });

                if(autoInit){
               	//	untuk auto sort
                	self.trigger('change');
                }
            });
        }
    }

    $.postLink = function(options){
        var settings = $.extend(options, {
            obj : $('.post-link'),
        });

        if(typeof settings.obj == 'string'){
            settings.obj = $(settings.obj);
        }

        if(settings.obj.length){
            settings.obj.off('click').on('click', function(event){
                event.preventDefault();
                event.stopPropagation();

                var self            = $(this);
                var targetUrl       = $.checkUndefined(self.attr('href'), 'javascript:void(0);');
                var dataConfirm     = $.checkUndefined(self.data('confirm'), 'Apakah Anda yakin?');
                var dataModelName   = $.checkUndefined(self.data('model-name'));
                var dataValue       = $.checkUndefined(self.data('value'));

                if(confirm(dataConfirm)){
                    var inputName = 'data' + (dataModelName ? '[' + dataModelName + '][id]' : '');
                    var input = $('<input/>').attr({
                        'type'  : 'text', 
                        'name'  : inputName, 
                        'value' : dataValue, 
                    });

                    var tempForm = $('<form></form>').attr({
                        'action' : targetUrl, 
                        'method' : 'post', 
                    }).html(input);

                    tempForm.appendTo('body').submit();
                }
                else{
                    return false;
                }
            });
        }
    }

//  CUSTOM AUTOCOMPLETE WITH CATEGORY AS ITEM GROUP ////////////////////////////////////////////////////////////////////////////////////////////////////////

    if(typeof $.ui.autocomplete == 'function'){
        $.widget('custom.catcomplete', $.ui.autocomplete, {
            _create     : function(){
                this._super();
                this.widget().menu('option', 'items', '> :not(.ui-autocomplete-category)');
            },
            _renderMenu : function(ul, items){
                var that            = this;
                var currentCategory = '';

                $.each(items, function(index, item){
                    var li;

                    if(typeof item.category != 'undefined' && item.category != currentCategory){
                        ul.append('<li class="ui-autocomplete-category">' + item.category + '</li>');
                        currentCategory = item.category;
                    }

                    li = that._renderItemData(ul, item);
                    if(item.category){
                        li.attr('aria-label', item.category + ' : ' + item.label);
                    }
                });
            }, 
            _renderItem : function (ul, item){
            //  highlight matched chars
                var caption = item.label.replace(
                    new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + $.ui.autocomplete.escapeRegex(this.term) + ')(?![^<>]*>)(?![^&;]+;)', 'gi'), '<b>$1</b>'
                );

                return $('<li></li>').data('item.autocomplete', item).append('<a>' + caption + '</a>').appendTo(ul);
            }
        });
    }

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var catCompleteJXHR;

    $.catcomplete = function(options){
        var settings = $.extend({
            obj : $('input[data-role="catcomplete"]'),
            objForm : $('#auto-submit'),
        }, options);

        if(typeof settings.obj != 'undefined' && settings.obj.length && typeof $.ui.autocomplete == 'function'){
            settings.obj.each(function(){
                var selfobj = $(this);
                var mustMatch = $.checkUndefined(selfobj.data('must-match'), false);
                var autoSubmit = $.checkUndefined(selfobj.data('auto-submit'), false);
                var additional = $.checkUndefined(selfobj.data('additional'), false);

                selfobj.catcomplete({
                    autoFocus   : true, 
                    appendTo    : $('body'), 
                    delay       : 0, 
                    minLength   : 3, 
                    select      : function(event, ui){
                        var self    = $(this);
                        var label   = $.checkUndefined(ui.item.label);
                        var urlChange   = $.checkUndefined(selfobj.data('select-source'), null);

                        self.val(label);

                        if(autoSubmit){
                            settings.objForm.submit();
                        }

                        if(self.next('input:hidden').length){
                            var reference   = $.checkUndefined(ui.item.reference);
                            var value       = $.checkUndefined(ui.item.value, reference);

                            self.next('input:hidden').val(reference);
                        }

                        if( urlChange != null ) {
                            urlChange += '/id:'+reference+'/';
                            $.directAjaxLink({
                                obj: selfobj,
                                url: urlChange,
                            });
                        }
                    }, 
                    source      : function(request, response){
                        var data_parent;
                        var self        = $(this);
                        var extraParams = $._extractParams(selfobj);
                        var dataSource  = $.checkUndefined(selfobj.attr('data-source'), false);
                        var dataParent  = $.checkUndefined(selfobj.attr('data-parent'), false);
                        var dataCustomSourceUrl  = $.checkUndefined(selfobj.attr('data-custom-source-url'), false);
                        var data_additional = $(additional).val();

                        if(dataCustomSourceUrl != false){
                            dataSource += '/'+dataCustomSourceUrl;
                        }

                        if(dataParent){
                            var data_parent = $(dataParent).val();
                        }

                        var postData    = {
                            'Search' : {
                                'keyword' : request.term,
                                'additional':data_additional,
                                'parent' : data_parent,
                            }, 
                        };

                        if(catCompleteJXHR){
                            catCompleteJXHR.abort();
                        //  self.removeClass('ui-autocomplete-loading').addClass('ui-autocomplete-input');
                        }

                        if(extraParams){
                        //  append additional params ========================================================                   

                            if($.objKeys(extraParams.post).length){
                                postData = $.extend(true, {
                                    'Search' : extraParams.post, 
                                }, postData);
                            }

                            if($.objKeys(extraParams.named).length){
                                var nonFieldParams  = [];
                                var fieldParams     = [];
                                var namedParams     = '';

                                $.each(extraParams.named, function(paramKey, paramValue){
                                    var regex = new RegExp('^\\d+$');

                                    if(regex.test(paramKey)){
                                    //  numeric field name
                                        nonFieldParams.push(paramValue);
                                    }
                                    else{
                                        fieldParams.push(paramKey + ':' + paramValue);
                                    }
                                });

                            //  alter url
                                namedParams+= dataSource.substr(dataSource.length - 1) == '/' ? '' : '/';
                                namedParams+= nonFieldParams.length ? nonFieldParams.join('/') + '/' : '';
                                namedParams+= fieldParams.length ? fieldParams.join('/') : '';

                                if(dataSource.indexOf('?') > -1){
                                    dataSource = dataSource.split('?').join(namedParams + '?');
                                }
                                else{
                                    dataSource+= namedParams;
                                }
                            }

                            if($.objKeys(extraParams.query).length){
                                var queryParams = [];

                                $.each(extraParams.query, function(paramKey, paramValue){
                                    queryParams.push(paramKey + '=' + paramValue);
                                });

                            //  alter url
                                dataSource+= dataSource.indexOf('?') > -1 ? '&' : '?';
                                dataSource+= queryParams.join('&');
                            }

                        //  =================================================================================
                        }

                        catCompleteJXHR = $.post(dataSource, postData, function(data){
                        //  catCompleteCache[term] = data;
                        //  self.removeClass('ui-autocomplete-loading').addClass('ui-autocomplete-input');
                            response(data);
                        }, 'json');
                    }, 
                    open        : function(event, ui){
                        var self            = $(this);
                        var target          = $(event.target);
                        var targetHeight    = target.height();
                        var dropdown        = $('.ui-autocomplete:visible');

                        if(dropdown.length){
                            var dropdownTop     = dropdown.offset().top - $(window).scrollTop();
                            var dropdownHeight  = dropdown.height();
                            var viewportHeight  = $(window).height();
                            var buffer          = 50;

                            dropdown.css({
                                'width' : target.outerWidth() + 'px',  
                            });     
                        }

                    //  self.removeClass('ui-autocomplete-loading').addClass('ui-autocomplete-input');
                    }, 
                    change      : function(event, ui){
                        var self = $(this);

                    //  untuk hapus textbox jika isi tidak sesuai dengan result ajax
                        if(mustMatch && !ui.item){
                            self.val('');

                            if(self.next('input:hidden').length){
                                self.next('input:hidden').val('');
                            }
                        }
                    }, 
                }).click(function(){
                //  $(this).select();
                }).keyup(function(){
                //  reset hidden input when user done typing
                    if($(this).next('input:hidden').length){
                        $(this).next('input:hidden').val('');
                    }
                });
            });
        }
    }

//  additional params extractor
    $._extractParams = function(objElement){
        objElement = typeof objElement == 'object' ? objElement : $(objElement);

        if(objElement.length){
            var objDataKeys = $.objKeys(objElement.data());
            var paramKeys   = ['post', 'named', 'query'];//$.arrayIntersect(objDataKeys, ['post', 'named', 'query']);
            var objParams   = {
                post    : {}, 
                named   : {}, 
                query   : {}, 
            };

            if(paramKeys.length){
                $.each(paramKeys, function(index, paramType){
                //  var params = objElement.data(paramType);
                    var params = objElement.attr('data-' + paramType);

                //  console.log(params);

                    if(typeof params != 'undefined' && params != ''){
                    //  convert to array
                        if(params.indexOf(',') > -1){
                            params = params.split(',');
                        }
                        else{
                            params = [params];
                        }

                    //  trim array params after split (like array_filter())
                        params = $.grep(params, function(v, i){
                            v = $.trim(v);
                            return (typeof v != 'undefined' && v != '');
                        });

                    //  loop params
                        if(params.length){
                            var counter = 0;
                            $.each(params, function(paramIndex, paramValue){
                                var fieldName   = '';
                                var fieldValue  = '';

                            //  check if params contain CLASS or ID selector
                                if(paramValue.match(/[#|.|:]/)){
                                    if(paramValue.indexOf(':') > -1){
                                        fieldName   = paramValue.split(':')[0];
                                        fieldValue  = paramValue.split(':')[1];

                                        fieldName   = $.getObjVal(fieldName);
                                        fieldValue  = $.getObjVal(fieldValue);
                                    }
                                    else{
                                        fieldName   = counter;
                                        fieldValue  = $.getObjVal(paramValue);

                                        counter++;
                                    }
                                }
                                else{
                                    fieldName   = counter;
                                    fieldValue  = paramValue;

                                    counter++;
                                }

                                objParams[paramType][fieldName] = fieldValue;
                            });
                        }
                    }   
                });
            }

            return objParams;
        }
        else{
            return null;
        }
    }

    var scheduledText = function ( date ) {
        var date = $.checkUndefined(date, null);
        var btnObj = $('.link-submit-form.btn-scheduled');
        var text_schedule = btnObj.attr('data-text-schedule');
        var text = btnObj.attr('data-text');

        if( date != null && date.format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm') ) {
            text = text_schedule;
        }

        btnObj.html(text);
    }

    var _callApplyScheduleDate = function ( picker, self ) {
        var dataTarget = $.checkUndefined(self.attr('data-target'), null);
        var rel = $.checkUndefined(self.attr('rel'), null);
        var startDate = picker.startDate.format('DD/MM/YYYY HH:mm');

        if( dataTarget != null ) {
            $(dataTarget).val( startDate );
        }
        if( rel != null && self.is( 'a') ) {
            if ( self.is( 'a' ) ) {
                $('[rel="'+rel+'"]').each(function(i, selected){ 
                    $(selected).data('daterangepicker').setStartDate(startDate);
                    // $(selected).data('daterangepicker').setEndDate(null);
                });

                scheduledText( picker.startDate );
            }
        }
    }

    var _callApplySingleDate = function ( picker, self, flag_trigger, format = 'YYYY-MM-DD' ) {
        var trigger = $.checkUndefined(self.attr('data-trigger'), false);

        var dt = picker.startDate.format(format);
        self.val(dt);

        if( flag_trigger == true && trigger != false ) {
            self.trigger(trigger);
        }        
    }

    var _callApplyDateRange = function ( picker, self, flag_trigger, format = 'YYYY-MM-DD' ) {
        var trigger = $.checkUndefined(self.attr('data-trigger'), false);
        
        startDate = picker.startDate.format(format);
        endDate = picker.endDate.format(format);

        var dt = startDate + ' - ' + endDate;
        self.val(dt);

        if( flag_trigger == true && trigger != false ) {
            self.trigger(trigger);
        }

        if( !self.hasClass('calendar-chart') && $('.date-range-calendar.calendar-chart').length > 0 ) {
            $('.date-range-calendar.calendar-chart').val(dt);
            $('.date-range-calendar.calendar-chart').trigger(trigger);
        }
    }

    $.daterangepicker = function( options ) {
        var settings = $.extend({
            obj: $('.date-range'),
            objTime: $('.date-range-time'),
            objOffPast: $('.date-range-off-past'),
            objReservation: $('.date-reservation'),
            objSchedule: $('.date-schedule'),
            objCalendar: $('.date-range-calendar'),
            objSinglePicker: $('.date-single-picker'),
            objCustom: $('.date-range-custom'),
            objSingle: $('.date-range-single'),
            objSingleTime: $('.date-timerange-time-single'),
        }, options );

        if( settings.objOffPast.length > 0 ){
            settings.objOffPast.daterangepicker({
                locale: {
                    format: 'DD/MM/YYYY',
                },
                "linkedCalendars": false,
                autoUpdateInput: false,
                minDate: new Date(),
            });

            settings.objOffPast.on('apply.daterangepicker', function(ev, picker) {
                var trigger = $.checkUndefined($(this).attr('data-trigger'), false);
                
                startDate = picker.startDate.format('DD/MM/YYYY');
                endDate = picker.endDate.format('DD/MM/YYYY');

                $(this).val(startDate + ' - ' + endDate);

                if( trigger != false ) {
                    $(this).trigger(trigger);
                }
            });
        }

        if( settings.obj.length > 0 ) {
            settings.obj.daterangepicker({
                timePicker: true,
                locale: {
                    format: 'YYYY-MM-DD',
                },
                "linkedCalendars": false,
            });
        }

        if( settings.objTime.length > 0 ){
            settings.objTime.daterangepicker({
                timePicker: true,
                autoUpdateInput: false,
                locale: {
                    format: 'YYYY-MM-DD HH:mm',
                },
                "linkedCalendars": false,
                "timePicker24Hour": true,
            });

            settings.objTime.on('apply.daterangepicker', function(ev, picker) {
                _callApplyDateRange( picker, $(this), true, 'YYYY-MM-DD HH:mm' );
            });
            // settings.objCalendar.on('hide.daterangepicker', function(ev, picker) {
            //     _callApplyDateRange( picker, $(this) );
            // });

            settings.objTime.each(function(i, selected){ 
                var tmp = $(selected).val();

                $(selected).val(tmp)
            });
        } 

        if( settings.objSchedule.length > 0 ) {
            settings.objSchedule.each(function(i, selected){ 
                var self = $(this);
                var value = $.checkUndefined(self.attr('data-value'), null);

                if( value == null ) {
                    startDate = moment().format('DD/MM/YYYY HH:mm');
                } else {
                    startDate = value;
                }
                
                self.daterangepicker({
                    locale: {
                        format: 'DD/MM/YYYY HH:mm',
                    },
                    "linkedCalendars": false,
                    timePicker: true,
                    "timePicker24Hour": true,
                    startDate: startDate,
                    endDate: null,
                    minDate: moment().format('DD/MM/YYYY HH:mm'),
                    singleDatePicker: true,
                });

                if( self.is( 'a') && value != null ) {
                    self.data('daterangepicker').setStartDate($.trim(value));
                    // self.data('daterangepicker').setEndDate(null);

                    scheduledText( self.data('daterangepicker').startDate );
                } else {
                    scheduledText();
                }
            });

            settings.objSchedule.on('apply.daterangepicker', function(ev, picker) {
                _callApplyScheduleDate( picker, $(this) )
            });

            settings.objSchedule.on('hide.daterangepicker', function(ev, picker) {
                _callApplyScheduleDate( picker, $(this) )
            });
        }

        if( settings.objCustom.length > 0 ) {
            settings.objCustom.each(function(){
                var self = $(this);
                var limitday = $.convertNumber(self.attr('data-limit'), 'int');

                if( limitday == 0 ) {
                    limitday = false;
                }

                self.daterangepicker({
                    locale: {
                        format: 'DD/MM/YYYY',
                    },
                    "linkedCalendars": false,
                    dateLimit: { days: limitday },
                });
            });
        }

        if(settings.objSinglePicker.length > 0){
            settings.objSinglePicker.daterangepicker({
                "singleDatePicker": true,
                locale: {
                    format: 'YYYY-MM-DD',
                },
                autoUpdateInput: false,
            })

            settings.objSinglePicker.on('apply.daterangepicker', function(ev, picker) {
                _callApplySingleDate( picker, $(this), true );
            });
            // settings.objCalendar.on('hide.daterangepicker', function(ev, picker) {
            //     _callApplyDateRange( picker, $(this) );
            // });
        }

        if( settings.objCalendar.length > 0 ) {
            settings.objCalendar.daterangepicker({
                ranges: {
                   'Hari ini': [moment(), moment()],
                   'Kemarin': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                   '7 Hari Terakhir': [moment().subtract(6, 'days'), moment()],
                   '30 Hari Terakhir': [moment().subtract(29, 'days'), moment()],
                   'Bulan ini': [moment().startOf('month'), moment().endOf('month')],
                   'Bulan lalu': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                locale: {
                    format: 'YYYY-MM-DD',
                },
                autoUpdateInput: false,
            });

            settings.objCalendar.on('apply.daterangepicker', function(ev, picker) {
                _callApplyDateRange( picker, $(this), true );
            });
            // settings.objCalendar.on('hide.daterangepicker', function(ev, picker) {
            //     _callApplyDateRange( picker, $(this) );
            // });

            settings.objCalendar.each(function(i, selected){ 
                var tmp = $(selected).val();

                $(selected).val(tmp)
            });
        }

        if( settings.objSingle.length > 0 ) {
            settings.objSingle.each(function(){
                var self = $(this);
                var date_val = $.checkUndefined(self.val(), '');

                if( date_val == '' ) {
                    startDate = moment().format('DD/MM/YYYY HH:mm');
                } else {
                    startDate = date_val;
                }

                self.daterangepicker({
                    locale: {
                        format: 'DD/MM/YYYY',
                    },
                    singleDatePicker: true,
                    showDropdowns: true,
                    startDate: startDate,
                });
            });
        }

        if( settings.objSingleTime.length > 0 ) {
            settings.objSingleTime.each(function(){
                var self = $(this);
                var date_val = $.checkUndefined(self.val(), '');;
                var time = $.checkUndefined(self.data('time'), 'false');

                if( date_val == '' ) {
                    startDate = moment().format('DD/MM/YYYY HH:mm');
                } else {
                    startDate = date_val;
                }

                self.daterangepicker({
                    locale: {
                        format: 'DD/MM/YYYY HH:mm',
                    },
                    singleDatePicker: true,
                    showDropdowns: true,
                    timePicker24Hour: true,
                    timePicker: eval(time),
                    startDate: startDate,
                });
            });
        }
    }

    $.showHide = function( options ) {
        var settings = $.extend({
            obj: $('.show-hide'),
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.click(function(){
                var self = $(this);
                var status = $.checkUndefined(self.attr('data-status'), 'hide');
                var target = $.checkUndefined(self.attr('data-target'), false);

                if(status == 'hide'){
                    self.attr('data-status', 'show');
                    self.find('.prm-angle-top').addClass('prm-angle-bottom').removeClass('prm-angle-top');
                    $(target).fadeIn();
                } else {
                    self.attr('data-status', 'hide');
                    self.find('.prm-angle-bottom').addClass('prm-angle-top').removeClass('prm-angle-bottom');
                    $(target).fadeOut();                    
                }

            });
        }
     }

    $.callChoosen = function( options ) {
        var settings = $.extend({
            objTag: $('[data-role="select-tag"]'),
            init: false,
        }, options );

        if( settings.objTag.length > 0 ) {
            if( settings.init == false ) {
                var placeholder = settings.objTag.attr('placeholder');                
                settings.objTag.select2({
                    tags: true,
                    placeholder: placeholder,
                });
            } else {
                settings.objTag.each(function(i,item){
                    $(item).select2(settings.init);
                });
            }
        }
    }
    
    $.formatNumber = function( number, decimals, dec_point, thousands_sep ){
        // Set the default values here, instead so we can use them in the replace below.
        thousands_sep   = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
        dec_point       = (typeof dec_point === 'undefined') ? '.' : dec_point;
        decimals        = !isFinite(+decimals) ? 0 : Math.abs(decimals);

        // Work out the unicode representation for the decimal place.   
        var u_dec = ('\\u'+('0000'+(dec_point.charCodeAt(0).toString(16))).slice(-4));

        // Fix the number, so that it's an actual number.
        number = (number + '')
            .replace(new RegExp(u_dec,'g'),'.')
            .replace(new RegExp('[^0-9+\-Ee.]','g'),'');

        var n = !isFinite(+number) ? 0 : +number,
            s = '',
            toFixedFix = function (n, decimals) {
                var k = Math.pow(10, decimals);
                return '' + Math.round(n * k) / k;
            };

        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (decimals ? toFixedFix(n, decimals) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands_sep);
        }
        if ((s[1] || '').length < decimals) {
            s[1] = s[1] || '';
            s[1] += new Array(decimals - s[1].length + 1).join('0');
        }
        return s.join(dec_point);
    }

    $.convertDecimal = function(self, decimal){
        var val = $.convertNumber(self.val(), 'string');
        var decimal = $.checkUndefined(decimal, 0);
        
        return $.formatNumber(val, decimal);
    }

    $.inputPrice = function(options){
        var settings = $.extend({
            obj: $('.input-price'),
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.off('blur').blur(function (e) {
                var self    = $(this);
                var places  = 0;
                var decimal = self.attr('data-decimal');
                var percent = self.attr('data-percentage');
                var val = $.convertNumber(self.val(), 'float');

                if(self.val().indexOf('.') > -1){
                    places = 2;
                }

                if(typeof decimal != 'undefined'){
                    places = parseInt(decimal);
                }
                if( percent == 'true' ) {
                    var targetAlert = self.attr('data-target-alert');
                    $(targetAlert).find('.error-message').remove();

                    if( val < 0 ) {
                        $(targetAlert).append($.flashNotice('error', 'Tidak boleh lebih kecil dari 0', false, 'error-message', false));
                        self.val(0);
                    } else if( val > 100 ) {
                        $(targetAlert).append($.flashNotice('error', 'Tidak boleh lebih besar dari 100', false, 'error-message', false));
                        self.val(0);
                    }
                }

                self.val($.convertDecimal(self, places));
            });
        }

        settings.obj.trigger('blur');
    }

    // $.hiddenTextFile = function(options){
    //     var settings = $.extend({
    //         obj: $('.hidden-text-file'),
    //     }, options ); 

    //     if( settings.obj.length > 0 ) {
    //         alert(1);
    //         settings.obj.off('blur').blur(function (e) {
    //         });
    //     }
    // }

    $.inputUrl = function(options){
        var settings = $.extend({
            obj: $('.input-url'),
            objParent: $('.order-creative'),
        }, options ); 

        if( settings.obj.length > 0 ) {
            settings.obj.off('blur').blur(function (e) {
                var self    = $(this);
                var val = self.val();
                var data_target = self.data('target');
                var data_rel = self.data('rel');
                

                val = $.wrapWithHttpLink(val);
                self.val(val);

                if(data_target){
                    if(data_rel){
                        $(data_target+'[data-rel='+data_rel+']').html(val);
                    }else{
                        $(data_target).html(val);
                    }
                }

            });

            $.wrapWithHttpLink = function(url){
                var result     = url;
                var textUrl    = 'http://';
                var textUrls   = 'https://';

                if( url != '' ) {
                    var flag = false;
                    if(url.indexOf(textUrl) === -1){
                        flag = true;
                    }

                    if(flag){
                        result = textUrl+url;
                    }
                }
                return result;
            }
        }
    }

    $.orderAbs = function(options){
        var settings = $.extend({
            obj: $('.order-abs'),
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.blur(function(event) {
                var self = $(this);
                var val = self.val();

                if(val <= 0){
                    self.val('');
                }
            });
        }
    }

    $.affixScroll = function(options){
       var settings = $.extend({
            obj: $('.affix-scroll'),
        }, options );   

       if( settings.obj.length > 0 ) {
            settings.obj.each(function(key, input){
                var self = $(this);
                var data_display = self.data('display');

                if($.inArray(data_display, ['only-dekstop']) > -1){
                    var innerWidth = $('body').first().innerWidth();
                    if(innerWidth > 768){
                        self.affix({});
                    } else {
                        self.removeAttr('data-spy');
                    }
                }
            });
       }
    }

    $.membershipToggle = function(options){
        var settings = $.extend({
            obj: $('input[type=checkbox].selector-toggle'),
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.change(function(){
                var self = $(this);
                var trigger_selector_class = self.attr('triggered-selector-class');
                var checked = self.is(':checked');

                if(checked){
                    $(trigger_selector_class).removeClass('hide');
                } else {
                    $(trigger_selector_class).addClass('hide');
                }

            });
        }
    }

    $.inputNumber = function(options){
        var settings = $.extend({
            obj: $('.input-number'),
        }, options );

        if( settings.obj.length > 0 ) {
            settings.obj.keypress(function(event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if( (this.value.length == 0 && charCode == 46) || charCode == 33 || charCode == 64 || charCode == 35 || charCode == 36 || charCode == 37 || charCode == 94 || charCode == 38 || charCode == 42 || charCode == 40 || charCode == 41
                    ){
                    return false;
                } else {
                    if (
                        charCode == 8 ||  /*backspace*/
                        charCode == 46 || /*point*/
                        charCode == 9 || /*Tab*/
                        charCode == 27 || /*esc*/
                        charCode == 13 || /*enter*/
                        // charCode == 97 || 
                        // Allow: Ctrl+A
                        // (charCode == 65 && event.ctrlKey === true) ||
                        // Allow: home, end, left, right
                        (charCode >= 35 && charCode < 39) || ( charCode >= 48 && charCode <= 57 )
                        ) 
                    {
                        return true;
                    }else if (          
                        (charCode != 46 || ($(this).val().indexOf('.') != -1)) || 
                        (charCode < 48 || charCode > 57)) 
                    {
                        event.preventDefault();
                    }
                }
            }).blur(function(){
                var self    = $(this);
                var places  = 0;

                if(self.val().indexOf('.') > -1){
                //  places = self.val().split('.')[1];
                //  places = places.length;
                    places = 2;
                }

                // self.val($.convertDecimal(self, places));
            });     
        }
    }

    $.callPreloader = function( options ) {
        if( $('#render_tbl').length > 0 ) {
            $('.table-responsive, .pagination, .filter-footer').hide();
            var url = $('#render_tbl').attr('data-reload');
            var template = $('#render_tbl').attr('data-template');

            $.ajax({
                url: url,
                dataType: 'html',
                type: 'POST',
                success:function(result){
                    var header_number = '.main-action .data-number';
                    var contentHtml = $(result).find(template).html();
                    var header = $(result).find(header_number).html();

                    $(template).html(contentHtml);
                    $(header_number).html(header);
                    $('#render_tbl').remove();

                    // var tr = $('.table-responsive table.table > tbody > tr');
                    // tr.each(function(i){
                    //     if( i > 9 ){
                    //         $(this).find('.drop-table-content').removeClass('on-top');
                    //         $(this).find('.drop-table-content').addClass('on-bottom');
                    //     }
                    // });
                    
                    $.rebuildFunction();
                    $.rebuildFunctionAjax( $(template) );

                    // tour_guide = $.checkUndefined(tour_guide, false);
                    // if( tour_guide == true ) {
                    //     $.tourGuide();
                    // }
                },
                error: function(){
                    console.log('Server timeout');
                },
                timeout: 30000,
            });
        }
    }

    $.closePopover = function( obj ) {
        $('.close-popup').click(function (e) {
            e.preventDefault();

            var self = $(this);
            var target = self.attr('data-target');

            $(target).html('');
        });
    }

    $.actionPopover = function(options){
        var options = $.extend({
            obj : $('a[data-role="popover-action"], button[data-role="popover-action"]'), 
        }, options);

        var popover_trigger = function ( obj_name ) {
            obj_name.off('click');
            obj_name.on('click', function (e) {
                var describedby = $.checkUndefined($(this).attr('aria-describedby'), null);

                if( describedby == null ) {
                    $(this).popover('show');
                    obj_name.not(this).popover('hide');

                    $.popoverClose();
                    return false;
                } else {
                    $(this).popover('hide');
                }
            });
        }

        $('[data-toggle="popover"]').popover({
            html : true,
            container: 'body',
            'template': '<div class="popover" role="tooltip"><div class="arrow"></div><a href="javascript:void();" class="close"><i class="rv4-cross "></i></a><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        });

        popover_trigger($('[data-toggle="popover"]'));

        if(typeof $.fn.popover == 'function' && options.obj.length){
            options.obj.popover({
                'container' : 'body',
                'content'   : function(){
                    var self = $(this);
                    return self.next('[data-role="popover-content"]').clone().removeClass('hide');
                }, 
                'placement' : 'bottom', 
                'html'      : true, 
            });

            popover_trigger(options.obj);
        }
    }

    $.convertDate = function (date, reverse){
        reverse = $.checkUndefined(reverse, false);

        if(!reverse){
            var split = date.split("/");
            return split[2]+'-'+split[1]+'-'+split[0];
        }else{
            var split = date.split("-");
            return split[2]+'/'+split[1]+'/'+split[0];
        }

    }

    $.ajaxCreative = function(options) {
        var settings = $.extend({
            obj: $('.ajax-creative'),
            objInterval: $('.ajax-interval'),
            objParent: $('.order-creative'),
            init: false,
        }, options );

        $.dataUrl = function(parent, url){
            var date_from =  $.checkUndefined(parent.find('.date-from').val(), false);
            var date_to =  $.checkUndefined(parent.find('.date-to').val(), false);

            if(date_from){
                date_from = $.convertDate(date_from);
                date_from = 'date_from:'+date_from;
                url = url+'/'+date_from;
            }

            if(date_to){
                date_to = $.convertDate(date_to);
                date_to = 'date_to:'+date_to;
                url = url+'/'+date_to;
            }
            return url;
        }

        if(settings.objInterval.length > 0){
            settings.objInterval.change(function(){
                var self = $(this);
                var interval = self.val();
                var formData = $.checkUndefined(self.serialize(), false); 
                var data_rel = $.checkUndefined(self.data('rel'), false);
                var data_url = $.checkUndefined(self.data('url'), false);
                var parent = $('.order-creative[data-rel='+data_rel+']');
                var value = $.checkUndefined(parent.find('.interval-value').val(), 0);
                var date_from = parent.find('.date-from');
                var date_val = parent.find('.date-from').val();

                data_url = data_url+'/'+interval+'/'+value;
                data_url = $.dataUrl( parent, data_url);

                $.ajaxAction(data_url, 'html', formData, data_rel);

                $.selectorOptions(self, parent, '.interval-value');

                var date_val = date_val.split('/');
                date_val = date_val[1]+'/'+date_val[0]+'/'+date_val[2];
                date_val = moment(date_val);
                $.dp_change(date_from, date_val, '.date-to', true);

                $.triggerPeriode(parent, 0);
            });
        }

        if(settings.obj.length > 0){
            settings.obj.change(function(){
                var self = $(this);
                var value = self.val();
                var formData = self.serialize(); 
                var data_rel = self.data('rel');
                var data_url = self.data('url');
                var parent = $('.order-creative[data-rel='+data_rel+']');
                var interval = parent.find('.setting-interval').val();
                var date_from = parent.find('.date-from');

                data_url = data_url+'/'+interval+'/'+value;

                $.ajaxAction(data_url, 'html', formData, data_rel);

                var date_val = parent.find('.date-from').attr('data-date');

                // var date_val = date_val.split('/');
                // date_val = date_val[1]+'/'+date_val[0]+'/'+date_val[2];
                // date_val = moment(date_val);

                $.triggerPeriode(parent, value);
                $.dp_change(date_from, date_val, '.date-to', true);
            });
        }

        $.triggerPeriode = function(parent, val){
            val = $.checkUndefined(val, 0);
            // date_val = $.checkUndefined(date_val, false);

            if(val > 0){
                parent.find('.date-from').removeAttr('disabled');
                parent.find('.date-to').removeAttr('disabled');
                
                var date_from = parent.find('.date-from');
                var date_val = parent.find('.date-from').attr('data-date');

                var date_val = date_val.split('-');
                date_val = date_val[1]+'/'+date_val[2]+'/'+date_val[0];

                var date_pick = $.dateAddrebuild(date_from, date_val, true);
                date_pick = moment(date_pick).format('YYYY-MM-DD');

                if(date_pick != false && date_pick != 'NaN'){
                    parent.find('.date-to').data('DateTimePicker').minDate(false);
                    parent.find('.date-to').attr('data-date', date_pick);
                    // parent.find('.date-to').data('DateTimePicker').minDate(date_pick);                    
                }

            } else {
                parent.find('.date-from').attr('disabled', true).val('');
                parent.find('.date-to').attr('disabled', true).val('');

            }
        }

        $.selectorOptions = function(self, parent, target){
            var data_alias = $.checkUndefined(self.find(':selected').data('alias'), false);
            var val = $.checkUndefined(self.val(), 0);

            if(val != ''){
                var loops = [1, 2, 3, 4];
            } else {
                var loops = [1];
            }

            parent.find(target+" option").remove();
            $.each(loops, function(key, val) {   
                if(key == 0){
                    alias = 'Pilih periode';
                }else{
                    alias = key+' '+data_alias;
                }

                parent.find(target)
                     .append($("<option></option>")
                                .attr("value",key)
                                .text(alias)); 
            });

            // if(data_currency){
            //     $('.change-currency').html(data_currency);
            // }

        }

        $.ajaxAction = function(data_url, dataType, formData, data_rel){
            loadJXHR = $.ajax({
                url: data_url,
                type: 'POST',
                dataType: dataType,
                data: formData,
                beforeSend  : function() {
                    $.loadingbar_progress('beforeSend');
                },
                success: function(result) {
                    var total_price = 0;
                    $('.order-payment-price[data-rel='+data_rel+']').html(result);
                    $('.order-payment-price').each(function(index, input){
                        var self = $(this);
                        var price = $.checkUndefined(self.find('span').data('price'), false);

                        if(price){
                            total_price = total_price + price;                        
                        }
                    });    
                    total_price = $.formatNumber(total_price, 0);
                    $('.order-total-price').html(total_price);         
                }
            }).always(function() {
                $.loadingbar_progress('always');
            });
        }
    }

    $.toggleErrorInput = function(options){
        var settings = $.extend({
            obj             : null,
            message         : '',
            isError         : false,
            inputClass      : 'form-error',
            messageClass    : 'error-message', 
            
        }, options );

    //  reset state
        settings.obj.removeClass(settings.inputClass).next('div.' + settings.messageClass).remove();

        if(settings.obj.length){
            if(settings.isError == true){
                var objMessage = '<div class="' + settings.messageClass + '">' + settings.message + '</div>';

            //  append message after targeted object
                settings.obj.addClass(settings.inputClass).after( $(objMessage) );
            }
        }
    }

    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

//  filter dropdown result
    var listFilterJXHR;
    $.listFilter = function(options){
        var settings = $.extend({
            obj : $(':input.filter-input'),
        }, options);

        if(settings.obj.length){
        //  reset value onload
        //  settings.obj.val('');

            settings.obj.off('change').each(function(){
                var objFilter   = $(this);
                var objList     = $(objFilter.data('list'));
                var objDropdown = objFilter.closest('.drop-wrapper');

                if(objDropdown.length){
                //  reset filter value on blur (when dropdown closed)
                    objDropdown.on({
                        'hide.bs.dropdown' : function(event){
                            settings.obj.val('').trigger('keyup');
                       //   settings.obj.val('');
                            return true;
                        }, 
                        'shown.bs.dropdown' : function(event){
                            if(objFilter.length && objFilter.val() == ''){
                                objFilter.trigger('keyup');
                            }
                        },
                    });

                    if(objList.length < 1){
                        objList = objDropdown.find('ul.result-list');
                    }
                }

                if(objList.length){
                    var objItems = objList.find('.result-item');

                    objFilter.off('keyup').on('keyup', function(event){
                        var self        = $(this);
                        var dataTarget  = $.checkUndefined(self.data('target'));
                        var dataReplace = $.checkUndefined(self.data('replace'), false);
                        var dataSource  = $.checkUndefined(self.data('source'), false);
                        var keyword     = self.val();

                        if(keyword.length){
                            keyword = keyword.toLowerCase();

                        //  hide all (as default state)
                            objItems.hide();

                        //  search matching item or item that already checked
                            var checkedItems = objItems.filter(function(){
                                if($(this).find(':input:checkbox').length){
                                    return $(this).find(':input:checkbox').prop('checked');
                                }

                                return false;
                            });

                            var visibleItems = objItems.filter(function(){
                                if($(this).data('text')){
                                    return $(this).data('text').toLowerCase().indexOf(keyword) > -1;
                                }

                                return false;
                            });

                            if(checkedItems.length) checkedItems.show();
                            if(visibleItems.length) visibleItems.show();
                        }

                        var charCode = (event.which) ? event.which : event.keyCode;
                    //  alert(charCode);

                        if( ($.inArray(charCode, [9, 13, 16, 17, 27]) > -1) || (charCode == 65 && event.ctrlKey === true) || (charCode >= 34 && charCode <= 40) || (charCode >= 48 && charCode <= 57) ){
                        //  do nothing
                        }
                        else{
                            delay(function(){
                            //  pake ajax change
                                $.ajaxLink({ objChange : self });

                            //  force trigger
                                self.trigger('change');
                            }, 500);    
                        }
                    });
                }
            });
        }

        return settings.obj;
    }

//  check all function
	$.pickAll = function(options){
		var settings = $.extend({
			obj : $(':input:checkbox[data-role=pickall]'), 
		}, options);

		settings.obj = $(settings.obj);

		if(settings.obj.length){
			settings.obj.on('change init', function(parentEvt){
				var self = $(this);

			//	get parent (drop wrapper)
				var objParent = $(self.attr('data-parent'));

				if(objParent.length){
				//	get children (checkbox list)
					var objChildren = self.attr('data-child') ? $(self.attr('data-child')) : objParent.find('input:checkbox').not(self);

					if(objChildren.length){
						if(objChildren.is(':checkbox')){
							if(parentEvt.type == 'change'){
							//	change
								objChildren.prop('checked', self.prop('checked')).trigger('change');
							}
							else{
							//	init (set default state)
								checked = objChildren.length == objChildren.filter(':checked').length;
								self.prop('checked', checked);

							//	bind event to child (once when initiated)
								objChildren.bind('change', function(childEvt){
									checked	= objChildren.length == objChildren.filter(':checked').length;

								//	change parent check state based on child state
									self.prop('checked', checked);
								});
							}
						}
						else{
							console.log('pickall error : invalid element type for children');
						}
					}
				}
				else{
					console.log('pickall error : no wrapper defined');
				}
			}).trigger('init');
		}
	}

//  untuk halaman collections
    var collectionSelectors = '[data-role=checkbox-result-placeholder] li :input:checkbox[data-role!=pickall], [data-role="collection-remove"]';
    $('body').on('click change', collectionSelectors, function(event){
        var self        = $(this);
        var list        = $('#manual-input-list');
        var listItem    = true;

        if(self.is(':input:checkbox') && event.type == 'change'){
            var filter = self.closest('ul.result-list').find('li.filter-input-wrapper input:text');
        }
        else{
            var filter = $(self.data('filter'));
        }

        if(filter.length){
            var filterID        = filter.attr('id');
            var dataList        = filter.data('list');
            var dataListItem    = filter.data('list-item');

            if(dataListItem){
                list        = $(dataList);
                listItem    = dataListItem;
            }
        }

        if(list.length){
            if(self.is(':input:checkbox') && event.type == 'change'){
            //  checkbox
                var value   = self.val();
                var text    = self.closest('.checkbox-wrapper').find('label.checkbox-label').text();
                var item    = list.find('li[data-value="' + value + '"]');

                if(typeof value != 'undefined' && value != ''){
                    if(self.prop('checked')){
                        if(item.length == 0){
                            var wrapper = $('<li></li>');
                            var button  = $('<button></button>');
                            var icon    = $('<span></span>').attr('class', 'prm-cross-2');
                            var label   = $('<div></div>').attr('class', 'collection-item-name').text(text);

                            button.attr({
                                'title'         : 'Hapus ' + text, 
                                'type'          : 'button', 
                                'class'         : 'drop-toggle cgray2', 
                                'data-role'     : 'collection-remove', 
                                'data-value'    : value, 
                                'data-filter'   : '#' + filterID, 
                            }).append(icon);

                            button = $('<div class="float-right"></div>').append(button);

                        //  append all
                            list.append(wrapper.attr('data-value', value).append(button).append(label));
                        }
                    }
                    else{
                        if(item.length) item.remove();
                    }
                }
            }
            else{
            //  remove toggle
                var value   = self.data('value');
                var item    = $(collectionSelectors).filter(':input:checkbox:checked[value="' + value + '"]');

                if(item.length){
                    if(confirm('Apakah Anda yakin ingin menghapus data ini?')){
                        item.prop('checked', false).trigger('change');
                    }

                }
            }
        }
    }).ready(function(event){
		if($(collectionSelectors).length){
            $(collectionSelectors).filter(':input:checkbox:checked').trigger('change');
        }
    });

    $('body').on('click', '[data-role="remove-toggle"]', function(event){
        var self    = $(this);
        var target  = $(self.attr('data-target'));

        if(target.length){
            target.remove();
        }
    });

    $('body').on('click', '[data-role="clone-toggle"], [data-role="clone-remove"]', function(event){
        var self    = $(this);
        var role    = $.checkUndefined(self.data('role'));
        var reIndex = true;

        if($.inArray(role, ['clone-remove', 'clone-toggle']) > -1){
            var target      = $.checkUndefined(self.data('target'));
            var useCkeditor = typeof CKEDITOR != 'undefined' && typeof CKEDITOR.instances != 'undefined';

            if(role == 'clone-toggle'){
                var source = $.checkUndefined(self.data('source'));

                if($(target).length && $(source).length){
                    var clone   = $(source).eq(0).clone();
                    var inputs  = clone.find(':input');

                    if(inputs.length){
                        inputs.each(function(index, input){
                            var inputID         = $(input).attr('id');
                            var inputName       = $(input).attr('name');
                            var instanceName    = inputID ? inputID : inputName;

                            if($(input).is('select')){
                                $(input).find('option:first').prop('selected', true);
                            }
                            else{
                                $(input).val('');
                            }

                            if(useCkeditor && typeof CKEDITOR.instances[instanceName] != 'undefined'){
                            //  input ckeditor
                                var editor = $(input).next('div.cke, div');
                                if(editor.length){
                                    editor.remove();
                                }
                            }
                        });
                    }

                //  append to wrapper
                    var cloneRemove = clone.find('[data-role="clone-remove"]');
                    if(cloneRemove.length){
                        cloneRemove.removeClass('hide');
                    }

                //  clear any flash message inside cloned object
                    var flashMessages = clone.find('div.error-message, div.success-message');
                    if(flashMessages.length){
                        flashMessages.remove();
                    }

                    $(target).append(clone);
                }
            }
            else{
                var item        = self.closest('[data-role="clone-item"]');
                var siblings    = item.siblings();

                if(item.length && siblings.length){
                    if(confirm('Apakah Anda yakin ingin menghapus data ini?')){
                        item.remove();
                        siblings.eq(0).find(':input:eq(0)').trigger('change');    
                    }
                    else{
                        reIndex = false;
                    }
                }
                else{
                    alert('Tidak dapat menghapus item terakhir');
                    reIndex = false;
                }
            }

        //  re-index inputs
            if($(target).length && reIndex){
                var items = $(target).find('[data-role="clone-item"]');

                if(items.length){
                    var triggerMatch = false;

                    items.each(function(itemIndex, item){
                        var self    = $(item);
                        var inputs  = self.find(':input, label');

                        if(inputs.length){
                            inputs.each(function(inputIndex, input){
                                var inputVal    = $(input).val();
                                var inputID     = $(input).attr('id');
                                var inputName   = $(input).attr('name');
                                var renameMatch = $(input).data('rename-match');
                                var tagName     = $(input).prop('tagName');

                                if(tagName == 'label'){
                                    var inputFor    = $(input).attr('for');
                                    var attributes  = {
                                        'id'    : inputID ? inputID.replace(/\d+/g, itemIndex) : '',
                                        'for'   : inputFor ? inputFor.replace(/\d+/g, itemIndex) : '',
                                    };
                                }
                                else{
                                    var attributes = {
                                        'id'    : inputID ? inputID.replace(/\d+/g, itemIndex) : '',
                                        'name'  : inputName ? inputName.replace(/\d+/g, itemIndex) : '',
                                    };

                                    if(renameMatch && $(input).hasAttr('data-match')){
                                        var dataMatch = $(input).attr('data-match');

                                        attributes = $.extend({
                                            'data-match' : dataMatch.replace(/\d+/g, itemIndex),
                                        }, attributes);

                                        triggerMatch = true;
                                    }
                                }

                                $(input).attr(attributes);

                                if(useCkeditor && $(input).hasClass('editor')){
                                //  re init ckeditor
                                    $.editor({ obj : $(input) });
                                }
                            });
                        }
                    });

                    if(triggerMatch){
                        items.last().find('select[data-rename-match="true"]').trigger('init');
                    }

                    $.rebuildFunction();
                }
            }
        }
    });

    $.reindexList = function(options){
        var settings = $.extend({
            obj     : null, 
            child   : null, 
        }, options);

        var target = $(settings.obj);

        if(target.length){
            var rules = target.data('rule');
            var child = settings.child ? settings.child : target.data('child');
                child = $(child);

            if(child && child.length && rules && $.isArray(rules)){
                child.each(function(childIndex, childObj){
                    childObj = $(childObj);

                    $.each(rules, function(ruleIndex, rule){
                        var rule        = eval(rule);
                        var selector    = $.checkUndefined(rule[0]);
                        var attributes  = $.checkUndefined(rule[1]);
                            attributes  = $.isArray(attributes) ? attributes : [attribute];

                        var reindexTarget = childObj.find(selector);

                        if(reindexTarget.length){
                            reindexTarget.each(function(targetIndex, reindexTargetObj){
                                var reindexTargetObj = $(reindexTargetObj);
                                var targetAttributes = {};

                                $.each(attributes, function(attributeIndex, attributeName){
                                    if(reindexTargetObj.hasAttr(attributeName)){
                                        var newValue = reindexTargetObj.attr(attributeName).toString();
                                        //  newValue = newValue.replace(/[0-9]/g, childIndex);
                                            newValue = newValue.replace(/\d+/g, childIndex);

                                        targetAttributes[attributeName] = newValue;
                                    }
                                });

                                if(targetAttributes){
                                    reindexTargetObj.attr(targetAttributes);

                                    if(reindexTargetObj.hasClass('editor')){
                                        $.editor({ obj : reindexTargetObj });
                                    }
                                }
                            });

                            if(reindexTarget.is(':input') && reindexTarget.hasClass('handle-toggle')){
                                reindexTarget.trigger('init');
                            }
                        }
                    });
                });

                $.rebuildFunction();
            }
        }
    }

    $.fn.extend({
		insertAtCaret: function(myValue){
			return this.each(function(i){
				if(document.selection){
				//	For browsers like Internet Explorer
					this.focus();
					var sel	= document.selection.createRange();

					sel.text = myValue;
					this.focus();
				}
				else if(this.selectionStart || this.selectionStart == '0'){
				//	For browsers like Firefox and Webkit based
					var startPos = this.selectionStart;
					var endPos = this.selectionEnd;
					var scrollTop = this.scrollTop;
					this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
					this.focus();
					this.selectionStart = startPos + myValue.length;
					this.selectionEnd = startPos + myValue.length;
					this.scrollTop = scrollTop;
				}
				else{
					this.value += myValue;
					this.focus();
				}
			});
		}
	});

    $.tagPicker = function(settings){
		var settings = $.extend({
			obj : '.tag-picker', 
		}, settings);

		settings.obj = $(settings.obj);

		if(settings.obj.length){
			settings.obj.on('click', function(event){
				event.preventDefault();

				var self		= $(this);
				var dataTarget	= self.data('target');
				var dataValue	= self.data('value');
				var dataSpace	= self.data('space');
				var dataReplace	= self.data('replace');
				var objTarget	= $(dataTarget);

				if(objTarget.length){
					if(dataReplace){
						objTarget.val(dataValue);
					}
					else{
						objTarget.insertAtCaret(dataValue);
					}
				}
			});
		}
    }

    $.tagPicker();

    $.func_type_plan = function(){
        $('.func-type-plan').change(function(){
            var self = $(this);

            var value = self.val();

            var product_target = $('.product-box');
            var blok_target = $('.blok-box');
            var files_background_box = $('.files-background-box');

            if(value == 'siteplan' || value == 'blok' || value == 'bloks'){
                product_target.show();

                if(value == 'siteplan' || value == 'bloks'){
                    blok_target.show();
                    files_background_box.show();
                }else{
                    blok_target.hide();
                    files_background_box.hide();
                }
            }else{
                product_target.hide();
                blok_target.hide();
                files_background_box.show();
            }
        });
    }

    $.directModal = function(options){
        var settings = $.extend({
            obj: $('.directModal'),
            objId: $('#myModal'),
            objTarget: '.modal-body'
        }, options );

        if(settings.obj.length > 0){
            settings.obj.off('click');
            settings.obj.click(function(){
                var vthis = settings.obj;

                var data_source = $.checkUndefined(vthis.attr('data-source'), 'media');
                settings.objId.addClass(data_source);

                var template = vthis.data('target-template');
                var type = vthis.data('type');

                var content_template = $(template).html();

                if(content_template.length > 0){
                    settings.objId.html(content_template);
                    settings.objId.modal({
                        show: true,
                    });

                    if(type == 'facility'){
                        $.submitOtherFacility(settings.objId);
                    }
                }

                return false;
            });
        }
    }

    $.submitOtherFacility = function(objModal){
        $('.submit-input-other-facility').click(function(){
            var self = $(this);

            var root_parent = self.parents('.other-facility-box-form');

            var self_target = root_parent.find('input.other-text-field');

            var value = $.checkUndefined(self_target.val(), false) ;
            var model = $.checkUndefined(self_target.data('model'), 'ProductFacility') ;
            
            if(value != false){
                var cek_dot = value.indexOf('.');

                if(cek_dot <= 0){
                    values = value.split(',');

                    for (var i = 0; i < values.length; i++) {
                        value = values[i];
                        
                        var id_text = 'facilities-'+i+value;
                        id_text = id_text.replace(/ /g, '-');

                        if( $('#'+id_text).length == 0 ) {
                            var content = '<div class="col-sm-6">'+
                                '<div class="checkbox-wrapper">'+
                                    '<div class="checkbox-button">'+
                                        '<input type="hidden" name="data['+model+'][other_text]['+value+']" id="'+id_text+'_" value="0">'+
                                        '<input type="checkbox" name="data['+model+'][other_text]['+value+']" value="'+value+'" id="'+id_text+'">'+
                                        '<label for="'+id_text+'"></label>'+
                                    '</div>'+
                                    '<label for="'+id_text+'" class="checkbox-label">'+value+'</label>'+
                                '</div>'+
                            '</div>';

                            $('#property-facilities > div.row').append(content);

                            $('#'+id_text).attr('checked', true);
                        }
                    };

                    objModal.modal('hide');
                }else{
                    alert('Tidak boleh menggunakan titik (.)');    
                }
            }else{
                alert('Mohon isi fasilitas');
            }
        }); 
    }

    $.tooltipBar = function( options ){
        var settings = $.extend({
            obj: $('[data-toggle="tooltip"]'),
            page: 1,
        }, options );

        settings.obj.tooltip({
            'html': true,
        });
    }

    $.triggerEvent = function( options ){
        $('.trigger-event').off('click').click(function(){
            var target = $(this).attr('data-target');
            var events = $.checkUndefined($(this).attr('data-event'), 'click');

            $(target).trigger(events);
        });
    }

    $.delayRemoveAlert = function( options ){
        var alerts = $('.wrapper-message .alert-wrapper.open, .wrapper-ajax-alert .alert-wrapper.open');
        if( alerts.length > 0 ) {
           alerts.delay( 5000 ).fadeOut('normal', function() {
                $(this).empty();
            });
        }
    }

    $.copy_atrribute = function(){
        if($('.copy-all-attribute-to-children').length > 0){
            $(document).ready(function(){
                $('#building-group-view').removeClass('hide');

                if ($(window).width() >= 1024) {
                    hoverProduct();
                    hoverStage();
                    clickProduct();
                    clickStage();
                    showTooltip();
                }
                
                $('.copy-all-attribute-to-children').each(function(index, element){
                    var self = $(this);
                    var children = self.children('path, polygon, rect');
                    
                    $.each(self.data(), function(field, value) {
                        if(field == 'class' || field == 'fill' || field == 'id' || field == 'fill-opacity'){
                            field = field;
                        }else{
                            field = 'data-'+field;
                        }

                        children.attr(field, value);
                    });
                });

                $('.availability-toggle').click(function(){
                    var self = $(this);
                    var target = $('.product-list li.inactive');
                    var target_svg = $('.building-slice-svg path.unit-unavailable, .building-slice-svg polygon.unit-unavailable, .building-slice-svg rect.unit-unavailable');

                    if(self.prop('checked')){
                        target.addClass('hide');
                        // target_svg.addClass('hide');
                    }else{
                        target.removeClass('hide');
                        target_svg.removeClass('hide');
                    }
                });
            });
        }
    }

    $.filterInput = function( options ) {
        if( $('.filter-panel .filter-search').length > 0 ) {
            $('.filter-panel .filter-search').off('keyup').keyup(function(){
                var self = $(this);
                var searchText = self.val().toLowerCase();
                var parent = self.parents('.filter-panel');

                if( searchText != '' ) {
                    parent.find('.filter-list > .item').each(function(){
                        var currentLiText = $(this).attr('data-keyword').toLowerCase();
                        var showCurrentLi = currentLiText.indexOf(searchText) !== -1;

                        if( showCurrentLi == true ) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                } else {
                    parent.find('.filter-list > .item').show();
                }
            });
        }
    }

    $._callLabelCheckbox = function (options) {
        var settings = $.extend({
            obj: $('.drop-wrapper .drop-content .checkbox-wrapper'),
            objChk: $('.drop-wrapper .drop-content .checkbox-wrapper input[type="checkbox"]'),
            lblEmpty: $('.drop-wrapper .drop-toggle'),
            objTarget: $('.drop-wrapper .drop-toggle > label.title'),
            strChk: 'input[type="checkbox"]',
            strLbl: 'label.radio-label',
        }, options );

        function _callTriggerChecboxDropdown () {
            var result = '';

            settings.obj.each(function() {
                var inputChk = $(this).find(settings.strChk);
                var label = $(this).find(settings.strLbl).html();

                if( inputChk.is(':checked') ) {
                    if( result == '' ) {
                        result += label;
                    } else {
                        result += ', '+label;
                    }
                }
            });

            if( result != '' ) {
                resultTitle = result.substr(0,18);

                if( result.length > 18 ) {
                    resultTitle += '..';
                }


                settings.objTarget.html(resultTitle);
            } else {
                settings.objTarget.html(settings.lblEmpty.attr('data-empty'));
            }
        }

        settings.objChk.off('click').click(function(){
            _callTriggerChecboxDropdown();
        });

        _callTriggerChecboxDropdown();
    }

    $.popupWindow = function (options) {
        var settings = $.extend({
            obj: $('.popup-window'),
        }, options );
        
        if( settings.obj.length > 0 ) {
            settings.obj.off('click');
            settings.obj.click(function(){
                var self = $(this);
                var width = $.checkUndefined(self.attr('data-width'), 500);
                var height = $.checkUndefined(self.attr('data-height'), 300);
                var url = $.checkUndefined(self.attr('href'), false);
                var title = $.checkUndefined(self.attr('title'), '');
                var top = ($(window).height() / 2) - (height / 2);
                var left = ($(window).width() / 2) - (width / 2);

                if(self.hasAttr('data-pin-custom') && url === false){
                    url = self.data('pin-href');
                    self.attr('href', url);
                }

                if( url != false ) {
                    window.open(url, title, 'left='+left+',top='+top+',height='+height+',width='+width);
                }

                return false;
            });
        }
    }

    var btnBackToTop = $('#back-to-top');
    if(btnBackToTop.length){
        var button = btnBackToTop.find('a');

        button.click(function(){
            $('html, body').animate({
                scrollTop : 0,
            }, 500);
        });

         $(document).on('scroll', function(){
            if($(this).scrollTop() > 100){
                button.fadeIn('fast');
            }
            else{
                button.fadeOut('fast');
            }
        }).trigger('scroll');
    }

    var popupModal = $('#popup-modal');
    if(popupModal.length){
        popupModal.modal('show').css('display', 'block').on('hidden.bs.modal', function(event){
			var protocol	= window.location.protocol;
			var host		= window.location.host;
			var baseURL		= protocol + '//' + host;

			$.get(baseURL + '/backprocess/popups/disable');

			var carousel	= $(this).find('.carousel');
			var activeItem	= carousel.find('.carousel-inner .item.active');

			if(activeItem.length){
				var objVideoPlayer	= activeItem.find('iframe.video-player');
				var objVideoOverlay	= activeItem.find('div.video-overlay');
				var currentSource	= objVideoPlayer.attr('src');

				if(objVideoPlayer.length && currentSource.indexOf('autoplay') > -1){
				//  just reset the video that has been played
					var dataOriginal = $.checkUndefined(objVideoPlayer.attr('data-original'));

					objVideoPlayer.attr('src', dataOriginal);
					objVideoOverlay.show();
				//	console.log('video turned off');
				}
			}

			carousel.carousel('cycle');
        });
    }

    $.autoSearch = function(options){
        var settings = $.extend({
            obj     : $('a.auto-search'),
            input   : $(':input#suggestionForm'), 
        }, options);

        settings.obj    = $(settings.obj);
        settings.input  = $(settings.input);

        if(settings.obj.length && settings.input.length){
            settings.obj.on('click', function(evt){
                evt.preventDefault();

                var self        = $(this);
                var dataType    = $.checkUndefined(self.attr('data-type'));
                var dataField   = $.checkUndefined(self.attr('data-field'));
                var dataValue   = $.checkUndefined(self.attr('data-value'));
                var newAttrs    = {};

                if(dataType){
                    newAttrs = $.extend({ 'data-type' : dataType }, newAttrs);
                }

                if(dataField){
                    newAttrs = $.extend({ 'data-field' : dataField }, newAttrs);
                }

            //  set additional attributes to target
                settings.input.attr(newAttrs).val(dataValue);

                var searchButton = $('.btn-search');
                if(searchButton.length){
                //  trigger ajax request when search form shown
                    $('body').on({
                        'search:shown'      : function(evt){ settings.input.trigger('keydown'); }, 
                        'search:done'       : function(evt){ settings.input.removeAttr('data-field data-value data-type'); }, 
                        'search:rendered'   : function(evt){ settings.input.blur(); }, 
                    });

                //  open search box
                    searchButton.trigger('click');
                }
            });
        }
    }

    $.recalcBs = function(options){
        var settings = $.extend({
            obj     : $('a[data-toggle="tab"]'),
        }, options);

        settings.obj.on('shown.bs.tab', function (e) {
            $('[data-simplebar-direction]').simplebar('recalculate');
        });
    }

    $.highlightOverlyOn = function(obj){
        if( obj.parents('.wrapper-highlight-overly').length > 0 ) {
            if( $('.alert.alert-success').length > 0 ) {
                $.highlightOverlyOff(obj);
            } else {
                $('.wrapper-highlight-overly').addClass('active');
                $('.overlay-grey').addClass('active');
            }
        }
    }

    $.highlightOverlyOff = function(obj){
        $('.wrapper-highlight-overly').removeClass('active');
        $('.overlay-grey').removeClass('active');
        $('.daterangepicker.dropdown-menu').css('z-index', '100');
        $('.ui-autocomplete.ui-menu').css('z-index', '100');
    }

    $.highlightOverly = function(options){
        var settings = $.extend({
            obj : $('.wrapper-highlight-overly'),
            objOverly : $('.overlay-grey'),
        }, options);

        settings.obj.off('mousedown').mousedown(function(){
            settings.obj.addClass('active');
            settings.objOverly.addClass('active');

            $('.daterangepicker.dropdown-menu').css('z-index', '9999');
            $('.ui-autocomplete.ui-menu').css('z-index', '9999');
        });
    }

    $.validate_input_number = function(options){
        var settings = $.extend({
            obj : $('.validate-input-number'),
        }, options);

        if(settings.obj.length > 0){
            settings.obj.bind('keyup blur', function(){
                validateNumber($(this));
            });

            function validateNumber(self){
                var val = self.val();
                var validate_requirement = self.data('validate');
                var config = self.data('config');
                var message = '';
                var default_value = '';

                var arr_message = [];

                var type = $.checkUndefined(config.type, 'alert');
                var default_value = $.checkUndefined(config.default, false);
                var error = false;
                val = val.replace(/,/g, '');
                val = parseInt(val);

                if(val == ''){
                    val = 0;
                }

                if(validate_requirement != ''){
                    $.each(validate_requirement, function(key, value) {
                        if(key == 'min' && val < value){
                            message = 'Nilai minimal adalah %s';
                        }else if(key == 'max' && val > value){
                            message = 'Nilai maksimal adalah %s';
                        }else{
                            message = '';
                        }

                        message = message.replace(/%s/g, value);

                        if(message != '' && type == 'alert'){
                            alert(message);
                        }else{
                            arr_message.push(message);
                        }
                    });

                    if(arr_message.length > 0){
                        message = arr_message.join("\n");

                        var parent_target = self.parent();
                        if(parent_target.hasClass('input-group')){
                            parent_target = parent_target.parent();
                        }

                        var target = parent_target.find('.error-message');

                        if(target.length > 0){
                            target.text(message);
                        }else{
                            parent_target.append('<div class="error-message">'+message+'</div>');
                        }
                    }
                }
            }
        }
    }

//  GOOGLE CALENDAR
    // if($('.validation-email').length > 0){
    //     $('.validation-email').blur(function(){
    //         var self = $(this);
    //         var val = self.val();
    //         var data_filter = $.checkUndefined(self.data('filter'), false);
    //         var data_source = $.checkUndefined(self.data('source'), false);

    //         val = val.trim();

    //         if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)){ 
    //             var res = val.split("@");
    //             var ext = $.checkUndefined(res[1], false);

    //             if(ext == data_filter){
    //                 $(data_source).fadeIn();
    //             } else {
    //                 $(data_source).fadeOut();
    //             }
    //         } else {
    //             $(data_source).fadeOut();
    //         }

    //     });
    //     $('.ui-autocomplete.ui-menu').css('z-index', '100');
    // }

    // if($('.google-client-text').length > 0){
    //     var settings = {
    //         obj : $('.google-client-text'),
    //         objGuide : $('.guide-google'),
    //         objConnected : $('.google-connected'),
    //     }

    //     var val  = settings.obj.val();
    //     googleConnected(val);

    //     settings.obj.change(function(){
    //         var self = $(this);
    //         var val = self.val();
    //         var data_filter = self.data('filter');


    //         var result = val.search('.apps.googleusercontent.com');

    //         if(result == -1 && val != ''){
    //             self.val('');
    //             val = '';
    //         } else {
    //             $.directAjaxLink({
    //                 obj: self,
    //                 callback: 'google-cal'
    //             });
    //         }

    //         googleConnected(val);

    //     });

    //     function googleConnected(val){
    //         if(val != ''){
    //             settings.objGuide.fadeOut();
    //             settings.objConnected.fadeIn();
    //         } else {
    //             settings.objGuide.fadeIn();
    //             settings.objConnected.fadeOut();
    //         }
    //     }
    // }

    // if($('.toogle-google-calendar').length > 0){
    //     $('.toogle-google-calendar').click(function(){
    //         var self = $(this);
    //         var checked = self.is(':checked');
    //         var data_target = self.data('target');

    //         if(checked){
    //             $(data_target).fadeIn();
    //         } else {
    //             $(data_target).fadeOut();
    //         }
    //     });
    // }

    $.googleCal = function(type, json, key_id, document_id, model, url_referer){
        var settings = {
            obj : $('.act_google_cal'),
        }

        if(settings.obj.length > 0){
            $.ajax({
              type: "POST",
              url: '/backprocess/settings/googleID/',
              dataType: 'json',
              success: function(result) {
                var google_client_id  = $.checkUndefined(result.google_client_id, false);
                if(google_client_id != ''){
                    $.googleProcess(result, type, json, key_id, document_id, model, url_referer);
                }
              }
            });
        }
    }

    $.googleProcess = function(result, type, json, event_id, document_id, model, url_referer){
        var google_id = $.checkUndefined(result.google_client_id, false);

        var settings = {
            authorize : $('#authorize, .authorize'),
            signout   : $('#signout, .signout'),
            trigger   : $('.trigger-google'),
        };

        // Client ID and API key from the Developer Console
        var CLIENT_ID = google_id;
        // var READONLY = $.checkUndefined(result.readonly, false);
        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/calendar";

        /**
        *  On load, called to load the auth2 library and API client library.
        */
        gapi.load('client:auth2', initClient);

        /**
        *  Initializes the API client library and sets up sign-in state
        *  listeners.
        */
        function initClient() {
            gapi.client.init({
              discoveryDocs: DISCOVERY_DOCS,
              clientId: CLIENT_ID,
              scope: SCOPES
            }).then(function () {
              // Listen for sign-in state changes.
              gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
              // Handle the initial sign-in state.
              updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

              if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                getEmails();
              }
              
              if(type == 'doAction'){
                gapi.client.load('calendar', 'v3', $.doActionEvent(json, event_id, document_id, model, url_referer));
              }
              // settings.signout.onclick = handleSignoutClick;
            });
        }

        /**
        *  Called when the signed in status changes, to update the UI
        *  appropriately. After a sign-in, the API is called.
        */

        function getEmails(){
            var email = '';
            var strip = '';
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                email = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
                strip = '&nbsp;-&nbsp;';
            }
                
            $('.set-email-google').html(email);
            $('.strip-google').html(strip);
        }

        function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                settings.authorize.css('display', 'none');
                settings.signout.css('display', 'inline-block');
                settings.trigger.removeAttr('disabled');
            } else {
                settings.authorize.css('display', 'inline-block');
                settings.signout.css('display', 'none');
                settings.trigger.attr('disabled', 'disabled');
            }
            getEmails();
        }
        
        if($('#authorize, .authorize').length > 0){
            $('#authorize, .authorize').click(function(){
                gapi.auth2.getAuthInstance().signIn();
            });
        }

        if($('#signout, .signout').length > 0){
            $('#signout, .signout').click(function(){
                gapi.auth2.getAuthInstance().signOut();
            });
        }
    }

// END GOOGLE CALENDAR
    $('.payment-selector button').click(function() {
        var settings = {
            payment : $('.is_payment'),
            tenor : $('.tenor-selector, .bank-selector'), 
        };

        var self = $(this);
        self.addClass('choose-box-active').siblings().removeClass('choose-box-active');
        settings.payment.attr('disabled', true);
        self.find(settings.payment).removeAttr('disabled');

        var val_payment = self.find(settings.payment).val();
        var flag = $.inArray( val_payment, [ '15', '99' ] );

        if( flag > -1 ){
            settings.tenor.fadeIn();
        } else {
            settings.tenor.fadeOut();
        }
    });

    $.select_dropdown = function(options){
        var settings = $.extend({
            obj : $('.main-choose-drop-toggle'),
            objVal : $('.drop-wrapper .val-toggle'),
        }, options);

        if(settings.obj.length > 0){
            settings.obj.off('click');
            settings.obj.click(function(){
                var self = $(this);
                var val = self.data('value');
                var text = self.text();

                settings.obj.removeClass('active');
                self.addClass('active');

                var parent_target = self.parents('.drop-wrapper');
                var default_text = 'Pilih cara pembayaran';

                if(val != '' || val != 0){
                    default_text = text;
                }

                var target_text = parent_target.find('.drop-toggle');

                target_text.html(default_text+' <span class="prm-angle-bottom"></span>');

                settings.objVal.val(val);

                $.directAjaxLink({
                    obj: self,
                });
            });
        }
    }

    $.show_less_description = function(options){
        $('.open-more').click(function(){
            var self = $(this);
            var url_async = $.checkUndefined(self.attr('data-url'), '');
            var parent = self.parents('.open-more-box');

            if(url_async != ''){
                $.ajax({
                    url : url_async,
                    type : "post",
                    async : true,
                    success : function(data) {}
                });
            }

            parent.find('.text-editor-hide').remove();
            parent.find('.text-load-more.text-editor').css('height', 'initial');
            parent.find('.text-load-more.text-editor').css('max-height', 'initial');
            self.remove();
        });
    }

    $.copyClipboard = function(options){
        $('.copy-clipboard').off('click').click(function(){
            var self = $(this);
            var txtAlert = $.checkUndefined(self.attr('data-alert'), null);

            self.select();

            document.execCommand("copy");

            if( txtAlert != null ) {
                alert(txtAlert);
            }
        });
    }

    $.rangeSlider = function(){
        var slider = $('.range-slider'),
          range = $('.range-slide_range'),
          value = $('.range-slide_value');
        
        slider.each(function(){
            value.each(function(){
                var value = $(this).prev().attr('value');
                $(this).html(value);
            });

            range.on('input', function(){
                var self = $(this);
                var value_range = parseFloat(this.value);

                var from = $.checkUndefined(self.data('target-from-range'), '');
                var to = $.checkUndefined(self.data('target-to-range'), '');

                if(from != '' && to != ''){
                    var obj_from = parseFloat($(from).val().replace(/,/gi, ""));
                    var obj_to = $(to);

                    var total = obj_from*(value_range/100);

                    $(obj_to).val($.formatNumber(total, 0));
                }

                var prev = self.prev(value);

                var attribute = $.checkUndefined(prev.data('text-attribute'), '');

                prev.html(value_range+attribute);
            });
        });
    }

    $.triggerChangeCurrency = function(){
        $('.trigger-change-currency').off('change');
        $('.trigger-change-currency').change(function(){
            var self = $(this);
            var target_label = self.data('target-label');
            var value = self.find('option:selected').text();
            var target = $(target_label);

            target.text(value);
        });

        if($('.trigger-change-currency').length > 0){
            $('.trigger-change-currency').trigger('change');
        }
    }

    $.paymentDetail = function(){
        if( $('.custom-range-payment-periode').length > 0 ){
            $('.custom-range-payment-periode').off('click');
            $('.custom-range-payment-periode').click(function(){
                var self = $(this);
                var parent_target = self.parents('.items-installment');

                var section = parent_target.find('.range-custom-payment-section');

                if(section.hasClass('hide')){
                    section.removeClass('hide');
    
                    var text = '<span class="cgray2 small-text">Batal</span>';
                    var is_custom_payment = 1;

                    section.val('');
                }else{
                    section.addClass('hide');

                    var text = '<span class="cblack2 small-text">Jarak Periode</span>';
                    var is_custom_payment = 0;
                }

                parent_target.find('.is-custom-payment').val(is_custom_payment);

                self.html(text);
            });
        }

        if( $('.add-payment-periode').length > 0 ){
            $('.add-payment-periode').off('click');
            $('.add-payment-periode').click(function(){
                var self = $(this);
                var parent_target = self.parents('.items-installment');

                var period_from     = parent_target.find('.period-from-payment').val();
                var period_to       = parent_target.find('.period-to-payment').val();
                var period_price    = parent_target.find('.period-price-payment').val();

                var box         = self.data('box'); 
                var copy        = self.data('copy');
                var tag         = $.checkUndefined(self.data('tag'), 'li');
                var class_tag   = $.checkUndefined(self.data('class-tag'), '');
                var rebuild_function   = $.checkUndefined(self.data('price-function', ''));

                var target = $(box);

                var target_value = 0;
                if(period_to != '' && period_to != 0){
                    target_value = parseInt(period_to);
                }else if(period_from != '' && period_from != 0){
                    target_value = parseInt(period_from);
                }

                target_value++;

                $(copy).find('.period-from-payment').attr('value', target_value);
                $(copy).find('.period-price-payment').attr('value', period_price);

                var content = $(copy).html();

                $(copy).find('.period-from-payment').attr('value', '');
                $(copy).find('.period-price-payment').attr('value', '');
                
                if(tag != 'li'){
                    target.append('<'+tag+' class="'+class_tag+'">'+content+"</"+tag+">");    
                }else{
                    target.append('<li class="items">'+content+"</div>");    
                }

                var content = '<span class="cred small-text">Hapus</span>';

                self.html(content);

                self.addClass('delete-payment-periode');
                self.removeClass('add-payment-periode');

                $.inputNumber({
                    obj: $('.items-installment .input-number'),
                });
                
                $.inputPrice({
                    obj: $('.items-installment .input-price'),
                });

                $.paymentDetail();
            });
        }

        if($('.delete-payment-periode').length > 0){
            $('.delete-payment-periode').off('click');
            $('.delete-payment-periode').click(function(){
                var self = $(this);
                var parent_target = self.parents('.items-installment');

                parent_target.remove();
            });
        }
    }

    $.paymentChannelHandler = function(){
        if($('.payment-channel-handle').length > 0 || $('.payment-channel-other-handle').length > 0){
            $('.payment-channel-handle').off('change');
            $('.payment-channel-handle').change(function(){
                var self = $(this);
                var val = self.val();

                var target_payment_channel_transfer = $('.payment-channel-transfer');
                var target_payment_channel_transfer_other = $('.payment-channel-transfer-other');
                var target_payment_channel_advance = $('.payment-channel-advance');

                if((val == '99' || val == 99) || (val == '98' || val == 98)){
                    if(val == '99' || val == 99){
                        target_payment_channel_transfer.show();
                    }else{
                        target_payment_channel_transfer.hide();

                        $('.payment-channel-transfer select').val('');
                        $('.payment-channel-transfer-other input').val('');
                    }

                    target_payment_channel_advance.show();
                }else{
                    target_payment_channel_advance.hide();
                    target_payment_channel_transfer.hide();
                }

                target_payment_channel_transfer_other.hide();
            });

            $('.payment-channel-other-handle').off('change');
            $('.payment-channel-other-handle').change(function(){
                var self = $(this);
                var val = self.val();

                var target_payment_channel_transfer_other = $('.payment-channel-transfer-other');

                if(val == 'new'){
                    target_payment_channel_transfer_other.show();
                }else{
                    target_payment_channel_transfer_other.hide();

                    $('.payment-channel-transfer-other input').val('');
                }
            });
        }
    }

    $.voucherHandler = function(){
        //  checkout payment handler
        var btnValidateVoucher = $('#validate-voucher-button');

        if(btnValidateVoucher.length){
            var txtVoucherCode          = $('#voucher-code');
            var txtDocumentType         = $('#document-type');
            var txtDocumentCode         = $('#document-code');
            var txtDocumentPrefix       = $('#document-prefix');
            var selMembershipPackage    = $('#document-membership-package');
            var txtTriggerVoucher       = $('#trigger-voucher');

            var baseAmount      = $('#document-amount');
            var discountAmount  = $('#document-discount');
            var totalAmount     = $('#document-grandtotal');

            var data_default = $.checkUndefined(btnValidateVoucher.data('default'), false);
            var data_parent = $.checkUndefined(btnValidateVoucher.data('parent'), 'div.content-input');
            var data_class = $.checkUndefined(btnValidateVoucher.data('class'), 'padding-top-2');

            var inputParent = txtVoucherCode.closest( data_parent );

            /*diskusi sama surya*/
            // if(txtVoucherCode.length > 0 && data_default == false ){
            //     txtVoucherCode.val('');
            // }

            if(selMembershipPackage.length){
                selMembershipPackage.on('ajax-link:changed', function(event){
                    txtVoucherCode.val('');
                    inputParent.find('div.error-message, div.success-message').remove();
                });
            }

            var checkVoucherJXHR;
            btnValidateVoucher.off('click');
            btnValidateVoucher.click(function(){
                var self = $(this);

                inputParent.find('div.error-message, div.success-message').remove();

                if(txtVoucherCode.val() != ''){
                    if(checkVoucherJXHR){
                        checkVoucherJXHR.abort();
                    }

                    var protocol    = window.location.protocol;
                    var host        = window.location.host;
                    var baseURL     = protocol + '//' + host;

                    checkVoucherJXHR = $.ajax({
                        url     : baseURL + '/backprocess/vouchers/validateVoucher',
                        type    : 'post',
                        data    : {
                            'code'                  : txtVoucherCode.val(), 
                            'document_type'         : txtDocumentType.val(), 
                            'document_code'         : txtDocumentCode.val(), 
                            'membership_package'    : selMembershipPackage.val(), 
                            'refer_prefix'          : txtDocumentPrefix.val(),
                            // 'price'                 : self.data('price'),
                        },
                        success : function(data){
                            var objResult = $.parseJSON(data);

                            if(typeof(objResult) == 'object'){
                                var status  = typeof(objResult.status) != 'undefined' ? objResult.status : 'error';
                                var message = typeof(objResult.msg) != 'undefined' ? objResult.msg : 'Error';

                                if(status == 'success'){
                                    var voucher         = typeof(objResult.data) != 'undefined' ? objResult.data : false;
                                    var currencySymbol  = typeof(voucher.discount_currency_symbol) != 'undefined' ? voucher.discount_currency_symbol : '';
                                    var discountType    = typeof(voucher.discount_type) != 'undefined' ? voucher.discount_type : 'nominal';
                                    var discountValue   = typeof(voucher.discount_value) != 'undefined' ? voucher.discount_value : 0;
                                    var subTotal        = $.checkUndefined(baseAmount.data('value'), 0);
                                    var grandTotal      = subTotal;

                                    if(discountType == 'nominal'){
                                        discountValue = typeof(voucher.discount_convert_value) != 'undefined' ? voucher.discount_convert_value : 0;
                                    }
                                    else{
                                        discountValue = (parseFloat(subTotal) / 100) * parseFloat(discountValue);
                                    }

                                    grandTotal = parseFloat(subTotal) - parseFloat(discountValue);
                                    grandTotal = parseFloat(grandTotal) < 0 ? 0 : grandTotal;

                                    discountValue   = formatMoney(discountValue, 0);
                                    grandTotal      = formatMoney(grandTotal, 0);

                                    discountAmount.html(currencySymbol+' '+discountValue);
                                    totalAmount.html(currencySymbol+' '+grandTotal);

                                    inputParent.append('<div class="success-message '+data_class+'">'+message+'</div>');
                                    inputParent.append('<input type="hidden" name="data[VoucherCode][status]" value="1">');
                                }
                                else{
                                    discountAmount.html('-');
                                    totalAmount.html(baseAmount.html());

                                    inputParent.append('<div class="error-message '+data_class+'">'+message+'</div>');
                                }
                            }
                            else{
                                return false;
                            }
                        },
                        error   : function(){
                            console.log('an error occured');
                        }
                    });
                }
                else{
                    discountAmount.html('-');
                    totalAmount.html(baseAmount.html());
                }

                return false;
            });

            if(txtTriggerVoucher.length > 0){
                btnValidateVoucher.trigger('click');
                $('#trigger-voucher').remove();
            }
        }
    }

    function _callChartLine ( self, result, rel, type, options ) {
        var type = $.checkUndefined(type, 'line');

        var width = $.checkUndefined(options.resolution.width, false);
        var height = $.checkUndefined(options.resolution.height, false);
        var attributes = $.checkUndefined(options.attributes, []);

        switch(type) {
            case 'bar':
                var salesData = new google.visualization.DataTable(result);
                var chartOptions = {
                    width:'100%',
                    focusTarget: 'category',
                    backgroundColor: 'transparent',
                    colors: ['#4593e2', '#31dd95', '#fbd481', '#f9a9c5', '#9F509E', '#F2713E'],
                    chartArea: {
                        left: 20,
                        top: 10,
                        width: '100%',
                        height: '70%'
                    },
                    bar: {
                        groupWidth: '70%'
                    },
                    hAxis: {
                        textStyle: {
                            fontSize: 9,
                            color:'#929496'
                        }
                    },
                    vAxis: {
                        baselineColor: '#e6e6e6',
                        gridlines: {
                            color: '#e6e6e6',
                            count: 9
                        },
                        textStyle: {
                            fontSize: 9,
                            color:'#929496'
                        },
                        minValue: 0,
                        maxValue: 5,
                        // ticks: [0,3,6,9,12,15,18,21,24,27,30]
                    },
                    legend: {
                        position: 'bottom',
                        textStyle: {
                            fontSize: 9,
                            color:'#929496'
                        }
                    },
                    animation: {
                        duration: 300,
                        easing: 'out',
                        startup: true
                    },
                };
                var chart = new google.visualization.ColumnChart(document.getElementById(rel));
                chart.draw(salesData, $.extend(chartOptions, attributes));
            break;
            case 'bars':
                result = JSON.parse(result);
                var salesData = new google.visualization.arrayToDataTable(result.rows);
                
                var chartOptions = {
                    width:'100%',
                    focusTarget: 'category',
                    backgroundColor: 'transparent',
                    colors: ['#4593e2', '#31dd95', '#fbd481', '#f9a9c5', '#9F509E', '#F2713E'],
                    chartArea: {
                        left: 20,
                        top: 10,
                        width: '100%',
                        height: '70%'
                    },
                    bar: {
                        groupWidth: '70%'
                    },
                    hAxis: {
                        textStyle: {
                            fontSize: 9,
                            color:'#929496'
                        },
                    },
                    vAxis: {
                        baselineColor: '#e6e6e6',
                        gridlines: {
                            color: '#e6e6e6',
                            count: 9
                        },
                        textStyle: {
                            fontSize: 9,
                            color:'#929496'
                        },
                        minValue: 0,
                        maxValue: 5,
                        // ticks: [0,3,6,9,12,15,18,21,24,27,30]
                    },
                    legend: {
                        position: 'bottom',
                        textStyle: {
                            fontSize: 9,
                            color:'#929496'
                        }
                    },
                    animation: {
                        duration: 300,
                        easing: 'out',
                        startup: true
                    }
                };
                
                var chart_arr = new google.charts.Bar(document.getElementById(rel));

                chart_arr.draw(salesData, google.charts.Bar.convertOptions( $.extend(chartOptions, attributes) ));
            break;
            case 'line':
                var salesData = new google.visualization.DataTable(result);
                var chartOptions = {
                    backgroundColor: 'transparent',
                    colors: ['#4593e2', '#31dd95', '#fbd481', '#f9a9c5', '#9F509E', '#F2713E'],
                    areaOpacity:'0.1',
                    pointSize: 3,
                    pointShape: {
                        type: 'circle'
                    },
                    chartArea: {
                        left: 30,
                        top: 10,
                        right: 30,
                        width: '100%',
                        height: '70%'
                    },
                    bar: {
                        groupWidth: '70%'
                    },
                    hAxis: {
                        textStyle: {
                            fontSize: 10,
                            color:'#929496'
                        }
                    },
                    vAxis: {
                        baselineColor: '#e6e6e6',
                        gridlines: {
                            color: '#e6e6e6',
                            count: 4
                        },
                        textStyle: {
                            fontSize: 9,
                            color:'#929496'
                        },
                        minValue: 0,
                        maxValue: 5,
                        // ticks: [0,5,10,15,20]
                    },
                    legend: {
                        position: 'bottom',
                        textStyle: {
                            fontSize: 9,
                            color:'#929496'
                        }
                    },
                    animation: {
                        duration: 300,
                        easing: 'out',
                        startup: true
                    },
                    tooltip: {
                        isHtml: true
                    },
                };
                var chart = new google.visualization.AreaChart(document.getElementById(rel));
                chart.draw(salesData, $.extend(chartOptions, attributes) );
            break;
            case 'pie':
                var parseResult = jQuery.parseJSON( result );
                parseResult = $.checkUndefined( parseResult['rows'], [] );

                var salesData = google.visualization.arrayToDataTable(parseResult);
                var pickColor = ['#4593e2', '#31dd95', '#fbd481', '#f9a9c5', '#9F509E', '#F2713E'];
                var chartOptions = {
                    backgroundColor: {
                        strokeWidth: 0,
                    },
                    colors: pickColor,
                    pieStartAngle: 135,
                    chartArea: {
                        left: 0,
                        top: 0,
                        width: width,
                        height: height
                    },
                    pieHole: 0.8,
                    legend: 'none',
                    pieSliceText: 'none',
                };

                var chart = new google.visualization.PieChart(document.getElementById(rel));
                chart.draw(salesData, $.extend(chartOptions, attributes) );
            break;
        }
        
        // $('.dashboard-chart-loading').remove();

        if( self.find('.chart-legend-color').length > 0 ) {
            self.find('.chart-legend-color').each(function(i, obj){
                var thisColor = $(this);
                var get_color = $.checkUndefined(pickColor[i], pickColor[0]);

                thisColor.css('background-color', get_color);
            });
        }
    }

    $.infinityLoad = function( options ) {
        var settings = $.extend({
            obj: $('[data-load="infinity"]'),
            page: 1,
            reset: true,
        }, options );

        if( settings.obj.length > 0 ) {
            _callGenerateChart(settings.obj, settings.page, settings.reset);
        }
    }

    function _callInfinityLoad ( self, page, loadingBar ) {
        var urlRender = self.attr('data-render-url');
        var template = self.attr('wrapper-write-dashboard-template');
        var template_parent = $.checkUndefined(self.attr('wrapper-write-dashboard-parent'), null);
        var data_append = $.checkUndefined(self.attr('data-append'), null);
        var url = self.attr('data-url') + '?page='+ page;
        var rel = $.checkUndefined(self.attr('rel'), 'default');

        var date_type = $.checkUndefined(self.attr('data-type'), null);
        var data_method = $.checkUndefined(self.attr('data-method'), 'POST');
        var data_form = $.checkUndefined(self.attr('data-form'), null);
        var data_abort = $.checkUndefined(self.attr('data-abort'), null);
        var data_loading = $.checkUndefined(self.attr('data-loading'), null);
        var data_height = $.checkUndefined(self.attr('data-height'), '50%');
        var data_width = $.checkUndefined(self.attr('data-width'), '100%');
        var data_remove = $.checkUndefined(self.attr('data-remove'), null);
        var formData = null;

        // attributes
        var data_legend = $.checkUndefined(self.attr('data-legend'), null);

        var loadingBar = $.checkUndefined(loadingBar, 'true');

        if( data_form != null ) {
            formData = $(data_form).serialize(); 
        }

        if( data_abort == 'true' && loadJXHR ){
            loadJXHR.abort();
        }
        if( data_loading != null ) {
		//	remove loading bar
			var objLoading	= $(data_loading).html();
				objLoading	= $(objLoading);
			var cssClass	= objLoading.attr('class');
				cssClass	= cssClass.length ? '.' + cssClass.split(' ').join('.') : cssClass;

			if( typeof cssClass == 'undefined' || $(template).parent().find(cssClass).length <= 0 ){
				$(template).after(objLoading);
			}

		//	console.log(cssClass);
		//	console.log($(template).parent().find(cssClass).length);
        }

        loadJXHR = $.ajax({
            url: url,
            type:  data_method,
            data: formData,
            success:function(result){
                if( typeof result == 'object' && result != null && result.rows.length ) {
					try{
						// result = jQuery.parseJSON( result );
						var result_rows = result.rows;
						delete result.rows;

						eval('$.resultjson'+rel+'.rows = $.checkUndefined($.resultjson'+rel+'.rows, []);');
						eval('$.resultjson'+rel+'.cols = $.checkUndefined($.resultjson'+rel+'.cols, []);');

						eval('$.extend(true, $.resultjson'+rel+', result);');

						$.each(result_rows, function(i, row){ 
							eval('$.resultjson'+rel+'.rows.push(row);');
						});

						// eval('$.extend(true, $.resultjson'+rel+', result);');
						// console.log(eval('$.resultjson'+rel));

						$.infinityLoad({
							obj: self,
							page: page + 1,
							reset: false,
						});
					}
					catch(e){
						console.log(e);
					}
                } else {
                    var resultjson = eval('$.resultjson'+rel);
                    var resultjsonRows = $.checkUndefined(resultjson.rows, []);
                    var resultJsonType = $.checkUndefined(resultjson.JsonType, null);

                    if ( resultjsonRows.length == 0 && ( resultJsonType != 'calendar' && resultJsonType != 'content' ) ) {
                        resultjson.rows = {};
                    }

                    if( template_parent != null ) {
                        template = template_parent;
                    }

                    $.ajax({
                        url: urlRender,
                        data: { json: JSON.stringify(resultjson) },
                        type: 'POST',
                        beforeSend  : function() {
                            $.loadingbar_progress('beforeSend', loadingBar);
                        },
                        success:function(resultRender){
                            // var content = $(resultRender).find(template).html();
                            var header_content = $(template).find('.header-chart').length;

                            var data_wrapper_arr = template.split(',');
                            
                            $.each(data_wrapper_arr, function(index, identifier){
                                var targetWrapper = $.trim(identifier);
                                var contentPage = $(resultRender).find(targetWrapper).html();

                                $(targetWrapper).html(contentPage);
                            });

                            if( data_append != null ) {
                                var data_append_arr = data_append.split(',');

                                $.each(data_append_arr, function(index, identifier){
                                    var targetWrapper = $.trim(identifier);
                                    var contentPage = $(resultRender).find(targetWrapper).html();

                                    if( $(resultRender).find(targetWrapper).length > 0 ) {

                                        if($('#wrapper-dashboard-parent-tips .tips-content > .loader').length > 0){
                                            $('#wrapper-dashboard-parent-tips .tips-content > .loader').remove();
                                        }

                                        $('#wrapper-dashboard-parent-tips .tips-content').append(contentPage);
                                        $('#wrapper-dashboard-parent-tips').slideDown();
                                    }
                                });
                            }

                            if( data_remove != null ) {
                                var data_remove_arr = data_remove.split(',');

                                $.each(data_remove_arr, function(index, identifier){
                                    var targetWrapper = $.trim(identifier);

                                    $(targetWrapper).remove();
                                });
                            }

                            if( header_content == 0 ) {
                                $(template+' .header-chart').remove();
                                $(template+' .detail-report').remove();
                            }

                            $.tooltipBar();
                            $.infinityClick();
                            $.rebuildFunction();

                            var dataRows = $.checkUndefined(resultjson.rows, null);
                            var options = {
                                'resolution' : {
                                    'width' : data_width,
                                    'height' : data_height,
                                },
                            };

                            if(data_legend == 'false'){
                                options = $.extend(options, {
                                    'attributes' : {
                                        'legend': false,
                                    }
                                });
                            }

                            if ( dataRows.length > 0 ) {
                                switch (date_type) {
                                    case 'chart-line':
                                        google.charts.setOnLoadCallback( _callChartLine( $(template), eval('JSON.stringify($.resultjson'+rel+')'), rel, 'line', options ) );
                                    break;
                                    case 'chart-bar':
                                        google.charts.setOnLoadCallback( _callChartLine( $(template), eval('JSON.stringify($.resultjson'+rel+')'), rel, 'bar', options ) );
                                    break;
                                    case 'chart-bars':
                                        google.charts.setOnLoadCallback( _callChartLine( $(template), eval('JSON.stringify($.resultjson'+rel+')'), rel, 'bars', options ) );
                                    break;
                                    case 'chart-pie':
                                        google.charts.setOnLoadCallback( _callChartLine( $(template), eval('JSON.stringify($.resultjson'+rel+')'), rel, 'pie', options ) );
                                    break;
                                }
                            }
                            
                            eval('$.resultjson'+rel+' = {};')
                            $.sameHeight();
                        },
                        error: function(){
                            console.log('Server timeout');
                        },
                    }).always(function() {
                        $.loadingbar_progress('always', loadingBar);
                    });
                }
            },
            error: function(){
                console.log('Server timeout');
            },
            timeout: 30000,
        });
    }

    function _callGenerateChart (obj, page, reset) {
        obj.each(function(){
            var self = $(this);
            var rel = $.checkUndefined(self.attr('rel'), 'default');

            if( reset == true ) {
                eval('$.resultjson'+rel+' = {};');
            }
            
            _callInfinityLoad(self, page, 'false');
        });
    }

    $.infinityClick = function( options ) {
        var settings = $.extend({
            objNav: $('[data-navigation="infinity"]'),
            objNavChange: $('[data-navigation-change="infinity"]'),
            objNavKeyup: $('[data-navigation-keyup="infinity"]'),
        }, options );

        if( settings.objNav.length > 0 ) {
            settings.objNav.off('click').click(function(){
                var self = $(this);
                var rel = $.checkUndefined(self.attr('rel'), 'default');

                eval('$.resultjson'+rel+' = {};');
                
                _callInfinityLoad(self, 1, 'true');

                return false;
            });
        }

        if( settings.objNavChange.length > 0 ) {
            settings.objNavChange.off('change').change(function(){
                var self = $(this);
                var rel = $.checkUndefined(self.attr('rel'), 'default');

                eval('$.resultjson'+rel+' = {};');
                
                _callInfinityLoad(self, 1, 'true');

                return false;
            });
        }

        if( settings.objNavKeyup.length > 0 ) {
            settings.objNavKeyup.off('keyup').keyup(function(){
                var self = $(this);
                var rel = $.checkUndefined(self.attr('rel'), 'default');
                var data_table = $.checkUndefined(self.attr('data-table'), null);

                eval('$.resultjson'+rel+' = {};');
                
                _callInfinityLoad(self, 1, 'true');

                if( data_table == 'true' ) {
                    var objSearchDate = $('.form-table-search #SearchDate');
                    var valSearchDate = objSearchDate.val();

                    if( valSearchDate != self.val() ) {
                        objSearchDate.val( self.val() );
                        objSearchDate.trigger('keyup');
                    }
                }

                return false;
            });
        }
    }

    $.sameHeightItem = function(obj){
        var data_type = obj.attr('data-type');
        var data_on_mobile = obj.attr('data-on-mobile');

        if( data_on_mobile != 'false' || (data_on_mobile == 'false' && !$.isMobile()) ) {
            var label_layer = obj.find('.label-layer');
            var wrapper_layer = obj.find('.wrapper-layer');
            var absolute_botton = obj.find('.absolute-botton');
            var elementHeights = wrapper_layer.map(function() {
                return $(this).height();
            }).get();

            var maxHeight = Math.max.apply(null, elementHeights);

            if( data_type == 'fix-height' ) {
                wrapper_layer.css('height', maxHeight);
            } else {
                wrapper_layer.css('min-height', maxHeight);
            }
            
            //  console.log(maxHeight);

            if( absolute_botton.length > 0 ) {
                absolute_botton.css({'position': 'absolute', 'bottom': 0, 'width': '100%'});
            }
        }
    }

    $.sameHeight = function( options ) {
        var settings = $.extend({
            obj: $('.same-height'),
        }, options );

        if(settings.obj.length > 0){
            settings.obj.each(function(index, object){
                var self = $(this);
                
                $.sameHeightItem(self);
            });
        }
    }

//	auto zindex on modal
	window.modalZindex = 0;

	$(document).on('hide.bs.modal show.bs.modal', '.modal', function(event){
		var self		= $(this); 
		var zIndex		= self.css('z-index');
		var newZIndex	= parseInt(zIndex) + $('.modal:visible').length;

		if(event.type == 'hide.bs.modal'){
			$('.modal:visible').css('overview', 'auto');
		}
		else{
			self.css('z-index', newZIndex);

			setTimeout(function(){
				$('.modal-backdrop').not('.modal-stack').css('z-index', newZIndex - 1).addClass('modal-stack');

				window.modalZindex = newZIndex;
			}, 0);	
		}
	});

    $.screenShot = function(options){
        var settings = $.extend(true, {
            obj         : $('[role="capture-screen-button"]'), 
            title       : document.title, 
            export      : true, 
            onInit      : null, 
            onComplete  : null, 
            exportOpts  : {
                logging			: false, 
                backgroundColor : null, 
                imageTimeout    : 60000, 
            //  width           : objTarget.width() + 40,
            //  height          : objTarget.height() + 40,
            }
        }, options);

        settings.obj = $(settings.obj);

        if(settings.obj.length){
        //  trigger init event
            settings.obj.prop('disabled', false).trigger('screenshot:init');

            if(typeof settings.onInit == 'function'){
                settings.onInit(settings.obj, settings);
            }

            settings.obj.off('click').on('click', function(event){
                var ajaxState	= $('body').attr('data-ajax');
            	var self		= $(this);
                var buttonState	= self.attr('data-state');

                if($.inArray(ajaxState, ['ready', 'completed']) > -1 && buttonState != 'processing'){
                //  can be processed after all ajax request completed
                    event.preventDefault();

                    var caption         = self.text();
                    var documentTitle   = self.data('title');
                    var targetSelector  = self.data('target');
                    var objTarget       = $(targetSelector);

                    var documentPeriod	= $(':input[data-role="report-period-input"]').val();
                //  loading
                    self.text('Mohon tunggu...').attr('data-state', 'processing');

                    if(objTarget.length){
                        var wrapperID   = 'screenshot-wrapper';
                        var objWrapper  = $('#' + wrapperID);

                        if(objWrapper.length <= 0){
                            var protocol    = window.location.protocol;
                            var host        = window.location.host;
                            var baseURL     = protocol + '//' + host;
                            var targetURL   = baseURL + '/backprocess/reports/export';

                            objWrapper = $('<form></form>').attr({
                                'id'        : wrapperID, 
                                'action'    : targetURL, 
                                'method'    : 'post', 
                            });
                        }

                        objWrapper.html('');

                        var pages       = objTarget.find('[data-page],[data-page="*"]');
                        var pageIndex   = [];

                        if(pages.length <= 0){
                            pages = objTarget;

                            pageIndex.push(0);
                        }
                        else{
                            pages.each(function(index, page){
                                pageIndex.push($(this).data('page'));
                            });

                            pageIndex = $.unique(pageIndex.sort());
                        }

                        $.each(pageIndex, function(index, pageNumber){
                        //  hanya bisa 1 item, dan ga boleh pisah wrapper
                            var page = objTarget.find('[data-page="' + pageNumber + '"]');

                            if(page.length < 1 && pageIndex.length == 1){
                                page = objTarget;
                            }

                            if(page.length){
                                var usingTemp = false;

                                if(page.length > 1){
                                    usingTemp = true;

                                    $('body').append($('<div></div>', {
                                        'id' : 'screenshot-temp-wrapper', 
                                    }).html(page.clone()));

                                    page = $('#screenshot-temp-wrapper');
                                }

                                if(index == 0){
                                	if(typeof documentTitle != 'undefined'){
	                                    var inputID     = 'ExportTitle';
	                                    var inputName   = 'data[Export][title]';

	                                    objWrapper.append($('<input />', {
	                                        'id'    : inputID, 
	                                        'name'  : inputName, 
	                                        'value' : documentTitle, 
	                                        'type'  : 'hidden', 
	                                    }));
	                                }

	                                if(typeof documentPeriod != 'undefined'){
	                                    var inputID     = 'ExportPeriod';
	                                    var inputName   = 'data[Export][period]';

	                                    objWrapper.append($('<input />', {
	                                        'id'    : inputID, 
	                                        'name'  : inputName, 
	                                        'value' : documentPeriod, 
	                                        'type'  : 'hidden', 
	                                    }));
	                                }
                                }

                                var inputID     = 'ExportPage' + index;
                                var inputName   = 'data[Export][page][' + index + ']';

                                var paddingLeft     = page.css('padding-left');
                                var paddingRight    = page.css('padding-right');

								page.css({
									'padding-left'  : '15px', 
									'padding-right' : '35px',
								});

								$('body').find('.report-wrapper').css('overflow', 'hidden');

                                html2canvas(page.get(0), settings.exportOpts).then(canvas => {
                                    var base64 = canvas.toDataURL();

                                    objWrapper.append($('<input />', {
                                        'id'    : inputID, 
                                        'name'  : inputName, 
                                        'value' : base64, 
                                        'type'  : 'hidden', 
                                    }));

                                    if(usingTemp){
                                        $('#screenshot-temp-wrapper').remove();
                                    }

                                    if(settings.export === true && index == pageIndex.length - 1){
                                    //  reset caption
                                    //	self.text(caption);
                                    	self.text('Export').removeAttr('data-state');

                                    //  process export
                                        objWrapper.submit();
                                    }

                                    $('body').find('.report-wrapper').css('overflow', 'initial');
                                    page.css({
                                        'padding-left'  : paddingLeft, 
                                        'padding-right' : paddingRight, 
                                    });
                                });
                            }
                        });

                        objTarget.after(objWrapper);
                    }
                    else{
                    //  reset caption
                        self.text(caption);
                    }
                }
                else{
                    console.log('still processing some ajax request');
                }
            });

            return settings.obj;
        }
        else{
            return false;
        }
    }

    $(document).ajaxStart(function(){
        $('body').attr('data-ajax', 'processing');

		if($('[role="capture-screen-button"]').length){
			$('[role="capture-screen-button"]').addClass('disabled');
		}
    }).ajaxStop(function(){
        $('body').attr('data-ajax', 'completed');

        if($('[role="capture-screen-button"]').length){
			$('[role="capture-screen-button"]').removeClass('disabled');
		}
    });

    $.box_up = function(){
        if($('.box-up').length > 0){
            $('.box-up').click(function(){
                var self = $(this);

                var target_show = $.checkUndefined(self.attr('data-box-up-show'), '');
                var target_hide = $.checkUndefined(self.attr('data-box-up-hide'), '');

                if(target_show != '' && target_hide != ''){
                    $(target_hide).hide();
                    $(target_show).show();
                }
            });
        }
    }

	$(document).on('click', 'div.video-overlay', function(e){
		var self			= $(this);
		var dataTarget		= $.checkUndefined(self.attr('data-target'));
		var objVideoPlayer	= $(dataTarget);

		if(objVideoPlayer.length){
			var objCarousel = self.closest('.carousel');

			if(objCarousel.length){
				objCarousel.carousel('pause');
			}

			var dataOriginal	= $.checkUndefined(objVideoPlayer.attr('data-original'));
			var dataSource		= dataOriginal + '?autoplay=1';

			objVideoPlayer.attr('src', dataSource);
            self.hide();
		}
	});

	$('.carousel').on('slide.bs.carousel', function(event){
		var self		= $(this);
		var objItems	= self.find('.carousel-inner .item');

		if(objItems.length){
			objItems.each(function(index, item){
				var item = $(item);
				var objVideoPlayer	= item.find('iframe.video-player');
				var objVideoOverlay	= item.find('div.video-overlay');

				if(objVideoPlayer.length){
					var currentSource = objVideoPlayer.attr('src');

					if(currentSource.indexOf('autoplay') > -1){
					//	just reset the video that has been played
						var dataOriginal = $.checkUndefined(objVideoPlayer.attr('data-original'));

						objVideoPlayer.attr('src', dataOriginal);
                        objVideoOverlay.show();
					}
				}
			});

            self.carousel('cycle');
		}
	});

    $.ajaxRenderSubject = function(){
        $('.ajax-render-subject, .ajax-render-class').change(function(){
            var self = $(this);
            var subject_id = self.val();
            var url = self.attr('data-url');
            var warpper_write= self.attr('data-wrapper-write');
            var data_form = self.attr('data-form');

            if(subject_id){
                var formData = $(data_form).serialize(); 
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'html',
                    data: formData,
                    success: function(response, status) {
                        $(warpper_write).html(response)
                        $.rebuildFunction();
                        return false;
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert('Gagal melakukan proses. Silahkan coba beberapa saat lagi.');
                        return false;
                    }
                });
            }
        });
    }

    $.handle_download_box = function(){
        $('.handle-download-box').off('change');
        $('.handle-download-box').change(function(){
            var self = $(this);

            var val = self.val();

            $('.download-box').hide();

            if( val == 'default'){
                $('#standard-box').show();
            }else if(val == 'ices'){
                $('#ices-box').show();
            }
        });
    }

    $.selectAll = function(options){
        var settings = $.extend({
            select_all: $('.select-all'),
            unselect_all: $('.unselect-all')
        }, options );

        if(settings.select_all.length > 0){
            settings.select_all.click(function(){
                var self = $(this);
                var data_parent = $.checkUndefined(self.attr('data-parent'), false);
                var data_trigger = $.checkUndefined(self.attr('data-trigger'), false);
                var parent = self.parents(data_parent); 

                if(data_trigger == 'true'){
                    parent.find('.select-item').prop('checked', false);
                    parent.find('.select-item').trigger('click');
                } else {
                    parent.find('.select-item').prop('checked', true);
                }
            });
        }

        if(settings.unselect_all.length > 0){
            settings.unselect_all.click(function(){
                var self = $(this);
                var data_parent = $.checkUndefined(self.attr('data-parent'), false);
                var data_trigger = $.checkUndefined(self.attr('data-trigger'), false);
                var parent = self.parents(data_parent); 

                if(data_trigger == 'true'){
                    parent.find('.select-item').prop('checked', true);
                    parent.find('.select-item').trigger('click');
                } else {
                    parent.find('.select-item').prop('checked', false);
                }
            });
        }
    }

    $.triggerSelectAll = function(options){
        var settings = $.extend({
            all: $('.click-select-all'),
            item: $('.click-select-item')
        }, options );

        if(settings.all.length > 0){
            settings.all.click(function(){
                var self = $(this);
                // var target = $.checkUndefined(self.attr('data-target'), settings.item)
                var checked = self.is(':checked');

                settings.item.prop('checked', checked);
            });
        }

        if (settings.item.length > 0){
            settings.item.click(function(){
                var self = $(this);
                var checked = self.is(':checked');

                if(checked == false){
                    settings.all.prop('checked', false)
                }else {
                    $.parentAll(settings);
                }
            });
        }

        $.parentAll = function(settings){
            var count = settings.item.length;

            countItem = 0
            $.each( settings.item, function( i, val ) {
                var itemChecked = $(val).is(':checked');

                if(itemChecked){
                    countItem += 1;
                }

            });

            if (countItem == count){
                settings.all.prop('checked', true);
            }
        }
        $.parentAll(settings);
    }

}( jQuery ));

//  check html 5 caching support
function _localStorageAvailable(){
    try{
        return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch(e){
        return false;
    }
}

//  savepageOrder
var _savePageOrderJXHR;
function _savePageOrder(object){
    if($(object).length && typeof $.fn.nestable == 'function'){
        if(_savePageOrderJXHR){
            _savePageOrderJXHR.abort();
        }

    //  var postData = window.JSON.stringify($(object).nestable('serialize'));
        var postData = {
            data : $(object).nestable('serialize'), 
        };

        _savePageOrderJXHR = $.post('/backprocess/pages/save_page_order.json', postData, function(response){
            responseStatus  = $.checkUndefined(response.status, 'error');
            responseMessage = $.checkUndefined(response.msg);
            responseData    = $.checkUndefined(response.data);

            if(responseStatus == 'error'){
                $('.wrapper-alert').find('[data-role="flash-notice"]').remove();
                $('.wrapper-alert').prepend($.flashNotice(responseStatus, responseMessage, false));
            }
        }, 'json');
    }
}

function inIframe(){
    try{
        return window.self !== window.top;
    }
    catch(e){
        return true;
    }
}

var alert_msg = function(msg){
    setTimeout(function(){
        $('.alert-wrapper').fadeOut('normal', function() {
            $(this).remove();
        });
    }, 5000);

    if($('.wrapper-alert').length > 0){
        $('.wrapper-alert').html(
            '<div class="alert-wrapper open">'+
                '<div class="alert alert-fail">'+
                    '<p id="msg-text"><strong>Duh!</strong> '+msg+' <a href="javascript:void(0);" class="close-btn" onclick="$(&quot;.alert-wrapper.open&quot;).hide();">Close</a></p>'+
                '</div>'+
            '</div>'
        );
    }
}

function setCookie(cname, cvalue, exminute) {
    var d = new Date();
    d.setTime(d.getTime() + (exminute * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    
    return "";
}

function deleteCookie(cname) {
    document.cookie = cname + "=;path=/";
}

function checkCookie(cname) {
    var username = getCookie(cname);
    if (username != "") {
        return true;
    } else {
        return false;
    }
}

function formatMoney(number, places, symbol, thousand, decimal) {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

function isJson(data){
	if(typeof data == 'string'){
		try{
			data = $.parseJSON(data);
			return true;
		}
		catch(error){
			console.log(error);
			return false
		}
	}
}