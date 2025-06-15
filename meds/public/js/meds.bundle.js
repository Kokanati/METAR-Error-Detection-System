// apps/meds/meds/public/js/meds.bundle.js

// This is a minimal required content for the app to appear
// You can add your custom JS later
frappe.ready(() => {
    console.log('Meds app loaded');
});

// Required for desktop integration
frappe.provide('frappe.ui');
frappe.ui.app_icon = {
    'meds': {
        'icon': 'octicon octicon-pulse',
        'color': '#FF69B4',
        'label': 'Meds'
    }
};