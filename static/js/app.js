// Create function for plots
function getPlot(id) {

  // Read in data from samples json
  d3.json("data/samples.json").then((data)=> {
      console.log(data)

      var wfreq = data.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)
      
      // Filter sample values by name
      var samples = data.samples.filter(s => s.id.toString() === id)[0];
      
      console.log(samples);

      // Grab the top 10 sample values
      var samplevalues = samples.sample_values.slice(0, 10).reverse();

      // Grab the top 10 OTU ids
      var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
      
      var OTU_id = OTU_top.map(d => "OTU " + d)

      // Grab top 10 labels for OTU ids
      var labels = samples.otu_labels.slice(0, 10);

      // Create trace variable for bar plot
      var trace = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          marker: {
            color: 'rgb(142,124,195)'},
          type:"bar",
          orientation: "h",
      };

      // Create data variable
      var data = [trace];

      // Create layout variable for bar plot
      var layout = {
          title: "Top 10 OTU",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 30
          }
      };

      // Create the bar plot
      Plotly.newPlot("bar", data, layout);
    
      // Create trace variable for bubble plot
      var trace1 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids
          },
          text: samples.otu_labels

      };

      // Create layout variable for bubble plot
      var layout_bubble = {
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1000
      };

      // Create data variable
      var data_bubble = [trace1];

      // Create the bubble plot
      Plotly.newPlot("bubble", data_bubble, layout_bubble); 

      // Create the gauge plot variable

      var data_gauge = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: { text: `Belly Button Washing Frequency: Scrubs per Week ` },
        type: "indicator",
        
        mode: "gauge+number",
        gauge: { axis: { range: [null, 9] },
                 steps: [
                  { range: [0, 2], color: "yellow" },
                  { range: [2, 4], color: "cyan" },
                  { range: [4, 6], color: "teal" },
                  { range: [6, 8], color: "lime" },
                  { range: [8, 9], color: "green" },
                ]}
            
        }
      ];

      // Create layout variable for gauge plot
      var layout_gauge = { 
          width: 700, 
          height: 600, 
          margin: { t: 20, b: 40, l:100, r:100 } 
        };

      // Create the gauge plot
      Plotly.newPlot("gauge", data_gauge, layout_gauge);
    });
}  
// Create the function to grab the data
function getInfo(id) {

  // Read the json file to get data
  d3.json("data/samples.json").then((data)=> {
      
      // Get the metadata info for the demographic panel
      var metadata = data.metadata;

      console.log(metadata)

      // Filter meta data info by sample id
      var result = metadata.filter(meta => meta.id.toString() === id)[0];

      // Select demographic panel to put data
      var demographicInfo = d3.select("#sample-metadata");
      
      // Empty the demographic info panel each time before getting new id info
      demographicInfo.html("");

      // Grab demographic data for the id and append the info to the panel
      Object.entries(result).forEach((key) => {   
              demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}

// Create the function for the change event
function optionChanged(id) {
  getPlot(id);
  getInfo(id);
}

// Create the function for the initial data rendering
function init() {
  // Select dropdown menu 
  var dropdown = d3.select("#selDataset");

  // Read the data 
  d3.json("data/samples.json").then((data)=> {
      console.log(data)

      // Get the id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // Call the functions to display the plots to the page
      getPlot(data.names[0]);
      getInfo(data.names[0]);
  });
}

init();