from django.contrib.sitemaps import Sitemap

class WAMCSitemap(Sitemap):
    def items(self):
      return [self]

    location = "/"
    changefreq = "weekly"
    priority = 0.5
