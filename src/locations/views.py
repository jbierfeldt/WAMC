from django.core import serializers
from django import http
from django.utils.text import slugify

import json

from django.views.generic.detail import BaseDetailView

from locations.models import Location

class JSONResponseMixin(object):
    def render_to_response(self, context):
        "Returns a JSON response containing 'context' as payload"
        return self.get_json_response(self.convert_context_to_json(context))

    def get_json_response(self, content, **httpresponse_kwargs):
        "Construct an `HttpResponse` object."
        return http.HttpResponse(content,
                                 content_type='application/json',
                                 **httpresponse_kwargs)

    def convert_context_to_json(self, context):
        "Convert the context dictionary into a JSON object"
        data_struct = {
        	'name': context['object'].name,
        	'lat': context['object'].lat,
        	'lng': context['object'].lng
        }
        return json.dumps(data_struct)

class LocationDetailView(BaseDetailView, JSONResponseMixin):

	model = Location

	def get_object(self, queryset=None):
		slug = slugify(self.request.GET['tag'])
		obj = Location.objects.get(tags__slug=slug)
		return obj

# Create your views here.
