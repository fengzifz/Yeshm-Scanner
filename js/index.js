var BASE_URL = 'http://14.20.211.113/index.php/ajax/',
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
        $('ul#select-amount li').each(function(){
            $(this).click(function(){
                var value = $(this).text();
                $('#amount').text(value);
                $('#pro-num').val(value);
            });
        });
    }
};

// 1. localStorage
//      未创建的变量：undefined
//      已经创建的变量，删除时设置为 string 'null'
var user = {
    initialize: function(){
        if(localStorage.usr && localStorage.usr != 'null'){
            user.success(); 
        }
        user.login();
        user.logout();
    },

    autoLogin: function(){
        if(localStorage.usr == 'damon.chen' && localStorage.pwd == 111111){
            user.success();
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
                user.success();
                localStorage.usr = usr;
                localStorage.pwd = pwd;
                
            } else {
                setStatus('alert alert-danger', '账号或密码错误', sObj);
            }
        });
    },

    logout: function(){
        $('#logout').on('click', function(){
            localStorage.usr = 'null';
            localStorage.pwd = 'null';
            $('.login-wrapper').show();
            $('div.result').hide();
        });
    },

    success: function(){
        $('.login-wrapper').hide();
        $('div.result').show();
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