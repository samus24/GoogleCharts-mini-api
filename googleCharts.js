google.charts.load('current');
var debug = false;  //If we want test messages

var data;
var wrapper;

var store = (function() {
    var map = {};

    return {
        set: function ( name, value ) {
            map[ name ] = value;
        },
        get: function ( name ) {
            return map[ name ];
        }
    };
})();

var mouseX;
var mouseY;

$(document).mousemove(function(e){
	mouseX = e.pageX;
	mouseY = e.pageY;
});
/*
* This function draws a google chart with the params we select. It also has the functions of select, mouseOver and MouseOut. If we want a custom select function
* It has a parameter with that purpouse.
*@param col -> Array of objects for the columns of the chart
*@param rows ->Array with rows of the chart
*@param type -> Type pf chart from case below. Actual formats available are BAR, BUBBLE, COLUMN and PIE 
*@param container -> Id of the HTML container for the chart
*@param option -> Js object with the options desired for the chart
*@param mouseOver -> Boolean if we want a mouseOver interaction
*@param mouseOut -> Boolean if we want a mouseOut interaction
*@param selectFunction -> Js function with the desired select event
*@param id -> Id of the chart.
*/
function drawNewChart(col, rows, type, container, option, mouseOver, mouseOut, selectFunction, id) {
	google.charts.setOnLoadCallback(draw);
	function draw() {
		data = new google.visualization.DataTable();
		var typeID;
		if(debug) {
			console.log(data);
			console.log(col);
			console.log("Data should be an array");
			console.log(rows);
			console.log(type);
			console.log(container);
			console.log(option);
		}
		if(col !== undefined) {
			for (var i=0; i < col.length; ++i) {
				data.addColumn(col[i]);
			}
		}

		if(rows !== undefined)
			data.addRows(rows);

		switch(type) {
			case 'BAR':
				typeID = 'BarChart';
				break;
			case 'BUBBLE': 
				typeID = 'BubbleChart';
				break;
			case 'COLUMN':
				typeID = 'ColumnChart';
				break;
			case 'PIE': 
				typeID = 'PieChart';
				break;
			case undefined:
				break;
			default:
				console.log("Not an allowed chart. The values are BAR, BUBBLE, COLUMN and PIE");
		}

		if(container !== undefined) {
			console.log(container)
		 	wrapper = new google.visualization.ChartWrapper({
			    chartType: typeID,
			    dataTable: data,
			    options: option,
			    containerId: container
			  });
		 }
		wrapper.draw();
		store.set(id, wrapper);
		google.visualization.events.addOneTimeListener(wrapper, 'ready', onReady);

		function onReady() {
			var ret = store.get(id).getChart();
			onMouseOverHandler(ret, mouseOver);
			onMouseOutHandler(ret, mouseOut);
			selectHandler(ret, function(){selectFunction(ret)});
			resize(store.get(id));
		}
	}
}


function resize(chart) {
	function resizeHandler () {
		chart.draw();
	}

	if (window.addEventListener) {
		window.addEventListener('resize', resizeHandler, false);
	}

	else if (window.attachEvent) {
		window.attachEvent('onresize', resizeHandler);
	}	
}

function onMouseOverHandler(chart, mouseOverFunction) {
	google.visualization.events.addListener(chart, 'onmouseover', mouseOverFunction);
}

function onMouseOutHandler(chart, mouseOutFunction) {
	google.visualization.events.addListener(chart, 'onmouseout', mouseOutFunction);
}

function selectHandler(chart, selectFunction) {
	google.visualization.events.addListener(chart, 'select', selectFunction);
}