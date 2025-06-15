
// src/utils/validateMetar.js

// ========== UTC TIME VALIDATION ==========
export function validateUtcTime(utcTime) {
    if (!/^\d{6}$/.test(utcTime)) {
        return { valid: false, reason: 'Invalid format (use DDHHMM)' };
    }

    const now = new Date();
    const dd = parseInt(utcTime.slice(0, 2), 10);
    const hh = parseInt(utcTime.slice(2, 4), 10);
    const mm = parseInt(utcTime.slice(4, 6), 10);

    if (mm % 5 !== 0) {
        return { valid: false, reason: 'METAR time must be to the nearest 5 minutes' };
    }

    const candidateTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), dd, hh, mm));
    const diffMinutes = Math.round((candidateTime - now) / 60000);

    if (diffMinutes > 15) {
        return { valid: false, reason: 'Time is too far in the future (max 15 min ahead)' };
    }

    if (diffMinutes < 0) {
        return {
            valid: false,
            reason: 'Past time',
            prompt: 'The time entered is in the past. Are you doing a correction to a previous METAR?'
        };
    }

    return { valid: true };
}

// ========== WIND VALIDATION ==========
export function validateWindFields(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];

    const { windDir, windSpeed, gust, windV1, windV2 } = formData;

    const windSpeedNum = Number(windSpeed);
    const gustNum = Number(gust);

    const isDirMissing = windDir === '///';
    const isSpeedMissing = windSpeed === '//';

    if (!windDir) {
        errors.push('Wind direction is required.');
        errorFields.push('wind');
    }
    if (windSpeed === undefined || windSpeed === null || windSpeed.trim() === '') {
        errors.push('Wind speed is required.');
        errorFields.push('wind');
    }
    if (windDir === '000' && windSpeedNum !== 0 && !isSpeedMissing) {
        errors.push('Wind speed must be 0 when direction is 000.');
        errorFields.push('wind');
    }
    if (windSpeedNum === 0 && windDir !== '000') {
        errors.push('Wind direction must be 000 when speed is 0.');
        errorFields.push('wind');
    }
    if (gust && (!/^\d+$/.test(gust) || gustNum < 0 || gustNum > 99)) {
        errors.push('Gust must be a number between 0 and 99.');
        errorFields.push('wind');
    }
    if (gust && windSpeed && gustNum <= windSpeedNum) {
        errors.push('Gust must be greater than wind speed.');
        errorFields.push('wind');
    }
    if (windV1 && windV2) {
        const v1 = Number(windV1);
        const v2 = Number(windV2);
        if (isNaN(v1) || isNaN(v2) || v1 >= v2) {
            errors.push('Wind variable range is invalid (start should be less than end).');
            errorFields.push('wind');
        }
    }

    if (setErrorFields) setErrorFields(errorFields);
    return errors;
}

// ========== VISIBILITY VALIDATION ==========
export function validateVisibilityFields(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];
    const { visibility, dirVisDir, dirVisValue, cavok } = formData;

    if (cavok) {
        if (setErrorFields) setErrorFields([]);
        return [];
    }

    if (!visibility || visibility.trim() === '') {
        errors.push('Visibility is required.');
        errorFields.push('visibility');
    } else if (!/^\d+$/.test(visibility) || Number(visibility) < 0 || Number(visibility) > 9999) {
        errors.push('Visibility must be between 0000 and 9999 meters.');
        errorFields.push('visibility');
    }

    if ((dirVisDir && !dirVisValue) || (!dirVisDir && dirVisValue)) {
        errors.push('Both directional visibility and its value must be filled.');
        errorFields.push('visibility');
    } else if (
        dirVisDir && dirVisValue &&
        (!/^\d{4}$/.test(dirVisValue) || Number(dirVisValue) < 0 || Number(dirVisValue) > 9999 ||
            !['N','NE','E','SE','S','SW','W','NW'].includes(dirVisDir))
    ) {
        errors.push('Directional visibility must be 4 digits (0000–9999) and direction must be valid (e.g., NE, SW).');
        errorFields.push('visibility');
    }

    if (setErrorFields) setErrorFields(errorFields);
    return errors;
}

