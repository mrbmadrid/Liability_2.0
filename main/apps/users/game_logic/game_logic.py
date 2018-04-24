from models import *

'''
players
	player
		action
		income
			residual
			travel
			occupy
		outgoing
			loan payments
			travel cost
			occypy cost

'''

class StateManager(object):
	def unpack_game_state(self, state):
		#unpack game from game state
		game = {}
		return game

	def pack_game_state(self, game):
		#pack game into state integer
		game_state = 0
		return game_state

	def unpack_cell_state(self, state):
		#unpack cell from cell state
		return cell


	def process_actions(self, game):
		cells = Cell.objects.filter(game_id=game.id)
		players = Player_Profile.objects.filter(game_id=game.id)
		players_action_data = {}
		for player in players:
			players_action_data[player] = {
				"income" : {
					"residual" : 0,
					"travel" : 0,
					"occypy" : 0,
					"cell_sale": {}
				}
				"outgoing" : {
					"loan_payments" : 0,
					"travel" : 0,
					"occypy" : 0,
					"cell_upgrade", {}
					"cell_purchase": {}
				}
			}

		for player in players:
			process_upgrades(player, players_action_data[player])
			process_purchases(player, players, players_action_data)
			process_travel
			#calculate player actions
			#modify 


		#purchases = {}
		#get cell offset (origin cell for game) 
		#for player in players
			#loop through player.action
				#if upgrade action
					#if player owns cell
						#if player has resources for action
							#modify cell.state
							#modify player_profile.state
				#elif purchase action
					#if cell is unowned
						#if 'cell_id' in purchases
							#if offer > purchases['cell_id'][1]
								#purchases['cell_id'] = [player.player_id, offer]
						#else
							#purchases['cell_id'] = [player.player_id, offer]
			
	def submit_action(request):
		if not 'id' in request.session: #redirect to landing if not logged in
			return redirect(index)
		game = Game.objects.get(id=request.POST['game_id']) #get current game
		player_profile = game.player_profiles.get(player_profiles_id=request.session['id']) #get player_profile
		if player_profile: #this makes sure the player has a profile in the game
			if player_profile.turn < game.turn: #if player has not already submitted an action for this turn 
				player_profile.action = request.POST['action'] #store action
				player_profile.turn += 1 #increment player turn
				game.waiting_to_finish_turn -= 1 #decrement players game is waiting on to process turn
				player_profile.save()
				game.save()
			if game.turn == 0:
				#implement django-carrot function call to process all player actions
				pass
	
	def calc_travel_costs(path, cell_list, ):
		route = path.split(" ")
		cost = 0
		for loc in route:
			cell = Cell.objects.get(loc=loc)
			cur_cost = get_cell_economy(cell).travel_cost
			cost += cur_cost

	











			

