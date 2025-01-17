from rest_framework.decorators import api_view
from rest_framework.response import Response
from config.game_config import GAME_OPTIONS


@api_view(['GET'])
def options(request):
	"""
	API endpoint to fetch all available game options.
	"""
	return Response(GAME_OPTIONS)
