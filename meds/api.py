import frappe
from frappe.core.doctype.communication.email import make

@frappe.whitelist(allow_guest=True)
def send_metar_email():
    try:
        data = frappe.request.get_json()
        header = data.get("header")
        metar_list = data.get("metar_list")
        recipient = data.get("recipient_email")

        if not header or not metar_list or not recipient:
            return {"success": False, "message": "Missing required fields."}

        message = f"{header}\n{metar_list}"
        html_message = message.replace ('\n', '<br>')

        frappe.sendmail(
            recipients=[recipient],
            subject="METAR Observation",
            message=html_message,
            delayed=False,
            sender="MEDSystem <system@jlh-tonga.com>"
        )

        return {
            "success": True,
            "message": f"METAR sent successfully to {recipient}",
            "recipients": [recipient]
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "METAR Email Error")
        return {
            "success": False,
            "message": str(e)
        }