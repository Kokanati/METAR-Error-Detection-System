import React, { createContext, useContext, useState } from 'react';

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
};

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [metarList, setMetarList] = useState([]);
    const [validatedHeader, setValidatedHeader] = useState('');
    const [errorFields, setErrorFields] = useState([]);
    const [stationError, setStationError] = useState('');


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
