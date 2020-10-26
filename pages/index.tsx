import Head from "next/head";
import Layout from "../components/Layout";
import * as d3 from "d3";
import { useEffect } from "react";
import { axisBottom, axisLeft } from "d3";

export default function Home() {
  useEffect(() => {
    const width = 1000;
    const height = 400;
    const margin = { top: 50, right: 70, left: 110, bottom: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const chart = d3.select(".chart");
    const svg = chart.append("svg");
    svg.attr("width", width).attr("height", height).style("margin", "auto");

    d3.csv("data.csv").then((data) => {
      data.map((d: { population: any }) => {
        d.population = parseFloat(d.population) * 1000;
      });

      const maxP = d3.max(data, (d) => d.population);

      // We need x value as number for bar chart
      // because with that value
      // we can configure how far will go on x coordinate distance
      const xScale = d3
        .scaleLinear()
        // more like first index is first domain(x), and first range(y)
        // which is like (x, y) = (0, 0) and also last index of both will like this
        .domain([0, parseFloat(maxP)])
        .range([0, innerWidth]);

      // We need ycale value for seperating how far will go up or down
      // we can also set height of the svg
      // look closely, we used xvalue for only length of rects
      // then we used y value for x attribute and also every single rect height
      const yScale = d3
        .scaleBand()
        .domain(data.map((d) => d.country))
        .range([0, innerHeight])
        .padding(0.1);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const xAxisTickFormat = (number) =>
        d3.format(".3s")(number).replace("G", "B");
      const xAxisLeft = axisLeft(yScale);
      const xAxisBottom = axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight);

      g.append("g").call(xAxisLeft).selectAll(".domain, .tick line").remove();
      const xAxisBG = g
        .append("g")
        .call(xAxisBottom)
        .attr("transform", `translate(0, ${innerHeight})`);

      xAxisBG.select(".domain").remove();

      xAxisBG
        .append("text")
        .attr("fill", "black")
        .text("Population")
        .attr("class", "popHead")
        .attr("x", innerWidth / 2)
        .attr("y", 60);

      g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", (d) => yScale(d.country))
        .attr("width", (d) => xScale(parseFloat(d.population)))
        .attr("height", yScale.bandwidth())
        .style("fill", "salmon");

      g.append("text")
        .attr("y", -20)
        .attr("x", 110)
        .attr("class", "headline")
        .text("Top Most Popular Countries");
    });
  }, []);
  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <div className="m-8">
          <h1
            id="title"
            className="text-center border-b-2 border-gray-200 pb-5"
          >
            D3 Bar Chart
          </h1>
          <div className="chart"></div>
        </div>
      </main>

      <footer className="border-t-2 border-gray-200">
        <h4 className="text-center">Muhammad Mejanul Haque</h4>
      </footer>
    </Layout>
  );
}
