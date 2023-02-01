import { useCallback } from 'react';
import * as d3 from "d3";
import { memo } from 'react';
import { useState } from 'react';
import { useRef } from 'react';


const Country = memo(({
    geoGenerator,
    country, 
    color, 
    handleMouseOverCountry, 
    handleMouseLeaveCountry, 
    handleCountryClick}) => {
    return (
        <path
            className={'Country'}
            name={country.properties.ADMIN}
            key={country.properties.ADMIN+'_path'}
            id={country.properties.ADMIN.replaceAll(' ', '-')}
            d={geoGenerator(country)}
            fill={color}
            onMouseMove={() => handleMouseOverCountry(country)}
            onMouseLeave={() => handleMouseLeaveCountry(country)}
            onClick={() => handleCountryClick(country)}
        />
    );
});

export default function Map ({
    mapData,
    updateActiveCountry,
    activeCountryData,
    colours,
    geoGenerator,
    width,
    height
}) {
    const [mouseDown, setMouseDown] = useState(false);
    const [viewBox, setViewBox] = useState({startX: 0, startY: 0, width: width, height: height});
    const widthScaleFactor = useRef(1);

    const handleMouseOverCountry = useCallback((country) => {
        d3.select("#"+country.properties.ADMIN.replaceAll(' ', '-'))
        .transition()
        .duration(50)
        .style("stroke-width", `${widthScaleFactor.current}`)
        .style("opacity", 1)
        .style("stroke", "black");
    }, []);

    const handleMouseLeaveCountry = useCallback((country) => {
        d3.selectAll(".Country")
        .transition()
        .duration(50)
        .style("stroke", "transparent")
    }, []);

    const handleCountryClick = useCallback((country) => {
        let name = country.properties.ADMIN;
        updateActiveCountry(name);
    }, [updateActiveCountry]);
    
    const handleMouseMove = useCallback((e) => {
        if (mouseDown) {
            let dragSpeed = viewBox.width / width;

            let newStartX = e.movementX > 0 ? Math.max(
                -width / 2,
                viewBox.startX - e.movementX * dragSpeed 
            ) : Math.min(
                3 * width / 4,
                viewBox.startX - e.movementX * dragSpeed 
            );

            let newStartY = e.movementY > 0 ? Math.max(
                -height / 2,
                viewBox.startY - e.movementY * dragSpeed 
            ) : Math.min(
                3 * height / 4,
                viewBox.startY - e.movementY * dragSpeed 
            );

            setViewBox({
                startX: newStartX,
                startY: newStartY,
                width: viewBox.width,
                height: viewBox.height
            });
        }
    }, [width, height, mouseDown, viewBox]);

    function handleMouseLeave() {
        setMouseDown(false);
    }


    function handleWheelEvent(e) {
        let dir = e.deltaY > 0 ? -1 : 1;

        let zoomSpeed = .05 * viewBox.width / width;

        let scaleFactor = 1.05;

        // affect of zoom is to strech or shrink the view box
        let newWidth = e.deltaY < 0 ? Math.min(width, viewBox.width / scaleFactor)
        : Math.max(50, viewBox.width * scaleFactor);
        let newHeight = e.deltaY < 0 ? Math.min(height, viewBox.height / scaleFactor)
        : Math.max(50 * (height / width), viewBox.height * scaleFactor);

        // the position of the top left corner moves
        // towards or away from the mouse depending
        // on zoom direction.
        let newStartX = viewBox.startX 
        + (e.clientX - viewBox.startX) * zoomSpeed * dir;
        let newStartY = viewBox.startY 
        + (e.clientY - viewBox.startY) * zoomSpeed * dir;

        // we only update the window if the transformation does not
        // move the entire map outside of the view box
        if (
            newWidth <= width && newHeight <= height
            && newStartX >= -width / 2
            && newStartX <= 3 * width / 4
            && newStartY >= -height / 2
            && newStartY <= 3*height / 4
        ) {
            setViewBox({
                startX: newStartX,
                startY: newStartY,
                width: newWidth,
                height: newHeight
            });
            widthScaleFactor.current = newWidth / width;
        }
    }

    let names = activeCountryData.map(d => {return d.name});

    return (<div className={"map-container"}>
        <svg 
            viewBox={
                    `${viewBox.startX} ${viewBox.startY} 
                    ${viewBox.width} ${viewBox.height}`
                }
            style={{backgroundColor: '#d7f2fc'}}
            width={width} 
            height={height}
            onWheel={e => handleWheelEvent(e)}
            onMouseMove={e => handleMouseMove(e)}
            onMouseDown={(e) => {setMouseDown(true)}}
            onMouseUp={(e) => {setMouseDown(false)}}
            onMouseLeave={() => {handleMouseLeave()}}
        >
            {mapData.features.map(
                country => {
                    let color = names.includes(country.properties.ADMIN) ?
                    activeCountryData[names.indexOf(country.properties.ADMIN)].color
                    : '#808080'; 
                    return <g
                                key={country.properties.ADMIN+'_country_g'}
                                onMouseMove={() => handleMouseOverCountry(country)}
                                onMouseLeave={() => handleMouseLeaveCountry(country)}
                            >
                                <Country
                                    geoGenerator={geoGenerator}
                                    country={country}
                                    color={color}
                                    handleMouseOverCountry={handleMouseOverCountry}
                                    handleMouseLeaveCountry={handleMouseLeaveCountry}
                                    handleCountryClick={handleCountryClick}
                                    key={country.properties.ADMIN+'_country'}
                                />
                            </g>
                }
            )}
        </svg>
    </div>);
}
