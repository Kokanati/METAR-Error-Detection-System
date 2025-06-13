import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import { useFormData } from '../context/FormContext';

const WxCloudBlock = () => {
    const { formData, updateField } = useFormData();
    const [cloudLayers, setCloudLayers] = useState([{ amount: '', height: '', type: '', showCb: false }]);
    const [errors, setErrors] = useState([]);
    const [hasTouchedClouds, setHasTouchedClouds] = useState(false);

    const refVisibility = useRef(null);
    const isDisabled = formData.noWxReport;

    const validateVisibility = (val) => /^[0-9]{4}$/.test(val);
    const validatePresentWeather = (val) => /^(-|\+)?[A-Z]{2,6}$/.test(val);

    const visError = formData.visibility && !validateVisibility(formData.visibility) ? 'Visibility must be 4 digits (e.g. 9999)' : '';
    const wxError = formData.showPresentWeather && formData.presentWeather && !validatePresentWeather(formData.presentWeather) ? 'Invalid present weather code' : '';

    useEffect(() => {
        const isCleared =
            formData.clouds.length === 0 ||
            (formData.clouds.length === 1 &&
                !formData.clouds[0].amount &&
                !formData.clouds[0].height &&
                !formData.clouds[0].type);

        if (isCleared) {
            setCloudLayers([{ amount: '', height: '', type: '', showCb: false }]);
            setHasTouchedClouds(false);
        } else {
            setCloudLayers(formData.clouds);
        }
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
        if (cloudLayers.length >= 4 || isDisabled) return;
        setCloudLayers([...cloudLayers, { amount: '', height: '', type: '', showCb: false }]);
    };

    const handleRemoveLayer = (index) => {
        const updated = cloudLayers.filter((_, i) => i !== index);
        setCloudLayers(updated);
    };

    const toggleCbSection = (index) => {
        const updated = [...cloudLayers];
        updated[index].showCb = !updated[index].showCb;
        if (!updated[index].showCb) updated[index].type = '';
        setCloudLayers(updated);
    };

    useEffect(() => {
        if (!hasTouchedClouds) return;
        const newErrors = [];
        cloudLayers.forEach((layer, idx) => {
            const err = {};
            if (!layer.amount) err.amount = 'Required';
            else if (layer.amount === 'FEW' && idx > 1) err.amount = '"FEW" only allowed in first 2 layers';
            if (!/^[0-9]{3}$/.test(layer.height)) err.height = 'Height must be 3 digits';
            newErrors.push(err);
        });
        setErrors(newErrors);
    }, [cloudLayers, hasTouchedClouds]);

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
                    disabled={isDisabled}
                />
                {visError && <div className="error-message">{visError}</div>}
            </div>

            {/* Restored Present Weather field */}
            <div className="field-row">
                <div className="field-subgroup">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.showPresentWeather}
                            onChange={() => {
                                const newValue = !formData.showPresentWeather;
                                updateField('showPresentWeather', newValue);
                                if (!newValue) updateField('presentWeather', '');
                            }}
                            disabled={isDisabled}
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
                            disabled={isDisabled}
                        />
                        {wxError && <div className="error-message">{wxError}</div>}
                    </div>
                )}
            </div>

            {cloudLayers.map((layer, index) => (
                <div key={index} className="field-subgroup" style={{ marginBottom: '0.75rem', position: 'relative' }}>
                    <label>Cloud Layer</label>
                    <select
                        value={layer.amount}
                        onChange={(e) => handleChange(index, 'amount', e.target.value)}
                        className={`form-input ${hasTouchedClouds && errors[index]?.amount ? 'error' : ''}`}
                        disabled={isDisabled}
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
                        disabled={isDisabled}
                    />
                    {!layer.showCb && (
                        <>
                            {index < 2 && (
                                <button
                                    onClick={() => toggleCbSection(index)}
                                    className="button-toggle"
                                    style={{ marginLeft: '0.5rem' }}
                                    disabled={isDisabled}
                                >+ CB?</button>
                            )}
                            {cloudLayers.length > 1 && (
                                <button
                                    onClick={() => handleRemoveLayer(index)}
                                    className="button-toggle"
                                    style={{ marginLeft: '0.5rem' }}
                                    disabled={isDisabled}
                                >Remove</button>
                            )}
                        </>
                    )}

                    {layer.showCb && (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                                <label>
                                    <input
                                        type="radio"
                                        value="TCU"
                                        checked={layer.type === 'TCU'}
                                        onChange={(e) => handleChange(index, 'type', e.target.value)}
                                        disabled={isDisabled}
                                    /> TCU
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="CB"
                                        checked={layer.type === 'CB'}
                                        onChange={(e) => handleChange(index, 'type', e.target.value)}
                                        disabled={isDisabled}
                                    /> CB
                                </label>
                            </div>
                            <span
                                style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer', position: 'absolute', top: '0', right: '0.1rem' }}
                                onClick={() => toggleCbSection(index)}
                            >–</span>
                        </>
                    )}
                </div>
            ))}
            {cloudLayers.length < 4 && (
                <button onClick={handleAddLayer} className="button-toggle" disabled={isDisabled}>+ Add Cloud Layer</button>
            )}
        </div>
    );
};

export default WxCloudBlock;
