
const Legend = ({
    activeCountryData, 
    width, 
    height, 
    xOffset, 
    yOffset
}) => {
    let fontSize = 15

    return  <g transform={`translate(${xOffset}, ${yOffset})`}>
                <svg width={width} height={height}>
    
                    <g>
                        {activeCountryData.map(d => {
                            return  (
                                <g 
                                    key={`legend-${d.name}`} 
                                    transform={`translate(0, ${15*(activeCountryData.indexOf(d)+1)})`}
                                >
                                    <line x1="6" x2="18" stroke={d.color}/>
                                    <text 
                                        x='1'
                                        y='1'
                                        dx={25}
                                        dy={3} 
                                        key={d.name} 
                                        fill="black" 
                                        fontSize={fontSize}
                                    >
                                        {d.name}
                                    </text>
                                </g>
                            )
                        })}
                    </g>
                </svg>
            </g> 
}

export default Legend;