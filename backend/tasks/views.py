from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout,login,authenticate
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
import json
from django.views.decorators.http import require_http_methods


def home(request):
    return render(request,'tasks/home.html')

@ensure_csrf_cookie
def loginPage(request):
    if request.method=='POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user=authenticate(request,username=username,password=password)
        if user is not None:
            login(request,user)
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@ensure_csrf_cookie
def logoutPage(request):
    if request.method=='POST':
        logout(request)
        return JsonResponse({'message': 'Logout successful'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@require_http_methods(["PATCH"])
def update_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        data = json.loads(request.body)
        task.completed = data.get('completed', task.completed)  # Update status
        task.save()
        return JsonResponse({'message': 'Task updated successfully'}, status=200)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)



class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]


