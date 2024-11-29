from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet,home,loginPage,logoutPage,update_task

router = DefaultRouter()
router.register(r'tasks', TaskViewSet,basename='task')

urlpatterns = [
    path('',home,name='home'),
    path('login/',loginPage,name='login'),
    path('logout/',logoutPage,name='logout'),
    path('api/', include(router.urls)),
    path('api/tasks/<int:task_id>/', update_task, name='update_task'),
]