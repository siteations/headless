//basic node script to log/sort place, pname, other tags

const fs = require('fs');

const chapters = ['00', '01', '02', '03', '04', '05', '06', '07_agents_sites_resources', '08', '09_agents_sites_resources', '10', '11', '12', '13', '14', '15', '16'];


const head = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xslt" href="../../frameworks/tei/xml/tei/stylesheet/html/tei.xsl"?>
<?oxygen RNGSchema="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_lite.rng" type="xml"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
    <teiHeader>
        <fileDesc>
            <titleStmt>
                <title>LANDSCAPE DESIGN A CULTURAL AND ARCHITECTURAL HISTORY</title>
                <author>ELIZABETH BARLOW ROGERS</author>
                <respStmt>
                    <resp>TEI P5 XML markup in conformance with the TEI DTD</resp>
                    <name>AEL Data</name>
                </respStmt>
            </titleStmt>
            <publicationStmt>
                <publisher>HARRY N. ABRAMS, INC.,</publisher>
                <pubPlace/>
                <date/>
            </publicationStmt>
            <sourceDesc>
                <bibl>LANDSCAPE DESIGN A CULTURAL AND ARCHITECTURAL HISTORY by ELIZABETH BARLOW
                    ROGERS</bibl>
            </sourceDesc>
        </fileDesc>
        <profileDesc>
            <langUsage>
                <language ident="en"/>
            </langUsage>
        </profileDesc>
    </teiHeader>
    <text>
        <body>`

const end = `
        </body>
    </text>
</TEI>`


//-------BASIC ERASURE OF HYPHENS, EXTRA LINE BREAKS, CHAPTER LEVEL HEADS/ASSOCIATIONS---------

// chapters.forEach(item=>{

// 	var content = fs.readFileSync(`../svn Landscape Design/repos/xml/BetsyRogers/chapters/${item}.xml`, 'utf8');
// 	var reps = content.match(/(-<lb\/> )|(-<lb\/>)|\r|\n/g, '' );
// 	var contents = content.replace(/(-<lb\/> )|(-<lb\/>)|\r|\n/g, '' );

// 	fs.writeFileSync(`../svn Landscape Design/repos/xml/BetsyRogers/chapters/${item}a.xml`, head+contents+end);

// 	console.log(contents.length, reps.length)

// })

/* work on the a version for the first round of scrubbing:

spec the xml schema with subtype - places into site/subsite, pname into indiv/corp

general place list - check against existing versions (images, RA)

*/
var images =[]

chapters.forEach(item=>{

    var content = fs.readFileSync(`../svn Landscape Design/repos/xml/BetsyRogers/chapters/${item}.xml`, 'utf8');
    var figures = content.match(/<figure xml:id([\s\S]*?)<\/figure>/gm);
    if (figures){
        figures =figures.map((fig, i)=>{
            fig=fig.replace(/\n\s*/gm, '');
            var figObj={};
            figObj.chp = item;
            figObj.id = fig.match(/id="fig-.*?"/gm)[0].replace(/id="fig-|"/gm,'');
            figObj.graphic = fig.match(/graphic url=".*?"/gm)[0].replace(/graphic url="|"/gm,'');
            figObj.desc = fig.match(/<figDesc>.*?<\/figDesc>/gm)? fig.match(/<figDesc>.*?<\/figDesc>/gm)[0].replace(/<figDesc><hi rend="bold">|<\/hi><\/figDesc>|<.*?>|<\/.*?>/gm, ''): null;
            figObj.key = "";
            figObj.match = "";
            figObj.options = [];
            return figObj;
        });
        images=images.concat(figures);
        console.log(item, figures? figures.length: null);

    }

    console.log(item, images.length);

})

//fs.writeFileSync(`../Lists/imageList.js`, 'var images='+JSON.stringify(images)+'; module.exports = images');
