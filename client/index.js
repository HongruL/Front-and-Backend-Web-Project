// set the dimensions and margins for the graphs
const margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = 650 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// Hier folgt der fast fertig implementierte Code für die Erstellung des Balkendiagramms
let x = d3.scaleBand().range([0, width]).padding(0.1);
let y = d3.scaleLinear().range([height, 0]);

const barchart = d3
  .select("#barchart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

fetch("https://wetter-api.funkhaus-franken.de/niederschlag_monat.json")
  .then((response) => response.json())
  .then((json) => {
    // TODO: Hier müssen die Daten von der API, welche in der json-Variable liegen, weiterverarbeitet werden
    console.log(json);

    // TODO: Statt der folgenden Beispiel-Daten sollen die tatsächlichen Daten vom Server im return übergeben werden. Achtung: Das Format muss identisch sein!
    const exampleData = [
      { month: "Januar", rain: 45.3 },
      { month: "Februar", rain: 25.3 },
      { month: "März", rain: 0.5 },
      { month: "April", rain: 12.9 },
      { month: "Mai", rain: 54.3 },
      { month: "Juni", rain: 44.5 },
      { month: "Juli", rain: 34.4 },
      { month: "August", rain: 13.3 },
      { month: "September", rain: 41.5 },
      { month: "Oktober", rain: 77.1 },
      { month: "November", rain: 22.3 },
      { month: "Dezember", rain: 43.9 },
    ];

    return exampleData;
  })
  .then((data) => {
    // scale the range of the data in the domains
    x.domain(
      data.map(function (d) {
        return d.month;
      })
    );
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.rain;
      }),
    ]);

    // append the rectangles for the bar chart
    barchart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.month);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.rain);
      })
      .attr("height", function (d) {
        return height - y(d.rain);
      });

    // add the x axis with labels
    barchart
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y axis with labels
    barchart.append("g").call(d3.axisLeft(y));
  });

// TODO: Hier soll nun der Code für die Erstellung des Liniendiagramms folgen. Aktuell ist nur ein Beispiel-Diagramm implementiert, das als Ausgangspunkt dienen soll.
// Data
const data = [
  { x: 1, y: 10 },
  { x: 2, y: 20 },
  { x: 3, y: 15 },
  { x: 4, y: 25 },
  { x: 5, y: 30 },
];

// Append the SVG object to the div called 'chart'
const linechart = d3
  .select("#linechart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales
const xLine = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.x)])
  .range([0, width]);

const yLine = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.y)])
  .range([height, 0]);

// Add the X Axis
linechart
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xLine));

// Add the Y Axis
linechart.append("g").call(d3.axisLeft(yLine));

// Create the line generator
const line = d3
  .line()
  .x((d) => xLine(d.x))
  .y((d) => yLine(d.y));

// Add the line path
linechart
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", line);
