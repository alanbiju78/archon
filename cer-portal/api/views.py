from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from .models import Event, Participation
from .serializers import UserSerializer, EventSerializer
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class EventList(generics.ListAPIView):
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

class EventDetail(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

class ParticipateEvent(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        response_data = request.data.get('response') # 'join' or 'skip'
        if response_data not in ['join', 'skip']:
            return Response({'error': 'Invalid response'}, status=status.HTTP_400_BAD_REQUEST)

        # Create or update participation
        participation, created = Participation.objects.update_or_create(
            user=request.user,
            event=event,
            defaults={'response': response_data}
        )

        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)