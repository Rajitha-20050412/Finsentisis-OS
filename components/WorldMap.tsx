import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

interface WorldMapProps {
  data: { id: string; value: number; risk: string }[];
}

const WorldMap: React.FC<WorldMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, content: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 500;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();

    const projection = d3.geoMercator()
      .scale(width / 6.5)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(["Critical", "High", "Medium", "Low"])
      .range(["#ef4444", "#f97316", "#eab308", "#22c55e"]); // Red, Orange, Yellow, Green

    // Loading world topology
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((worldData: any) => {
      const countries = feature(worldData, worldData.objects.countries);

      const g = svg.append("g");

      g.selectAll("path")
        // @ts-ignore
        .data(countries.features)
        .enter().append("path")
        .attr("d", path as any)
        .attr("fill", (d: any) => {
          // Mapping ISO numeric to Alpha-3 is tricky without a library, 
          // simulating random/mock mapping based on properties or ID for visual demo
          // In real app, we use strict ISO mapping.
          
          // Simple mock logic for demo visualization
          const countryName = d.properties.name;
          const countryRisk = data.find(item => {
              if (item.id === "USA" && countryName === "United States of America") return true;
              if (item.id === "IND" && countryName === "India") return true;
              if (item.id === "CHN" && countryName === "China") return true;
              if (item.id === "DEU" && countryName === "Germany") return true;
              if (item.id === "BRA" && countryName === "Brazil") return true;
              if (item.id === "ZAF" && countryName === "South Africa") return true;
              return false;
          });

          return countryRisk ? colorScale(countryRisk.risk) : "#1e293b"; // slate-800 for no data
        })
        .attr("stroke", "#0f172a") // slate-900
        .attr("stroke-width", 0.5)
        .style("cursor", "pointer")
        .on("mouseover", (event, d: any) => {
           d3.select(event.currentTarget).attr("opacity", 0.8);
           const countryName = d.properties.name;
           const countryRisk = data.find(item => {
              if (item.id === "USA" && countryName === "United States of America") return true;
              if (item.id === "IND" && countryName === "India") return true;
              if (item.id === "CHN" && countryName === "China") return true;
              if (item.id === "DEU" && countryName === "Germany") return true;
              if (item.id === "BRA" && countryName === "Brazil") return true;
              if (item.id === "ZAF" && countryName === "South Africa") return true;
              return false;
          });
          
          if (countryRisk) {
              setTooltip({
                  x: event.pageX,
                  y: event.pageY,
                  content: `${countryName}: ${countryRisk.risk} Risk`
              });
          }
        })
        .on("mouseout", (event) => {
            d3.select(event.currentTarget).attr("opacity", 1);
            setTooltip(null);
        });
    });

  }, [data]);

  return (
    <div ref={containerRef} className="w-full relative bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg shadow-black/50">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-slate-200 font-semibold mb-1">Global Risk Heatmap</h3>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
           <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Critical</span>
           <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span> High</span>
           <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span> Medium</span>
           <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Low</span>
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-[500px]"></svg>
      {tooltip && (
          <div 
            className="absolute z-50 bg-slate-800 text-white text-xs px-3 py-1.5 rounded shadow-lg border border-slate-700 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ left: tooltip.x - containerRef.current?.getBoundingClientRect().left!, top: tooltip.y - containerRef.current?.getBoundingClientRect().top! - 10 }}
          >
              {tooltip.content}
          </div>
      )}
    </div>
  );
};

export default WorldMap;