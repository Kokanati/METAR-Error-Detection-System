import React, { useEffect, useRef, useState } from 'react';

import '../App.css';
import { useFormData } from '../context/FormContext';
import { validateUtcTime } from '../utils/validateMetar';
import UtcClock from './UtcClock';

const stationsByCountry = {
    "Tonga": ["NFTF", "NFTV", "NFTL", "NFTP", "NFTO", "NFTN"],
    "Fiji": ["NFFN", "NFNA", "NFNL", "NFNS", "NFNK"],
    "Samoa": ["NSFA", "NSMA"],
    "Cook Islands": ["NCRG"],
    "Niue": ["NIUE"],
    "Tuvalu": ["NGFU"],
    "Vanuatu": ["NVVV", "NVSS"],
    "Solomon Islands": ["AGGH"],
    "Papua New Guinea": ["AYPY", "AYMD", "AYMO"],
    "Kiribati": ["NGTA", "NGTZ"],
    "Nauru": ["ANAU"],
    "Palau": ["PTRO"]
};

const ccccByCountry = {
    "Tonga": "NFTF",
    "Fiji": "NFFN",
    "Samoa": "NSFA",
    "Cook Islands": "NCRG",
    "Niue": "NIUE",
    "Tuvalu": "NGFU",
    "Vanuatu": "NVVV",
    "Solomon Islands": "AGGH",
    "Papua New Guinea": "AYPY",
    "Kiribati": "NGTA",
    "Nauru": "ANAU",
    "Palau": "PTRO"
};

const ttaaiiByCountry = {
    "Tonga": { METAR: "SATO31", SPECI: "SPTO31" },
    "Fiji": { METAR: "SAFJ31", SPECI: "SPFJ31" },
    "Samoa": { METAR: "SASA31", SPECI: "SPSA31" },
    "Cook Islands": { METAR: "SACI31", SPECI: "SPCI31" },
    "Niue": { METAR: "SANI31", SPECI: "SPNI31" },
    "Tuvalu": { METAR: "SATV31", SPECI: "SPTV31" },
    "Vanuatu": { METAR: "SAVU31", SPECI: "SPVU31" },
    "Solomon Islands": { METAR: "SASB31", SPECI: "SPSB31" },
    "Papua New Guinea": { METAR: "SAPG31", SPECI: "SPPG31" },
    "Kiribati": { METAR: "SAKI31", SPECI: "SPKI31" },
    "Nauru": { METAR: "SANA31", SPECI: "SPNA31" },
    "Palau": { METAR: "SAPW31", SPECI: "SPPW31" }
};

