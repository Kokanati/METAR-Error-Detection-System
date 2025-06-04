import frappe
import json
from frappe.model.document import Document
from frappe import _

@frappe.whitelist(allow_guest=True)
def save_metar_observation(payload=None):
    if isinstance(payload, str):
        payload = json.loads(payload)

   frappe.logger().info("Received payload: {}".format(payload))

    # Required fields for sanity check
    required_fields = ["obs_type", "station_id", "obs_time", "wind_direction", "wind_speed", "visibility", "temperature", "dew_point", "qnh"]

    missing = [f for f in required_fields if not payload.get(f)]
    if missing:
        frappe.throw(_("Missing required fields: ") + ", ".join(missing))

    # Create a new document
    doc = frappe.new_doc("METAR Observation")

    for key, value in payload.items():
        if hasattr(doc, key):
            doc.set(key, value)

    doc.submitted_at = frappe.utils.now_datetime()
    doc.insert(ignore_permissions=True)

    return {"status": "success", "name": doc.name}

@frappe.whitelist(allow_guest=True)
def send_metar_email(observation_names=None):
    if isinstance(observation_names, str):
        observation_names = json.loads(observation_names)

    if not observation_names:
        frappe.throw("No observations selected for email.")

    metars = []
    for name in observation_names:
        obs = frappe.get_doc("METAR Observation", name)
        metar_str = build_metar_string(obs)
        metars.append(metar_str)

        # Mark email_sent = 1
        obs.email_sent = 1
        obs.save(ignore_permissions=True)

    email_body = "\n".join(metars)

    frappe.sendmail(
        recipients=["regi@jlh-tonga.com", "reggy.hingano@gmail.com"],
        subject="Validated METAR Observations",
        message=email_body
    )

    return {"status": "sent", "count": len(metars)}


def build_metar_string(doc):
    # Basic string construction (extend as needed)
    return f"{doc.obs_type} {doc.station_id} {doc.obs_time} {doc.wind_direction}{doc.wind_speed}KT {doc.visibility} {doc.temperature}/{doc.dew_point} Q{doc.qnh} {doc.remarks or ''}".strip()

@frappe.whitelist(allow_guest=True)
def ping():
	return "pong"
