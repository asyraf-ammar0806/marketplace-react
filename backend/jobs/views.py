from rest_framework import generics, permissions
from .models import Job
from .serializers import JobSerializer

# This built-in DRF view handles both fetching a list of jobs (GET) 
# and creating a new job listing (POST) automatically.
class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all().order_by('-created_at') # Newest jobs first
    serializer_class = JobSerializer
    
    # Rule: Anyone can view (GET), but you MUST be logged in to create (POST)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Automatically grab the user from the JWT token and set them as the client
    def perform_create(self, serializer):
        serializer.save(client=self.request.user)