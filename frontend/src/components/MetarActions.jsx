
import React, { useEffect } from 'react';

import '../App.css';
import { useFormData } from '../context/FormContext';

const MetarActions = () => {
    const { formData, metarList, setMetarList, setValidatedHeader, updateField } = useFormData();

    const [showModal, setShowModal] = React.useState(false);
    const [arcModal, setarcModal] = React.useState(false);


    // Header string: TTAAii CCCC UTCtime
    const buildHeaderString = () => {
        const { ttaaii, cccc, utcTime } = formData;
        return [ttaaii, cccc, utcTime].filter(Boolean).join(' ');
    };
    //const { metarList, setMetarList, setValidatedHeader, updateField } = useFormData();

    const [isSendDisabled, setIsSendDisabled] = React.useState(true);

    useEffect(() => {
        setIsSendDisabled(metarList.length === 0);
    }, [metarList]);

    const handleCopy = () => {
        if (metarList.length === 0) return;

        const allMetars = metarList.join('\n');
        navigator.clipboard.writeText(allMetars)
            .then(() => {
                alert('All METAR lines copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy METARs:', err);
                alert('Failed to copy METARs to clipboard');
            });
    };


    const handleIngest = () => {
        {/*alert('This is a demo version. METAR ingestion functionality is available in the full version only.\n\nFor more information, visit https://jlh-tonga.com or contact us at sales@jlh-tonga.com');*/ }
        setShowModal(true);
    };


    const handleArchive = () => {
        {/*alert('This is a Demo version. Archiving functionality is for Full-version Only.');*/ }
        setarcModal(true);
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

        // Ask user which line to edit
        const indexInput = prompt(`Enter the METAR line number to edit (1 to ${metarList.length}):`);
        const index = parseInt(indexInput, 10) - 1;

        if (isNaN(index) || index < 0 || index >= metarList.length) {
            alert('Invalid line number.');
            return;
        }

        // Prompt to edit the selected METAR line
        const currentValue = metarList[index];
        const editable = prompt('Edit the METAR string below:', currentValue);

        if (editable !== null && editable.trim() !== '') {
            const updatedList = [...metarList];
            updatedList[index] = editable.trim();
            setMetarList(updatedList);
        }
    };



    const handleSendMetar = async () => {
        const header = buildHeaderString();
        const metarBody = metarList.join('\n');

        const fullMessage = `You are about to send:\n\n${header}\n\n${metarBody}\n\nContinue?`;
        const confirmSend = window.confirm(fullMessage);

        if (!confirmSend) return;

        try {
            const response = await fetch('/api/method/meds.api.send_metar_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Frappe-CSRF-Token': window.csrf_token || '' // fallback if token is exposed globally
                },
                body: JSON.stringify({
                    header,
                    metar_list: metarBody,
                    recipient_email: formData.recipientEmail
                })
            });

            const result = await response.json();

            if (response.ok && result.message && result.message.success) {
                alert(`✅ ${result.message.message}`);
            } else {
                alert(`❌ Failed to send: ${result.message?.message || 'Unknown error'}`);
        }

        } catch (error) {
            console.error('Send METAR failed:', error);
            alert('Could not send METAR. Check server logs.', error);
        }
    };




    return (
        <div className="section">
            {/*<h2 className="section-title">METAR Header</h2>*/}
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
                <button onClick={handleIngest} className="gray-button">Ingest to CliDE</button>
                <button onClick={handleArchive} className="gray-button">Archive</button>
                <button onClick={handleSendMetar} className="send-button" disabled={isSendDisabled}>Send METAR</button>

            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>⚠️ Demo Version</h3>
                        <p>
                            METAR ingestion to CliDE database or any database is only available in the full version.
                            <br />
                            For more info, please visit{' '}
                            <a href="https://jlh-tonga.com/?page_id=306" target="_blank" rel="noopener noreferrer">
                                JLH Website
                            </a>{' '}
                            or contact us at{' '}
                            <a href="mailto:sales@jlh-tonga.com">sales@jlh-tonga.com</a>.
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
                            Local Auto-archive of weather observations is only available in the full version.
                            <br />
                            For more info, please visit{' '}
                            <a href="https://jlh-tonga.com/?page_id=306" target="_blank" rel="noopener noreferrer">
                                JLH Website
                            </a>{' '}
                            or contact us at{' '}
                            <a href="mailto:sales@jlh-tonga.com">sales@jlh-tonga.com</a>.
                        </p>
                        <button onClick={() => setarcModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetarActions;
