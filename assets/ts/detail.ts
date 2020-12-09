import * as d3 from 'd3';
import { byAge, byCitySize, PercentagePoint } from './data';


let margins = {top: 10, right: 10, bottom: 10, left: 10};
let detailDimensions = {
  width: 245 - margins.left - margins.right,
  height: 100 - margins.top - margins.bottom
}


let detailChart = d3.select('#detail-chart')
    .attr("preserveAspectRatio", 'xMaxYMax meet')
    .attr("viewBox", `0 0 ${detailDimensions.width + margins.right + margins.left} ${detailDimensions.height + margins.top + margins.bottom}`)
    .append("g")
    .attr("transform",
        "translate(" + margins.left + "," + margins.top + ")")


const perColumn = 5

function showByAge() {
  detailChart.selectAll(".data-point")
      .data(createMappedData(byAge))
      .transition()
      .attr("class", d => d + ' data-point')

  detailChart.selectAll(".label")
      .data(buildLabels(byAge))
      .transition()
      .text(d => d.label)
      .attr('x', (d) => d.posX)

}

function showByPopulation() {
  detailChart.selectAll(".data-point")
      .data(createMappedData(byCitySize))
      .transition()
      .attr("class", d => d + ' data-point')

  detailChart.selectAll(".label")
      .data(buildLabels(byCitySize))
      .transition()
      .text(d => d.label)
      .attr('x', (d) => d.posX)
}


function createMappedData(data: PercentagePoint[]) {
  return data.map(value => Array.apply(null, Array(value.percentage)).map(() => value.class))
      .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
}

function buildLabels(data: PercentagePoint[]) {
  let sum = 0
  return data.map(value => {
    let center = sum + value.percentage / 2
    sum += value.percentage;
    return {
      label: value.label,
      posX: (center / 100) * 20 * 12 - 6
    }
  });
}

detailChart.selectAll(".data-point")
    .data(createMappedData(byAge))
    .enter()
    .append("circle")
    .attr('cx', (d, i) => (Math.floor(i / perColumn) * 12))
    .attr('cy', (d, i) => ((i % perColumn) * 12))
    .attr('r', 5)
    .attr("class", d => d)
    .classed('data-point', true)

detailChart.selectAll(".label")
    .data(buildLabels(byAge))
    .enter()
    .append("text")
    .classed("label", true)
    .text(d => d.label)
    .attr("text-anchor", "middle")
    .attr('x', (d) => d.posX)
    .attr('y', perColumn * 12 + 5)

showByAge()

let isAge = true

document.getElementById('detail-chart').onclick = () => {
  if (isAge) {
    showByPopulation()
  } else {
    showByAge()
  }
  isAge = !isAge
}
