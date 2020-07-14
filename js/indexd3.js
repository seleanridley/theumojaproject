( function() {

    var svg = d3.select("#svgcontainer").append("svg")
    var lines = svg.append("g").attr("class", "links")
    //var labels = svg.append("text").attr("class", "labels")

    d3.select("svg")
        .attr("background-color", '#FFF')
    

    var width = window.innerWidth, height = 600;
    var nodes = [{name: 'Home', id: 0, url: 'index.html'}, 
            {name: 'Local Black Businesses', id: 1, url: 'local_bb.html'}]
    var links = [
        {source: 0, target: 1}
    ]

    var simulation = d3.forceSimulation(nodes)
    .force("charge",d3.forceManyBody().strength(-2000))
    .force("link", d3.forceLink(links).distance(200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('position', d3.forceY(100))
    .on('tick', ticked);

    //console.log(nodes)
    //console.log(links)
    function ticked() {
        var u = d3.select('svg')
            .selectAll('circle')
            .data(nodes)

        var v = d3.select('.links')
            .selectAll('line')
            .data(links)

        var l = d3.select('svg')
            .selectAll('text')
            .data(nodes)

        v.enter()
            .append('line')
            .merge(v)
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            //.attr("x1", 100)
            .attr("x1", function(d) { 
              console.log(d)
              return d.source.x
            })
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        v.exit().remove()

        u.enter()
        .append("a")
           .attr("xlink:href", function(d){return d.url;}) 
            .append('circle')
            .attr('r', 70)
            .merge(u)
            .attr('fill', 'white')
            .attr('stroke', '#84BCDA')
            .attr("stroke-width", 3)
            .attr('cx', function(d) {
            return d.x
            })
            .attr('cy', function(d) {
            return d.y
            })
            .call(dragDrop)

        u.exit().remove()

        l.enter()
            .append('text')
            .text(function(d) {
              return d.name
            })
            .merge(l)
            .attr('class', 'labels')
            .attr('x', function(d) {
              return d.x 
            })
            .attr('y', function(d) {
              return d.y + 10
            })
           /* .attr('dx', function(d) {
                return -60
              })      
            .attr('dy', function(d) {
              return 100
            })    */
            .attr('baseline-shift', '-90px')
            .attr("text-anchor", "middle")
            .attr("fill", "black")

        l.exit().remove()

      }

      simulation.force("link", d3.forceLink().distance(20))
      simulation.alpha(1).restart()

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
            node.fx = null
            node.fy = null
        })

})()