$(document).ready(function(){
	updateGames()

	$("#quickplay_4").click(function(){
		$.get( "/join_public_game/4", function(res) {
  			updateGames()
		});
	})

	$("#quickplay_8").click(function(){
		$.get( "/join_public_game/8", function(res) {
  			updateGames()
		});
	})

	var roomName = 'lobby';

	var chatSocket = new WebSocket(
		'ws://' + window.location.host +
		'/ws/chat/' + roomName + '/');

	chatSocket.onmessage = function (e) {
		var data = JSON.parse(e.data);
		var message = data['message'];
		// document.querySelector('#chat-div').append(message + '\n');
		document.querySelector('#chat-log').value += (message + '\n');
	};

	chatSocket.onclose = function (e) {
		console.error('Chat socket closed unexpectedly');
	};

	document.querySelector('#chat-message-input').focus();
	document.querySelector('#chat-message-input').onkeyup = function (e) {
		if (e.keyCode === 13) {  // enter, return
			document.querySelector('#chat-message-submit').click();
		}
	};

	document.querySelector('#chat-message-submit').onclick = function (e) {
		var messageInputDom = document.querySelector('#chat-message-input');
		var message = messageInputDom.value;
		// console.log($('#user_id').val());
		chatSocket.send(JSON.stringify({
			'message': $('#user_name').val() + ': ' + message
		}));

		messageInputDom.value = '';
	};

})

function updateGames(){
	$.getJSON( "/user/"+$("#user_id").val(), function(res) {
  		$("#player_games").html("")
  		for(key in res['games']){
  			$("#player_games").append(
  				 "<div class='row'><div class='col-sm-8'><a href='/joingame/"+key+"'>"+res['games'][key]['name']+"</a></div><div class='col-sm-2'>"+ res['games'][key]['turn'] +
  				 "</div></div>"
  				)
  		}
	});
}

