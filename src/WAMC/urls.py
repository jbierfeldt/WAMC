from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from locations.views import LocationDetailView

from WAMC.sitemaps import WAMCSitemap

from django.contrib import admin
admin.autodiscover()

sitemaps = {
    'wamc': WAMCSitemap()
}

urlpatterns = patterns('',
	url(r'^sitemap.xml$', 'django.contrib.sitemaps.views.sitemap', {'sitemaps': sitemaps}),
	url(r'^robots.txt$', include('robots.urls')),
    url(r'^$', TemplateView.as_view(template_name="map/index.html")),
    url(r'^tags/$', LocationDetailView.as_view(), name='location-detail'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
