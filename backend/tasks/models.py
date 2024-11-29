from django.db import models

# Create your models here.
class Task(models.Model):

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title=models.CharField(max_length=255)
    description=models.TextField(null=True,blank=True)
    completed=models.BooleanField(default=False)
    created=models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=6, choices=PRIORITY_CHOICES, default='medium')
     

    def __str__(self):
        return self.title

