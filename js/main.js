function init(){

	$('.updatedate').html(updateDate)

	$('#dataframe').hide();
	$('#mapoverlay').hide()
	$('#helpoverlay').hide()

	$('.level2nav').on('mouseover',function(e){
		$('#mapoverlay').hide()
	})

	$(document).click(function(event) {
	    if (!$(event.target).is("#mapoverlay")) {
	        $("#mapoverlay").hide();
	    }
	})

	/*$('.level2nav').on('mouseout',function(e){
		$('#helpoverlay').hide()
	})*/

	$('#frame_2').hide()
	$('#frame_3').hide()
	$('#frame_4').hide()
	let height = $(window).height()-32

	$('.level1nav').css({'height':(height+2)+'px'});
	$('.level2nav').css({'height':height+'px'});
	$('#frame3viz').css({'height':height+'px'});
	$('#frame2mapcontainer').css({'height':height+'px'});
	$('#frame3mapcontainer').css({'height':height+'px'});
	$('#frame2viz').css({'height':height+'px'});
	$('#frame4viz').css({'height':height+'px'});
	$('#frame1viz').css({'height':height+'px'});


	$('.hoverhighlight').on('mouseover',function(){
		let tech = $(this).attr('data-id')
		$('.countrystatusbox').css('opacity',0.25)
		$('.' + tech).css('opacity',1)
	});

	$('.hoverhighlight').on('mouseout',function(){
		$('.countrystatusbox').css('opacity',1)
	});



	initDataLoading()

}

function switchFrame(frame,map){
		$('#mapoverlay').hide()
		$('.frame').hide()
		$('#frame_'+frame).show()
		map.invalidateSize()
		$('.topframenav').removeClass('activenav')
		$('#framenav'+frame).addClass('activenav')
}

function initDataFrame1(data,world){
	$('#dataframe').show();
	$('.loader').hide();
	let keyValues = data.map(function(d){
		return {'key':d['Country ISO3'],'value':d['Quarter'],'date':d['VP Date of introduction']}
	});

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#c43b3d'},{'value':2,'colour':'#d3a522'},{'value':3,'colour':'#ffd139'},{'value':4,'colour':'#ffe89c'}];

	let overlay = function(iso){

		let found = false
		$('#mapoverlay').html('<p>Not in dataset</p>')
		data.forEach(function(row){

			if(row['Country ISO3']==iso){
				let html = `
					<h6><a href="country.html?iso=${row['Country ISO3']}" target="_blank">${row['Country']}</a></h6>
					<p class="p4">Date of introduction</p>
					<p class="p2">${row['VP Date of introduction']}</p>
					<p class="p4">Name of international VP</p>
					<p class="p2">${row['Name of international VP']}</p>
					<p class="p4">Name of domestic VP</p>
					<p class="p2">${row['Name of domestic VP']}</p>
				`
				$('#mapoverlay').html(html)
				found = true
			}
		})
		if(found){$('#mapoverlay').show()} else {$('#mapoverlay').hide()}
	}
	
	let map = initMap('frame1map',world,[keyValues],colourBands,overlay);

	$('#framenav1').on('click',function(){
		switchFrame(1,map);
	});

	$('#frame1viz').hide();
	$('.frame1legend2').hide()

	$('#frame1navmap').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame1viz').hide()
		$('#frame1map').show()
		$('#frame1navmap').addClass('active2nav')
		$('#frame1navviz').removeClass('active2nav')
		$('.frame1legend2').hide()
		$('.frame1legend1').show()
		map.invalidateSize();
	});

	$('#frame1navviz').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame1map').hide()
		$('#frame1viz').show()
		$('#frame1navmap').removeClass('active2nav')
		$('#frame1navviz').addClass('active2nav')
		$('.frame1legend2').show()
		$('.frame1legend1').hide()
	});

	updateKeyStatsFrame1(data)
	

	//populateViz1(data)

	$('#frame1viz').html(chart1)

	viz1overlay(data)

	let dropdownOptions = []
	let isoCodes2 = []
	data.forEach(function(d){
		if(isoCodes2.indexOf(d['Country ISO3'])==-1){
			isoCodes2.push(d['Country ISO3'])
			dropdownOptions.push({'iso':d['Country ISO3'],'country':d['Country']})
		}
		
	});

	populateCountryDrop(dropdownOptions)
}

