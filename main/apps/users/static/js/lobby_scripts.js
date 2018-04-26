$(document).ready(function(){
	$.get( "/user/"+$("#user_id").val(), function(res) {
  		alert(res)
	});

	$("#quickplay_4").click(function(){
		$.get( "/join_public_game/4", function(res) {
  			alert(res)
		});
	})
})