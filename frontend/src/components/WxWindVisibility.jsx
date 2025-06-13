import React, { useEffect, useState } from 'react';
import '../App.css';
import { useFormData } from '../context/FormContext';

const WxWindVisibility = () => {
    const {
        formData,
        updateField,
        appendMetar,
        setErrorFields,
        resetMetarBody
    } = useFormData();

    const [errors, setErrors] = useState({});

    const isDisabled = formData.noWxReport;

    // Handle NO WX toggle
    const handleNoWxChange = () => {
        const newValue = !formData.noWxReport;
        updateField('noWxReport', newValue);

        if (newValue) {
            const { obsType, station, utcTime } = formData;

            if (!station || !utcTime || !obsType) {
                alert("Please fill in Station, UTC Time, and Obs Type before setting NO WX Report.");
                updateField('noWxReport', false);
                return;
            }

            const nilString = `${obsType} ${station} ${utcTime}Z NIL=`;

            const confirm = window.confirm(`${station} has NIL observation. Proceed?`);

            if (confirm) {
                // Reset all EXCEPT: country, obsType, utcTime, cccc, ttaaii, metarList
                updateField('station', '');
                updateField('windDir', '');
                updateField('windSpeed', '');
                updateField('gust', '');
                updateField('cavok', false);
                updateField('visibility', '');
                updateField('windV1', '');
                updateField('windV2', '');
                updateField('clouds', []);
                updateField('temperature', '');
                updateField('dewPoint', '');
                updateField('pressure', '');
                updateField('remarks', '');
                updateField('recentWeather', '');
                updateField('showWindVar', false);
                updateField('showDirVis', false);
                updateField('dirVisValue', '');
                updateField('dirVisDir', '');
                updateField('showPresentWeather', false);
                updateField('presentWeather', '');
                updateField('showRecentWeather', false);
                updateField('showRemarks', false);
                setErrorFields([]);
                appendMetar(nilString);
                updateField('noWxReport', false); // Untick the checkbox
            } else {
                updateField('noWxReport', false);
            }
        }
    };

    // 🔍 Validate windDir, windSpeed, gust, and wind variation format
    useEffect(() => {
        const errs = {};
        const { windDir, windSpeed, gust, windV1, windV2, showWindVar } = formData;

        if (windDir && windDir !== '///') {
            if (!/^(\d{3}|VRB)$/.test(windDir)) {
                errs.windDir = 'Must be 3 digits or "VRB"';
            } else if (/^\d{3}$/.test(windDir)) {
                const deg = Number(windDir);
                if (deg < 0 || deg > 360) {
                    errs.windDir = 'Direction must be between 000–360';
                } else if (deg % 10 !== 0) {
                    errs.windDir = 'Direction must be a multiple of 10 (e.g. 010, 120)';
                }
            }
        }

        if (windSpeed && windSpeed !== '//') {
            if (!/^\d+$/.test(windSpeed) || Number(windSpeed) < 0) {
                errs.windSpeed = 'Must be a non-negative number or "//" for missing.';
            }
        }

        if (gust && windSpeed && Number(gust) < Number(windSpeed) + 10) {
            errs.gust = 'Gust must be ≥ Wind Speed + 10';
        }

        if (showWindVar) {
            if (windV1 && !/^\d{3}$/.test(windV1)) {
                errs.windV1 = 'V1 must be 3 digits';
            }
            if (windV2 && !/^\d{3}$/.test(windV2)) {
                errs.windV2 = 'V2 must be 3 digits';
            }
        }

        setErrors(errs);
    }, [
        formData.windDir,
        formData.windSpeed,
        formData.gust,
        formData.windV1,
        formData.windV2,
        formData.showWindVar
    ]);

    const isGustEnabled = Number(formData.windSpeed) >= 15;

    return (
        <div className="section">
            <div className="field-subgroup">
                <label title="This is a NIL observation.">
                    <input
                        type="checkbox"
                        checked={formData.noWxReport}
                        onChange={handleNoWxChange}
                    />
                    {' '}NO WX Report |
                </label>

                <label>Wind Direction</label>
                <input
                    type="text"
                    value={formData.windDir}
                    onChange={(e) => updateField('windDir', e.target.value.toUpperCase())}
                    className={`form-input ${errors.windDir ? 'error' : ''}`}
                    placeholder="Direction"
                    maxLength={3}
                    disabled={isDisabled}
                />
                {errors.windDir && <div className="error-message">{errors.windDir}</div>}
            </div>

            <div className="field-subgroup">
                <label>Wind Speed</label>
                <div className="field-subgroup">
                    <input
                        type="number"
                        value={formData.windSpeed}
                        onChange={(e) => updateField('windSpeed', e.target.value)}
                        className={`form-input ${errors.windSpeed ? 'error' : ''}`}
                        placeholder="Speed"
                        maxLength={3}
                        disabled={isDisabled}
                    />
                    <span>G</span>
                    <input
                        type="number"
                        value={formData.gust}
                        onChange={(e) => updateField('gust', e.target.value)}
                        className={`form-input ${errors.gust ? 'error' : ''}`}
                        placeholder="Gust"
                        disabled={!isGustEnabled || isDisabled}
                    />
                </div>
                {errors.windSpeed && <div className="error-message">{errors.windSpeed}</div>}
                {errors.gust && <div className="error-message">{errors.gust}</div>}
            </div>

            <div className="field-row">
                <div className="field-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.showWindVar}
                            onChange={() => {
                                const newValue = !formData.showWindVar;
                                updateField('showWindVar', newValue);
                                if (!newValue) {
                                    updateField('windV1', '');
                                    updateField('windV2', '');
                                }
                            }}
                            disabled={isDisabled}
                        />
                        Wind Variation
                    </label>
                </div>

                {formData.showWindVar && (
                    <div className="field-subgroup">
                        <input
                            type="text"
                            value={formData.windV1 || ''}
                            onChange={(e) => updateField('windV1', e.target.value)}
                            className={`form-input ${errors.windV1 ? 'error' : ''}`}
                            maxLength={3}
                            placeholder="From V1"
                            disabled={isDisabled}
                        />
                        {errors.windV1 && <div className="error-message">{errors.windV1}</div>}

                        <input
                            type="text"
                            value={formData.windV2 || ''}
                            onChange={(e) => updateField('windV2', e.target.value)}
                            className={`form-input ${errors.windV2 ? 'error' : ''}`}
                            maxLength={3}
                            placeholder="To V2"
                            disabled={isDisabled}
                        />
                        {errors.windV2 && <div className="error-message">{errors.windV2}</div>}
                    </div>
                )}
                <label>
                    <input
                        type="checkbox"
                        checked={formData.cavok || false}
                        onChange={() => updateField('cavok', !formData.cavok)}
                        disabled={isDisabled}
                    />
                    CAVOK
                </label>
            </div>
        </div>
    );
};

export default WxWindVisibility;
