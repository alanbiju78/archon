from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, Participation

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

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'venue', 'join_count', 'skip_count']

    def get_join_count(self, obj):
        return obj.participations.filter(response='join').count()

    def get_skip_count(self, obj):
        return obj.participations.filter(response='skip').count()