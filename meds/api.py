import frappe
from frappe.core.doctype.communication.email import make

@frappe.whitelist(allow_guest=True)
def send_metar_email(header, metar_list, receipient_email="reggy.hingano@gmail.com"):
    """
    Send METAR report via email using Frappe's internal mail system.
    Called from the frontend with two parameters: header (string) and metar_list (string)
    """
    try:
        recipients = [receipient_email]
        subject = "METAR Submission"
        message = f"<b>{header}</b><br><pre>{metar_list}</pre>"

        frappe.sendmail(
            recipients=recipients,
            subject=subject,
            message=message,
            delayed=False,
            sender="MEDSystem <system@jlh-tonga.com>"
        )

        return "METAR sent successfully"
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "METAR Email Sending Failed")
        return f"Failed to send METAR: {str(e)}"
