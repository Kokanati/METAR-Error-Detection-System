# apps/meds/meds/config/desktop.py
def get_data():
    return [
        {
            "module_name": "Meds",
            "type": "module",
            "label": "METAR Checker",
            "color": "#e67e22",
            "icon": "octicon octicon-pulse",
            "link": "metar-checker",
            "onboard_present": 1
        }
    ]