function updateKeyStatsFrame1(data){
	keys = [];

	data.forEach(function(d){
		let key = d['Country ISO3']
		if(keys.indexOf(key)==-1){
			keys.push(key)
		}
	})

	let countNotlaunched = 0
	data.forEach(function(d){
		if(d['launched']=='No'){
			countNotlaunched++
		}
	});

	$('#frame1allcountries').html(keys.length)
	$('#frame1launched').html(keys.length-countNotlaunched)
}

function viz1overlay(data){

	console.log('overlay init')
	console.log(data)
	$('.countrypoint').on('mouseover',function(){
		console.log('overlay')
		let iso = $(this).attr('id')

		let row = {}
		console.log(iso)
		data.forEach(function(d){

			if(d['Country ISO3']==iso){
				row = d
			}
		});
		console.log(row)
		let mouseX = event.pageX
    	let mouseY = event.pageY
    	if(mouseX>window.innerWidth-200){
    		mouseX = window.innerWidth-200
    	}
    	if(mouseY>window.innerHeight-200){
    		mouseY = window.innerHeight-200
    	}

		$('#mapoverlay').css('top', mouseY);
		$('#mapoverlay').css('left', mouseX);

		$('#mapoverlay').show()

		let deaths = Math.round(row['Deaths'] * 10) / 10
		let cases = Math.round(row['Cases'] * 10) / 10
		let vaccinated = Math.round(row['Vaccinated'] * 100)
		let fullyVaccinated = Math.round(row['Fully Vaccinated'] * 100)

		let html = `
			<h5>${row['Country']}</h5>
			<p class="p4">Cases per million</p>
            <p class="p2">${cases}</p>
            <p class="p4">Deaths per million</p>
            <p class="p2">${deaths}</p>
            <p class="p4">Vaccinated</p>
            <p class="p2">${vaccinated}%</p>
            <p class="p4">Fully Vaccinated</p>
            <p class="p2">${fullyVaccinated}%</p>


        `
		$('#mapoverlay').html(html)
	});
}

function populateViz1(data){
	data.forEach(function(d){
		if(d['Deaths']!=''){
			$('#frame1viz').append('<p>'+d['Country']+'</p>')
			createViz1Chart('#frame1viz',d);
		}
	});
}

function createViz1Chart(id,data){
	let svg = d3.select(id).append("svg").attr("width", 100).attr("height", 120)

	let cases = Math.floor(Math.log10(data['Cases']*100))
	if(cases<0 || cases==0){cases = 0.2}

 	svg.append('text')
    	.attr('x',55)
    	.attr('y',40)
    	.style("font-size", "12px")
    	.text(data['Country ISO3'])
    	.attr('text-anchor','left')

	let arc1 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(cases*12.5)
	    .startAngle(-Math.PI/2)
	    .endAngle(0);

	svg.append('path')
	    .attr('d', arc1)
	    .attr('fill','#7C2C77')
	    .attr("transform", "translate(50, 70)")


	let deaths = Math.floor(Math.log10(data['Deaths']*100))
	if(deaths<0 || deaths==0){deaths = 0.2}

	let arc2 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(deaths*12.5)
	    .startAngle(0)
	    .endAngle(Math.PI/2);

	svg.append('path')
	    .attr('d', arc2)
	    .attr('fill','#7C2C77')
	    .attr('opacity',0.75)
	    .attr("transform", "translate(50, 70)")

	let vaccinated = data['Vaccinated']
	

	let arc3 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(vaccinated*50)
	    .startAngle(Math.PI/2)
	    .endAngle(Math.PI);

	svg.append('path')
	    .attr('d', arc3)
	    .attr('fill','#00E1B3')
	    .attr('opacity',0.75)
	    .attr("transform", "translate(50, 70)")

	let fullyVaccinated = data['Fully Vaccinated']


	let arc4 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(fullyVaccinated*50)
	    .startAngle(Math.PI)
	    .endAngle(Math.PI*1.5);

	svg.append('path')
	    .attr('d', arc4)
	    .attr('fill','#00E1B3')
	    .attr("transform", "translate(50, 70)")

}

