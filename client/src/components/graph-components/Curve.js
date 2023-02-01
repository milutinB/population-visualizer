export default function Curve({
    data,
    xtickWidth,
    yMax,
    height
}) {

    var pathString = "M0"
    + "," + (height - height * parseInt(data.data[0].population) / yMax);
    
    data.data.map(d => {
        return pathString += "L" + ((parseInt(d.year) - 1960) * xtickWidth) 
        + "," + (height - (height * parseInt(d.population) / yMax));
    })

  
    return  <path
                strokeWidth={2.5} 
                fill='none' 
                className="line" 
                stroke={data.color}
                d={pathString}
            />           
}
