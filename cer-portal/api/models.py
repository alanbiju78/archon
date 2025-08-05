from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    venue = models.CharField(max_length=200)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')

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
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Common fields
    full_name = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    
    # Student-specific fields
    student_id = models.CharField(max_length=20, blank=True)
    major = models.CharField(max_length=100, blank=True)
    
    # Organizer-specific fields
    organization_name = models.CharField(max_length=100, blank=True)
    
    # Profile completion flag
    profile_complete = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} Profile'

# This signal automatically creates a Profile when a new User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
