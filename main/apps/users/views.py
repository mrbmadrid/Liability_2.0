# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render, redirect, HttpResponse
from bcrypt import hashpw, gensalt, checkpw
from .models import *
import json
# Create your views here.


def index(request):
	if not 'id' in request.session:
		return render(request, "users/landing.html")
	return redirect(lobby) #redirect to lobby if logged in

def lobby(request):
	if not 'id' in request.session: #redirect to landing if not logged in
		return redirect(index)
	return render(request, "index.html")


'''
Login / Registration

'''

def register(request):
	register_errors={}
	if request.POST:
		if len(User.objects.filter(email=request.POST['form-email'])):
			register_errors['email_duplicate'] =  "This email has already been registered."
		if len(User.objects.filter(user_name=request.POST['form-username'])):
			register_errors['username_duplicate'] = request.POST['form-username'] + " This username is not available."
		if len(register_errors):
			return render(request, "users/landing.html", {'register_errors' : register_errors})
		register_errors = User.objects.reg_validator(request.POST)
		if len(register_errors):
			print(register_errors)
			return render(request, "users/landing.html", {'register_errors' : register_errors})
		sw = gensalt()
		pw = hashpw(request.POST['form-password'].encode(), sw).decode('utf-8')
		User.objects.create(f_name = request.POST['form-first-name'], l_name = request.POST['form-last-name'], user_name = request.POST['form-username'], email = request.POST['form-email'], sw = sw, pw = pw)
		request.session['id'] = User.objects.get(user_name=request.POST['form-username']).id
		request.session.modified=True
		return redirect(lobby)
	return redirect(index)

def login(request):
	login_errors={}
	if request.POST:
		if len(User.objects.filter(user_name=request.POST['login-username'])):
			user = User.objects.get(user_name=request.POST['login-username'])
			print(user.sw)
			if checkpw(request.POST['login-password'].encode(), user.pw.encode()):
				request.session['id'] = User.objects.get(user_name=request.POST['login-username']).id
				return redirect(lobby)
			else:
				login_errors['exists'] = "Check your username or password."
		else:
			login_errors['exists'] = "Check your username or password."
	return render(request, "users/landing.html", {'login_errors':login_errors})

def logout(request):
	if 'id' in request.session:
		request.session.pop('id', None)
	return redirect(index)



'''
	Ajax
'''
def check_username(request, username):
	if len(User.objects.filter(user_name=username)):
		return HttpResponse("taken")
	return HttpResponse("available")

def check_email(request, email):
	if len(User.objects.filter(email=email)):
		return HttpResponse("registered")
	return HttpResponse("unregistered")


'''
	Game Submission/Update/Validation
'''
def get_game_data(request, game_id):
	if not 'id' in request.session: #redirect to landing if not logged in
		return redirect(index)
	game = Game.objects.get(id=game_id)
	c = Cell.objects.filter(game_id=game_id)
	p = Player_Profile.objects.filter(game_id=game_id)
	cells = {}
	for cell in c:
		cells[cell.pos] = cell.game_data()
	players = {}
	for player in p:
		players[player.player.name] = player.game_data()

	return {
	"game" : game.game_data(),
	"cells" : cells,
	"players" : players
	}


def create_game(request):
	if not 'id' in request.session: #redirect to landing if not logged in
		return redirect(index)
	print(request.POST)
	#make game
	return HttpResponse("I need to do something with the data you gave. TTYL")

	data = json.loads(request.body)
	
	print(data['data']['6,6'])

	return HttpResponse('test')

