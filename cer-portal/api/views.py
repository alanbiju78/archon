# api/views.py
from django.contrib.auth.models import User, Group
from .models import Event, Participation
from .serializers import UserSerializer, EventSerializer
from .permissions import IsOwnerOrReadOnly, IsEventOwner
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile
from .serializers import UserSerializer, EventSerializer, ProfileSerializer, AttendeeSerializer

# --- User and Auth Views (No Change) ---
class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        role = self.request.data.get('role')
        if role:
            try:
                group = Group.objects.get(name=role)
                user.groups.add(group)
            except Group.DoesNotExist:
                pass

# --- Event Views (UPDATED) ---
class EventList(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # If user is an organizer, show only their events. Otherwise, show all.
        user = self.request.user
        if user.is_authenticated and user.groups.filter(name='Organizer').exists():
            return Event.objects.filter(owner=user).order_by('-date')
        return Event.objects.all().order_by('-date')

    def get_serializer_context(self):
        return {'request': self.request}

class EventCreate(generics.CreateAPIView): # <-- NEW
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Assign the current user as the owner of the event
        serializer.save(owner=self.request.user)

class EventDetail(generics.RetrieveUpdateDestroyAPIView): # <-- UPGRADED
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsOwnerOrReadOnly] # Use our custom permission

    def get_serializer_context(self):
        return {'request': self.request}

# --- Participation Views (No Change) ---
class ParticipateEvent(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # ... (rest of the view is the same)
    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        response_data = request.data.get('response') # 'join' or 'skip'
        if response_data not in ['join', 'skip']:
            return Response({'error': 'Invalid response'}, status=status.HTTP_400_BAD_REQUEST)

        participation, created = Participation.objects.update_or_create(
            user=request.user,
            event=event,
            defaults={'response': response_data}
        )

        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class MyEventsList(generics.ListAPIView): # <-- ADD THIS NEW CLASS
    """
    View to list events a user has registered for.
    """
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Get all participation records for the current user where the response is 'join'
        joined_participations = Participation.objects.filter(user=user, response='join')
        # Get the list of event IDs from these participations
        event_ids = joined_participations.values_list('event_id', flat=True)
        # Return the events that match these IDs
        return Event.objects.filter(id__in=event_ids).order_by('-date')

class EventAttendeeList(generics.ListAPIView):
    """
    View to list attendees for a specific event.
    Only the event owner can access this.
    """
    # Use the new, more detailed serializer
    serializer_class = AttendeeSerializer
    permission_classes = [permissions.IsAuthenticated, IsEventOwner]

    def get_queryset(self):
        event_id = self.kwargs['pk']
        user_ids = Participation.objects.filter(event_id=event_id, response='join').values_list('user_id', flat=True)
        # Use select_related to efficiently fetch profile data in one DB query
        return User.objects.filter(id__in=user_ids).select_related('profile')
        
class FeaturedEventList(generics.ListAPIView): # <-- ADD THIS NEW CLASS
    """
    Returns the top 3 most recent upcoming events.
    """
    queryset = Event.objects.order_by('-date')[:3] # Get the 3 most recent
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    View to retrieve or update the current user's profile.
    """
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # This ensures a profile always exists for the logged-in user.
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_update(self, serializer):
        # This method is called just before the data is saved.
        # We calculate the completion status based on the incoming data.
        user = self.request.user
        validated_data = serializer.validated_data
        is_complete = False

        # Use .get() to safely access keys that might not be in the validated_data yet
        full_name = validated_data.get('full_name')
        phone_number = validated_data.get('phone_number')

        if user.groups.filter(name='Student').exists():
            student_id = validated_data.get('student_id')
            major = validated_data.get('major')
            if full_name and phone_number and student_id and major:
                is_complete = True
        elif user.groups.filter(name='Organizer').exists():
            organization_name = validated_data.get('organization_name')
            if full_name and phone_number and organization_name:
                is_complete = True
        
        # Save the profile data along with the correctly calculated completion status
        serializer.save(profile_complete=is_complete)

class AllCommunityEventList(generics.ListAPIView):
    """
    View to list ALL community events, intended for organizers.
    This is different from the main EventList which filters for the owner.
    """
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]