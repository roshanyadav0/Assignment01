import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const DoughnutChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data && data.length > 0) {
            drawDoughnutChart();
        }
    }, [data]);

    const drawDoughnutChart = () => {
        const svg = d3.select(svgRef.current);

        // Clear previous drawings
        svg.selectAll('*').remove();

        const width = 400;
        const height = 300;
        const radius = Math.min(width, height) / 2;

        const pieData = [
            { type: 'Existing Customer', acv: d3.sum(data.filter(d => d.Cust_Type === 'Existing Customer'), d => d.acv) },
            { type: 'New Customer', acv: d3.sum(data.filter(d => d.Cust_Type === 'New Customer'), d => d.acv) }
        ];

        const totalCustomers = pieData.reduce((acc, curr) => acc + curr.acv, 0);

        const color = d3.scaleOrdinal()
            .domain(pieData.map(d => d.type))
            .range(['steelblue', 'orange']);

        const pie = d3.pie()
            .value(d => d.acv);

        const arc = d3.arc()
            .innerRadius(radius * 0.3)
            .outerRadius(radius * .6);

        const arcs = pie(pieData);

        svg.attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)
            .selectAll('path')
            .data(arcs)
            .enter().append('path')
            .attr('fill', d => color(d.data.type))
            .attr('d', arc)
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .text("Total $ "+totalCustomers.toLocaleString());
    };

    return (
        <svg ref={svgRef}></svg>
    );
};

export default DoughnutChart;
