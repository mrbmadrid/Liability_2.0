$(document).ready(function(){
	$.getJSON( "/user/"+$("#user_id").val(), function(res) {
  		for(key in res['games']){
  			$("#player_games").append(
  				 "<div class='row'><div class='col-sm-8'><a href='/joingame/"+key+"'>"+res['games'][key]['name']+"</a></div><div class='col-sm-2'>"+ res['games'][key]['turn'] +
  				 "</div></div>"
  				)
  		}
	});

	$("#quickplay_4").click(function(){
		$.get( "/join_public_game/4", function(res) {
  			alert(res)
		});
	})

	$("#quickplay_8").click(function(){
		$.get( "/join_public_game/8", function(res) {
  			alert(res)
		});
	})
})