# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.utils.safestring import mark_safe
import json

# Create your views here.

def index(request):
    request.session['user'] = 'Voltaic'
    print (request.session['user'])
    return render(request, 'chat/index.html', {})

def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name_json': mark_safe(json.dumps(room_name))
    })