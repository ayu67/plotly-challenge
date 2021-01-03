function getPlots(id) {
    d3.json('samples.json').then (sampledata =>{
        // we use reverse here and below so that the bar chart has the longest on top
        var sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
        console.log(sampleValues);
        // get top 10 otus
        var OTU_top = ( sampledata.samples[0].otu_ids.slice(0, 10)).reverse();
        // map the OTU ids to a more compatible form
        var ids = OTU_top.map(id => 'OTU ' + id);
        console.log(`OTU IDS: ${ids}`);
        // get the top 10 labels 
        var labels =  sampledata.samples[0].otu_labels.slice(0,10);
        console.log(`OTU_labels: ${labels}`)
        var trace = {
            x: sampleValues,
            y: ids,
            text: labels,
            marker: {
            color: 'blue'},
            type: 'bar',
            orientation: 'h',
        };
        
        var data = [trace];

        var layout = {
            title: 'Top 10 OTUs',
            yaxis:{
                tickmode:'linear',
            },
            margin: {
                l: 100,
                r: 0,
                t: 50,
                b: 50
            }
        };
    
        Plotly.newPlot('bar', data, layout);
        
        // prepare trace and layout for bubble plot
        var trace1 = {
            x: sampledata.samples[0].otu_ids,
            y: sampledata.samples[0].sample_values,
            mode: 'markers',
            marker: {
                size: sampledata.samples[0].sample_values,
                color: sampledata.samples[0].otu_ids
            },
            text:  sampledata.samples[0].otu_labels
        };
        var layout_1 = {
            xaxis:{title: 'OTU ID'},
            height: 500,
            width: 1000
        };
        var data1 = [trace1];
        Plotly.newPlot('bubble', data1, layout_1); 
        
        });
    }  

// create function to display sample metadata
function getmetadata(id) {
    d3.json('samples.json').then((data)=> {
        var metadata = data.metadata;
        console.log(metadata);
        // filter metadata by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        // select demographic panel to put data
        var demodata = d3.select('#sample-metadata');
        // clear the demographic panel on refresh
        demodata.html('');
        Object.entries(result).forEach((key) => {   
            demodata.append('h5').text(key[0].toUpperCase() + ': ' + key[1] + '\n');    
        });
    });
}
// add function for filter selection 'onchange'
function optionChanged(id) {
    getPlots(id);
    getmetadata(id);
}

function init() {
    var dropdown = d3.select('#selDataset');
    d3.json('samples.json').then((data)=> {
        data.names.forEach(function(name) {
            dropdown.append('option').text(name).property('value');
        });
        getPlots(data.names[0]);
        getmetadata(data.names[0]);
    });
}

init();