function initDataFrame2(data,world){

	$('frame2viz').hide();

	let keyValues = [];
	let isoCodes = []
	data.forEach(function(d){
		if(isoCodes.indexOf(d['Country ISO3'])==-1){
			isoCodes.push(d['Country ISO3']);
		}
	});
	for(let i =0;i<24;i++){
		keyValues[i]=[]
		isoCodes.forEach(function(iso){
			keyValues[i].push({'key':iso,'value':0});
		});
	}

	keyValues.forEach(function(keyValue,i){
		keyValue.forEach(function(country,j){
			data.forEach(function(d){
				if(d['Country ISO3']==country['key']){
					if(parseInt(d['month'])<i+2){
						country['value']++
					}
					if(!('country' in country)){
						keyValues[i][j]['country'] = d['Country name']
					}
				}
			})
		})
	})

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#ffe89c'},{'value':2,'colour':'#ffd139'},{'value':3,'colour':'#d3a522'},{'value':4,'colour':'#c43b3d'}];

	let overlay = function(iso){

		let found = false
		$('#mapoverlay').html('<p>Not in dataset</p>')
		keyValues[23].forEach(function(d){
			if(d['key']==iso){
				let html = `
					<h6><a href="country.html?iso=${d['key']}" target="_blank">${d['country']}</a></h6>
					<p class="p4">Total policy changes</p>
					<p class="p2">${d['value']}</p>
				`
				$('#mapoverlay').html(html)
				found = true
			}
		})
		if(found){$('#mapoverlay').show()} else {$('#mapoverlay').hide()}
	}


	let map = initMap('frame2map',world,keyValues,colourBands,overlay);

	map.setLayer(17);

	$('#framenav2').on('click',function(){
		switchFrame(2,map);
	});

	let sliderLabels = ['Jan 21','Feb 21','Mar 21','Apr 21','May 21','Jun 21','Jul 21','Aug 21','Sep 21','Oct 21','Nov 21','Dec 21','Jan 22','Feb 22','Mar 22','Apr 22','May 22','Jun 22','Jul 22','Aug 22','Sep 22','Oct 22','Nov 22','Dec 22']

	$('#dataframe2slider').on('change',function(){
		let layer = $(this).val();
		map.setLayer(layer-1);
		$('#frame2slidervalue').html(sliderLabels[layer-1])
	})

	$('#frame2slidervalue').html(sliderLabels[23])

	$('#frame2viz').hide();
	$('.frame2legend2').hide();

	$('#frame2navmap').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame2viz').hide()
		$('#frame2mapcontainer').show();
		$('.frame2legend1').show();
		$('.frame2legend2').hide();
		$('#frame2navmap').addClass('active2nav')
		$('#frame2navviz').removeClass('active2nav')
		map.invalidateSize();
	});

	$('#frame2navviz').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame2mapcontainer').hide();
		$('#frame2viz').show();
		$('.frame2legend1').hide();
		$('.frame2legend2').show();
		$('#frame2navmap').removeClass('active2nav')
		$('#frame2navviz').addClass('active2nav')
	});

	populateDataFrame2Viz(data)
	updateKeyStatsFrame2(data)

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const section = urlParams.get('section')

	if(section==2){
		switchFrame(2,map);
	}
}

function updateKeyStatsFrame2(data){
	
	let counts = [0,0,0,0]
	keys = [];
	data.forEach(function(d){
		let key = d['Country ISO3']
		if(keys.indexOf(key)==-1){
			keys.push(key)
		}
	})
	
	keys.forEach(function(key){
		let countrySet = data.filter(function(d){
			if(d['Country ISO3']==key){
				return true
			} else {
				return false
			}
		})
		let policyCount = countrySet.length
		counts[policyCount-1]++
	})

	$('#frame2allcountries').html(keys.length)
	$('#frame21countries').html(counts[0])
	$('#frame22countries').html(counts[1])
	$('#frame23countries').html(counts[2])
	$('#frame24countries').html(counts[3])

}

