/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2013-11-28 09:05:01
 * @version $Id$
 */

$('ul.dropdown-menu li').each(function(){
	$(this).click(function(){
		var value = $(this).text();
		$('#amount').text(value);
		$('#pro-num').val(value);
	});
});