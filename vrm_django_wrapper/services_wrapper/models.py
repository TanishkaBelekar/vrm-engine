from django.db import models, transaction
from services_wrapper.scoring_client import score

class Review(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    template_id = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    sections = models.JSONField()  # This holds the full sections list with questions and answers, matching the sample payload
    scoring_result = models.JSONField(null=True, blank=True)  # Stores scoring output

    def approve_review(self):
        """
        Called when reviewer approves.
        Sends full payload for scoring and approves only if no remediation pending.
        """
        if self.remediation_pending():
            # If remediation exists and is pending approval, skip approval/scoring here
            print("Remediation pending. Approval delayed.")
            return

        payload = {
            "template_id": self.template_id,
            "version": self.version,
            "sections": self.sections,
        }

        result = score(payload)  # Will raise exception if scoring fails

        with transaction.atomic():
            self.status = 'Approved'
            self.scoring_result = result
            self.save()

    def approve_remediation(self):
        """
        Called when remediation is approved.
        Triggers re-scoring and saves the updated scoring result.
        """
        payload = {
            "template_id": self.template_id,
            "version": self.version,
            "sections": self.sections,
        }

        result = score(payload)  # Will raise exception if scoring fails

        with transaction.atomic():
            self.scoring_result = result
            self.save()

    def remediation_pending(self):
        """
        Placeholder method.
        Returns False now since remediation integration not done.
        Update later to check remediation status from backend or DB.
        """
        return False
