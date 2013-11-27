/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2013-11-26 10:58:10
 * @version $Id$
 */

$('#confirm-bnt').click(function(){
	$.ajax({
		type: 'GET',
		url: 'http://14.20.217.35/index.php/ajax/product_list',
		contentType: "application/json; charset=utf-8",
		dataType: 'jsonp',
		jsonp: 'callback',
		jsonpCallback: 'success',
		data: {'barcode':'6917878030623'},
		success: function(data){
			alert(data[0]['name']);
		},
		error: function (err) {
        	alert('error');
        }
	});
});