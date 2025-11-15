// Global variables
let breathTestData = [];
let finesAgeData = [];
let finesStatesData = [];
let currentYear = 'all';
const tooltip = d3.select("#tooltip");

// Color schemes
const colors = {
    fines: "#667eea",
    charges: "#f6ad55",
    arrests: "#fc8181"
};

// Load all CSV files
async function loadData() {
    try {
        // Load all three CSV files
        breathTestData = await d3.csv("data/breath_test.csv", d => {
            // Handle different possible column names
            return {
                YEAR: +d.YEAR || +d.Year || +d.year,
                STATE: d.STATE || d.State || d.state,
                TOTAL_FINES: +(d.TOTAL_FINES || d["TOTAL FINES"] || d["Total Fines"] || 0),
                TOTAL_CHARGES: +(d.TOTAL_CHARGES || d["TOTAL CHARGES"] || d["Total Charges"] || 0),
                TOTAL_ARRESTS: +(d.TOTAL_ARRESTS || d["TOTAL ARRESTS"] || d["Total Arrests"] || 0)
            };
        });

        finesAgeData = await d3.csv("data/fines_age.csv", d => {
            // Handle different possible column names
            return {
                AGE_GROUP: d.AGE_GROUP || d["Age Group"] || d.age_group,
                TOTAL_FINES: +(d.TOTAL_FINES || d["TOTAL FINES"] || d["Total Fines"] || 0)
            };
        });

        finesStatesData = await d3.csv("data/fines_states.csv", d => {
            // Handle different possible column names
            return {
                STATE: d.STATE || d.State || d.state,
                TOTAL_FINES: +(d.TOTAL_FINES || d["TOTAL FINES"] || d["Total Fines"] || 0)
            };
        });

        console.log("Data loaded successfully!");
        console.log("Breath Test Data:", breathTestData);
        console.log("Breath Test Count:", breathTestData.length);
        console.log("Fines Age Data:", finesAgeData);
        console.log("Fines Age Count:", finesAgeData.length);
        console.log("Fines States Data:", finesStatesData);
        console.log("Fines States Count:", finesStatesData.length);

        // Check if data is actually loaded
        if (breathTestData.length === 0) {
            console.error("breath_test.csv has no data!");
        }
        if (finesAgeData.length === 0) {
            console.error("fines_age.csv has no data!");
        }
        if (finesStatesData.length === 0) {
            console.error("fines_states.csv has no data!");
        }

        // Initialize visualizations after data is loaded
        init();
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Error loading CSV files. Please check the file paths and console for details.");
    }
}

// Initialize all visualizations
function init() {
    createMapVisualization();
    createBreathTestChart();
    createAgeChart();
}

// Year filter function
function filterYear(year) {
    currentYear = year;
    
    // Update button states
    d3.selectAll('.btn').classed('active', false);
    d3.select(`#btn-${year}`).classed('active', true);
    
    // Update visualizations
    createBreathTestChart();
}

