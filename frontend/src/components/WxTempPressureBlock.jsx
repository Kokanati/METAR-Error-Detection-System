import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import { useFormData } from '../context/FormContext';

const WxTempPressureBlock = () => {
    const { formData, updateField } = useFormData();
    const [errors, setErrors] = useState({
        temperature: '',
        dewPoint: '',
        qnh: ''
    });

    const refTemp = useRef(null);
    const refDew = useRef(null);
    const refQnh = useRef(null);

    const isDisabled = formData.noWxReport;

    // Validate inputs whenever they change
    useEffect(() => {
        const newErrors = {
            temperature: '',
            dewPoint: '',
            qnh: ''
        };

        const temp = formData.temperature;
        const dew = formData.dewPoint;
        const qnh = formData.pressure;

        if (temp && temp !== '//' && (!/^\d+$/.test(temp) || Number(temp) < 0)) {
            newErrors.temperature = 'Temperature must be a non-negative number or "//" for missing.';
        }

        if (dew && dew !== '//' && (!/^\d+$/.test(dew) || Number(dew) < 0)) {
            newErrors.dewPoint = 'Dew Point must be a non-negative number or "//" for missing.';
        }

        if (temp && dew && temp !== '//' && dew !== '//' && Number(dew) > Number(temp)) {
            newErrors.dewPoint = 'Dew Point cannot be higher than Temperature.';
        }

        if (qnh && !/^(\d{4}|\/\/\/\/)$/.test(qnh)) {
            newErrors.qnh = 'QNH must be 4 digits or "////" for missing.';
        } else if (qnh && qnh !== '////' && (Number(qnh) < 900 || Number(qnh) > 1100)) {
            newErrors.qnh = 'QNH must be between 900 and 1100 hPa.';
        }


        setErrors(newErrors);
    }, [formData.temperature, formData.dewPoint, formData.pressure]);

    return (
        <div className="section">
            <div className="field-row">
                <div className="field-subgroup">
                    <label>Temperature (°C)</label>
                    <input
                        ref={refTemp}
                        type="text"
                        value={formData.temperature || ''}
                        onChange={(e) => updateField('temperature', e.target.value)}
                        className={`form-input ${errors.temperature ? 'error' : ''}`}
                        placeholder="°C"
                        maxLength={2}
                        disabled={isDisabled}
                    />
                    {errors.temperature && (
                        <div className="error-message">{errors.temperature}</div>
                    )}
                </div>

                <div className="field-subgroup">
                    <label>Dew Point (°C)</label>
                    <input
                        ref={refDew}
                        type="text"
                        value={formData.dewPoint || ''}
                        onChange={(e) => updateField('dewPoint', e.target.value)}
                        className={`form-input ${errors.dewPoint ? 'error' : ''}`}
                        placeholder="°C"
                        maxLength={2}
                        disabled={isDisabled}
                    />
                    {errors.dewPoint && (
                        <div className="error-message">{errors.dewPoint}</div>
                    )}
                </div>
            </div>

            <div className="field-subgroup">
                <label>QNH (hPa)</label>
                <input
                    ref={refQnh}
                    type="text"
                    value={formData.pressure || ''}
                    onChange={(e) => updateField('pressure', e.target.value)}
                    className={`form-input ${errors.qnh ? 'error' : ''}`}
                    placeholder="QNH"
                    maxLength={4}
                    disabled={isDisabled}
                />
                {errors.qnh && (
                    <div className="error-message">{errors.qnh}</div>
                )}
            </div>
        </div>
    );
};

export default WxTempPressureBlock;
