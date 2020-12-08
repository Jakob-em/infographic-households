import * as d3 from 'd3';


let margins = {top: 0, right: 0, bottom: 0, left: 0};
let detailDimensions = {
  width: 300 - margins.left - margins.right,
  height: 300 - margins.top - margins.bottom
}


let detailChart = d3.select('#detail-chart')
    .attr("preserveAspectRatio", 'xMixYMix meet')
    .attr("viewBox", `0 0 ${detailDimensions.width + margins.right + margins.left} ${detailDimensions.height + margins.top + margins.bottom}`)
    .append("g")
    .attr("transform",
        "translate(" + margins.left + "," + margins.top + ")")