// ========== CLOUDS VALIDATION ==========
export function validateCloudFields(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];
    const { clouds, cavok } = formData;

    if (cavok) {
        if (setErrorFields) setErrorFields([]);
        return [];
    }

    const isValidClouds = Array.isArray(clouds) && clouds.length > 0 &&
        clouds.some(cloud => cloud && cloud.amount && cloud.height);

    if (!isValidClouds) {
        errors.push('At least one cloud layer must be specified.');
        errorFields.push('cloud');
    } else {
        for (const cloud of clouds) {
            if ((cloud.amount === 'CB' || cloud.amount === 'TCU') && (!cloud.height || cloud.height.trim() === '')) {
                errors.push('CB/TCU clouds must have a height.');
                errorFields.push('cloud');
            }
        }
    }

    if (setErrorFields) setErrorFields(errorFields);
    return errors;
}

// ========== PRESENT WEATHER VALIDATION ==========
export function validateWeatherFields(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];
    const { presentWeather, visibility, cavok } = formData;

    if (cavok) {
        if (setErrorFields) setErrorFields([]);
        return [];
    }

    if (visibility && !isNaN(Number(visibility)) && Number(visibility) < 1000) {
        if (!presentWeather || presentWeather.trim() === '') {
            errors.push('Present weather must be reported when visibility is less than 1000 meters.');
            errorFields.push('weather');
        }
    }

    if (setErrorFields) setErrorFields(errorFields);
    return errors;
}

// ========== TEMP/DEW POINT VALIDATION ==========
export function validateTempDewPoint(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];
    const { temperature, dewPoint } = formData;

    if (!temperature || temperature.trim() === '') {
        errors.push('Temperature is required.');
        errorFields.push('tempdew');
    }
    if (!dewPoint || dewPoint.trim() === '') {
        errors.push('Dew point is required.');
        errorFields.push('tempdew');
    } else if (
        temperature && dewPoint &&
        !isNaN(Number(temperature)) && !isNaN(Number(dewPoint)) &&
        Number(temperature) < Number(dewPoint)
    ) {
        errors.push('Temperature must not be less than dew point.');
        errorFields.push('tempdew');
    }

    if (setErrorFields) setErrorFields(errorFields);
    return errors;
}

// ========== QNH (PRESSURE) VALIDATION ==========
export function validateQNH(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];
    const { pressure } = formData;

    if (!pressure || pressure.trim() === '') {
        errors.push('QNH is required.');
        errorFields.push('qnh');
    } else if (
        !isNaN(Number(pressure)) &&
        (Number(pressure) < 900 || Number(pressure) > 1100)
    ) {
        errors.push('QNH value must be between 900 and 1100 hPa.');
        errorFields.push('qnh');
    }

    if (setErrorFields) setErrorFields(errorFields);
    return errors;
}

// ========== DIRECTIONAL VISIBILITY VALIDATION ==========
export function validateDirectionalVisibilityFields(formData, setErrorFields) {
    return validateVisibilityFields(formData, setErrorFields);
}

// ========== COMBINED GROUP VALIDATORS ==========
export function validateCloudVisibilityWeather(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];

    const cloudErrors = validateCloudFields(formData, ef => { if (Array.isArray(ef)) errorFields.push(...ef); });
    if (Array.isArray(cloudErrors)) errors.push(...cloudErrors);

    const visErrors = validateVisibilityFields(formData, ef => { if (Array.isArray(ef)) errorFields.push(...ef); });
    if (Array.isArray(visErrors)) errors.push(...visErrors);

    const weatherErrors = validateWeatherFields(formData, ef => { if (Array.isArray(ef)) errorFields.push(...ef); });
    if (Array.isArray(weatherErrors)) errors.push(...weatherErrors);

    if (setErrorFields) setErrorFields(errorFields);
    return errors;
}

export function validateTempDewQnhFields(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];

    const tempErrors = validateTempDewPoint(formData, ef => { if (Array.isArray(ef)) errorFields.push(...ef); });
    if (Array.isArray(tempErrors)) errors.push(...tempErrors);

    const qnhErrors = validateQNH(formData, ef => { if (Array.isArray(ef)) errorFields.push(...ef); });
    if (Array.isArray(qnhErrors)) errors.push(...qnhErrors);

    if (setErrorFields) setErrorFields(errorFields);
    return errors;
}
