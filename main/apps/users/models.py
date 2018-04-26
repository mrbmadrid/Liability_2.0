# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import models
import re

# Create your models here.

class UserManager(models.Manager):
	def reg_validator(self, postData):
		errors = {}
		try:
			validate_email(postData['form-email'])
		except ValidationError:
			errors['email'] = postData['form-email'] + " is not a valid email."
		if not re.match(r'[a-zA-Z0-9_]+', postData['form-username']):
			errors['user_name'] = postData['form-username'] + " is not a valid user name."
		if not len(postData['form-password']) > 7:
			errors['password_length'] = "Your password is too short."
		elif len(postData['form-password']) > 16:
			errors['password_length'] = "Your password is too long."
		if not postData['form-password'] == postData['form-confirm']:
			errors['confirm_password'] = "Your passwords do not match."
		if not re.match(r'^.*(?=.{8,16})(?=.*\d)(?=.*[a-zA-Z]).*$', postData['form-password']):
			errors['password'] = "Your password must contain at least one upper case letter, one lower case letter, and one number."
		if not len(postData['form-first-name']):
			errors['f_name'] = "First name is required."
		if not len(postData['form-last-name']):
			errors['l_name'] = "Last name is required."
		return errors

class User(models.Model):
	user_name = models.CharField(max_length=16, unique=True)
	f_name = models.CharField(max_length=15)
	l_name = models.CharField(max_length=15)
	email = models.CharField(max_length=60, unique=True)
	sw = models.CharField(max_length=255)
	pw = models.CharField(max_length=255)
	joined_date = models.DateTimeField(auto_now_add=True)
	objects = UserManager()

class Game(models.Model):
	name = models.CharField(max_length=25, default="No Name")
	turn = models.IntegerField(default=0)
	board_length = models.IntegerField(default=10)
	board_width = models.IntegerField(default=10)
	num_players = models.IntegerField(default=8)
	waiting_to_finish_turn = models.IntegerField(default=8)
	created_at = models.DateTimeField(auto_now_add=True)
	created_by = models.ForeignKey(User, related_name="created_games", on_delete=models.PROTECT)

	def game_data(self):
		return {
		"name" : self.name,
		"turn" : self.turn,
		"length" : self.board_length,
		"width" : self.board_width,
		"num_players" : self.num_players,
		}
	

class Player_Profile(models.Model):
	player = models.ForeignKey(User, related_name="player_profiles", on_delete=models.PROTECT)
	pos = models.CharField(max_length=5)
	turn = models.IntegerField(default=0)
	move = models.CharField(max_length=255, default="00")
	account_balance = models.IntegerField()
	action = models.CharField(max_length=255)
	game = models.ForeignKey(Game, related_name="player_profiles", on_delete=models.PROTECT)
	'''
	Stuff that needs to be stored for each player in the game goes here.
	This is structured this way rather than using a ManyToManyField so players 
	can play in multiple games
	'''

	def game_data(self):
		return {
		"name" : self.player.user_name,
		"pos" : self.pos,
		"turn" : self.turn,
		"balance" : self.account_balance
		}

class Cell(models.Model):
	pos = models.CharField(max_length=5)
	price = models.IntegerField(default=25000)
	value = models.IntegerField(default=25000)
	q_1 = models.IntegerField(default=0)
	q_2 = models.IntegerField(default=0)
	q_3 = models.IntegerField(default=0)
	q_4 = models.IntegerField(default=0)
	travel_cost = models.IntegerField(default=100)
	stay_cost = models.IntegerField(default=500)
	residual_income = models.IntegerField(default=500)
	height = models.FloatField(default=0.5)
	neighborhood = models.IntegerField(default=0)
	owner = models.ForeignKey(Player_Profile, related_name="cells_owned", on_delete=models.PROTECT, null=True)
	game = models.ForeignKey(Game, related_name="cells", on_delete=models.PROTECT)
	for_sale = models.BooleanField(default=True)
	color = models.CharField(max_length=10, null=True)
	modified = models.BooleanField(default=False)
	updated_at = models.DateTimeField(auto_now=True)

	'''
		Takes a cell model object and returns a dict of values representing the
		cell's economy
	'''	

	def set_cell_economy(self):
		cell_economy = {
			"stay_cost" : 500.0,
			"travel_cost" : 100.0,
			"income" : 500.,
			"value" : 25000
		}	
		for count in range(0, self.neighborhood): #Modify economy based on neighborhood
			cell_economy['stay_cost'] *= 1.2
			cell_economy['travel_cost'] += 40
			cell_economy['income'] += 50
			cell_economy['value'] = pow(cell_economy['value'], 1.01)
		quadrant_mod = self.get_quadrant_mod()
		cell_economy['stay_cost'] *= quadrant_mod[0]
		cell_economy['travel_cost'] *= quadrant_mod[1]
		cell_economy['income'] *= quadrant_mod[2]
		self.travel_cost = cell_economy['travel_cost']
		self.stay_cost = cell_economy['stay_cost']
		self.residual_income = cell_economy['income']
		self.value = cell_economy['value']
		if not self.owner:
			self.price = self.value
		self.save()

	def get_quadrant_mod(self):
		quadrant_mod = [1, 1, 1]
		building = self.get_modifiers(str(self.q_1))
		for i in range(0, 3):
			quadrant_mod[i] += building[i]
		building = self.get_modifiers(str(self.q_2))
		for i in range(0, 3):
			quadrant_mod[i] += building[i]
		building = self.get_modifiers(str(self.q_3))
		for i in range(0, 3):
			quadrant_mod[i] += building[i]
		building = self.get_modifiers(str(self.q_4))
		for i in range(0, 3):
			quadrant_mod[i] += building[i]
		return quadrant_mod

	def get_modifiers(self, building):
		building_modifiers = {
			"0" : [0, 0, 0], #empty
			"1" : [-0.1, -0.2, 0.2], #Trailer Park
			"2" : [0, -0.2, 0.25], #Apartment Complex
			"3" : [0.1, -0.1, 0.3], #Housing Development
			"4" : [0.2, 0, 0.4], #Luxury Condos
			"5" : [0, 0.2, 0], #Truck Stop
			"6" : [0.2, 0.1, 0], #Outlet Mall
			"7" : [0.3, 0.1, -0.1], #Hotel
			"8" : [0.5, -0.2, -0.2], #Corporate Headquarters
			"9" : [0.2, 0, -0.1], #Manufacturing Plant
			"10" : [0.3, 0, -0.1], #Assembly Plant
			"11" : [0.4, 0, -0.1], #Power Plant
			"12" : [0.5, -0.2, 0], #Distrobution Center
			"13" : [0, 0, 0], #Prison
			"14" : [0, 0, 0], #Casino
			"15" : [0, 0, 0,], #Resort
			"16" : [0, 0, 0] #Monument
		}
		return building_modifiers[building]

	def game_data(self):
		if self.modified:
			self.set_cell_economy()
			self.modified = False
			self.save()

		data = {
		"pos" : {
			'x': self.pos.split(',')[0],
			'y': self.pos.split(',')[1],
			'h': self.height
		},
		"value" : self.value,
		"price" : self.price,
		"for_sale" : self.for_sale,
		"buildings" : [self.q_1, self.q_2,self.q_3,self.q_4],
		"travel_cost" : self.travel_cost,
		"stay_cost" : self.stay_cost,
		"residual_income" : self.residual_income,
		"h" : self.height,
		"nh" : self.neighborhood,
		"color" : self.color
		}
		if self.owner:
			data["owner"] = self.owner.player.user_name
		else:
			data["owner"] = "Unowned"
		return data



