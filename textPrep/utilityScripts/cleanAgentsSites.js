//basic node script to log/sort place, pname, other tags

const fs = require('fs');

const chapters = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16'];

const uni = [ '&#x2014;',
  '&#x00E9;',
  '&#x00E0;',
  '&#x2013;',
  '&#x00E1;',
  '&#x00B0;',
  '&#x00E8;',
  '&#x00F4;',
  '&#x2026;',
  '&#x00C9;',
  '&#x00E7;',
  '&#x00F6;',
  '&#x00BD;',
  '&#x00ED;',
  '&#x2032;',
  '&#x2033;',
  '&#x00D7;',
  '&#x00F3;',
  '&#x00EB;',
  '&#x00FC;',
  '&#x00E2;',
  '&#x00CE;',
  '&#x00D4;',
  '&#x00EA;',
  '&#x00EE;',
  '&#x00EF;',
  '&#x00E4;',
  '&#x00E3;',
  '&#x00C1;',
  '&#x00FA;',
  '&#x014D;',
  '&#x016B;',
  '&#x00EC;',
  '&#x00F2;' ];

const unicode = [];

chapters.forEach(item=>{

	var contents = fs.readFileSync(`../svn Landscape Design/repos/xml/BetsyRogers/chapters/${item}a.xml`, 'utf8');


	//---------------------general synch----------------------//

	const countAll={
		pages: contents.split('<pb n="').length-1,
		place: contents.split('<name type="place">').length-1,
		pnoun: contents.split('<name type="pname">').length-1,
		notes: contents.split('<note xml:id="').length-1,
		biblio: contents.split('<bibl>').length-1,
		figures: contents.split('<figure xml:id').length-1,
		};

	//add a second object for the index and glossary

	const matchAll={
		pages: contents.match(/<pb n=\".*\/>/g),
		place: contents.match(/<name type="place">(.+?)<\/name>/g),
		pname: contents.match(/<name type="pname">(.+?)<\/name>/g),
		notes: contents.match(/<note xml:id="\S*" place="end">((.|\n|\r)+?)<\/note>/g),
		biblio: contents.match(/<bibl>((.|\n|\r)+?)<\/bibl>/g),
		figures: contents.match(/<figure xml:id="\S*">((.|\n|\r)+?)<\/figure>/g),
		unicode: contents.match(/\&#x\S+?;/g),
		divisions: contents.match(/<div type="\S*">/g)
		};

	matchAll.unicode.forEach(code=>{
		var cleaned = code //.replace('&#x', '').replace(';','');

		if (unicode.indexOf(cleaned) === -1){
			unicode.push(cleaned);
		}
	})


	console.log(item, countAll, unicode);

	// var chapters = contents.split('<div type="chapter">').map(each=>'<div type="chapter">' + each)
	// 		chapters.forEach((chapter, i)=> fs.writeFileSync('../Landscape Design/chapters/'+(i-1).toLocaleString(undefined, { minimumIntegerDigits: 3 })+ '.xml', chapter));

//---------------------------- agents basics (run me first) -----------------------------------

/*
	var agentsInd = [];
	var agentsArr=[];
	var agents = contents.match(/<name type="pname"((.|\n|\r)+?)<\/name>/g)
		.forEach(match=>{
			var agent = match.match(/>((.|\n|\r)+?)</g)[0].replace(/>|<|\n|\r/g, '').replace(/(\s{1,})/g,' ');
			if (agentsInd.indexOf(agent)===-1){
				agentsInd.push(agent)
				agentsArr.push({name:[agent], id:0, chp:item })
			}
	});

	console.log(agentsArr, agentsInd.length)

	fs.writeFileSync(`../Lists/${item}agents.js`, 'var agents='+JSON.stringify(agentsArr)+'; module.exports.agents = agents');

*/

//---------------------------- site basics (run me after all agent processing is done) -----------------------------------

/*
	var sitesInd = [];
	var sitesArr=[];
	var site = contents.match(/<name type="place" subtype=((.|\n|\r)+?)<\/name>/g)
		.forEach(elem=>{
			var site = elem.match(/>((.|\n|\r)+?)</g)[0].replace(/>|<|\n|\r/g, '').replace(/(\s{1,})/g,' ');
			if (sitesInd.indexOf(site)===-1){
				sitesInd.push(site)
				agentsArr.push({name:[agent], id:0, chp:item })
			}
	});

	console.log(agentsArr, agentsInd.length)

	fs.writeFileSync(`../Lists/${item}agents.js`, 'var agents='+JSON.stringify(agentsArr)+'; module.exports.agents = agents');

*/


})

//-------------revise agents and check matching (2 rounds), secondary text read through-------------------

// TIMING NOTE:
// First round, basic checks for names: 2pm-4:52pm, 4:52-5:37pm for secondary checks (~4 hrs)
// in advance of computational count

// grab addition agents and place additions during read through...
// second round additions of name/placement correction in oxygen: 12:23pm-1:33pm, 3:36-3:54PM, 6:30-7:12pm, plus an hour min. 8:40pm-9pm, 1-2:50pm (1+1.5+.75+.25+2 = 5.5-6 hr with footnotes)
// addition of notes:


const {agents} = require(`../Lists/07agents.js`);
const agJS = agents.map((ag,i)=>{ag.count=0; ag.id=7000+i; return ag});

var chpRev = fs.readFileSync(`../svn Landscape Design/repos/xml/BetsyRogers/chapters/07a.xml`, 'utf8');
var chpCount = chpRev.match(/<name type="pname"((.|\n|\r)+?)<\/name>/g).length
var omitted =[]
var chpAgents = chpRev.match(/<name type="pname"((.|\n|\r)+?)<\/name>/g)
											.forEach(match=>{
														var agent = match.match(/>((.|\n|\r)+?)</g)[0].replace(/>|<|\n|\r/g, '').replace(/(\s{1,})/g,' ');
														var agentType = (match.match(/subtype="\w+?"/g))? match.match(/subtype="\w+?"/g)[0].replace(/subtype="/g, '').replace(/"/g, '') : null ;
														var currCount = chpCount;
														agJS.forEach(ag=>{
														if (ag.name.indexOf(agent)!==-1){
															ag.count ++ ;
															ag.type = agentType ;
															delete ag.subtype;
															chpCount -- ;
														}
														})
														if (currCount === chpCount){omitted.push(agent)};
												});
	const ag = agJS.filter(each=>each.count===0);

//console.log('agents found', ag);

fs.writeFileSync(`../Lists/07agentsA.js`, 'var agents='+JSON.stringify(agJS)+'; module.exports.agents = agents');

//-------------revise agents and add to html-------------------

// TIMING NOTE:
// Second round, basic checks for names: with updated list of tags
// in advance of computational count



