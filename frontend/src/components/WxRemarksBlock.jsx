import React, { useEffect, useRef } from 'react';
import '../App.css';
import { useFormData } from '../context/FormContext';

const WxRemarksBlock = () => {
    const { formData, updateField } = useFormData();
    const refRemarks = useRef(null);
    const refRecent = useRef(null);

    {/*const toggleRecent = () => updateField('showRecentWeather', !formData.showRecentWeather);*/ }
    {/*const toggleRemarks = () => updateField('showRemarks', !formData.showRemarks);*/ }

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
                    />
                )}
            </div>

            <div className="field-group">
                <label>
                    <input
                        type="checkbox"
                        checked={formData.showRemarks}
                        onChange={toggleRemarks}
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
                    />
                )}
            </div>
        </div>
    );
};

export default WxRemarksBlock;
