from rest_framework import generics
from .models import Job
from .serializers import JobSerializer

# This built-in DRF view handles both fetching a list of jobs (GET) 
# and creating a new job listing (POST) automatically.
class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all().order_by('-created_at') # Newest jobs first
    serializer_with_client = JobSerializer
    serializer_class = JobSerializer