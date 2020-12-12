import * as d3 from 'd3';
import { byAge, byCitySize, PercentagePoint } from './data';


let margins = {top: 0, right: 10, bottom: 0, left: 0};
let detailDimensions = {
  width: 300 - margins.left - margins.right,
  height: 180 - margins.top - margins.bottom
}

const spacingVertical = 14
const spacingHorizontal = 13

const personIcon = `<g>
 <ellipse cx="148.5" cy="34.611" rx="34.458" ry="34.611"/>
 <path d="M222.403,176.902l-8.645-60.51C210.586,95.554,192.096,78.6,172.541,78.6h-3.001c-6.37,3.078-13.508,4.806-21.04,4.806
 c-7.532,0-14.669-1.728-21.04-4.806h-2.998c-19.557,0-38.048,16.954-41.228,37.844l-8.638,60.459
 c-0.313,2.191,0.699,4.359,2.581,5.525l24.769,15.343l11.543,80.929C114.831,288.96,123.491,297,133.205,297h30.589
 c9.714,0,18.375-8.04,19.708-18.237l11.55-80.992l24.77-15.344C221.703,181.262,222.717,179.094,222.403,176.902z"/>
</g>`

let detailChart = d3.select('#detail-chart')
    .attr("preserveAspectRatio", 'xMaxYMax meet')
    .attr("viewBox", `0 0 ${detailDimensions.width + margins.right + margins.left} ${detailDimensions.height + margins.top + margins.bottom}`)
    .append("g")
    .attr("transform",
        "translate(" + margins.left + "," + margins.top + ")")


const perColumn = 5

function showByAge() {
  toggleDetailButtons(true)
  detailChart.selectAll(".label")
      .data(buildLabels(byAge, 'horizontal'))
      .enter()
      .append("text")
      .classed("label", true)
      .attr('y', (perColumn + 0.5) * spacingVertical)
      .attr("text-anchor", "middle")

  detailChart.selectAll(".data-point")
      .data(createMappedData(byAge))
      .enter()
      .append('g')
      .attr('transform', horizontalPositionAndScale)
      .attr("class", d => d)
      .classed('data-point', true)
      .html(personIcon)
      .attr("fill-opacity", 0)

  detailChart.selectAll(".data-point")
      .data(createMappedData(byAge))
      .transition()
      .attr("fill-opacity", 1)
      .attr('transform', horizontalPositionAndScale)
      .attr("class", d => d.class + ' data-point')

  detailChart.selectAll(".label")
      .data(buildLabels(byAge, 'horizontal'))
      .transition()
      .attr('x', (d) => d.posX)
      .attr('y', (perColumn + 0.5) * spacingVertical)
      .attr("class", d => d.class + ' label')
      .each(addLines)
}
function horizontalPositionAndScale(d, i){
  return `translate(${(Math.floor(i / perColumn) * spacingHorizontal)}, ${((i % perColumn) * spacingVertical)}) scale(0.04, 0.042)`
}

function barPositionAndScale(d){
  return `translate(${(d.indexInGroup % perColumn) * spacingHorizontal + d.index * spacingHorizontal * (perColumn + 1)}, ${150 - Math.floor(d.indexInGroup / perColumn) * spacingVertical}) scale(0.04, 0.042)`
}

function showByPopulation() {
  toggleDetailButtons(false)

  detailChart.selectAll(".data-point")
      .data(createMappedData(byCitySize))
      .exit()
      .transition()
      .duration(100)
      .attr("fill-opacity", 0)
      .transition()
      .delay(200)
      .remove()

  detailChart.selectAll(".data-point")
      .data(createMappedData(byCitySize))
      .transition()
      .attr('transform', barPositionAndScale)
      .attr("class", d => d.class + ' data-point')

  detailChart.selectAll(".label")
      .data(buildLabels(byCitySize, 'vertical'))
      .transition()
      .attr("class", d => d.class + ' label')
      .attr('x', (d) => d.posX)
      .attr('y', 175)
      .each(addLines)

  detailChart.selectAll(".label")
      .data(buildLabels(byCitySize, 'vertical')).exit().remove()
}

function addLines(d) {
  let lines = d3.select(this).selectAll('tspan')
      .data(d.label.split("\n").map((d, i) => ({label: d, index: i})))

  let fillLabelDetails = function () {
    d3.select(this).transition()
        .attr('dy', (l) => l.index == 0 ? "0em" : "1em")
        .text((l) => l.label)
        .attr('x', d.posX)
  }

  lines.enter()
      .append("tspan")
      .attr("text-anchor", "middle")
      .each(fillLabelDetails)
  lines.exit().remove()
  lines.each(fillLabelDetails)
}


function createMappedData(data: PercentagePoint[]) {
  return data.map((value, index) =>
      Array.apply(null, Array(value.percentage)).map((d, indexInGroup) => ({class: value.class, index, indexInGroup})))
      .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
}

function buildLabels(data: PercentagePoint[], direction: 'horizontal' | 'vertical') {
  let sum = 0
  return data.map((value, index) => {
    let center = sum + value.percentage / 2
    sum += value.percentage;
    let posX;
    if (direction == 'horizontal') {
      posX = (center / 100) * 20 * spacingHorizontal - spacingHorizontal / 2
    } else {
      posX = (0.5) * (perColumn) * spacingHorizontal + index*(perColumn+1) * spacingHorizontal
    }
    return {
      label: value.label,
      class: value.class,
      posX
    }
  });
}

showByAge()

function toggleDetailButtons(isByAge: boolean) {
  d3.select('#by-population-button').classed('active', !isByAge)
  d3.select('#by-age-button').classed('active', isByAge)
}

document.getElementById('by-age-button').onclick = () => showByAge()
document.getElementById('by-population-button').onclick = () => showByPopulation()

