// 
d3.json("data/samples.json").then(function (data) {
    console.log(data);

    makeDropdown(data);
    makeMetadata(data, data.names[0]);
    makeBarChart(data, data.names[0]);
    makeBubbleChart(data, data.names[0]);
    makeGaugeChart(data, data.names[0]);
});

function optionChanged(val) {
    d3.json("data/samples.json").then(function (data){
        console.log(data);

        makeMetadata(data, val);
        makeBarChart(data, val);
        makeBubbleChart(data, val);
        makeGaugeChart(data, val);
    });
}

function makeDropdown(data) {
    for (let i = 0; i < data.names.length; i++){
        let name = data.names[i];
        d3.select("#selDataset").append("option").text(name);
    }
}

function makeMetadata(data, val) {
    console.log(val);

    // nuke dropdown
    d3.select("#sample-metadata").html("");

    let meta = data.metadata.filter(x => x.id == val)[0];
    let keys = Object.keys(meta);
    for(let i = 0; i < keys.length; i++){
        let key = keys[i];
        d3.select("#sample-metadata").append("p").text(`${key}: ${meta[key]}`);
    }
}

function makeBarChart(data, val) {
    let sample = data.samples.filter(x => x.id == val)[0];

    // Slice
    let sample_values = sample.sample_values.slice(0, 10);
    let otu_labels = sample.otu_labels.slice(0, 10);
    let otu_ids = sample.otu_ids.slice(0, 10);

    // Is it worth it?... Reverse it
    sample_values.reverse();
    otu_labels.reverse();
    otu_ids.reverse();

    // Bar Graph Trace
    let trace1 = {
        x: sample_values,
        y: otu_ids.map(x => `OTU: ${x}`),
        hovertext: otu_labels,
        type: 'bar',
        orientation: "h",
        marker: {color: "dodgerblue"}
    };

    //
    let plotly_data = [trace1];

    //
    let layout = {
        "title": `Bacteria for ID: ${val}`,
        "xaxis": {'title': "Number of Bacteria Found"},
        //"yaxis": {'title': "Bacteria Found"}
    }

    //
    Plotly.newPlot("bar", plotly_data, layout);
}

function makeBubbleChart(data, val) {
    let sample = data.samples.filter(x => x.id == val)[0];

    //
    let sample_values = sample.sample_values;
    let otu_labels = sample.otu_labels;
    let otu_ids = sample.otu_ids;


    //Bubble Chart Trace
    let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values,
            colorscale: 'Picnic'
        }
    };

    //
    let plotly_data = [trace1];

    //
    let layout = {
        "title": `Number of Bacteria for ID: ${val}`,
        "xaxis": {'title': "OTU ID"},
        "yaxis": {'title': "Number of Bacteria Found"}
    }

    //
    Plotly.newPlot("bubble", plotly_data, layout);
}


function makeGaugeChart(data, val) {
    let meta = data.metadata.filter(x => x.id == val)[0];

    let wfreq = meta.wfreq;


    //Gauge Chart Trace
    let trace1 = {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "" },
        type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: 5 },
        gauge: {
            axis: { range: [0, 10] },
            steps: [
                { range: [0, 5], color: "skyblue" },
                { range: [5, 7], color: "dodgerblue" },
                { range: [7, 10], color: "blue" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 9.75
            }
        }    
    };

    //
    let plotly_data = [trace1];

    //
    let layout = {
        "title": `Belly Button Washing Frequency`

    }

    //
    Plotly.newPlot("gauge", plotly_data, layout);

}