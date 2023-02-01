import Curve from './graph-components/Curve.js';
import Axis from './graph-components/Axis.js';
import Legend from './graph-components/Legend.js';


const Graph = ({activeCountryData}) => {


    var maxPop;
    if (activeCountryData.length > 0) {
        let maxPopulations = activeCountryData.map(d => {
            let aux = d.data.map(d => {
                return parseInt(d.population)
            });
            return Math.max(...aux);
        })
        maxPop = Math.ceil(Math.max(...maxPopulations) / 1000000);
    } else {
        maxPop = 100;
    }

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 70 };
    var width = 550 - margin.left - margin.right;
    var height = 388 - margin.top - margin.bottom;


    // xticks and yticks arrays store tick labels (value)
    // and distance from tick to origin (offset)
    var xtickWidth = 5*(width / (2021 - 1960));
    var xticks = [...Array(Math.ceil((2021-1960)/5)).keys()].map(t => {
        return {
            value: 5*(t) + 1960,
            offset: (t) * xtickWidth
        };
    });

    // round the maximum population based on its order of magnitude
    // to ensure reasonable y-axis labels
    var maxPopRounded;

    if (maxPop >= 100)  {
        maxPopRounded = Math.ceil(maxPop  / 100) * 100;
    }
    else if (maxPop >= 10 && maxPop < 100) {
        maxPopRounded = Math.ceil(maxPop  / 10) * 10;
    }
    else if (maxPop >=1 && maxPop < 10) {
        maxPopRounded = Math.ceil(maxPop);
    }
    else if (maxPop < 1 && maxPop >= .1) {
        maxPopRounded = 1;
    } else if (maxPop < .1 && maxPop >= .01) {
        maxPopRounded = Math.ceil(maxPop * 10) / 10;
    } else if (maxPop < .01){
        maxPopRounded = Math.ceil(maxPop * 100) / 100;
    }
    
    var ytickWidth = height / 10;
    var yticks = [...Array(10).keys()].map(t => {
        return {
            value: (t + 1) * maxPopRounded / 10,
            offset: (t+1) * ytickWidth
        }
    })

    return <div className='graph-container'>
        <svg 
            width={`${width + margin.left + margin.right}px`} 
            height={`${height + margin.top + margin.bottom}px`}
        >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <text x={width/2} y={-1} textAnchor='middle'>
                    Population Change Over Time
                </text>
                <Axis
                    ticks={xticks}
                    isX={true}
                    height={height}
                    width={width}
                />
                <Axis
                    ticks={yticks}
                    isX={false}
                    height={height}
                    width={width}
                />
                {activeCountryData.map(d=>{
                    return (
                        <Curve
                            xtickWidth={xtickWidth / 5}
                            yMax={maxPopRounded * 1000000}
                            data = {d}
                            height={height}
                            key={d.data[0].population}
                        />
                    )
                })}
            </g>
        </svg>
        <div className='legend'>
            <svg width={`${width}px`} height={`${height / 2}px`}>
                <Legend
                    activeCountryData={activeCountryData}
                    width={`${width}px`}
                    height={`${height / 2}px`}
                    xOffset={0}
                    yOffset={20}
                />
            </svg>
        </div>
    </div>;
}

export default Graph;