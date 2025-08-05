from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, Participation
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile # Import the Profile model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    join_count = serializers.SerializerMethodField()
    skip_count = serializers.SerializerMethodField()
    organizer_info = serializers.SerializerMethodField()
    current_user_participation = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'venue', 'join_count', 'skip_count', 'owner', 'organizer_info', 'current_user_participation']
        read_only_fields = ['owner']

    def get_join_count(self, obj):
        return obj.participations.filter(response='join').count()

    def get_skip_count(self, obj):
        return obj.participations.filter(response='skip').count()

    def get_organizer_info(self, obj):
        try:
            profile = obj.owner.profile
            return {
                'full_name': profile.full_name,
                'phone_number': profile.phone_number
            }
        except Profile.DoesNotExist:
            return None
    
    

    def get_current_user_participation(self, obj):
        # The request object is passed in the context from the view
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                participation = Participation.objects.get(event=obj, user=request.user)
                return participation.response
            except Participation.DoesNotExist:
                return None
        return None
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        groups = user.groups.all()
        if groups:
            token['role'] = groups[0].name
        else:
            token['role'] = 'Guest'

        # THIS IS THE FIX: Use a try-except block to safely get the profile status
        try:
            token['profile_complete'] = user.profile.profile_complete
        except Profile.DoesNotExist:
            # If profile doesn't exist, create it and set complete to False
            Profile.objects.create(user=user)
            token['profile_complete'] = False

        return token

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['full_name', 'phone_number', 'student_id', 'major', 'organization_name', 'profile_complete']
    
class AttendeeSerializer(serializers.ModelSerializer):
    """
    Serializer to provide full profile details for an event attendee.
    """
    full_name = serializers.CharField(source='profile.full_name', read_only=True)
    phone_number = serializers.CharField(source='profile.phone_number', read_only=True)
    student_id = serializers.CharField(source='profile.student_id', read_only=True)
    major = serializers.CharField(source='profile.major', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'phone_number', 'student_id', 'major']