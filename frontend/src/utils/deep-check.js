export function validateWindFields(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];
    const { windDir, windSpeed, gust, windV1, windV2 } = formData;

    // Convert to numbers once
    const windSpeedNum = windSpeed === '//' ? NaN : Number(windSpeed);
    const gustNum = Number(gust);

    // 1. First handle missing/required fields
    if (!windDir && windDir !== '///') {
        errors.push('Wind direction is required.');
        errorFields.push('wind');
    }

    if ((windSpeed === undefined || windSpeed === null || windSpeed.trim() === '') && windSpeed !== '//') {
        errors.push('Wind speed is required.');
        errorFields.push('wind');
    }

    // If either field is completely missing, return early
    if (errors.length > 0) {
        setErrorFields(prev => [...new Set([...prev, ...errorFields])]);
        return errors;
    }

    // 2. Handle missing value cases ('///' and '//')
    if (windDir === '///' || windSpeed === '//') {
        if (windDir === '///' && windSpeed !== '//') {
            errors.push('Wind speed must be "//" if direction is missing ("///").');
            errorFields.push('wind');
        }
        if (windSpeed === '//' && windDir !== '///') {
            errors.push('Wind direction must be "///" if speed is missing ("//").');
            errorFields.push('wind');
        }
        setErrorFields(prev => [...new Set([...prev, ...errorFields])]);
        return errors;
    }

    // 3. Validate calm wind conditions (000/0)
    if (windDir === '000' || windSpeedNum === 0) {
        if (windDir === '000' && windSpeedNum !== 0) {
            errors.push('Wind speed must be 0 when direction is 000.');
            errorFields.push('wind');
        }
        if (windSpeedNum === 0 && windDir !== '000') {
            errors.push('Wind direction must be 000 when speed is 0.');
            errorFields.push('wind');
        }
        // For calm winds, we can skip other validations
        if (errors.length > 0) {
            setErrorFields(prev => [...new Set([...prev, ...errorFields])]);
            return errors;
        }
        return errors; // Valid calm wind, no further checks needed
    }

    // 4. Validate variable wind (VRB)
    if (windDir === 'VRB') {
        if (windSpeedNum > 6) {
            errors.push('Variable wind (VRB) should only be used for wind speed ≤ 6 KT.');
            errorFields.push('wind');
        }
        // Skip gust validation for VRB winds
        setErrorFields(prev => [...new Set([...prev, ...errorFields])]);
        return errors;
    }

    // 5. Validate normal wind conditions
    if (windSpeedNum >= 15) {
        if (!gust) {
            errors.push('Wind gust required when wind speed ≥ 15 KT.');
            errorFields.push('wind');
        } else if (gustNum < windSpeedNum + 10) {
            errors.push('Wind gust must be ≥ wind speed + 10 KT.');
            errorFields.push('wind');
        }
    }

    // 6. Validate wind variation
    if (windV1 && windV2) {
        const v1 = parseInt(windV1, 10);
        const v2 = parseInt(windV2, 10);
        if (!isNaN(v1) && !isNaN(v2)) {
            const diff = v2 > v1 ? v2 - v1 : (360 + v2 - v1);
            if (diff < 60) {
                errors.push('Wind variation must differ by at least 60°.');
                errorFields.push('wind');
            }
        }
    }

    // 7. Validate operational limits
    if (windSpeedNum > 150) {
        errors.push('Wind speed exceeds maximum operational limit (>150 KT).');
        errorFields.push('wind');
    }

    setErrorFields(prev => [...new Set([...prev, ...errorFields])]);
    return errors;
}