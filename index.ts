import * as d3 from 'd3';

let margins = {top: 0, right: 0, bottom: 0, left: 0};

let width = 1920 - margins.left - margins.right;
let height = 500 - margins.top - margins.bottom;

let areaChart = d3.select('body')
    .append('svg')
    .attr('id', 'area-chart')
    .attr('height', height)
    .attr('width', width)

const randomPoint = () => ({x: Math.random() * width, y: Math.random() * height});
const points = [...Array(10)].map(randomPoint);
console.log(points)

areaChart
    .selectAll('dot')
    .data(points)
    .enter().append('circle')
    .attr("r", 3.5)
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y)

const scrollMultiplier = 10;
const maxOffset = (document.body.scrollWidth - window.innerWidth)

window.addEventListener('wheel', (event: WheelEvent) => {
  const delta = event.deltaY*scrollMultiplier;
  const newOffset = Math.max(0, Math.min(maxOffset, pageXOffset + delta))
  window.scrollTo({left: newOffset});
  event.preventDefault()
})
