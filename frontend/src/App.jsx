import React from 'react';
import './App.css';

import WelcomeBanner from './components/WelcomeBanner';

import { useFormData } from './context/FormContext';
import {
  validateWindFields,
  validateCloudVisibilityWeather,
  validateTempDewQnhFields
} from './utils/validateMetar';

import WxHeaderForm from './components/WxHeaderForm';
import WxWindVisibility from './components/WxWindVisibility';
import WxCloudBlock from './components/WxCloudBlock';
import WxTempPressureBlock from './components/WxTempPressureBlock';
import WxRemarksBlock from './components/WxRemarksBlock';
import MetarPreview from './components/MetarPreview';
import MetarActions from './components/MetarActions';
import UtcClock from './components/UtcClock';

function App() {
  const {
    formData,
    appendMetar,
    resetMetarBody,
    setErrorFields
  } = useFormData();

  const buildMetarString = () => {
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

    let wind = '';
    if (windDir && windSpeed) {
      wind = `${windDir}${windSpeed.padStart(2, '0')}`;
      if (gust && Number(windSpeed) >= 15) wind += `G${gust}`;
      wind += 'KT';
    }
    if (showWindVar && windV1 && windV2) wind += ` ${windV1}V${windV2}`;

    let visClouds = '';
    if (cavok) {
      visClouds = 'CAVOK';
    } else {
      let vis = visibility || '';
      if (showDirVis && dirVisValue && dirVisDir) vis += ` ${dirVisValue}${dirVisDir}`;
      let cloudsStr = '';
      if (clouds.length > 0) {
        cloudsStr = clouds
          .filter(cl => cl.amount && cl.height)
          .map(cl => `${cl.amount}${cl.height}${cl.type || ''}`)
          .join(' ');
      }

      visClouds = [vis, showPresentWeather && presentWeather, cloudsStr].filter(Boolean).join(' ');
    }

    let tempDew = '';
    if (temperature && dewPoint) {
      tempDew = `${temperature}/${dewPoint}`;
    }

    let qnhStr = pressure ? `Q${pressure}` : '';

    let remarksStr = '';
    if (showRecentWeather && recentWeather) remarksStr += ` RE${recentWeather}`;
    if (showRemarks && remarks) remarksStr += ` RMK ${remarks}`;

    const metarParts = [
      obsType,
      station,
      utcTime ? `${utcTime}Z` : '',
      wind,
      visClouds,
      tempDew,
      qnhStr,
      remarksStr.trim(),
    ].filter(Boolean);

    if (metarParts.length > 0) {
      metarParts[metarParts.length - 1] += '=';
    }

    return metarParts.join(' ');
  };

  const handleCheck = () => {
    let allErrors = [];
    console.log("FormData:", formData); // 🧪 Debug

    const windErrors = validateWindFields(formData, setErrorFields);
    const visibilityErrors = validateCloudVisibilityWeather(formData, setErrorFields);
    const tempQnhErrors = validateTempDewQnhFields(formData, setErrorFields);

    allErrors = [...windErrors, ...visibilityErrors, ...tempQnhErrors];

    if (allErrors.length > 0) {
      alert('⚠️ Some fields contain errors:\n\n' + allErrors.join('\n'));
    } else {
      alert('✅ No errors detected. Observation has been verified.');
      setErrorFields([]); //Clear only if no errors

      const metarString = buildMetarString();
      console.log("Generated METAR:", metarString);
      appendMetar(metarString);

      // Reset fields except header (country, obsType, utcTime, cccc, ttaaii)
      resetMetarBody();
    }
  };

  return (
    <div className="app-container">
      {/*<h1 className="form-title">METAR Error Detection System</h1>*/}
      <WelcomeBanner />

      <WxHeaderForm />

      <div className="two-pane">
        <div className="left-pane">
          <WxWindVisibility />
          <WxCloudBlock />
          <WxTempPressureBlock />
          <WxRemarksBlock />

          <div className="button-group">
            <button
              className="check-button"
              onClick={handleCheck}
              disabled={formData.noWxReport}
            >
            Check
            </button>

            <button
              className="refresh-button"
              onClick={() => {
                const confirmRefresh = window.confirm("This will reset all values. Do you want to continue?");
                if (confirmRefresh) {
                  window.location.reload();
                }
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="right-pane">
          <MetarPreview />
          <MetarActions />
        </div>
      </div>
    </div>
  );
}

export default App;
