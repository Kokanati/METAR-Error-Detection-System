# METAR Error Detection System (MEDS)

> A real-time METAR validation tool built with Frappe + React for quality assurance of aviation weather reports before submission to WMO GTS or national systems.

---

## 🚀 Overview

The METAR Error Detection System (MEDS) is a web-based platform designed for meteorological stations and weather observers to validate METAR and SPECI reports. It features:

* Real-time field-level METAR validation
* Auto-generation of METAR strings
* Cloud layer logic checks
* Duplicate station detection
* Email sending of verified METAR to weather desks
* Modular React frontend powered by Frappe backend
* METAR Local Auto-Archive
* Direct ingestion of observation data into CLiDE Database or any database


---

## 🧱 Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React + Vite + Tailwind CSS       |
| Backend    | Frappe Framework (Python)         |
| Database   | MariaDB (via Frappe ORM)          |
| Server     | Node (Vite dev) + Frappe (Python) |
| Deployment | Frappe Bench (Dev Mode)           |

---

## 📦 Features

### ✅ Core Functionalities

* METAR/SPECI mode switching
* Station and country selector
* UTC clock and auto-time population
* Cloud layer checks (e.g. FEW only on first 2 layers)
* Directional visibility and weather codes
* Validation on:

  * Visibility
  * Temperature/dew point consistency
  * QNH

### ✉️ Email Submission

* Configurable SMTP email backend via `site_config.json`
* Custom recipient input via gear icon
* Email preview and confirmation modal
* HTML-formatted email using `frappe.sendmail()`

### 🧠 User Experience

* Interactive form
* Error highlights
* Dynamic METAR preview
* METAR history list (edit, delete, copy)

---

## ⚙️ Configuration

### Email Setup in `site_config.json`

```json
"mail_server": "mail.jlh-tonga.com",
"mail_port": 465,
"mail_login": "system@jlh-tonga.com",
"mail_password": "<your-password>",
"auto_email_id": "system@jlh-tonga.com",
"use_ssl": 1,
"allow_cors": "http://localhost:5173"
```

Ensure your SMTP credentials are valid and CORS allows your frontend port.

---

## 🛠️ Development

### Prerequisites

* Frappe Bench (v15+)
* Node + Yarn
* Python 3.10+

### Local Setup

```bash
# Start Frappe
bench start

# In another terminal (frontend dev)
cd apps/meds/frontend
npm install
npm run dev
```

App URL: [http://localhost:5173](http://localhost:5173)
Frappe API: [http://localhost:8000](http://localhost:8000)

---

## 📁 Folder Structure

```
apps/
  meds/
    frontend/       # React + Vite app
    meds/
      api.py        # Python email API handler
      ...
```

---

## 🔐 Security

* Email input is validated
* CORS restriction via Frappe
* SMTP credentials are secured in `site_config.json`

---

## 📮 Example Email Output

```
SATO31 NFTF 070930

METAR NFTF 070930Z 09009KT 9999 FEW018 24/23 Q1012=
METAR NFTV 070930Z 12010KT 9999 SCT018 24/21 Q1012=
```

---

## 👨‍💻 Author

**Kokanati** — [GitHub](https://github.com/Kokanati)

---

## 📜 License

This project is open-source and licensed under MIT.

---

## 🙏 Acknowledgements

* [Frappe Framework](https://frappeframework.com)
* [React](https://react.dev)
* [WMO METAR Standards](https://www.wmo.int)
* \[Tonga Meteorological Services (Example Use Case)]
