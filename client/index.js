// Set the dimensions and margins for the graphs
const margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = 650 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// Create scales for the bar chart
let x = d3.scaleBand().range([0, width]).padding(0.1);
let y = d3.scaleLinear().range([height, 0]);

// Create the bar chart container
const barchart = d3
  .select("#barchart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Fetch data for the bar chart
fetch("http://localhost:3000/wetterdaten/niederschlag")
  .then((response) => response.json())
  .then((json) => {
    const data = [];
    const monthlyRain = {};

    for (let key in json) {
      const month = key.slice(4, 6);
      const rain = parseFloat(json[key].MO_RR);
      if (!monthlyRain[month]) monthlyRain[month] = { total: 0, count: 0 };
      if (rain !== -999) {
        monthlyRain[month].total += rain;
        monthlyRain[month].count += 1;
      }
    }

    for (let month in monthlyRain) {
      const avgRain = monthlyRain[month].total / monthlyRain[month].count;
      data.push({ month, rain: avgRain });
    }

    // Sort data by month
    const monthOrder = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    data.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    // Map month number to names
    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    data.forEach(d => d.month = monthNames[parseInt(d.month) - 1]);

    return data;
  })
  .then((data) => {
    // Scale the range of the data in the domains
    x.domain(data.map(d => d.month));
    y.domain([0, d3.max(data, d => d.rain)]);

    // Append the rectangles for the bar chart
    barchart.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.month))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.rain))
      .attr("height", d => height - y(d.rain));

    // Add the x axis with labels
    barchart.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the y axis with labels
    barchart.append("g")
      .call(d3.axisLeft(y));

    // Identify the summer month with the least rain
    const summerMonths = data.filter(d => ["Juni", "Juli", "August", "September"].includes(d.month));
    const minRainMonth = summerMonths.reduce((min, d) => d.rain < min.rain ? d : min, summerMonths[0]);

    return minRainMonth.month;
  })
  .then((minRainMonth) => {
    fetch("http://localhost:3000/wetterdaten/temperatur")
      .then(response => response.json())
      .then((json) => {
        const monthIndex = {
          "Juni": "06",
          "Juli": "07",
          "August": "08",
          "September": "09"
        }[minRainMonth];

        const temperatureAccum = {};
        for (let key in json) {
          if (key.slice(4, 6) === monthIndex && key.slice(8, 10) === "18") {
            const day = key.slice(6, 8);
            const temp = parseFloat(json[key].TT_TER);
            if (!temperatureAccum[day]) temperatureAccum[day] = { total: 0, count: 0 };
            temperatureAccum[day].total += temp;
            temperatureAccum[day].count += 1;
          }
        };

        const temperatureData = Object.keys(temperatureAccum).map(day => {
          return { day: parseInt(day), temperature: temperatureAccum[day].total / temperatureAccum[day].count };
        });

        return temperatureData;
      })
      .then(data => {
        // Sort the tata by day
        data.sort((a, b) => a.day - b.day);

        const linechart = d3
          .select("#linechart")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const xLine = d3
          .scaleLinear()
          .domain([1, d3.max(data, (d) => d.day)])
          .range([0, width]);

        const yLine = d3
          .scaleLinear()
          .domain([d3.min(data, d => d.temperature), d3.max(data, (d) => d.temperature)])
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
          .x((d) => xLine(d.day))
          .y((d) => yLine(d.temperature));

        // Add the line path
        linechart
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2)
          .attr("d", line);
      });
  });
