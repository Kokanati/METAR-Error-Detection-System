import frappe
from frappe.utils.jinja import get_jenv

def get_context(context):
    if frappe.session.user == "Guest":
        frappe.local.flags.redirect_location = "/login?"redirect-to=/metar"
        raise frappe.Redirect
    return context

