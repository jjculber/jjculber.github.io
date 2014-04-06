var width = 900;
var height = 500;

var chartdata = [];

function min(a, b) {
   return a<b ? a : b;
}

function max(a, b) {
   return a>b ? a : b;
}

function buildChart(data) {

   var xmargin = 70;
   var ymargin = 20;

   var chart = d3.select("#chart").append("svg:svg").attr("class", "chart")
               .attr("width", width).attr("height", height);
   
   // y axis
   var yl = d3.scale.linear().domain([d3.min(data.map(function(x) {
      return min(x.hash * 150 / Math.pow(2, 32), x.diff);
   })), d3.max(data.map(function(x) {
      return max(x.hash * 150 / Math.pow(2, 32), x.diff);
   }))]).range([height-ymargin, ymargin]);
   // y axis
   var yr = d3.scale.linear().domain([d3.min(data.map(function(x) {
      return min(x.hash, (x.diff / 150 * Math.pow(2,32)));
   })), d3.max(data.map(function(x) {
      return max(x.hash, (x.diff / 150 * Math.pow(2,32)));
   }))]).range([height-ymargin, ymargin]);
   
   // x axis
   var x = d3.scale.linear().domain([d3.min(data.map(function(d) {
      return d.timestamp;
   })), d3.max(data.map(function(d) {
      return d.timestamp;
   }))]).range([xmargin, width-xmargin]);

   // axis lines
   chart.selectAll("line.x").data(x.ticks(10)).enter().append("svg:line").attr(
               "class", "x").attr("x1", x).attr("x2", x).attr("y1", ymargin)
               .attr("y2", height-ymargin).attr("stroke", "#ccc");

   chart.selectAll("line.y").data(yr.ticks(10)).enter().append("svg:line").attr(
               "class", "y").attr("x1", xmargin).attr("x2", width-xmargin).attr(
               "y1", yr).attr("y2", yr).attr("stroke", "#ccc");

   chart.selectAll("text.xrule").data(x.ticks(10)).enter().append("svg:text")
               .attr("class", "xrule").attr("x", x).attr("y", height-ymargin)
               .attr("dy", 20).attr("text-anchor", "middle").text(function(d) {
                  var date = new Date(d);
                  return (date.getMonth()+1)+"/"+date.getDate();
               });

   chart.selectAll("text.yrule").data(yr.ticks(10)).enter().append("svg:text")
               .attr("class", "yruler").attr("x", width-xmargin).attr("y", yr)
               .attr("dy", 0).attr("dx", 5).attr("text-anchor", "left")
               .text(function(num) {
                  return num/1000000 + " MH/s";
               });
   chart.selectAll("text.yrule").data(yl.ticks(10)).enter().append("svg:text")
               .attr("class", "yrulel").attr("x", 0).attr("y", yl)
               .attr("dy", 0).attr("dx", 30).attr("text-anchor", "left")
               .text(function(num) {
                  return num.toFixed(2);
               });

   var line1 = d3.svg.line()
   // assign the X function to plot our line as we wish
   .x(function(d,i) { 
      // return the X coordinate where we want to plot this datapoint
      return x(d.timestamp);
   })
   .y(function(d) { 
      // return the Y coordinate where we want to plot this datapoint
      return yr(d.hash); // use the 1st index of data (for example, get 20 from [20,13])
   });

   
   var line2 = d3.svg.line()
   // assign the X function to plot our line as we wish
   .x(function(d,i) { 
      // return the X coordinate where we want to plot this datapoint
      return x(d.timestamp); 
   })
   .y(function(d) { 
      // return the Y coordinate where we want to plot this datapoint
      return yl(d.diff); // use the 2nd index of data (for example, get 13 from [20,13])
   });

   chart.append("svg:path").attr("d", line1(data)).attr("class", "data1");
   chart.append("svg:path").attr("d", line2(data)).attr("class", "data2");

}

function appendToData(data) {
   for (var i = 0; i<data.length; i++) {
      chartdata.push({timestamp: Date.parse(data[i][0]), hash: parseInt(data[i][1]), diff: parseFloat(data[i][2])});
   }
   chartdata = chartdata.sort(function(x, y) {
      return x.timestamp-y.timestamp;
   });
   $('#difficulty').val(chartdata[chartdata.length-1].diff);
   buildChart(chartdata);
}

function fetchData() {
   $.get("stats.json", appendToData);
}

$(function() {
   $('.calc').change(function() {
      $('#profit').text((86400/($('#difficulty').val() * 4294967296 / ($('#hashrate').val() * 1000)) * 50) + ' DFC/day');
   });
   
   fetchData();
});
