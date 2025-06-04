frappe.ui.form.on('METAR Observation', {
    refresh(frm) {
        frm.add_custom_button(__('Check METAR'), () => {
            frappe.msgprint(__('This will later validate your METAR input.'));
        });
    }
});

