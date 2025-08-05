# api/permissions.py
from rest_framework import permissions
from .models import Event

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the event.
        return obj.owner == request.user

class IsEventOwner(permissions.BasePermission):
    """
    Custom permission to only allow the owner of an event to view its attendee list.
    """
    def has_permission(self, request, view):
        # Get the event ID from the URL
        event_id = view.kwargs.get('pk')
        if not event_id:
            return False
        
        try:
            # Check if an event with this ID has the current user as its owner
            return Event.objects.filter(pk=event_id, owner=request.user).exists()
        except Event.DoesNotExist:
            return False