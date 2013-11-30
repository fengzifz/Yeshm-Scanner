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
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
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
        var parentElement = document.getElementById(id);
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

            document.getElementById('buying-status').style.display = 'none';

            if(result.text.length == 0){
                setStatus('alert alert-info', '没有结果，请重新扫描');
            } else {
                app.showProduct(result.text);
            }

        }, function (error) { 
            var scanError = document.getElementById('scan-error');
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
                    setStatus('alert alert-info', 'wao~ 没有该产品，请到楼下seven eleven购买');
                } else {
                    var info = data[0];
                    document.getElementById('product-info').style.display = 'block';
                    document.getElementById('pro-name').innerHTML = info['name'];
                    document.getElementById('pro-price').innerHTML = info['price'];
                    document.getElementById('pro-amount').innerHTML = info['amount'];
                    document.getElementById('pro-barcode').innerHTML = info['barcode'];
                    document.getElementById('pro-pid').setAttribute('value', info['id']);
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
                document.getElementById('pro-amount').innerHTML = info['amount'];
                showOrHide('none');
            },
            error: function(){
                setStatus('alert alert-danger', 'Ajax Error: update.');
            },
            complete: function(){
                showOrHide('none');
            }
        });
    }
};

var login = {
    initialize: function(){
        login.login();
    },

    login: function(){
        $('#login').click(function(e){
            e.preventDefault();
            $('.login-wrapper').hide();
            $('body').addClass('result').removeClass('login');
            $('div.result').show();
        });
    }
};

function setStatus(theClass, theText){
    var status = document.getElementById('buying-status');
    status.style.display = 'block';
    status.className = theClass;
    status.innerHTML = theText;
}

function showOrHide(val){
    document.getElementById('loading-wrapper').style.display = val;
}