
const Axis = ({ticks, isX, height, width}) => {
    if (isX) {
        let pathString = `M0,0H${width}Z`;
        // d="M0,6V0H870V6"
        return (
            <g transform={`translate(0, ${height})`} fill='None' textAnchor='middle'>
                <g>
                    <text fill="black" x={width/2} dy='2.5em'>{'Year'}</text>
                </g>
            <path className="domain" stroke="black" d={pathString}/>
                {ticks.map(t => {
                    return <g 
                            className="tick" 
                            opacity="1" 
                            key={t.value}
                            transform={`translate(${t.offset}, 0)`}>
                                <line y2="6" stroke="black"/>
                                <text
                                    fill="black"
                                    y="9"
                                    dy="0.71em"
                                    fontSize={10}    
                                >
                                    {t.value}
                                </text>
                        </g>
                })}
            </g>
        );
    } else {
        let pathString = `M0,0v${height}Z`;
        // d="M0,0V430Z"
        return (
            <g fill='None' textAnchor='end'>
                        <g transform={`rotate(-90 0 ${height}) translate(${height/2}, -35)`} textAnchor='middle'>
                            <text fill="black" x={0} y={height}>{'Population (millions)'}</text>
                        </g>
                        <path className="domain" stroke="black" d={pathString}/>
                        {ticks.map(t => {
                                return <g 
                                        className="tick" 
                                        opacity="1" 
                                        key={t.value}
                                        transform={`translate(0, ${height-t.offset})`}>
                                            <line x2="-6" stroke="black"/>
                                            <text
                                                fill="black"
                                                x="-9"
                                                y="-3"
                                                dy="0.71em"
                                                fontSize={10}    
                                            >
                                                {t.value}
                                            </text>
                                    </g>
                            })}
                </g>
        );
    }
};

export default Axis;