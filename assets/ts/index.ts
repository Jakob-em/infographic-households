import * as d3 from 'd3';
import {historicalData, HistoricalPoint} from './data';
import {addLinesFunction} from './utils';

let margins = {top: 10, right: 250, bottom: 85, left: 60};
let historyDimensions = {
  width: 1920 - margins.left - margins.right,
  height: 700 - margins.top - margins.bottom
}

let tooltipDimension = {
  width: 120,
  height: 50
}
let tooltipPadding = {
  x: 0,
  y: 30
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

let singleHousehold = true;

function prepareSingleHousehold() {
  toggleHistoryButtons(true);
  singleHousehold = true

  y.domain([0.6, 0]).range([0, historyDimensions.height]);
  yAxis.tickFormat(d3.format('.0%'))
  historyChart.select('.axis.y').transition().call(yAxis)

  redrawPoints(d => d.singleHouseholdPercentage)
}

function toggleHistoryButtons(isSingleHousehold: boolean) {
  d3.select('#average-size-button').classed('active', !isSingleHousehold)
  d3.select('#single-household-button').classed('active', isSingleHousehold)
}

function prepareAverageHouseholdSize() {
  toggleHistoryButtons(false);
  singleHousehold = false
  y.domain([5, 0]).range([0, historyDimensions.height]);
  yAxis.tickFormat(d3.format('.111'))
  historyChart.select('.axis.y').transition().call(yAxis)

  redrawPoints(d => d.averageHouseholdSize)
}

function prepareInitialChart() {
  historyChart.append('path')
      .datum(historicalData)
      .attr('class', 'history-line')
      .attr('fill', 'none')

  historyChart.selectAll('.history-point').data(historicalData)
      .enter().append('circle')
      .attr('class', 'history-point')
      .attr('cx', d => x(d.year))
      .attr('r', 0)
}


function buildConnectionPath(position: { x: any; y: any }) {
  const connectionPath = d3.path();
  connectionPath.moveTo(position.x, position.y)
  connectionPath.lineTo(position.x + 100, position.y)
  connectionPath.lineTo(position.x + 100, 0)
  connectionPath.lineTo(position.x + 500, 0)
  return connectionPath;
}


function redrawPoints(dataFn: (d: HistoricalPoint) => number) {
  function drawTooltip(e, d) {
    const xPos = x(d.year) - tooltipDimension.width / 2
    const yPos = y(dataFn(d)) - tooltipDimension.height - tooltipPadding.y

    let tooltip = d3.select('.tooltip')
    tooltip.transition()
        .style('opacity', 1)
    tooltip
        .attr('transform', `translate(${xPos}, ${yPos})`)
    tooltip.select('text').remove()

    const dataLabel = (singleHousehold ? dataFn(d) * 100 : dataFn(d)) + (singleHousehold ? '%' : '')
    tooltip
        .append('text')
        .attr('y', tooltipDimension.height / 2)
        .attr('x', tooltipDimension.width / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .html(`${d.year}: <tspan> ${dataLabel}</tspan>`)

  }

  const radius = d3.scaleLinear().domain([0, d3.extent(historicalData, dataFn)[1]]).range([0, 25]);
  historyChart.selectAll('.history-point')
      .data(historicalData)
      .transition()
      .attr('cy', d => y(dataFn(d)))
      .attr('r', d => radius(dataFn(d)))

  historyChart.selectAll('.history-point')
      .on('mouseover', drawTooltip)
      .on('mouseout', function () {

        d3.select('.tooltip').transition()
            .duration(300)
            .style('opacity', 0);
      });


  const lastPoint = historicalData[historicalData.length - 1]
  const position = {x: x(lastPoint.year), y: y(dataFn(lastPoint))}

  const connectionPath = buildConnectionPath(position);

  let isLineVisible = !!historyChart.select('.history-line').attr('d')

  let delay = isLineVisible ? 0 : 500;

  historyChart.selectAll('.connection-line')
      .transition()
      .attr('d', connectionPath)
      .delay(delay)
      .style('opacity', '1')

  historyChart.select('.history-line')
      .transition()
      .delay(delay)
      .attr('d', d3.line()
          .x(d => x(d.year))
          .y(d => y(dataFn(d)))
      )

  const averageDiff = (i) => (dataFn(historicalData[i + 1]) - dataFn(historicalData[i])) / (historicalData[i + 1].year - historicalData[i].year)
  const firstDataLabel = singleHousehold ? (averageDiff(0) * 100).toFixed(2) + '%' : averageDiff(0).toFixed(2)
  const secondDataLabel = singleHousehold ? (averageDiff(1) * 100).toFixed(2) + '%' : averageDiff(1).toFixed(2)

  drawConnectionLabel(0, dataFn, false, 'first-half', 10, 70, 270,
      'Durchschnittliche Änderung\npro Jahr: ' + firstDataLabel)
  drawConnectionLabel(1, dataFn, false, 'second-half', 10, 70, 270,
      'Durchschnittliche Änderung\npro Jahr: ' + secondDataLabel)

  drawConnectionLabel(1, dataFn, true, 'detailed', 50, 135, 420,
      `Von 1999 bis 2019 stieg die Gesamtanzahl der
Haushalte um 18%. Wobei die Anzahl der
Singlehaushalte um 41% stieg. Gleichzeitig
fiel die Anzahl der Haushalte mit 5 oder
mehr Personen um mehr als 19%.
`)

}

function drawConnectionLabel(fromPointIndex: number, dataFn, above: boolean, className: string, zoomSize: number, height: number, width: number, text: string) {
  const fromPoint = historicalData[fromPointIndex]
  const toPoint = historicalData[fromPointIndex + 1]
  const lineMarkerX = x(fromPoint.year) + (x(toPoint.year) - x(fromPoint.year)) / 2;
  const lineMarkerY = y(dataFn(fromPoint)) + (y(dataFn(toPoint)) - y(dataFn(fromPoint))) / 2;

  const upperHalf = (lineMarkerY > historyDimensions.height / 2)
  const markerAbove = (upperHalf && above) || (!upperHalf && !above)

  const classSelector = '.' + className;

  const labelHeight = height
  const labelWidth = width

  if (historyChart.select(classSelector).empty()) {
    historyChart.append('circle')
        .classed('history-zoom', true)
        .classed(className, true)
        .attr('cx', lineMarkerX)
        .attr('r', zoomSize)

    historyChart
        .append('path')
        .classed('highlight-line', true)
        .classed(className, true)

    historyChart.append('rect')
        .classed('highlight-text-background', true)
        .classed(className, true)
        .attr('width', labelWidth)
        .attr('height', labelHeight)
        .each(rounded)
    historyChart.append('text')
        .classed('highlight-text', true)
        .classed(className, true)
  }

  historyChart.select(classSelector + '.highlight-text')
      .datum({label: text, posX: lineMarkerX - labelWidth})
      .each(addLinesFunction('left', '1.2em'))

  historyChart.select(classSelector + '.history-zoom')
      .transition()
      .attr('cy', lineMarkerY)

  const withDirection = (i) => (markerAbove ? -i : i)

  const verticalOffset = withDirection(labelHeight + 20) + (markerAbove ? -labelHeight : 0)

  historyChart.select(classSelector + '.highlight-text-background')
      .transition()
      .attr('x', lineMarkerX - labelWidth - 20)
      .attr('y', lineMarkerY + verticalOffset)

  historyChart
      .select(classSelector + '.highlight-text')
      .transition()
      .attr('y', lineMarkerY + verticalOffset + 30)

  const line = d3.path();
  line.moveTo(lineMarkerX, lineMarkerY + (markerAbove ? -zoomSize : zoomSize))
  line.lineTo(lineMarkerX, lineMarkerY + verticalOffset + labelHeight / 2)
  line.lineTo(lineMarkerX - 20, lineMarkerY + verticalOffset + labelHeight / 2)

  historyChart
      .select(classSelector + '.highlight-line')
      .transition()
      .attr('d', line)


}

let historyChart = d3.select('#history-chart')
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${historyDimensions.width + margins.right + margins.left} ${historyDimensions.height + margins.top + margins.bottom}`)
    .append('g')
    .attr('transform',
        'translate(' + margins.left + ',' + margins.top + ')')

function rounded() {
  d3.select(this)
      .attr('rx', 10)
      .attr('ry', 10)
}

function drawHistory() {

  const bottomLineOffset = 10;

  // Add horizontal grid lines
  historyChart
      .append('g')
      .attr('class', 'grid-lines')
      .attr('transform', `translate(0, ${historyDimensions.height + bottomLineOffset})`)

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
      .append('g')
      .attr('class', 'axis x')
      .attr('transform', `translate(0, ${historyDimensions.height + bottomLineOffset})`)


  d3.select('.axis.x').transition().call(d3.axisBottom(x)
      .ticks(3)
      .tickValues(historicalData.map(d => d.year))
      .tickFormat(d3.format(''))
  )

  // Add left axis
  historyChart
      .append('g')
      .attr('class', 'axis y')
      .attr('transform', `translate(-10,0)`)

  // Add label for x axis
  historyChart
      .append('text')
      .text('Jahr der Zählung')
      .attr('text-anchor', 'end')
      .attr('class', 'label x')
      .attr('x', historyDimensions.width)
      .attr('y', historyDimensions.height + margins.bottom - 20)

  // Add connection to detail chart
  historyChart
      .append('path')
      .classed('connection-line', true)
      .style('opacity', '0');


  prepareInitialChart()
  prepareSingleHousehold()

  // Add tooltip
  historyChart
      .append('g')
      .classed('tooltip', true)
      .append('rect')
      .attr('width', tooltipDimension.width)
      .attr('height', tooltipDimension.height)
      .each(rounded)


}


drawHistory()

document.getElementById('single-household-button').onclick = prepareSingleHousehold
document.getElementById('average-size-button').onclick = prepareAverageHouseholdSize