function populateDataFrame2Viz(data){

	isoCodes = [];
	countryData = []
	data.forEach(function(d){
		if(isoCodes.indexOf(d['Country ISO3'])==-1){
			isoCodes.push(d['Country ISO3'])
			countryData.push({'code':d['Country ISO3'],'continent':d['Continent'],'country':d['Country name'],'dates':[]})
		}
		let date = d3.timeParse("%Y-%m-%d")(d['Date of status change'])
		let last = countryData.length
		countryData[last-1]['dates'].push(date)
	});

	countryData.forEach(function(d){
		let countryCode = d['code'].toLowerCase()
		let html = `<div id="country_${countryCode}" class="countrystatusbox"> 
			<p class="p2">${d['code']}</p>
		</div>`
		let continent = d['continent'].toLowerCase().replace(' ','_')

		$('#frame2viz_'+continent).append(html)
		let id=`#country_${countryCode}`
		$(id).on('mouseover',function(e){

			let mouseX = event.pageX
        	let mouseY = event.pageY

        	if(mouseX>window.innerWidth-400){
        		mouseX = window.innerWidth-400
        	}
        	if(mouseY>window.innerHeight-400){
        		mouseY = window.innerHeight-400
        	}

			$('#mapoverlay').css('top', mouseY);
			$('#mapoverlay').css('left', mouseX);

			$('#mapoverlay').show()
			console.log(d)
			let html = `
                <div>
                	<h6><a href="country.html?iso=${d['code']}" target="_blank">${d['country']}</a></h6>
                    <ol id="statuschanges"></ol>
                </div>
            `
			$('#mapoverlay').html(html)

			let filteredData = data.filter(function(row){
				if(row['Country ISO3'] == d['code']){
					return true
				} else {
					return false
				}
			})
			createStatusText(filteredData)

		})
	})

	data.forEach(function(d){
		let countryCode = d['Country ISO3'].toLowerCase()
		let id=`#country_${countryCode}`
		$(id).append('<div class="implementationbox"><span class="p2 implementationtext">'+d['Status']+'</span><img class="implementationimg" src="images/implementation_type_'+d['Status']+'.svg" width="30" alt="'+statusText[d['Status']]+'"></div>')
		
	})
}

function initDataFrame3(data,world){
	let keyValues = [];
	let isoCodes = []
	data.forEach(function(d){
		if(isoCodes.indexOf(d['Country ISO3'])==-1){
			isoCodes.push(d['Country ISO3'])
		}
	});
	for(let i =0;i<20;i++){
		keyValues[i]=[]
		isoCodes.forEach(function(iso){
			keyValues[i].push({'key':iso,'value':0});
		});
	}

	keyValues.forEach(function(keyValue,i){
		keyValue.forEach(function(country){
			data.forEach(function(d){
				if(d['Country ISO3']==country['key']){
					if(parseInt(d['month'])<i+2){
						country['value']=1
					}
				}
			})
		})
	})

	let total = isoCodes.length
	$('#frame3allcountries').html(total)

	let countriesWithProtest = []
	data.forEach(function(d){
		if(d['month']!=100 && countriesWithProtest.indexOf(d['Country ISO3']==-1)){
			countriesWithProtest.push(d['Country ISO3'])
		}
	});

	let protests = countriesWithProtest.length

	$('#frame3protests').html(protests)

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#FFE89C'},{'value':1,'colour':'#C35414'}]

	let overlay = function(iso){

		let found = false
		$('#mapoverlay').html('<p>Not in dataset</p>')
		data.forEach(function(d){
			if(d['Country ISO3']==iso){
				let html = `
					<h6><a href="country.html?iso=${d['Country ISO3']}" target="_blank">${d['Country']}</a></h6>
				`
				$('#mapoverlay').html(html)
				found = true
			}
		})
		if(found){$('#mapoverlay').show()} else {$('#mapoverlay').hide()}
	}



	let map = initMap('frame3map',world,keyValues,colourBands,overlay)

	map.setLayer(19)

	$('#framenav3').on('click',function(){
		switchFrame(3,map)
	});

	let sliderLabels = ['Jan 21','Feb 21','Mar 21','Apr 21','May 21','Jun 21','Jul 21','Aug 21','Sep 21','Oct 21','Nov 21','Dec 21','Jan 22','Feb 22','Mar 22','Apr 22','May 22','Jun 22','Jul 22','Aug 22']

	$('#dataframe3slider').on('change',function(){
		let layer = $(this).val()
		map.setLayer(layer-1)
		$('#frame3slidervalue').html(sliderLabels[layer-1])
	})

	$('#frame3slidervalue').html(sliderLabels[19])

	$('#frame3viz').hide()
	$('.frame3legend2').hide()

	$('#frame3navmap').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame3viz').hide()
		$('#frame3mapcontainer').show()
		$('#frame3navmap').addClass('active2nav')
		$('#frame3navviz').removeClass('active2nav')
		$('.frame3legend1').show()
		$('.frame3legend2').hide()
		map.invalidateSize()
	});

	$('#frame3navviz').on('click',function(){
		$('#frame3mapcontainer').hide()
		$('#frame3viz').show()
		$('#frame3navmap').removeClass('active2nav')
		$('#frame3navviz').addClass('active2nav')
		$('.frame3legend1').hide()
		$('.frame3legend2').show()
	});

	populateProtestTable(data);

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const section = urlParams.get('section')

	if(section==4){
		switchFrame(3,map);
	}
}

