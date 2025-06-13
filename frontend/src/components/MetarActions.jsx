import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { useFormData } from '../context/FormContext';

const MetarActions = () => {
    const {
        formData,
        metarList,
        setMetarList,
        setValidatedHeader,
        updateField
    } = useFormData();

    const [showModal, setShowModal] = React.useState(false);
    const [arcModal, setArcModal] = React.useState(false);
    const [isSendDisabled, setIsSendDisabled] = React.useState(true);

    useEffect(() => {
        setIsSendDisabled(metarList.length === 0);
    }, [metarList]);

    const buildHeaderString = () => {
        const { ttaaii, cccc, utcTime } = formData;
        return [ttaaii, cccc, utcTime].filter(Boolean).join(' ');
    };
   

    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = async () => {
        if (metarList.length === 0) return;

        const allMetars = metarList.join('\n');

        // Try Clipboard API first if available and context is secure
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(allMetars);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 5000);
            } catch (err) {
                // Fallback if Clipboard API fails
                fallbackCopy();
            }
        } else {
            // Use legacy fallback directly
            fallbackCopy();
        }

        function fallbackCopy() {
            // Create hidden textarea, copy, then remove
            const textarea = document.createElement('textarea');
            textarea.value = allMetars;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                const successful = document.execCommand('copy');
                setCopySuccess(successful);
                setTimeout(() => setCopySuccess(false), 5000);
                if (!successful) {
                    alert('❌ Fallback: Could not copy METARs');
                }
            } catch (err) {
                alert('❌ Fallback: Could not copy METARs');
            }
            document.body.removeChild(textarea);
        }
    };


    const handleRemoveLine = () => {
        if (metarList.length === 0) return;
        const confirm = window.confirm('Are you sure you want to delete the last METAR line?');
        if (confirm) {
            const updatedList = [...metarList];
            updatedList.pop();
            setMetarList(updatedList);
        }
    };

    const handleEdit = () => {
        if (metarList.length === 0) return;

        const indexInput = prompt(`Enter the METAR line number to edit (1 to ${metarList.length}):`);
        if (indexInput === null) return;  // 🔒 user clicked "Cancel"

        const index = parseInt(indexInput, 10) - 1;
        if (isNaN(index) || index < 0 || index >= metarList.length) {
            alert('Invalid line number.');
            return;
        }

        const currentValue = metarList[index];
        const editable = prompt('Edit the METAR string below:', currentValue);
        if (editable !== null && editable.trim() !== '') {
            const updatedList = [...metarList];
            updatedList[index] = editable.trim();
            setMetarList(updatedList);
        }
    };

    
    const handleSendMetar = async () => {
        const { recipientEmail } = formData;
        const header = buildHeaderString();
        const metarBody = metarList.join('\n');

        if (!recipientEmail || !/^\S+@\S+\.\S+$/.test(recipientEmail)) {
            alert('❌ Please enter a valid recipient email before sending METAR.');
            return;
        }

        const confirmSend = window.confirm(
            `You are about to send the following METARs to ${recipientEmail}\n\n${header}\n${metarBody} \n\nContinue?`
        );

        if (!confirmSend) return;

        try {
            const response = await fetch('/api/method/meds.api.send_metar_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Frappe-CSRF-Token': window.csrf_token || ''
                },
                body: JSON.stringify({
                    header,
                    metar_list: metarBody,
                    recipient_email: recipientEmail
                })
            });

            const result = await response.json();
            if (response.ok && result.message && result.message.success) {
                alert(`✅ ${JSON.stringify(result.message.message)}`);
            } else {
                alert(`❌ Failed to send: ${result.message?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Send METAR failed:', error);
            alert('❌ Could not send METAR. Check server logs.');
        }
    };

    return (
        <div className="section">
            <div className="preview-box">
                {buildHeaderString() || 'WMO METAR Header will appear here when fields are filled in.'}
            </div>

            <h3 style={{ marginTop: '1rem' }}>Verified METAR</h3>
            <div className="action-box" style={{ whiteSpace: 'pre-line' }}>
                {metarList.length > 0 ? (
                    metarList.map((metar, idx) => (
                        <div key={idx}>{metar}</div>
                    ))
                ) : (
                    <div style={{ color: '#666' }}>No METARs yet. Fill out the form and click "Check" to generate one.</div>
                )}
            </div>

            <div className="button-row">
                <button onClick={handleCopy} className="gray-button">Copy</button>
                <button onClick={handleRemoveLine} className="danger-button">Remove Line</button>
                <button onClick={handleEdit} className="gray-button">Edit Content</button>
                <button onClick={() => setShowModal(true)} className="gray-button">Ingest to CliDE</button>
                <button onClick={() => setArcModal(true)} className="gray-button">Archive</button>
                <button onClick={handleSendMetar} className="send-button" disabled={isSendDisabled}>Send METAR</button>
            </div>
            {copySuccess && (
                <div style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginTop: '8px',
                    fontWeight: 'bold',
                    transition: 'opacity 0.5s ease-in-out'
                    }}>
                    ✅ METAR copied to clipboard!
                </div>
            )}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>⚠️ Demo Version</h3>
                        <p>
                            METAR ingestion to CliDE database or any database is only available in the full version.<br />
                            For more info, please visit{' '}
                            <a href="https://jlh-tonga.com/?page_id=306" target="_blank" rel="noopener noreferrer">JLH Website</a>{' '}
                            or contact us at <a href="mailto:sales@jlh-tonga.com">sales@jlh-tonga.com</a>.
                        </p>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {arcModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>⚠️ Demo Version</h3>
                        <p>
                            Local Auto-archive of weather observations is only available in the full version.<br />
                            For more info, please visit{' '}
                            <a href="https://jlh-tonga.com/?page_id=306" target="_blank" rel="noopener noreferrer">JLH Website</a>{' '}
                            or contact us at <a href="mailto:sales@jlh-tonga.com">sales@jlh-tonga.com</a>.
                        </p>
                        <button onClick={() => setArcModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetarActions;
