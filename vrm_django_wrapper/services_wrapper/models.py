from django.db import models
from services_wrapper.scoring_client import get_risk_score

class Review(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    template_id = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    sections = models.JSONField()  # stores review answers etc.
    scoring_result = models.JSONField(null=True, blank=True)  # store scoring output

    def approve(self):
        self.status = 'Approved'
        self.save()

        payload = {
            "template_id": self.template_id,
            "version": self.version,
            "sections": self.sections,
        }
        try:
            result = get_risk_score(payload)
            self.scoring_result = result
            self.save()
        except Exception as e:
            print(f"Failed to get scoring result: {e}")
