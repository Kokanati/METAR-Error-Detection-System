import frappe
from frappe.core.doctype.communication.email import make

@frappe.whitelist(allow_guest=True)
def send_metar_email(header, metar_list, recipient_email=None):
    """
    Send METAR report via email using Frappe's internal mail system.
    Called from the frontend with two parameters: header (string) and metar_list (string)
    """
    try:
        recipients = [recipient_email] if recipient_email else ["reggy.hingano@gmail.com"]
        #recipients = [receipient_email or "reggy.hingano@gmail.com"]
        subject = "METAR Submission"
        message = f"<b>{header}</b><pre>{metar_list}</pre>"

        frappe.sendmail(
            recipients=recipients,
            subject=subject,
            message=message,
            delayed=False,
            sender="MEDSystem <system@jlh-tonga.com>"
        )

        # Return success message with recipients
        return {
            "message": f"METAR sent successfully to {', '.join(recipients)}",
            "recipients": recipients,
            "success": True
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "METAR Email Sending Failed")
        return f"Failed to send METAR: {str(e)}"
