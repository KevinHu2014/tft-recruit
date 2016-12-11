const deadline = new Date(2017, 4, 5); //2016/12/31--24:00

const today = new Date();
const calendarHeight = $(window).height() - $('header').height() - $('main').height();
const calendarWidth = $('#recruit-calendar').width();
const margin = {
  calendarX: 30,
  calendarY: 20,
  xaxisY: 40,
  circleR: 5
};
const rectHeight = (calendarHeight - margin.calendarY * 7) / 5; // 4(間距) + 2(兩側)
const rectWidth = (calendarWidth - margin.calendarX * 8) / 7;

const svg = d3.select('#recruit-calendar').append('svg')
  .attr('width', function(){
  	return (calendarWidth < 0)? 0: calendarWidth;
  })
  .attr('height', function(){
  	return (calendarHeight < 0)? 0: calendarHeight;
  });

const tooltip = d3.select('#recruit-calendar')
	.append('tooltip').attr('class', 'tooltip');


let curSelectId = 'info';
$('.btn-section').click(function() {
  if (this.id === curSelectId) {;
  } else {
    $('#recruit-' + curSelectId).addClass('is-hidden');
    $('#recruit-' + this.id).removeClass('is-hidden')
    $('.btn-section').toggleClass('btn-recruit-disable');

    window.location.hash = '#recruit-' + this.id;

    curSelectId = this.id;
    $('html,body').scrollTop(0);
    console.log("switch to : " + '#recruit-' + this.id);
  }
})

// Info Code-------------

// same height all info cards
const sameHeightAllCards = ()=>{
	const cardLen = $('.m-info-type .gap').length;
	let maxHeight = 0;
	for (let i = cardLen - 1; i >= 0; i--) {
		if($(`.m-info-type:nth-child(${i+1}) .gap`).height()>maxHeight){
			maxHeight = $(`.m-info-type:nth-child(${i+1}) .gap`).height();
		}
	}
	for (let i = cardLen - 1; i >= 0; i--) {
		$(`.m-info-type:nth-child(${i+1}) .gap`).height(maxHeight);
	}	
}
sameHeightAllCards();


// Calendar Code-------------
let startDay = d3.timeSunday(d3.timeMonth(today));
let endDay = d3.timeSunday(new Date(2016, (today.getMonth()+ 1) ));

var calendarEvent; // read json

// d3.json('https://raw.githubusercontent.com/TeachForTaiwan/tft-recruit/gh-pages/src/calendarEvent.json', function(error, data){
d3.json('../../src/calendarEvent.json', function(error, data){
	if(error)
		alert('Parse calendar event ERROR!\n' + error);

	calendarEvent = data;

	if( $(window).width() > 767){
		drawCalendar(startDay, endDay);
	}

})

$('.calendar-month').click(function(){
	$('.calendar-month').removeClass('month-active');
	$('#' + this.id).addClass('month-active');

	switch(this.id){
		case 'December':
			startDay = d3.timeSunday(new Date(2016, 11));
			endDay = d3.timeSunday(new Date(2016, (today.getMonth()+ 1) ));
			break ;
		case 'January':
			startDay = d3.timeSunday(new Date(2016, 12));
			endDay = d3.timeSunday(d3.timeWeek.offset(new Date(2017, 1), 1));
			break ;
		case 'February':
			startDay = d3.timeSunday(new Date(2017, 1));
			endDay = d3.timeSunday(d3.timeWeek.offset(new Date(2017, 2), 1));
			break ;
		case 'March':
			startDay = d3.timeSunday(new Date(2017, 2));
			endDay = d3.timeSunday(d3.timeWeek.offset(new Date(2017, 3), 1));
			break ;
	}
	drawCalendar(startDay, endDay, 'c');
})

