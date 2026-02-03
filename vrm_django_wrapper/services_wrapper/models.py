from django.db import models, transaction
from services_wrapper.scoring_client import score


class Review(models.Model):
    """
    Review model represents the reviewer stage of an assessment.

    Scoring is triggered:
    - On reviewer approval
    - Re-triggered only after remediation approval (if remediation exists)
    """

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )

    template_id = models.CharField(max_length=100)
    version = models.CharField(max_length=20)

    # Full assessment payload sections (questions + answers),
    # sent as-is to the scoring service
    sections = models.JSONField()

    # Stores scoring service response:
    # {
    #   final_score,
    #   risk_tier,
    #   red_flags_triggered,
    #   section_breakdown,
    #   explainability_notes,
    #   scored_at,
    #   template_version
    # }
    scoring_result = models.JSONField(null=True, blank=True)

    def approve_review(self):
        """
        Reviewer approval workflow.

        - Called when reviewer clicks "Approve"
        - Triggers scoring ONLY if no remediation is pending
        - Approval is completed only if scoring succeeds
        """
        if self.remediation_pending():
            # Remediation exists and is not yet approved
            # Scoring and approval must wait
            return

        payload = {
            "template_id": self.template_id,
            "version": self.version,
            "sections": self.sections,
        }

        # Safe-fail: if scoring fails, approval must not proceed
        result = score(payload)

        with transaction.atomic():
            self.status = 'Approved'
            self.scoring_result = result
            self.save()

    def approve_remediation(self):
        """
        Remediation approval workflow.

        - Called after remediation is approved
        - Triggers re-scoring
        - Updates scoring result but does not change review status
        """
        payload = {
            "template_id": self.template_id,
            "version": self.version,
            "sections": self.sections,
        }

        result = score(payload)

        with transaction.atomic():
            self.scoring_result = result
            self.save()

    def remediation_pending(self):
        """
        Placeholder for remediation check.

        Currently returns False because remediation
        is handled by another backend module.

        This will later check:
        - remediation exists AND
        - remediation status != approved
        """
        return False
