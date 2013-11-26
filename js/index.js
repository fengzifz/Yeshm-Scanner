var DEBUG = false;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
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

            document.getElementById("info").innerHTML = result.text;

        }, function (error) { 
            var scanError = document.getElementById('scan-error');
            scanError.innerHTML = error;
            scanError.style.display = 'block';
        } );
    }
};

