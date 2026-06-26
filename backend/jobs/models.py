from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    # Link the job to the user who created it (the client)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    
    title = models.CharField(max_length=200) # Cleaned up here
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Automatically track dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title