from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    # We display the client's username instead of their database ID number
    client_username = serializers.CharField(source='client.username', read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'client', 'client_username', 'title', 'description', 'budget', 'created_at']