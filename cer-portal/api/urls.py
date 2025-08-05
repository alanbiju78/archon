# api/urls.py
from django.urls import path
from . import views
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Auth
    path('user/register/', views.UserCreate.as_view(), name='user_create'),
    path('profile/', views.ProfileDetail.as_view(), name='profile_detail'),
    path('token/', TokenObtainPairView.as_view(serializer_class=MyTokenObtainPairSerializer), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Events
    path('events/', views.EventList.as_view(), name='event_list'),
    path('community-events/', views.AllCommunityEventList.as_view(), name='community_events_list'),
    path('events/create/', views.EventCreate.as_view(), name='event_create'), # <-- NEW
    path('events/<int:pk>/', views.EventDetail.as_view(), name='event_detail'), # This now handles Retrieve, Update, and Delete
    path('events/<int:pk>/participate/', views.ParticipateEvent.as_view(), name='participate_event'),
    path('featured-events/', views.FeaturedEventList.as_view(), name='featured_events'), # <-- ADD THIS LINE
    path('my-events/', views.MyEventsList.as_view(), name='my_events_list'), # <-- ADD THIS LINE
    path('events/<int:pk>/attendees/', views.EventAttendeeList.as_view(), name='event_attendees'), # <-- ADD THIS LINE
    path('events/<int:pk>/participate/', views.ParticipateEvent.as_view(), name='participate_event'),
]