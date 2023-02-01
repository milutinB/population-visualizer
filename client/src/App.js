import './App.css';
import Map from './components/Map.js'
import Graph from './components/Graph.js'
import ErrorCard from './components/ErrorCard';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import * as d3 from "d3";
import axios from 'axios';

const MAX_COUNTRY_COUNT = 5


export default function App() {

  const [state, setState] = useState({
    mapLoaded: false,
    // raw map data to be loaded from server
    mapData: {},
    // population data from all countries from 1960-2021
    populationData: [],
    // active countries are those whose
    // population trends will be displayed on the line graph
    activeCountryData: [],
    // colors for active countries
    colors: ["red", "blue", "orange", "green", "purple"],
    // d3.js derivative of raw map data used to render map
    geoGenerator: [],
    // flag to indicate no available population data for
    // selected country
    missingData: false,
    // map loading progress
    loadingProgress: 0,

    mapWidth: 650,
    mapHeight: 500
  });

  function resolveMissingDataError() {
    setState({
      ...state,
      missingData: false
    });
  }

  const updateActiveCountry = useCallback((countryName) => {
    let data = state.populationData[countryName];
    let colors = state.colors;
    let activeCountryData = state.activeCountryData;
    let names = activeCountryData.map(d => {return d.name});

    if (names.includes(countryName)) {
      let index = names.indexOf(countryName);

      // free the associated color
      let obsoleteColor = activeCountryData[index].color;
      colors.unshift(obsoleteColor);

      // If countryName is already active,
      //  remove it from the active list
      activeCountryData.splice(index, 1);
    
    } else {

      if (state.populationData[countryName] === undefined) {
        setState(s => {return {
          ...s,
          missingData: true
        }});
        return;
      }

      if (activeCountryData.length === MAX_COUNTRY_COUNT) {
         // free the associated color
        let color = activeCountryData[0].color;
        colors.push(color);
        // Remove the 'oldest' country if the new addition
        // will exceed the limit
        activeCountryData.shift();
      } 

      activeCountryData.push({
        name: countryName, 
        color: colors[0], 
        data: data
      });
      colors.shift();
    }
    
    setState(s => { return {
      ...s,
      activeCountryData: activeCountryData,
      colors: colors
    }});
  }, [state.activeCountryData, state.colors, state.populationData]);


  useEffect(() => {
    axios.get('map_data', {
      onDownloadProgress: (progressEvent) => {
        setState(s => { return {
          ...s,
          loadingProgress: 100 * progressEvent.loaded / progressEvent.total
        }});
      }
    })
    .then(res => {
      return res.data})
    .then(mapData => {
        let projection = d3.geoMercator();
        projection.fitSize([state.mapWidth, state.mapHeight], mapData);
        let geoGenerator = d3.geoPath()
        .projection(projection);


        fetch('population_data')
        .then((res) => {
          return res.json()  
        })
        .then(allPopData => {
            setState(s => {return {
              ...s,
              colors: ["red", "blue", "orange", "green", "purple"],
              missingData: false,
              activeCountryData: [],
              mapData: mapData,
              populationData: allPopData,
              geoGenerator: geoGenerator,
              mapLoaded: true
            }});
        });
    });
  }, [state.mapHeight, state.mapWidth]);


    if (state.mapLoaded) {

      return(
        <div >
          <div className='info-box'>
            <div className='title'>
              <h1>Population Visualizer</h1>
            </div>
            <div className='subtitle'>
              <h3>Select up to five countries to view their population data.</h3>
            </div>
          </div>
          <div className='container'>
            <Map 
              mapData={state.mapData} 
              updateActiveCountry={updateActiveCountry}
              activeCountryData={state.activeCountryData}
              colors={state.colors}
              geoGenerator={state.geoGenerator}
              width={state.mapWidth}
              height={state.mapHeight}
            />
            <Graph 
              activeCountryData={state.activeCountryData}
            />
            <ErrorCard 
              missingData={state.missingData}
              resolve={() => resolveMissingDataError()}
            />
          </div>
          <div className='information'>
          <div className='attribution-box'>
            <h3 className='attribution-title'>Attribution:</h3>
            <div className='attribution-text'>Population data used is made available by{' '}
            <a href='https://data.worldbank.org/indicator/SP.POP.TOTL'>The World Bank.</a>
            </div>
          </div>
          <div className='source-code'>
            <h3>Source Code:</h3> 
            <a href='https://github.com/milutinB/population-visualizer'>https://github.com/milutinB/population-visualizer</a>
          </div>
          </div>
        </div>
      );
    }
    else {
      return <h1 id="loading-message">loading data: {Math.ceil(state.loadingProgress)}%</h1>; 
    }
}
