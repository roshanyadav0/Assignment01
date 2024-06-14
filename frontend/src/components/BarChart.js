import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data && data.length > 0) {
            drawBarChart();
        }
    }, [data]);

    const drawBarChart = () => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 60, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .domain(data.map(d => d.closed_fiscal_quarter))
            .range([margin.left, width + margin.left])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.acv)])
            .nice()
            .range([height, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(['Existing Customer', 'New Customer'])
            .range(['steelblue', 'orange']);

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y)
            .tickFormat(d => d3.format("$.2s")(d));

        svg.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        svg.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.closed_fiscal_quarter))
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.acv))
            .attr('height', d => height - y(d.acv))
            .attr('fill', d => color(d.ACType));

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis);

        svg.append('text')
            .attr('x', width / 2 + margin.left)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text('ACV Distribution by Quarter and Customer Type');
    };
    

    return (
        <svg ref={svgRef}></svg>
    );
};

export default BarChart;


// // ***********************************************************************************************




// import React, { useRef, useEffect } from 'react';
// import * as d3 from 'd3';

// const BarChart = ({ data }) => {
//     const svgRef = useRef();

//     useEffect(() => {
//         // Dimensions and margins for the graph
//         const margin = { top: 20, right: 30, bottom: 40, left: 40 };
//         const width = 800 - margin.left - margin.right;
//         const height = 400 - margin.top - margin.bottom;
    
//         // Clear any existing SVG content
//         const svg = d3.select(svgRef.current);
//         svg.selectAll('*').remove();
    
//         // Append a 'g' element to the SVG
//         const graph = svg
//             .attr('width', width + margin.left + margin.right)
//             .attr('height', height + margin.top + margin.bottom)
//             .append('g')
//             .attr('transform', `translate(${margin.left},${margin.top})`);
    
//         const groupDataByAcvAndCustType = (data) => {
//             // Initialize an empty object to store grouped and aggregated data
//             const groupedData = {};
        
//             // Loop through each data object
//             data.forEach(item => {
//                 // Check if a key exists for the Cust_Type
//                 if (!groupedData[item.Cust_Type]) {
//                     // If not, create an initial object for that key
//                     groupedData[item.Cust_Type] = { Cust_Type: item.Cust_Type, total_acv: 0 };
//                 }
//                 // Add the acv value to the existing total_acv for that Cust_Type
//                 groupedData[item.Cust_Type].total_acv += item.acv;
//             });
        
//             // Convert the object values to an array
//             const aggregatedData = Object.values(groupedData);
        
//             return aggregatedData;
//         };


//         console.log("grouped data ---> ", groupDataByAcvAndCustType(data));
//         // Group and aggregate data by quarter and customer type
//         const groupedData = groupDataByAcvAndCustType(data);

//         console.log("grouped data ---> ", groupedData);
    
//         // Convert grouped data into an array of quarters with aggregated values
//         const stackedData = Array.from(groupedData, ([quarter, typeMap]) => {
//             const acvValues = { quarter };
//             typeMap.forEach((value, key) => {
//                 acvValues[key] = value.reduce((acc, d) => acc + d.acv, 0);
//             });
//             return acvValues;
//         });
    
//         // Log processed data for debugging
//         console.log("Processed Data:", stackedData);
    
//         // Set up scales
//         const x = d3.scaleBand()
//             .domain(stackedData.map(d => d.quarter))
//             .range([0, width])
//             .padding(0.2);
    
//         const y = d3.scaleLinear()
//             .domain([0, d3.max(stackedData, d => d['Existing Customer'] + d['New Customer'])])
//             .nice()
//             .range([height, 0]);
    
//         // Add X axis
//         graph.append('g')
//             .attr('transform', `translate(0,${height})`)
//             .call(d3.axisBottom(x));
    
//         // Add Y axis
//         graph.append('g')
//             .call(d3.axisLeft(y));
    
//         // Stack the data
//         const stack = d3.stack()
//             .keys(['Existing Customer', 'New Customer'])
//             .order(d3.stackOrderNone)
//             .offset(d3.stackOffsetNone);
    
//         const series = stack(stackedData);
    
//         // Define color scale
//         const color = d3.scaleOrdinal()
//             .domain(['Existing Customer', 'New Customer'])
//             .range(['steelblue', 'orange']);
    
//         // Draw bars
//         graph.append('g')
//             .selectAll('g')
//             .data(series)
//             .enter().append('g')
//             .attr('fill', d => color(d.key))
//             .selectAll('rect')
//             .data(d => d)
//             .enter().append('rect')
//             .attr('x', d => x(d.data.quarter))
//             .attr('y', d => y(d[1])) // Ensure y is correctly mapped
//             .attr('height', d => y(d[0]) - y(d[1])) // Ensure height is correctly calculated
//             .attr('width', x.bandwidth());
    
//     }, [data]);
    

//     return (
//         <svg ref={svgRef}></svg>
//     );
// };

// export default BarChart;
