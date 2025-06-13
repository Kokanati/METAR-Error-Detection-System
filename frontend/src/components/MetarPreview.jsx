import React from 'react';
import { useFormData } from '../context/FormContext';
import '../App.css';

const MetarPreview = () => {
    const { formData, errorFields } = useFormData();

    const {
        obsType,
        station,
        utcTime,
        windDir,
        windSpeed,
        gust,
        windV1,
        windV2,
        visibility,
        showDirVis,
        dirVisValue,
        dirVisDir,
        showPresentWeather,
        presentWeather,
        clouds = [],
        temperature,
        dewPoint,
        pressure,
        showRecentWeather,
        recentWeather,
        showRemarks,
        remarks,
        cavok,
        showWindVar,
    } = formData;

    const highlightIfError = (field, value) =>
        errorFields?.includes(field)
            ? <span className="highlight-error">{value}</span>
            : value;

    // Build wind
    let wind = '';
    if (windDir && windSpeed) {
        let windVal = `${windDir}${windSpeed.padStart(2, '0')}`;
        if (gust && Number(windSpeed) >= 15) windVal += `G${gust}`;
        windVal += 'KT';
        wind = highlightIfError('wind', windVal);
    }
    if (showWindVar && windV1 && windV2) {
        const varText = `${windV1}V${windV2}`;
        wind = <>{wind} {highlightIfError('windVar', varText)}</>;
    }

    // Visibility and clouds as JSX spans
    const cloudSpans = clouds
        .filter(cl => cl.amount && cl.height)
        .map((cl, idx) => {
            const val = `${cl.amount}${cl.height}${cl.type ?? ''}`;
            return (
                <span
                    key={`cloud-${idx}`}
                    className={errorFields.includes('clouds') ? 'highlight-error' : ''}
                    style={{ marginRight: '6px' }}
                >
                    {val}
                </span>
            );
        });

    const visClouds = [];

    if (cavok) {
        visClouds.push(
            <span key="cavok" className={errorFields.includes('cavok') ? 'highlight-error' : ''} style={{ marginRight: '6px' }}>
                CAVOK
            </span>
        );
    } else {
        if (visibility) {
            visClouds.push(
                <span key="visibility" className={errorFields.includes('visibility') ? 'highlight-error' : ''} style={{ marginRight: '6px' }}>
                    {visibility}
                </span>
            );
        }

        if (showDirVis && dirVisValue && dirVisDir) {
            visClouds.push(
                <span key="dirVis" className={errorFields.includes('visibility') ? 'highlight-error' : ''} style={{ marginRight: '6px' }}>
                    {`${dirVisValue}${dirVisDir}`}
                </span>
            );
        }

        if (showPresentWeather && presentWeather) {
            visClouds.push(
                <span key="presentWeather" className={errorFields.includes('presentWeather') ? 'highlight-error' : ''} style={{ marginRight: '6px' }}>
                    {presentWeather}
                </span>
            );
        }

        visClouds.push(...cloudSpans);
    }

    let tempDew = '';
    if (temperature && dewPoint) {
        const val = `${temperature}/${dewPoint}`;
        tempDew = highlightIfError('tempDew', val);
    }

    let qnhStr = '';
    if (pressure) {
        qnhStr = highlightIfError('qnh', `Q${pressure}`);
    }

    let remarksStr = '';
    if (showRecentWeather && recentWeather) remarksStr += `RE${recentWeather} `;
    if (showRemarks && remarks) remarksStr += `RMK ${remarks}`;
    remarksStr = remarksStr.trim();

    // Render all METAR parts
    const parts = [
        obsType,
        station,
        utcTime ? `${utcTime}Z` : '',
        wind,
        ...visClouds,
        tempDew,
        qnhStr,
        remarksStr
    ].filter(Boolean);

    // Append '=' to the last part
    if (parts.length > 0) {
        const last = parts.pop();
        parts.push(typeof last === 'string'
            ? `${last}=`
            : <span className="highlight-error">{last}=</span>);
    }

    return (
        <div className="section">
            <div className="preview-box">
                {parts.length > 0 ? (
                    parts.map((part, idx) => (
                        <span key={idx} style={{ marginRight: '6px' }}>{part}</span>
                    ))
                ) : (
                    'This preview will display weather observation as generated in Real-time'
                )}
            </div>
        </div>
    );
};

export default MetarPreview;