// TODO: 等開放之後再把時間加進來
// initializeClock('countdownDIV', deadline);
// ---------------------
function _format(time, option) {
  switch (option) {
    case 'd':
      return time.getDay(); // Sunday = 0
    case 'w':
      let formatW = d3.timeFormat('%W'); // 取得一年中的第幾週
      return formatW(time) - formatW(startDay);
    case 'a':
      let formata = d3.timeFormat('%a'); // 取得星期幾
      return formata(time);
    case 'm':
      let formatB = d3.timeFormat('%B'); // 取得幾月
      return formatB(time);
    default:
      return alert("Shit 轉換時間出錯了！");
  }
}

function _setCalendarBar(){
	$('.calendar-month').each(function(index, el){
		if(el.id === _format(today, 'm'))
			$(el).addClass('month-active');
	})
}

function displayNone(time, opt){
	if(_format(time,'m') !== _format(opt,'m'))
		return 'none';
	else
		return 'block';
}

function opacityHidden(time, opt){
	if(_format(time,'m') !== _format(opt,'m'))
		return 0;
	else
		return 1;
}

function getRectX(time) {
  return _format(time, 'd') * (rectWidth + margin.calendarX) + margin.calendarX; // Add padding in section
}

function getRectY(time) {
  let getWeek = _format(time, 'w');
  if (_format(time, 'd') === 0)
    getWeek += 1;

  return (getWeek - 1) * (rectHeight + margin.calendarY) + margin.calendarY + margin.xaxisY / 2; // Add padding in section
}

/*
 * TODO: tooltip
 * TODO: 能同時顯示兩筆資料（因為現在用d3跑，所以一筆綁一筆）
ex: 		
		"21":[{
				"title":"陽明校園擺攤",
				"showing": "台中場",
				"time": "14:00 - 16:00",
				"location": "客家文化中心 3F 媒體簡報室"
			},{
				"title":"交大講座",
				"showing": "台中場",
				"time": "14:00 - 16:00",
				"location": "客家文化中心 3F 媒體簡報室"
			}],
*/

