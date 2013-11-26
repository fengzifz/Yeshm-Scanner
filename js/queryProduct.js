/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2013-11-26 10:58:10
 * @version $Id$
 */

$('#confirm-bnt').click(function(){
	$.ajax({
		type: 'POST',
		url: 'http://14.20.206.161/athene/index.php/ajax/testdamon',
		contentType: "application/json; charset=utf-8",
		dataType: 'jsonp',
		jsonp: 'callback',
		jsonpCallback: 'success',
		success: function(data){
			alert(data[1]['symbol']);
		},
		error: function (err) {
        	alert('error');
        }
	});
});