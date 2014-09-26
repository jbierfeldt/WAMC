from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from locations.views import LocationDetailView

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name="map/index.html")),
    url(r'^tags/$', LocationDetailView.as_view(), name='location-detail'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
