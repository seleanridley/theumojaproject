(function() {


    var svg = d3.select("#svgcontainer2").append("svg")
                    .call(d3.zoom().on("zoom", function () {
                        svg.attr("transform", d3.event.transform)
                    })).append("g")
    var lines = svg.append("g")

    
    
    var width = window.innerWidth, height = 1000;

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      }

    
    let {graph, groups, link_leaf, type_count} = load()
    
    var checks = new Set()
    function waitForSet(){
        if(type_count.includes(groups.size)){ 
            for (var it = groups.values(), val= null; val=it.next().value; ) {

                var m = d3.select('#cuisines')
                .append('div')
                .attr('class', 'form-check form-check-inline')

                m.append('input')
                    .attr('type', 'checkbox')
                    .attr('class', 'form-check-input')  
                    .attr('id', 'c_input')  
                
                m.append('label')
                    .attr('class', 'form-check-label')
                    .text(val) 

            }        
        }
        else{
            setTimeout(waitForSet, 1000);
        }
    }

    waitForSet()

    d3.select('#s_row').append('button')
    .attr('id', 'submit')
    .attr('type', 'button')
    .attr('class', 'btn btn-success  ml-auto float-right')
    .text('Submit')

/*

    var check_divs = document.getElementById('c_input');
    var inpts = check_divs.getElementsByTagName('input');

    // assign function to onclick property of each checkbox
    for (var i=0, len= inpts.length; i<len; i++) {
        if ( inpts[i].type === 'checkbox' ) {
            inpts[i].onclick = function() {
                if checks.has(inputs[i])
            }
        }
    } */

    var simulation = d3.forceSimulation(graph.nodes.concat(graph.links)) //(graph.nodes)
      //.alpha(0.7)
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .force("charge",d3.forceManyBody().strength(-200)) //.distanceMax(100))
      .force('link', d3.forceLink(graph.edges).distance(-1000))//.id(d =>  d.id ).distance(200))
      .force('collision', d3.forceCollide(600).strength(1))
      .force('centering', d3.forceCenter(width / 2, height / 2))

      setTimeout(function() {
          simulation.on('tick', ticked) }, 1500);
      


    function ticked() {
       // console.log(groups.size)
        var nodeById = d3.map();
        var edges = []
        graph.nodes.forEach(function(node, i) {
        nodeById.set(node.id, node);
        });

        graph.links.forEach(function(link, i) {
            edges.push({source: nodeById.get(link.source), target: nodeById.get(link.target)})
        });

        var c = d3.select('g')
            .selectAll('circle')
            .data(graph.nodes)

        var l = d3.select('g')
            .selectAll('line')
            .data(edges) 

        var t = d3.select('g')
            .selectAll('text')
            .data(graph.nodes)

        l.enter()
            .append('line')
            .merge(l)
            .attr('class', 'links')
            .attr("stroke", "#000")
            .attr("stroke-width", 0.35)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
        
        l.exit().remove() 

        graph.links.forEach(function(d, i) {
            var x1 = d.source.x,
                x2 = d.target.x,
                y1 = d.source.y,
                y2 = d.target.y,
                slope = (y2 - y1) / (x2  - x1);
      
            d.x = (x2 + x1)/ 2;
            d.y = (x2 - x1) * slope / 2 + y1;
      
          });

        c.enter()
        .append("a")
            .attr("xlink:href", function(d){return d.url;}) 
            .append('circle')
            .attr('r', function(d) {
                if(groups.has(d.name)) {
                    return 20; 
                } else {
                    return 10;
                } 
            })
            .merge(c)
            .style("fill", function (d) { 
                if(groups.has(d.name)) {
                    return '#FBACBE'; 
                } else if(!groups.has(d.name) && !link_leaf.has(d.name)) {
                    return '#80ED99'
                } else {
                    return 'white'
                }
            }) 
            .attr('stroke', '#84BCDA')
            .attr("stroke-width", 3)
            .attr('fx', function(d) {
                 return null
                })
            .attr('fy', function(d) {
                return null
                }) 
            .attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y
            })
            .call(dragDrop)

        c.exit().remove()

        t.enter()
            .append('text')
            .text(function(d) {
              return d.name
            })
            .merge(t)
            .attr('font-size', '12pt')
            .attr('class', 'labels')
            .attr('x', function(d) {
              return d.x 
            })
            .attr('y', function(d) {
              return d.y + 10
            })
            /*.attr('dx', function(d) {
                return -60
              })      
            .attr('dy', function(d) {
              return 
            })    */
            .attr('baseline-shift', function(d) {
                if(groups.has(d.name)) {
                    return '-25px'; 
                } else {
                    return '-25px';
                } 
            })
            .attr("text-anchor", "middle")
            .attr("fill", "black")

        t.exit().remove() 
        //simulation.force('link', d3.forceLink(graph.edges).distance(-1000))
       simulation.force("link", d3.forceLink(edges).strength(0.5).distance(-1000))
        .force('collision', d3.forceCollide(60).strength(0.5))
        .force('centering', d3.forceCenter(width / 2, height / 2))
        simulation.nodes(graph.nodes)
      }
      
      const dragDrop = d3.drag()
        .on('start', node => {
            node.fx = node.x
            node.fy = node.y
        })
        .on('drag', node => {
            simulation.alphaTarget(0.7).restart()
            node.fx = d3.event.x
            node.fy = d3.event.y
        })
        .on('end', node => {
            if (!d3.event.active) {
            simulation.alphaTarget(0)
            }
            //node.fx = null
           // node.fy = null
  
        })
      //simulation.nodes(graph.nodes)
      //simulation.restart()
      //simulation.force("link", d3.forceLink(edges)).distance(1)
      //simulation.alpha(1).restart()
 

    })()