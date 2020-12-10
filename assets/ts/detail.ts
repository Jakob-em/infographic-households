import * as d3 from 'd3';
import {byAge, byCitySize, PercentagePoint} from './data';


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
        .attr('x', (d) => d.posX)
        .each(addLines)
}

function showByPopulation() {
    detailChart.selectAll(".data-point")
        .data(createMappedData(byCitySize))
        .transition()
        .attr("class", d => d + ' data-point')

    detailChart.selectAll(".label")
        .data(buildLabels(byCitySize))
        .transition()
        .attr('x', (d) => d.posX)
        .each(addLines)
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
    .attr("text-anchor", "middle")
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
