import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import { useFormData } from '../context/FormContext';

const WxCloudBlock = () => {
    const { formData, updateField } = useFormData();
    const [cloudLayers, setCloudLayers] = useState([{ amount: '', height: '' }]);
    const [errors, setErrors] = useState([]);
    const [hasTouchedClouds, setHasTouchedClouds] = useState(false);

    const refVisibility = useRef(null);

    // Sync cloudLayers with formData and reset from outside
    useEffect(() => {
        setCloudLayers(formData.clouds.length > 0 ? formData.clouds : [{ amount: '', height: '' }]);
    }, [formData.clouds]);

    useEffect(() => {
        if (JSON.stringify(formData.clouds) !== JSON.stringify(cloudLayers)) {
            updateField('clouds', cloudLayers);
        }
    }, [cloudLayers]);

    const handleChange = (index, field, value) => {
        const updated = [...cloudLayers];
        updated[index][field] = value;
        setCloudLayers(updated);
        setHasTouchedClouds(true);
    };

    const handleAddLayer = () => {
        if (cloudLayers.length >= 4) return;
        setCloudLayers([...cloudLayers, { amount: '', height: '' }]);
    };

    const handleRemoveLayer = (index) => {
        const updated = cloudLayers.filter((_, i) => i !== index);
        setCloudLayers(updated);
    };

    // Cloud Layer validation
    useEffect(() => {
        if (!hasTouchedClouds) return;

        const newErrors = [];
        cloudLayers.forEach((layer, idx) => {
            const err = {};
            if (!layer.amount) {
                err.amount = 'Required';
            } else if (layer.amount === 'FEW' && idx > 1) {
                err.amount = '"FEW" only allowed in first 2 layers';
            }

            if (!/^[0-9]{3}$/.test(layer.height)) {
                err.height = 'Height must be 3 digits';
            }

            newErrors.push(err);
        });

        setErrors(newErrors);
    }, [cloudLayers, hasTouchedClouds]);

    const validateVisibility = (val) => /^[0-9]{4}$/.test(val);
    const validatePresentWeather = (val) => /^(-|\+)?[A-Z]{2,6}$/.test(val);
    const validateDirVis = (val, dir) => /^[0-9]{4}$/.test(val) && ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].includes(dir);

    const visError = formData.visibility && !validateVisibility(formData.visibility) ? 'Visibility must be 4 digits (e.g. 9999)' : '';
    const wxError = formData.showPresentWeather && formData.presentWeather && !validatePresentWeather(formData.presentWeather) ? 'Invalid present weather code' : '';
    const dirVisError = formData.showDirVis && (!validateDirVis(formData.dirVisValue, formData.dirVisDir)) ? 'Directional visibility format or direction invalid' : '';

    if (formData.cavok) return null;

    return (
        <div className="section">
            <div className="field-subgroup">
                <label>Visibility</label>
                <input
                    ref={refVisibility}
                    type="text"
                    value={formData.visibility || ''}
                    onChange={(e) => updateField('visibility', e.target.value)}
                    className={`form-input ${visError ? 'error' : ''}`}
                    placeholder="e.g. 9999"
                    maxLength={4}
                />
                {visError && <div className="error-message">{visError}</div>}

                <div className="field-subgroup">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.showDirVis}
                            onChange={() => {
                                const newValue = !formData.showDirVis;
                                updateField('showDirVis', newValue);
                                if (!newValue) {
                                    updateField('dirVisValue', '');
                                    updateField('dirVisDir', '');
                                }
                            }}
                        />
                        Directional Visibility
                    </label>
                </div>

                {formData.showDirVis && (
                    <div className="field-subgroup">
                        <input
                            type="text"
                            value={formData.dirVisValue || ''}
                            onChange={(e) => updateField('dirVisValue', e.target.value)}
                            className={`form-input ${dirVisError ? 'error' : ''}`}
                            placeholder="e.g. 4000"
                            maxLength={4}
                            style={{ width: '70px' }}
                        />
                        <select
                            value={formData.dirVisDir || ''}
                            onChange={(e) => updateField('dirVisDir', e.target.value)}
                            className={`form-input ${dirVisError ? 'error' : ''}`}
                            style={{ width: '70px' }}
                        >
                            <option value="">Dir</option>
                            <option value="N">N</option>
                            <option value="NE">NE</option>
                            <option value="E">E</option>
                            <option value="SE">SE</option>
                            <option value="S">S</option>
                            <option value="SW">SW</option>
                            <option value="W">W</option>
                            <option value="NW">NW</option>
                        </select>
                        {dirVisError && <div className="error-message">{dirVisError}</div>}
                    </div>
                )}
            </div>

            <div className="field-row">
                <div className="field-subgroup">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.showPresentWeather}
                            onChange={() => {
                                const newValue = !formData.showPresentWeather;
                                updateField('showPresentWeather', newValue);
                                if (!newValue) {
                                    updateField('presentWeather', '');
                                }
                            }}
                        />
                        Present Weather
                    </label>
                </div>

                {formData.showPresentWeather && (
                    <div className="field-subgroup">
                        <input
                            type="text"
                            value={formData.presentWeather || ''}
                            onChange={(e) => updateField('presentWeather', e.target.value)}
                            className={`form-input ${wxError ? 'error' : ''}`}
                            placeholder="-SHRA"
                            style={{ width: '70px' }}
                        />
                        {wxError && <div className="error-message">{wxError}</div>}
                    </div>
                )}
            </div>

            {cloudLayers.map((layer, index) => (
                <div key={index} className="field-subgroup" style={{ marginBottom: '0.75rem' }}>
                    <label>Cloud Layer</label>
                    <select
                        value={layer.amount}
                        onChange={(e) => handleChange(index, 'amount', e.target.value)}
                        className={`form-input ${hasTouchedClouds && errors[index]?.amount ? 'error' : ''}`}
                    >
                        <option value="">Amount</option>
                        <option value="FEW">FEW</option>
                        <option value="SCT">SCT</option>
                        <option value="BKN">BKN</option>
                        <option value="OVC">OVC</option>
                    </select>
                    <input
                        type="text"
                        value={layer.height}
                        onChange={(e) => handleChange(index, 'height', e.target.value)}
                        placeholder="Height (e.g. 030)"
                        className={`form-input ${hasTouchedClouds && errors[index]?.height ? 'error' : ''}`}
                        maxLength={3}
                    />
                    {cloudLayers.length > 1 && (
                        <button
                            onClick={() => handleRemoveLayer(index)}
                            className="button-toggle"
                            style={{ marginLeft: '0.5rem' }}
                        >
                            Remove
                        </button>
                    )}
                    {hasTouchedClouds && (
                        <div style={{ color: 'red', fontSize: '12px' }}>
                            {errors[index]?.amount && <div>{errors[index].amount}</div>}
                            {errors[index]?.height && <div>{errors[index].height}</div>}
                        </div>
                    )}
                </div>
            ))}

            {cloudLayers.length < 4 && (
                <button onClick={handleAddLayer} className="button-toggle">+ Add Cloud Layer</button>
            )}
        </div>
    );
};

export default WxCloudBlock;
