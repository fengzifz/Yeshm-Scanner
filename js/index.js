var DEBUG = false,
    BASE_URL = 'http://14.20.195.242/';

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
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner"),
            scanResult = '';

        scanner.scan( function (result) { 

            if(DEBUG){
                scanResult =    'Barcode: ' + result.text + '<br/>' + 
                                'Format: ' + result.format  + '<br/>' + 
                                'Cancelled: ' + result.cancelled;
            }
            app.showProduct(result.text);

        }, function (error) { 
            var scanError = document.getElementById('scan-error');
            scanError.innerHTML = error;
            scanError.style.display = 'block';
        } );
    },

    showProduct: function(barcode){
        $.ajax({
            type: 'GET',
            url: BASE_URL + 'index.php/ajax/product_list',
            contentType: 'application/json; charset=utf-8',
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'success',
            data: {'barcode': barcode},
            success: function(data){
                var info = data[0];
                document.getElementById('product-info').style.display = 'block';
                document.getElementById('pro-name').innerHTML = info['name'];
                document.getElementById('pro-price').innerHTML = info['price'];
                document.getElementById('pro-amount').innerHTML = info['amount'];
                document.getElementById('pro-barcode').innerHTML = info['barcode'];
                document.getElementById('pro-id').setAttribute('value', info['id']);
            },
            error: function(err){
                alert('error');
            }
        });
    },

    buyProduct: function(){
        $('#buy').click(function(e){
            var datas = {};
            datas.num = $('#pro-num').val();
            datas.pid = $('#pro-pid').val();

            e.preventDefault();
            $.ajax({
                type: 'GET',
                url: BASE_URL + 'index.php/ajas/sale_add',
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                jsonpCallback: 'success',
                data: {'num':datas.num, 'pid':datas.pid},
                success: function(data){
                    alert(data);
                },
                error: function(err){
                    alert('error');
                }
            });

        });
    }
};