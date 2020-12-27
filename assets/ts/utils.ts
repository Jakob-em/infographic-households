import * as d3 from 'd3';


export function addLinesFunction(textAnchor, lineSpacing = '1em') {

  return function addLines(d) {
    let lines = d3.select(this).selectAll('tspan')
        .data(d.label.split('\n').map((d, i) => ({label: d, index: i})))

    let fillLabelDetails = function () {
      d3.select(this)
          .html((l) => l.label)
          .transition()
          .attr('dy', (l) => l.index == 0 ? '0em' : lineSpacing)
          .attr('x', d.posX)
    }

    lines.enter()
        .append('tspan')
        .attr('text-anchor', textAnchor)
        .each(fillLabelDetails)
    lines.exit().remove()
    lines.each(fillLabelDetails)
  }
}
