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
	re_path('^get_game_data$', views.get_game_data),
	re_path('^joingame/(?P<game_id>\d+)$', views.join_game),
	re_path('^Create_Game$', views.create_game),
	re_path('^user/(?P<id>\d+)$', views.user),
	re_path('^join_public_game/(?P<size>\d)$', views.join_public_game)
	
]