function populateProtestTable(data){
	data.forEach(function(d){
		if(parseInt(d['month'])!=100){
			let html = `<tr><td>${d['Country']}</td><td>${d['Date']}</td><td>${d['Protest Notes']}</td><td><a href="${d['Link']}" target="_blank">Read more</a></td></tr>`
			$('#frame3protesttable').append(html);
		}
	});
}

function initDataFrame4(data,world){
	keyValues = [];
	keys = ['App launched','Centralised','Decentralised','GAEN API','Bluetooth','Location data','QR code','Vaccine information','Decommissioned and relevant data has been deleted']

	keys.forEach(function(key,i){
		newValues = []
		data.forEach(function(d){
			let value = null;

			if(d[key]=='No'){
				value = 0
			}
			if(d[key]=='Yes'){
				value = 1
			}
			newValues.push({'key':d['Country ISO3'],'value':value})
		})
		keyValues.push(newValues)
	})

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#FFE89C'},{'value':1,'colour':'#C35414'}];


	let overlay = function(iso){

		let found = false
		$('#mapoverlay').html('<p>Not in dataset</p>')
		data.forEach(function(row){
			let text = setIcon('#apps',row)
			if(row['Country ISO3']==iso){
				let html = `
					<h6><a href="country.html?iso=${row['Country ISO3']}" target="_blank">${row['Country name']}</a></h6>
					<p>${text}</p>
				`
				$('#mapoverlay').html(html)
				found = true
			}
		})
		if(found){$('#mapoverlay').show()} else {$('#mapoverlay').hide()}
	}



	let map = initMap('frame4map',world,keyValues,colourBands,overlay);

	$('#framenav4').on('click',function(){
		switchFrame(4,map)
	});

	$('.frame4legend2').hide()
	$('#frame4viz').hide()

	$('#frame4navmap').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame4viz').hide();
		$('#frame4map').show();
		$('#frame4navmap').addClass('active2nav')
		$('#frame4navviz').removeClass('active2nav')
		$('.frame4legend1').show()
		$('.frame4legend2').hide()
		map.invalidateSize();
	});

	$('#frame4navviz').on('click',function(){
		$('#frame4map').hide();
		$('#frame4viz').show();
		$('#frame4navmap').removeClass('active2nav')
		$('#frame4navviz').addClass('active2nav')
		$('.frame4legend1').hide()
		$('.frame4legend2').show()
	});

	populateFrame4Menu(keys,map)
	populateFrame4Viz(data)
	populateFrame4KeyStats(data)

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const section = urlParams.get('section')

	if(section==3){
		switchFrame(4,map);
	}

}

function populateFrame4KeyStats(data){
	let total = getKeyStats(data,'App launched');
	let count = getKeyStats(data,'Centralised');
	$('#frame4centralised').html(count+'/'+total);
	count = getKeyStats(data,'Decentralised');
	$('#frame4decentralised').html(count+'/'+total);
	count = getKeyStats(data,'Vaccine information');
	$('#frame4vaccine').html(count+'/'+total);
	count = getKeyStats(data,'QR code');
	$('#frame4qr').html(count+'/'+total);
	count = getKeyStats(data,'Bluetooth');
	$('#frame4bluetooth').html(count+'/'+total);
	count = getKeyStats(data,'Location data');
	$('#frame4location').html(count+'/'+total);
	count = getKeyStats(data,'GAEN API');
	$('#frame4gaen').html(count+'/'+total);

}