function drawCalendar(startDay, endDay, option){
	/*
	 * 's' : start(default)
	 * 'c' : change
	 */
	option = option || 's';

	let calendarRange = d3.timeDays(startDay, endDay);

	// Mon, Tue...
	let x = d3.scaleTime()
	  .domain([startDay, d3.timeDay.offset(startDay, 6)])
	  .range([margin.calendarX + rectWidth / 2, calendarWidth - margin.calendarX - rectWidth / 2]);

	let xAxis = d3.axisTop()
	  .scale(x)
	  .ticks(7)
	  .tickFormat(function(d) {
	    return _format(d, 'a');
	  })

	if (option === 's'){
		_init();
	}else if( option === 'c'){
		_change();
	}

	function _init(){
		
		let month = _format(today, 'm');
		let dayGrid = svg.selectAll("g")
		  .data(calendarRange)
		  .enter()
		  .append("g")
			  .attr('class', 'grid');

		// rect
		dayGrid
		  .append('rect')
			  .attr('class', 'day')
			  .attr('width', rectWidth)
			  .attr('height', rectHeight)
			  .attr('x', function(d) {
			    return getRectX(d);
			  })
			  .attr('y', function(d) {
			    return getRectY(d);
			  })
			  .style('display', function(d){
			  	return displayNone(d, today);
			  })
			  .on("mouseout", function(d) {
	        tooltip
	        	.style("display", "none")
	        	.style("opacity", "0")
	      });

		// date
		dayGrid
		  .append('text')
		  	.attr('class', 'date')
			  .attr('x', function(d) {
			    return getRectX(d) + 10;
			  })
			  .attr('y', function(d) {
			    return getRectY(d) + 30;
			  })
			  .text(function(d) {
			    return d.getDate();
			  })
			  .style('display', function(d){
			  	return displayNone(d, today);
			  })

		// circle
		dayGrid
			.append('circle')
				.attr('cx', function(d, i){
					return getRectX(d) + 10 + margin.circleR;
				})
				.attr('cy', function(d){
					return getRectY(d) + 60 -  margin.circleR ;
				})
				.attr('r', margin.circleR)
				.style('display', function(d){
					if(calendarEvent[month][d.getDate()] === undefined || displayNone(d, today) === 'none')
				  	return 'none';
				  else
				  	return 'block';
			  })

		// calendar-event
		dayGrid
			.append('text')
				.attr('class', 'calendar-event')
				.attr('data-date', function(d){
					return d.getDate();	
				})
				.attr('x', function(d){
					return getRectX(d) + 23;
				})
				.attr('y', function(d){
					// if(!Array.isArray(calendarEvent[month][d.getDate()]))
					// 	return getRectY(d) + 60 ;
					return getRectY(d) + 60 ;
				})
				.style('display', function(d){
			  	return displayNone(d, today);
			  })
				.text(function(d){
					if(calendarEvent[month][d.getDate()] !== undefined)
						return calendarEvent[month][d.getDate()].title;
				})
				.on("mousemove", function(d, i) {

	        tooltip
	        	.style('left', (d3.event.pageX - $('.tooltip').width() / 2) + 'px')
	        	.style('top', (d3.event.pageY + $('.tooltip').height() / 2) + "px")
	        	.style("opacity", "1")
	        	.style("display", "inline-block")
	        	.html(
	        		calendarEvent[month][calendarRange[i].getDate()].showing + 
	        		"&nbsp;" + 
	        		calendarEvent[month][calendarRange[i].getDate()].time + 
	        		"<br>" + 
	        		calendarEvent[month][calendarRange[i].getDate()].location
	        	);
	      })

		svg
		  .append("g")
			  .attr("class", "xAxial")
			  .attr("transform", 'translate(0,' + margin.xaxisY + ')')
			  .call(xAxis);

		_setCalendarBar(startDay);
	}

	function _change(){
		// console.log(calendarRange);
		const monMiddle = calendarRange[15];

		let dayGrid = svg.selectAll(".grid").data(calendarRange);
		let di = 0, ti = 0, ci = 0, datai = 0;
		let month = _format(monMiddle, 'm');
		 
		dayGrid
		  .selectAll('rect')
			.transition()
			.duration(500)
		  .style('opacity', function(){
		  	return opacityHidden(calendarRange[di++], monMiddle);
		  })
		  .style('display', 'block')

		// date
		di = 0, ti = 0;
		dayGrid
		  .selectAll('.date')
			  .text(function() {
			    return calendarRange[ti++].getDate();
			  })
			  .style('display', function(){
			  	return displayNone(calendarRange[di++], monMiddle);
			  })

		// circle
		datai = 0, di = 0, ci = 0;
		dayGrid
			.selectAll('.grid circle')
				.attr('data-date', function(){
					return calendarRange[datai++].getDate();	
				})
				.style('display', function(){					
					let display ;
					if(calendarEvent[month][calendarRange[ci].getDate()] === undefined || displayNone(calendarRange[di], monMiddle) === 'none')
				  	display = 'none';
				  else
				  	display = 'block';

				  ci++;
				  di++;
				  return display;
			  })

		// calendar-event
		ci = 0, di = 0, datai = 0;
		dayGrid
			.selectAll('.calendar-event')
				.attr('data-date', function(){
					return calendarRange[datai++].getDate();	
				})
				.style('display', function(){
					return displayNone(calendarRange[di++], monMiddle);
				})
				.text(function(){
					// let date = $(this).data('date');
					if(calendarEvent[month][calendarRange[ci].getDate()] !== undefined)
						return calendarEvent[month][calendarRange[ci++].getDate()].title;

					ci++;
				})
				.on("mousemove", function() {
					let date = $(this).data('date');

	        tooltip
	        	.style('left', (d3.event.pageX - $('.tooltip').width() / 2) + 'px')
	        	.style('top', (d3.event.pageY + $('.tooltip').height() / 2) + "px")
	        	.style("opacity", "1")
	        	.style("display", "inline-block")
	        	.html(
	        		calendarEvent[month][date].showing + 
	        		"&nbsp;" + 
	        		calendarEvent[month][date].time + 
	        		"<br>" + 
	        		calendarEvent[month][date].location
	        	);
	      })
	}
		
}
