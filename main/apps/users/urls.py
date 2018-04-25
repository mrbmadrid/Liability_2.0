from django.urls import path, re_path, include
from . import views

urlpatterns = [
	re_path('^$', views.index),
	re_path('^lobby$', views.lobby),
	re_path('^register$', views.register),
	re_path('^login$', views.login),
	re_path('^logout$', views.logout),
	re_path('^username_validation/(?P<username>.*)$', views.check_username),
	re_path('^email_validation/(?P<email>.*)$', views.check_email),
	re_path('^game/(?P<game_id>\d+)$', views.get_game_data),
	re_path('^game/create$', views.create_game)
]