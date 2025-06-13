import React, { useEffect, useRef } from 'react';
import '../App.css';
import { useFormData } from '../context/FormContext';

const WxRemarksBlock = () => {
    const { formData, updateField } = useFormData();
    const refRemarks = useRef(null);
    const refRecent = useRef(null);

    const isDisabled = formData.noWxReport;

    useEffect(() => {
        if (formData.showRemarks) refRemarks.current?.focus();
    }, [formData.showRemarks]);

    useEffect(() => {
        if (formData.showRecentWeather) refRecent.current?.focus();
    }, [formData.showRecentWeather]);

    const toggleRecent = () => {
        const newValue = !formData.showRecentWeather;
        updateField('showRecentWeather', newValue);
        if (!newValue) {
            updateField('recentWeather', '');
        }
    };

    const toggleRemarks = () => {
        const newValue = !formData.showRemarks;
        updateField('showRemarks', newValue);
        if (!newValue) {
            updateField('remarks', '');
        }
    };

    return (
        <div className="section">
            <div className="field-group">
                <label>
                    <input
                        type="checkbox"
                        checked={formData.showRecentWeather}
                        onChange={toggleRecent}
                        disabled={isDisabled}
                    />
                    Recent Weather
                </label>
                {formData.showRecentWeather && (
                    <input
                        ref={refRecent}
                        type="text"
                        value={formData.recentWeather}
                        onChange={(e) => updateField('recentWeather', e.target.value.toUpperCase())}
                        className="form-smallinput"
                        placeholder="e.g. RERA"
                        disabled={isDisabled}
                    />
                )}
            </div>

            <div className="field-group">
                <label>
                    <input
                        type="checkbox"
                        checked={formData.showRemarks}
                        onChange={toggleRemarks}
                        disabled={isDisabled}
                    />
                    Remarks
                </label>
                {formData.showRemarks && (
                    <input
                        ref={refRemarks}
                        type="text"
                        value={formData.remarks}
                        onChange={(e) => updateField('remarks', e.target.value)}
                        className="form-smallinput"
                        placeholder="e.g. RMK DRY AIR 48%"
                        disabled={isDisabled}
                    />
                )}
            </div>
        </div>
    );
};

export default WxRemarksBlock;
