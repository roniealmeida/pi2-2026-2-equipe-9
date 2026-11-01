from rest_framework.routers import DefaultRouter

from analysis.views import PlantAnalysisViewSet

router = DefaultRouter()
router.register(r'analysis', PlantAnalysisViewSet, basename='analysis')

urlpatterns = router.urls