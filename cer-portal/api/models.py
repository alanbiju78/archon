from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    venue = models.CharField(max_length=200)

    def __str__(self):
        return self.title

class Participation(models.Model):
    RESPONSE_CHOICES = [
        ('join', 'Will Join'),
        ('skip', 'Will Skip'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participations')
    response = models.CharField(max_length=4, choices=RESPONSE_CHOICES)

    class Meta:
        unique_together = ('user', 'event') # Ensures a user responds only once per event

    def __str__(self):
        return f'{self.user.username} - {self.event.title} - {self.response}'