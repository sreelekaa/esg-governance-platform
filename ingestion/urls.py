from django.urls import path
from .views import (
    SAPUploadView,
    UtilityUploadView,
    TravelSyncView
)

urlpatterns = [
    path("upload/sap/", SAPUploadView.as_view()),

    path("upload/utility/", UtilityUploadView.as_view()),

    path("travel/sync/", TravelSyncView.as_view()),
]