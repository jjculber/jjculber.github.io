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

   var margin = 50;

   var chart = d3.select("#chart").append("svg:svg").attr("class", "chart")
               .attr("width", width).attr("height", height);
   
   // y axis
   var y = d3.scale.linear().domain([d3.min(data.map(function(x) {
      return x.hash;
   })), d3.max(data.map(function(x) {
      return x.hash;
   }))]).range([height-margin, margin]);
   
   // x axis
   var x = d3.scale.linear().domain([d3.min(data.map(function(d) {
      return d.timestamp;
   })), d3.max(data.map(function(d) {
      return d.timestamp;
   }))]).range([margin, width-margin]);

   // axis lines
   chart.selectAll("line.x").data(x.ticks(10)).enter().append("svg:line").attr(
               "class", "x").attr("x1", x).attr("x2", x).attr("y1", margin)
               .attr("y2", height-margin).attr("stroke", "#ccc");

   chart.selectAll("line.y").data(y.ticks(10)).enter().append("svg:line").attr(
               "class", "y").attr("x1", margin).attr("x2", width-margin).attr(
               "y1", y).attr("y2", y).attr("stroke", "#ccc");

   chart.selectAll("text.xrule").data(x.ticks(10)).enter().append("svg:text")
               .attr("class", "xrule").attr("x", x).attr("y", height-margin)
               .attr("dy", 20).attr("text-anchor", "middle").text(function(d) {
                  var date = new Date(d*1000);
                  return (date.getMonth()+1)+"/"+date.getDate() + " " + date.getHours();
               });

   chart.selectAll("text.yrule").data(y.ticks(10)).enter().append("svg:text")
               .attr("class", "yrule").attr("x", width-margin).attr("y", y)
               .attr("dy", 0).attr("dx", 20).attr("text-anchor", "middle")
               .text(function(num) {
                  return (num/100).toFixed(0);
               });

   var line1 = d3.svg.line()
   // assign the X function to plot our line as we wish
   .x(function(d,i) { 
      // return the X coordinate where we want to plot this datapoint
//      console.log("buy price: " + d.timestamp + ", " + x(d.timestamp));
      return x(d.timestamp);
   })
   .y(function(d) { 
      // return the Y coordinate where we want to plot this datapoint
//      console.log("buy price: " + d.buy + ", " + y(d.buy));
      return y(d.hash); // use the 1st index of data (for example, get 20 from [20,13])
   });

   
   var line2 = d3.svg.line()
   // assign the X function to plot our line as we wish
   .x(function(d,i) { 
      // return the X coordinate where we want to plot this datapoint
      return x(d.timestamp); 
   })
   .y(function(d) { 
      // return the Y coordinate where we want to plot this datapoint
      return y(d.diff); // use the 2nd index of data (for example, get 13 from [20,13])
   });

   chart.append("svg:path").attr("d", line1(data)).attr("class", "data1");
   //chart.append("svg:path").attr("d", line2(data)).attr("class", "data2");

}

function appendToData(data) {
   for (var i = 0; i<data.length; i++) {
      chartdata.push({timestamp: Date.parse(data[i][0]), hash: data[i][1], diff: data[i][2]});
   }
   chartdata = chartdata.sort(function(x, y) {
      return x.timestamp-y.timestamp;
   });
   buildChart(chartdata);
}

function fetchData() {
   $.get("stats.json", appendToData);
}

$(function() {
   fetchData();
});
