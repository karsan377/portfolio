import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON("projects.json");
const projectsContainer = document.querySelector(".projects");

if (projectsContainer) {
  renderProjects(projects, projectsContainer, "h2");
}

// Dynamic project count
const projectsTitle = document.querySelector(".projects-title");
if (projectsTitle) {
  projectsTitle.textContent = `${projects.length} Projects`;
}

let query = "";
let selectedYear = null;

const searchInput = document.querySelector(".searchBar");

function getSearchedProjects() {
  if (!query) {
    return projects;
  }
  return projects.filter((p) =>
    Object.values(p).join("\n").toLowerCase().includes(query)
  );
}

function getFinalFilteredProjects() {
  let filtered = getSearchedProjects();
  if (selectedYear) {
    filtered = filtered.filter((p) => p.year == selectedYear);
  }
  return filtered;
}

function renderPieChart(chartData) {
  d3.select("#projects-pie-plot").selectAll("*").remove();
  d3.select(".legend").selectAll("*").remove();

  if (chartData.length === 0) {
    return;
  }

  const rolledData = d3.rollups(
    chartData,
    (v) => v.length,
    (d) => d.year
  );

  const data = rolledData
    .map(([year, count]) => ({ value: count, label: year }))
    .sort((a, b) => b.label - a.label);

  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value((d) => d.value).sort(null);
  const arcData = sliceGenerator(data);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const svg = d3.select("#projects-pie-plot");

  const clickHandler = (clickedYear) => {
    selectedYear = selectedYear === clickedYear ? null : clickedYear;
    renderProjects(getFinalFilteredProjects(), projectsContainer, "h2");
    renderPieChart(getSearchedProjects());
  };

  svg.selectAll("path")
    .data(arcData)
    .join("path")
    .attr("d", arcGenerator)
    .attr("fill", (d, i) => colors(i))
    .attr("class", (d) => (d.data.label == selectedYear ? "selected" : ""))
    .on("click", (event, d) => clickHandler(d.data.label));

  const legend = d3.select(".legend");
  legend.selectAll("li")
    .data(data)
    .join("li")
    .attr("style", (d, i) => `--color:${colors(i)}`)
    .attr("class", (d) => (d.label == selectedYear ? "selected" : ""))
    .html((d) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .on("click", (event, d) => clickHandler(d.label));
}

searchInput.addEventListener("input", (event) => {
  query = event.target.value.toLowerCase();
  selectedYear = null;
  const searchedProjects = getSearchedProjects();
  renderProjects(searchedProjects, projectsContainer, "h2");
  renderPieChart(searchedProjects);
});

renderPieChart(projects);