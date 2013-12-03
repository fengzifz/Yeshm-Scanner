var BASE_URL = 'http://14.20.216.136/index.php/ajax/',
    CONTENT_TYPE = 'application/json; charset=utf-8',
    JSONP = 'callback',
    DATA_TYPE = 'jsonp',
    JSONP_CALLBACK = 'success',
    TYPE_GET = 'GET',
    TIME_OUT = 8000;

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.buyProduct();
        this.setDropdown();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        S('scan').addEventListener('click', this.scan, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = S(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    },

    scan: function() {
        
        var scanner = cordova.require('cordova/plugin/BarcodeScanner');

        scanner.scan( function (result) { 
            // result = {text: 'xxx', format: 'xxx', cancelled: 'xxx'}

            // loading effect
            if(!result.cancelled){
                showOrHide('block');
            }

            S('buying-status').style.display = 'none';

            if(result.text.length == 0){
                setStatus('alert alert-info', '没有结果，请重新扫描');
            } else {
                app.showProduct(result.text);
            }

        }, function (error) { 
            var scanError = S('scan-error');
            scanError.innerHTML = error;
            scanError.style.display = 'block';
        } );
    },

    showProduct: function(barcode){
        $.ajax({
            type: TYPE_GET,
            url: BASE_URL + 'product_list',
            contentType: CONTENT_TYPE,
            dataType: DATA_TYPE,
            jsonp: JSONP,
            jsonpCallback: JSONP_CALLBACK,
            data: {'barcode': barcode},
            timeout: TIME_OUT,
            success: function(data){

                if(data == 0){
                    setStatus('alert alert-info', 'Oh~ 没有该产品');
                } else {
                    var info = data[0];
                    S('product-info').style.display = 'block';
                    S('pro-name').innerHTML = info['name'];
                    S('pro-price').innerHTML = info['price'];
                    S('pro-amount').innerHTML = info['amount'];
                    S('pro-barcode').innerHTML = info['barcode'];
                    S('pro-pid').setAttribute('value', info['id']);
                }
            },
            error: function(err){
                setStatus('alert alert-danger', 'Ajax Error: query.');
            },
            complete: function(){
                showOrHide('none');
            }
        });
    },

    buyProduct: function(){
        $('#buy').click(function(e){

            // loading effect
            showOrHide('block');

            var datas = {};
            datas.num = $('#pro-num').val();
            datas.pid = $('#pro-pid').val();

            e.preventDefault();
            
            $.ajax({
                type: TYPE_GET,
                url: BASE_URL + 'sale_add',
                contentType: CONTENT_TYPE,
                dataType: DATA_TYPE,
                jsonp: JSONP,
                jsonpCallback: JSONP_CALLBACK,
                data: {'num':datas.num, 'pid':datas.pid},
                timeout: TIME_OUT,
                success: function(data){
                    var barcode = $('#pro-barcode').text(),
                        status,
                        theClass = 'alert';

                    if(data == 1){
                        status = '购买成功';
                        theClass += ' alert-success';
                    } else if(data == 2){
                        status = '库存不足';
                        theClass += ' alert-info';
                    } else if(data == 3){
                        status = '发生错误';
                        theClass += ' alert-danger';
                    }

                    showOrHide('none');
                    setStatus(theClass, status);
                    app.updateQty(barcode);
                },
                error: function(err){
                    setStatus('alert alert-danger', 'Ajax Error: buy.');
                },
                complete: function(){
                    showOrHide('none');
                }
            });
        });
    },

    updateQty: function(barcode){
        $.ajax({
            type: TYPE_GET,
            url: BASE_URL + 'product_list',
            contentType: CONTENT_TYPE,
            dataType: DATA_TYPE,
            jsonp: JSONP,
            jsonpCallback: JSONP_CALLBACK,
            data: {'barcode': barcode},
            timeout: TIME_OUT,
            success: function(data){
                var info = data[0];
                S('pro-amount').innerHTML = info['amount'];
                showOrHide('none');
            },
            error: function(){
                setStatus('alert alert-danger', 'Ajax Error: update.');
            },
            complete: function(){
                showOrHide('none');
            }
        });
    },

    setDropdown: function(){
        $('ul.dropdown-menu li').each(function(){
            $(this).click(function(){
                var value = $(this).text();
                $('#amount').text(value);
                $('#pro-num').val(value);
            });
        });
    }
};

var login = {
    initialize: function(){
        if(window.localStorage.length > 0 || document.cookie.length > 0){
            login.autoLogin();
        } else {
            login.login();
        }
    },

    autoLogin: function(){
        if(window.localStorage){ // localStorage
            if(localStorage.usr && localStorage.pwd){
                login.success();
            }
        } else { // cookie
            if(getCookie('usr') && getCookie('pwd')){
                login.success();
            }
        }
    },

    login: function(){
        $('#login').click(function(e){

            var usr = S('username').value,
                pwd = S('password').value,
                exdate = 90,
                sObj = S('login-status');
            e.preventDefault();
            if(usr == 'damon.chen' && pwd == 111111){
                login.success();
                if(window.localStorage){
                    localStorage.usr = usr;
                    localStorage.pwd = pwd;
                } else { // 不支持localStorage则使用cookie
                    setCookie('usr', usr, exdate);
                    setCookie('pwd', usr, exdate);
                }
            } else {
                setStatus('alert alert-danger', '账号或密码错误', sObj);
            }
        });
    },

    success: function(){
        $('.login-wrapper').remove();
        $('div.result').show();
    }
};

var slide = {
    initialize: function(){
        this.show();
        this.hide();
        this.setCSS();
    },

    setCSS: function(){
        var w = $('#left-menu').width();
        $('#left-menu').css('left', -w);
    },

    show: function(){

        $('#left-menu-btn').on('tap', function(){
            $('#left-menu').animate({
                left: 0
            });
        });

        (new Hammer(document)).on('dragright', function(){
            $('#left-menu').animate({
                left: 0
            });
        });
    },

    hide: function(){
        var w = $('#left-menu').width();
        (new Hammer(document)).on('dragleft', function(){
            $('#left-menu').animate({
                left: -w
            });
        });
    },

    release: function(){
        (new Hammer(document)).on('release', function(){
            $(this).off('dragleft','dragright');
        });
    }
};

// 设置提示语
function setStatus(theClass, theText, obj){
    var status = obj || S('buying-status');
    status.style.display = 'block';
    status.className = theClass;
    status.innerHTML = theText;
}

// 隐藏或者显示loading层
function showOrHide(val){
    S('loading-wrapper').style.display = val;
}

// `id` is id selector
function S(id){
    return document.getElementById(id);
}

function setCookie(cName, value, expiredays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
}

function getCookie(cName){
    var cStart, cEnd;
    if(document.cookie.length > 0){
        cStart = document.cookie.indexOf(cName + '=');
        if(cStart != -1){
            cStart = cStart + cName.length + 1;
            cEnd = document.cookie.indexOf(';', cStart);
            if(cEnd == -1){
                cEnd = document.cookie.length;
            }
            return unescape(document.cookie.substring(cStart, cEnd));
        }
    }
    return '';
}

function deleteCookie(cName){
    if(getCookie(cName) != 'null'){
        document.cookie = cName + '=null' + ';expires=0'; 
    }
}
