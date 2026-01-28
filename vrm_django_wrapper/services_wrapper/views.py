import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .scoring_client import get_rules, score, validate

@csrf_exempt
def scoring_rules(request):
    try:
        data = get_rules()
        if data is None:
            return HttpResponseBadRequest("Failed to fetch scoring rules")
        return JsonResponse(data)
    except Exception as e:
        return HttpResponseBadRequest(f"Error fetching scoring rules: {e}")

@csrf_exempt
def scoring_view(request):
    if request.method == "POST":
        try:
            if not request.body:
                return HttpResponseBadRequest("Empty request body")
            payload = json.loads(request.body)
            score_result = score(payload)
            if score_result is None:
                return HttpResponseBadRequest("Scoring service error")
            return JsonResponse(score_result)
        except Exception as e:
            return HttpResponseBadRequest(f"Error scoring payload: {e}")
    return HttpResponseBadRequest("POST request required")

@csrf_exempt
def validation_view(request):
    if request.method == "POST":
        try:
            if not request.body:
                return HttpResponseBadRequest("Empty request body")
            payload = json.loads(request.body)
            validation_result = validate(payload)
            if validation_result is None:
                return HttpResponseBadRequest("Validation service error")
            return JsonResponse(validation_result)
        except Exception as e:
            return HttpResponseBadRequest(f"Error validating payload: {e}")
    return HttpResponseBadRequest("POST request required")





@csrf_exempt
def test_vendor_submit(request):
    if request.method == "POST":
        try:
            payload = json.loads(request.body)
            result = score(payload)
            if result:
                # Here you would normally save the result in DB
                return JsonResponse({"message": "Scoring done", "score_result": result})
            else:
                return HttpResponseBadRequest("Scoring service failed")
        except Exception as e:
            return HttpResponseBadRequest(f"Error: {e}")
    return HttpResponseBadRequest("POST request required")