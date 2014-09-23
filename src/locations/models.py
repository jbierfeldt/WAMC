from django.db import models

from taggit.managers import TaggableManager

class Location(models.Model):
	name = models.CharField(max_length=256)
	lat = models.FloatField()
	lng = models.FloatField()
	tags = TaggableManager()

	def __unicode__(self):
		return self.name