import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const useFormData = () => useContext(FormContext);

// Full default state
const initialFormData = {
    country: '',
    station: '',
    obsType: '',
    ttaaii: '',
    cccc: '',
    utcTime: '',
    windDir: '',
    windSpeed: '',
    gust: '',
    cavok: false,
    visibility: '',
    windV1: '',
    windV2: '',
    clouds: [],
    temperature: '',
    dewPoint: '',
    pressure: '',
    remarks: '',
    recentWeather: '',
    showWindVar: false,
    showDirVis: false,
    dirVisValue: '',
    dirVisDir: '',
    showPresentWeather: false,
    presentWeather: '',
    showRecentWeather: false,
    showRemarks: false,
    NoWxReport: false,
    username: '',
};

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [metarList, setMetarList] = useState([]);
    const [validatedHeader, setValidatedHeader] = useState('');
    const [errorFields, setErrorFields] = useState([]);
    const [stationError, setStationError] = useState('');

    useEffect(() => {
        fetch('/api/method/frappe.auth.get_logged_user')
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    updateField('username', data.message);
                }
            })
            .catch(err => console.error("Failed to get user", err));
    }, []);


    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const appendMetar = (metarString) => {
        setMetarList(prev => [...prev, metarString]);
    };

    // ❗ Reset only METAR body (preserving country, obsType, utcTime, station, cccc, ttaaii)
    const resetMetarBody = () => {
        setFormData(prev => ({
            ...prev,
            station: '',
            windDir: '',
            windSpeed: '',
            gust: '',
            cavok: false,
            visibility: '',
            windV1: '',
            windV2: '',
            clouds: [],
            temperature: '',
            dewPoint: '',
            pressure: '',
            remarks: '',
            recentWeather: '',
            showWindVar: false,
            showDirVis: false,
            dirVisValue: '',
            dirVisDir: '',
            showPresentWeather: false,
            presentWeather: '',
            showRecentWeather: false,
            showRemarks: false
        }));
        setErrorFields([]);
    };

    return (
        <FormContext.Provider value={{
            formData,
            updateField,
            metarList,
            appendMetar,
            setFormData,
            setMetarList,
            validatedHeader,
            setValidatedHeader,
            errorFields,
            setErrorFields,
            resetMetarBody,
            stationError,
            setStationError
        }}>
            {children}
        </FormContext.Provider>
    );
};