function getKeyStats(data,key){
	count = 0
	data.forEach(function(d){
		if(d[key]=='Yes'){
			count++
		}
	});
	return count
}

function populateFrame4Menu(keys,map){


	let definitions = [
		"Centralised: The data is generated, stored and processed on a central server operated by public health authorities. Authorities score users' risk and decide which affected users to inform.",
		"Decentralised: The data is generated, stored and processed on users' mobile devices, and transferred to a backend server, which notifies contacts when a user tests positive for COVID-19. Health authorities do not have access to the server.",
		"GAEN API: API systems built by Google and Apple.",
		"Bluetooth: By turning on Bluetooth, users allow the app to track real-time and historical interactions with other users, and receive an alert if they come into contact with a user who tests positive for COVID-19.",
		"Location data: App uses mobile devices’ location (GPS) to identify contacts who have been in the same locations and test positive for COVID-19.",
		"QR code: Users scan a QR code on entry to venues. If a user who tests positive for COVID-19 shares their results on the app, those users who have scanned the same QR code are notified.",
		"Vaccine information: App has been expanded to include vaccine status information, functioning both as a contact tracing app and vaccine passport.",
		"Decommissioned: App has been retired and user data deleted."
	]


	keys.forEach(function(key,i){
		let html = `<div><p><input type="radio" name="frame4layer" value="${i}" class="frame4nav"> ${key} <img class="helpimg help${i}" src="images/question-circle.svg" alt="help"></p></div>`
		if(i==0){
			html = `<div><p><input type="radio" name="frame4layer" value="${i}" class="frame4nav" checked> ${key}</p></div>`
		}
		
		$('#frame4layers').append(html)

		$('.help'+i).on('click',function(event){
			console.log('over')
			let mouseX = event.pageX
	    	let mouseY = event.pageY

	    	/*if(mouseY>window.innerHeight-200){
	    		mouseY = window.innerHeight-200
	    	}*/


	    	console.log(mouseX)
	    	console.log(mouseY)
	    	let text = definitions[i-1]
			$('#helpoverlay').css('top', mouseY);
			$('#helpoverlay').css('left', mouseX);
			$('#helpoverlay').html(text)
			$('#helpoverlay').show()
		});

		$(document).click(function(event) {
	    if (!$(event.target).is(".helpimg, #helpoverlay")) {
	        $("#helpoverlay").hide();
	    }
});
	});

	$('.frame4nav').on('click',function(){
		let layer = $('input[name="frame4layer"]:checked').val()

		map.setLayer(layer)
	});
}

function populateFrame4Viz(data){
	data.forEach(function(d,i){

		let cls = getAppClass(d)

		let html = `
			<div class="countrystatusbox ${cls}">
				<p>${d['Country ISO3']}</p>
				<div id="app_${d['Country ISO3']}" class="appiconviz">${appIcon}</div>
			</div>`
		let continent = d['Continent'].toLowerCase().replace(' ','_')
		$('#frame4viz_'+continent).append(html);
		let text = setIcon('#app_'+d['Country ISO3'],d)
		$('#app_'+d['Country ISO3']).on('mouseover',function(){
			let mouseX = event.pageX
        	let mouseY = event.pageY

        	if(mouseX>window.innerWidth-100){
        		mouseX = window.innerWidth-100
        	}
        	if(mouseY>window.innerHeight-100){
        		mouseY = window.innerHeight-100
        	}

			$('#mapoverlay').css('top', mouseY);
			$('#mapoverlay').css('left', mouseX);

			$('#mapoverlay').html(text)	

			$('#mapoverlay').show()
			
					
		});
		
	});
}

function initDataLoading(data,map){
	$.ajax({ 
	    type: 'GET', 
	    url: 'data/world_slim.json',
	    dataType: 'json',
	    success:function(response){
			loadData('frame1',response);
			loadData('frame2',response);
			loadData('frame3',response);
			loadData('frame4',response);
	    },
	 	error:function(e){
	 		console.log(e)
	 	}
	});	
}

init();