const WxHeaderForm = () => {
    const {
        formData,
        updateField,
        setValidatedHeader,
        metarList,
        stationError,
        setStationError
    } = useFormData();

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [recipientEmailInput, setRecipientEmailInput] = useState(formData.recipientEmail || '');

    const refUTC = useRef(null);

    const updateHeaderInfo = (country, obsType, utcTime) => {
        const ttaaii = ttaaiiByCountry[country]?.[obsType] || '';
        const cccc = ccccByCountry[country] || '';
        const headerLine = `${ttaaii} ${formData.station || ''} ${utcTime || ''}`.trim();
        updateField('ttaaii', ttaaii);
        updateField('cccc', cccc);
        setValidatedHeader(headerLine);
    };

    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        updateField('country', selectedCountry);
        updateField('station', '');
        const obsType = formData.obsType || 'METAR';
        updateHeaderInfo(selectedCountry, obsType, formData.utcTime);
    };

    const handleObsTypeChange = (e) => {
        const selectedObsType = e.target.value;
        updateField('obsType', selectedObsType);
        updateHeaderInfo(formData.country, selectedObsType, formData.utcTime);
    };

    useEffect(() => {
        if (formData.station) refUTC.current?.focus();
    }, [formData.station]);

    useEffect(() => {
        const selectedStation = formData.station?.trim();
        if (!selectedStation) {
            setStationError('');
            return;
        }

        const exists = metarList.some(line => line.includes(` ${selectedStation} `));
        setStationError(exists ? `Station ${selectedStation} already exists in METAR list.` : '');
    }, [formData.station, metarList]);

    const handleUtcBlur = () => {
        const result = validateUtcTime(formData.utcTime);
        if (!result.valid) {
            if (result.reason === 'Past time') {
                const confirmPast = window.confirm(result.prompt);
                if (!confirmPast) updateField('utcTime', '');
            } else {
                alert(result.reason);
                updateField('utcTime', '');
            }
        } else {
            updateHeaderInfo(formData.country, formData.obsType, formData.utcTime);
        }
    };

    return (
        <div className="section">
            <div className="field-row">
                <div className="field-group">
                    <label>Country</label>
                    <select
                        value={formData.country || ''}
                        onChange={handleCountryChange}
                        className="form-input wide"
                    >
                        <option value="">Select</option>
                        {Object.keys(stationsByCountry).map((country) => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>

                <div className="field-group">
                    <label>Obs Type</label>
                    <select
                        value={formData.obsType || ''}
                        onChange={handleObsTypeChange}
                        className="form-input"
                    >
                        <option value="">Select</option>
                        <option value="METAR">METAR</option>
                        <option value="SPECI">SPECI</option>
                    </select>
                </div>

                <div className="field-group">
                    <label>Station</label>
                    <select
                        value={formData.station || ''}
                        onChange={(e) => {
                            updateField('station', e.target.value);
                            updateHeaderInfo(formData.country, formData.obsType, formData.utcTime);
                        }}
                        className={`form-input ${stationError ? 'error' : ''}`}
                        disabled={!formData.country}
                    >
                        <option value="">Select</option>
                        {(stationsByCountry[formData.country] || []).map((station) => (
                            <option key={station} value={station}>{station}</option>
                        ))}
                    </select>
                    {stationError && <div className="error-message">{stationError}</div>}
                </div>

                <div className="field-group">
                    <label>UTC Time</label>
                    <input
                        ref={refUTC}
                        type="text"
                        value={formData.utcTime || ''}
                        onChange={(e) => updateField('utcTime', e.target.value)}
                        onBlur={handleUtcBlur}
                        className="form-input"
                        placeholder="DDHHMM"
                        maxLength={6}
                    />
                </div>

                <div className="field-group">
                    <label>CCCC</label>
                    <input
                        type="text"
                        value={formData.cccc || ''}
                        readOnly
                        className="form-input"
                    />
                </div>

                <div className="field-group">
                    <label>TTAAii</label>
                    <input
                        type="text"
                        value={formData.ttaaii || ''}
                        readOnly
                        className="form-input"
                    />
                </div>

                <div className='field-group'>
                    <UtcClock />
                </div>
                <div className='field-group'>
                    <button
                        className="icon-button"
                        onClick={() => setShowEmailModal(true)}
                        title="Set Recipient Email"
                        style={{ marginLeft: '0.5rem' }}
                    >
                        ⚙️
                    </button>
                </div>
                {showEmailModal && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h3>Email Configuration</h3>
                            SMTP Server: mail.jlh-tonga.com<br />
                            SMTP Port: 465<br />
                            SMTP User: system@jlh-tonga.com<br />
                            <small style={{ color: '#888' }}>*Note: The modification of the SMTP server, port, and user is not available in the demo version.</small><br />
                            <br />
                            <label htmlFor="recipientEmail">Recipient Email: </label><br />
                            <input
                                type="email"
                                value={recipientEmailInput}
                                onChange={(e) => setRecipientEmailInput(e.target.value)}
                                placeholder="example@jlh-tonga.com"
                                className="email-input"
                            />
                            <small style={{ color: '#888' }}>This email will receive the METARs generated by this form.</small><br />
                            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                <button
                                    onClick={() => setShowEmailModal(false)}
                                    className="gray-button"
                                    style={{ marginRight: '0.5rem' }}
                                >Cancel</button>
                                <button
                                    className="gray-button"
                                    onClick={() => {
                                        updateField('recipientEmail', recipientEmailInput);
                                        setShowEmailModal(false);
                                    }}
                                >Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default WxHeaderForm;
