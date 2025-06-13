export function validateWindFields(formData, setErrorFields) {
    const errors = [];
    const errorFields = [];

    const {
        windDir,
        windSpeed,
        gust,
        windV1,
        windV2
    } = formData;

    const isDirMissing = windDir === '///';
    const isSpeedMissing = windSpeed === '//';

    const isWindDirEmpty = windDir === undefined || windDir === null || windDir.trim() === '';
    const isWindSpeedEmpty = windSpeed === undefined || windSpeed === null || windSpeed.trim() === '';

    const windSpeedNum = !isSpeedMissing ? Number(windSpeed) : null;
    const gustNum = gust === '//' ? null : Number(gust);

    // 1. Required Field Checks
    if (isWindDirEmpty) {
        errors.push('Wind direction is required.');
        errorFields.push('wind');
    }

    if (isWindSpeedEmpty) {
        errors.push('Wind speed is required.');
        errorFields.push('wind');
    }

    // 2. Faulty Pairing Logic
    if (!isWindDirEmpty && !isWindSpeedEmpty) {
        if (windDir === '000' && windSpeedNum !== 0 && !isSpeedMissing) {
            errors.push('Wind speed must be 0 when direction is 000.');
            errorFields.push('wind');
        } else if (windSpeedNum === 0 && windDir !== '000') {
            errors.push('Wind direction must be 000 when speed is 0.');
            errorFields.push('wind');
        } else if (isDirMissing && !isSpeedMissing) {
            errors.push('Wind speed must be "//" if direction is missing ("///").');
            errorFields.push('wind');
        } else if (isSpeedMissing && !isDirMissing) {
            errors.push('Wind direction must be "///" if speed is missing ("//").');
            errorFields.push('wind');
        }
    }

    // 3. Variable Wind (VRB)
    if (windDir === 'VRB' && windSpeedNum > 6) {
        errors.push('Variable wind (VRB) should only be used for wind speed ≤ 6 KT.');
        errorFields.push('wind');
    }

    // 4. Gusts if wind speed ≥ 15
    if (!isSpeedMissing && windSpeedNum >= 15) {
        if (!gust || gust === '//') {
            errors.push('Wind gust required when wind speed ≥ 15 KT.');
            errorFields.push('wind');
        } else if (gustNum < windSpeedNum + 10) {
            errors.push('Wind gust must be ≥ wind speed + 10 KT.');
            errorFields.push('wind');
        }
    }

    // 5. Wind variation
    if (windDir && windDir !== 'VRB' && windV1 && windV2) {
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

    // 6. Wind speed exceeds operational limits
    if (!isSpeedMissing && windSpeedNum > 150) {
        errors.push('Wind speed exceeds maximum operational limit (>150 KT).');
        errorFields.push('wind');
    }

    setErrorFields(prev => [...new Set([...prev, ...errorFields])]);
    return errors;
}
