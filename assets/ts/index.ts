import * as d3 from 'd3';
import { historicalData, HistoricalPoint } from './data';

let margins = {top: 10, right: 10, bottom: 50, left: 50};
let historyDimensions = {
  width: 1920 - margins.left - margins.right,
  height: 500 - margins.top - margins.bottom
}


function offsetDomain(domain, offset) {
  return [domain[0] - offset, domain[1] + offset]
}

// Setup Y Axis
const y = d3.scaleLinear()
const yAxis = d3.axisLeft(y)

// Setup X Axis
const x = d3.scaleLinear()
    .domain(offsetDomain(d3.extent(historicalData, d => d.year), 2))
    .range([0, historyDimensions.width])


function prepareSingleHousehold() {
  y.domain([0.5, 0]).range([0, historyDimensions.height]);
  yAxis.tickFormat(d3.format('.0%'))
  historyChart.select('.axis.y').transition().call(yAxis)

  redrawPoints(d => d.singleHouseholdPercentage)
}

function prepareAverageHouseholdSize() {
  y.domain([4, 0]).range([0, historyDimensions.height]);
  yAxis.tickFormat(d3.format('.111'))
  historyChart.select('.axis.y').transition().call(yAxis)


  redrawPoints(d => d.averageHouseholdSize)
}

function prepareInitialChart() {
  historyChart.append("path")
      .datum(historicalData)
      .attr("class", "history-line")
      .attr("fill", 'none')

  historyChart.selectAll(".history-point").data(historicalData).enter()
      .append("circle")
      .attr('class', 'history-point')
      .attr("cx", d => x(d.year))
      .attr("r", 8);
}


function redrawPoints(dataFn: (d: HistoricalPoint) => number) {
  historyChart.selectAll(".history-point")
      .data(historicalData)
      .transition()
      .attr("cy", d => y(dataFn(d)))

  let isLineVisible = !!historyChart.select(".history-line").attr('d')

  historyChart.select(".history-line")
      .transition()
      .delay(isLineVisible ? 0 : 500)
      .attr("stroke-width", 2)
      .attr("d", d3.line()
          .x(d => x(d.year))
          .y(d => y(dataFn(d)))
      )
}


let historyChart = d3.select('#wrapper')
    .append('svg')
    .attr('id', 'history-chart')
    .attr('height', historyDimensions.height + margins.top + margins.bottom)
    .attr('width', historyDimensions.width + margins.right + margins.left)
    .append("g")
    .attr("transform",
        "translate(" + margins.left + "," + margins.top + ")");

function drawHistory() {

  const bottomLineOffset = 10;

  // Add horizontal grid lines
  historyChart
      .append("g")
      .attr("class", "grid-lines")
      .attr("transform", `translate(0, ${historyDimensions.height + bottomLineOffset})`)

  d3.select('.grid-lines').transition().delay(500).duration(500).on('start', () => {
    d3.select('.grid-lines').select('.domain').remove()
  }).call(d3.axisBottom(x)
      .ticks(3)
      .tickSize(-historyDimensions.height - bottomLineOffset)
      .tickValues(historicalData.map(d => d.year))
      .tickFormat('')
  )

  // Add bottom axis
  historyChart
      .append("g")
      .attr("class", "axis x")
      .attr("transform", `translate(0, ${historyDimensions.height + bottomLineOffset})`)


  d3.select('.axis.x').transition().call(d3.axisBottom(x)
      .ticks(3)
      .tickValues(historicalData.map(d => d.year))
      .tickFormat(d3.format(''))
  )

  // Add left axis
  historyChart
      .append("g")
      .attr("class", "axis y")
      .attr("transform", `translate(-10,0)`)
  prepareInitialChart()
  prepareSingleHousehold()

}


drawHistory()

document.getElementById('single-household-button').onclick = prepareSingleHousehold
document.getElementById('average-size-button').onclick = prepareAverageHouseholdSize
