import * as d3 from 'd3';
import { historicalData } from '../../data';

let margins = {top: 10, right: 10, bottom: 50, left: 50};
let historyDimensions = {
  width: 1920 - margins.left - margins.right,
  height: 500 - margins.top - margins.bottom
}


function offsetDomain(domain, offset) {
  return [domain[0] - offset, domain[1] + offset]
}

function drawHistory() {
  let historyChart = d3.select('#wrapper')
      .append('svg')
      .attr('id', 'history-chart')
      .attr('height', historyDimensions.height + margins.top + margins.bottom)
      .attr('width', historyDimensions.width + margins.right + margins.left)
      .append("g")
      .attr("transform",
          "translate(" + margins.left + "," + margins.top + ")");

  let xAxis = d3.scaleLinear()
      .domain(offsetDomain(d3.extent(historicalData, d => d.year), 2))
      .range([0, historyDimensions.width])


  historyChart
      .append("g")
      .attr("transform", `translate(0, ${historyDimensions.height + 10})`)
      .call(d3.axisBottom(xAxis).tickFormat(d3.format('')))

  let yAxis = d3.scaleLinear()
      .domain([0.5, 0])
      .range([0, historyDimensions.height]);
  historyChart
      .append("g")
      .attr("transform", `translate(-10,0)`)
      .call(d3.axisLeft(yAxis).tickFormat(d3.format('.0%')))

  // Add lines between points
  historyChart.append("path")
      .datum(historicalData)
      .attr("class", "history-line")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
          .x(d => xAxis(d.year))
          .y(d => yAxis(d.singleHouseholdPercentage))
      )

  // Add points
  historyChart.selectAll("data-points")
      .data(historicalData)
      .enter()
      .append("circle")
      .attr("class", "history-point")
      .attr("cx", d => xAxis(d.year))
      .attr("cy", d => yAxis(d.singleHouseholdPercentage))
      .attr("r", 7)



}


drawHistory()
