import React, { useState, useEffect } from 'react';
import '../App.css';
import { useFormData } from '../context/FormContext';

const WxWindVisibility = () => {
    const { formData, updateField } = useFormData();
    const [showWindVar, setShowWindVar] = useState(false);
    const [errors, setErrors] = useState({});

    // 🔍 Validate windDir, windSpeed, gust, and basic wind variation format
    useEffect(() => {
        const errs = {};
        const { windDir, windSpeed, gust, windV1, windV2 } = formData;

        if (windDir) {
            // Must be exactly 3 digits or 'VRB'
            if (!/^(\d{3}|VRB)$/.test(windDir)) {
                errs.windDir = 'Must be 3 digits or "VRB"';
            } else if (/^\d{3}$/.test(windDir)) {
                const deg = Number(windDir);
                // Must be within range 0–360 AND a multiple of 10
                if (deg < 0 || deg > 360) {
                    errs.windDir = 'Direction must be between 000–360';
                } else if (deg % 10 !== 0) {
                    errs.windDir = 'Direction must be a multiple of 10 (e.g. 010, 120)';
                }
            }
        }

        // Wind speed validation
        if (windSpeed && (!/^\d+$/.test(windSpeed) || Number(windSpeed) < 0)) {
            errs.windSpeed = 'Must be a non-negative number';
        }

        // Gust validation: must be >= wind speed + 10
        if (gust && windSpeed && Number(gust) < Number(windSpeed) + 10) {
            errs.gust = 'Gust must be ≥ Wind Speed + 10';
        }

        // Wind variation format check
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
        showWindVar
    ]);

    const isGustEnabled = Number(formData.windSpeed) >= 15;

    return (
        <div className="section">
            <div className="field-subgroup">
                <label>Wind Direction</label>
                <input
                    type="text"
                    value={formData.windDir}
                    onChange={(e) => updateField('windDir', e.target.value.toUpperCase())}
                    className={`form-input ${errors.windDir ? 'error' : ''}`}
                    placeholder="Direction"
                    maxLength={3}
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
                    />
                    <span>G</span>
                    <input
                        type="number"
                        value={formData.gust}
                        onChange={(e) => updateField('gust', e.target.value)}
                        className={`form-input ${errors.gust ? 'error' : ''}`}
                        placeholder="Gust"
                        disabled={!isGustEnabled}
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
                            checked={showWindVar}
                            onChange={() => {
                                setShowWindVar(!showWindVar);
                                if (showWindVar) {
                                    // Clear V1 and V2 when unchecked
                                    updateField('windV1', '');
                                    updateField('windV2', '');
                                }
                            }}
                        />
                        Wind Variation
                    </label>
                </div>

                {showWindVar && (
                    <div className="field-subgroup">
                        <input
                            type="text"
                            value={formData.windV1 || ''}
                            onChange={(e) => updateField('windV1', e.target.value)}
                            className={`form-input ${errors.windV1 ? 'error' : ''}`}
                            maxLength={3}
                            placeholder="From V1"
                        />
                        {errors.windV1 && <div className="error-message">{errors.windV1}</div>}

                        <input
                            type="text"
                            value={formData.windV2 || ''}
                            onChange={(e) => updateField('windV2', e.target.value)}
                            className={`form-input ${errors.windV2 ? 'error' : ''}`}
                            maxLength={3}
                            placeholder="To V2"
                        />
                        {errors.windV2 && <div className="error-message">{errors.windV2}</div>}
                    </div>
                )}
                <label>
                    <input
                        type="checkbox"
                        checked={formData.cavok || false}
                        onChange={() => updateField('cavok', !formData.cavok)}
                    />
                    CAVOK
                </label>
            </div>
        </div>
    );
};

export default WxWindVisibility;