// 1. MAP VISUALIZATION
function createMapVisualization() {
    const margin = {top: 20, right: 20, bottom: 20, left: 20};
    const width = 1200 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    d3.select("#map-viz").html("");
    
    const svg = d3.select("#map-viz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // State positions (simplified map layout)
    const statePositions = {
        "WA": {x: 100, y: 150, width: 180, height: 180},
        "NT": {x: 300, y: 80, width: 150, height: 120},
        "QLD": {x: 470, y: 80, width: 200, height: 200},
        "SA": {x: 320, y: 220, width: 140, height: 140},
        "NSW": {x: 550, y: 220, width: 140, height: 140},
        "VIC": {x: 480, y: 300, width: 120, height: 80},
        "TAS": {x: 550, y: 350, width: 60, height: 50},
        "ACT": {x: 620, y: 280, width: 40, height: 40}
    };
    
    const maxFines = d3.max(finesStatesData, d => d.TOTAL_FINES);
    const colorScale = d3.scaleSequential()
        .domain([0, maxFines])
        .interpolator(d3.interpolateBlues);
    
    // Draw states
    const states = svg.selectAll(".state")
        .data(finesStatesData)
        .enter()
        .append("g")
        .attr("class", "state");
    
    states.append("rect")
        .attr("class", "state-rect")
        .attr("x", d => statePositions[d.STATE].x)
        .attr("y", d => statePositions[d.STATE].y)
        .attr("width", d => statePositions[d.STATE].width)
        .attr("height", d => statePositions[d.STATE].height)
        .attr("fill", d => colorScale(d.TOTAL_FINES))
        .on("mouseover", function(event, d) {
            tooltip
                .style("opacity", 1)
                .html(`<strong>${d.STATE}</strong><br/>Total Fines: ${d.TOTAL_FINES.toLocaleString()}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });
    
    states.append("text")
        .attr("class", "state-label")
        .attr("x", d => statePositions[d.STATE].x + statePositions[d.STATE].width / 2)
        .attr("y", d => statePositions[d.STATE].y + statePositions[d.STATE].height / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(d => d.STATE);
    
    // Color legend
    const legendWidth = 300;
    const legendHeight = 20;
    
    const legendScale = d3.scaleLinear()
        .domain([0, maxFines])
        .range([0, legendWidth]);
    
    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d => (d/1000000).toFixed(1) + "M");
    
    const legend = svg.append("g")
        .attr("transform", `translate(${width - legendWidth - 50},${height - 40})`);
    
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "legend-gradient");
    
    gradient.selectAll("stop")
        .data(d3.range(0, 1.1, 0.1))
        .enter()
        .append("stop")
        .attr("offset", d => (d * 100) + "%")
        .attr("stop-color", d => colorScale(d * maxFines));
    
    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)")
        .style("stroke", "#333")
        .style("stroke-width", 1);
    
    legend.append("g")
        .attr("transform", `translate(0,${legendHeight})`)
        .call(legendAxis);
}

// 2. BREATH TEST BAR CHART
function createBreathTestChart() {
    const margin = {top: 20, right: 20, bottom: 80, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    d3.select("#breath-test-viz").html("");
    
    // Filter data by year
    let filteredData = breathTestData;
    if (currentYear !== 'all') {
        filteredData = breathTestData.filter(d => d.YEAR == currentYear);
    }
    
    // Aggregate by state
    const aggregated = d3.rollup(
        filteredData,
        v => ({
            fines: d3.sum(v, d => d.TOTAL_FINES),
            charges: d3.sum(v, d => d.TOTAL_CHARGES),
            arrests: d3.sum(v, d => d.TOTAL_ARRESTS)
        }),
        d => d.STATE
    );
    
    const data = Array.from(aggregated, ([state, values]) => ({
        state,
        ...values
    }));
    
    const svg = d3.select("#breath-test-viz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Scales
    const x0 = d3.scaleBand()
        .domain(data.map(d => d.state))
        .range([0, width])
        .padding(0.2);
    
    const x1 = d3.scaleBand()
        .domain(['fines', 'charges', 'arrests'])
        .range([0, x0.bandwidth()])
        .padding(0.05);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.fines, d.charges, d.arrests))])
        .nice()
        .range([height, 0]);
    
    // Axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).tickFormat(d => d.toLocaleString()));
    
    // Y-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Count");
    
    // Bars
    const stateGroups = svg.selectAll(".state-group")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "state-group")
        .attr("transform", d => `translate(${x0(d.state)},0)`);
    
    const categories = ['fines', 'charges', 'arrests'];
    const categoryColors = [colors.fines, colors.charges, colors.arrests];
    
    categories.forEach((category, i) => {
        stateGroups.append("rect")
            .attr("class", "bar")
            .attr("x", x1(category))
            .attr("width", x1.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .attr("fill", categoryColors[i])
            .on("mouseover", function(event, d) {
                tooltip
                    .style("opacity", 1)
                    .html(`<strong>${d.state}</strong><br/>${category.charAt(0).toUpperCase() + category.slice(1)}: ${d[category].toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
            })
            .transition()
            .duration(800)
            .attr("y", d => y(d[category]))
            .attr("height", d => height - y(d[category]));
    });
    
    // Legend
    const legend = d3.select("#breath-legend");
    legend.html("");
    
    const legendData = [
        {label: "Fines", color: colors.fines},
        {label: "Charges", color: colors.charges},
        {label: "Arrests", color: colors.arrests}
    ];
    
    legendData.forEach(item => {
        const legendItem = legend.append("div")
            .attr("class", "legend-item");
        
        legendItem.append("div")
            .attr("class", "legend-color")
            .style("background-color", item.color);
        
        legendItem.append("span")
            .text(item.label);
    });
}

// 3. AGE GROUP CHART
function createAgeChart() {
    const margin = {top: 20, right: 20, bottom: 60, left: 150};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    d3.select("#age-viz").html("");
    
    const svg = d3.select("#age-viz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Sort data by total fines
    const sortedData = [...finesAgeData].sort((a, b) => b.TOTAL_FINES - a.TOTAL_FINES);
    
    // Scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.TOTAL_FINES)])
        .nice()
        .range([0, width]);
    
    const y = d3.scaleBand()
        .domain(sortedData.map(d => d.AGE_GROUP))
        .range([0, height])
        .padding(0.2);
    
    const colorScale = d3.scaleOrdinal()
        .domain(sortedData.map(d => d.AGE_GROUP))
        .range(["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b", "#fa709a"]);
    
    // Axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => (d/1000000).toFixed(1) + "M"));
    
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    
    // X-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Total Fines (Millions)");
    
    // Bars
    svg.selectAll(".bar")
        .data(sortedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y(d.AGE_GROUP))
        .attr("width", 0)
        .attr("height", y.bandwidth())
        .attr("fill", d => colorScale(d.AGE_GROUP))
        .on("mouseover", function(event, d) {
            const percentage = ((d.TOTAL_FINES / d3.sum(finesAgeData, d => d.TOTAL_FINES)) * 100).toFixed(1);
            tooltip
                .style("opacity", 1)
                .html(`<strong>${d.AGE_GROUP}</strong><br/>Fines: ${d.TOTAL_FINES.toLocaleString()}<br/>Percentage: ${percentage}%`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr("width", d => x(d.TOTAL_FINES));
}

// Load data and initialize when page loads
window.onload = loadData;