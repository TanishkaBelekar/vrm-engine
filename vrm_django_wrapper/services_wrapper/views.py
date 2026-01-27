from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .scoring_client import get_rules, score, validate
import json


def scoring_rules(request):
    try:
        data = get_rules()
        return JsonResponse(data)
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@csrf_exempt
def scoring_view(request):
    if request.method == "POST":
        try:
            payload = json.loads(request.body)
            score_result = score(payload)
            return JsonResponse(score_result)
        except Exception as e:
            return HttpResponseBadRequest(str(e))
    return HttpResponseBadRequest("POST request required")


@csrf_exempt
def validation_view(request):
    if request.method == "POST":
        try:
            payload = json.loads(request.body)
            validation_result = validate(payload)
            return JsonResponse(validation_result)
        except Exception as e:
            return HttpResponseBadRequest(str(e))
    return HttpResponseBadRequest("POST request required")