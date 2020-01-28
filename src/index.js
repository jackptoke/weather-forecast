var http = require("http");
const fs = require("fs");
const xml2js = require('xml2js');
 

//create a server object:
http
  .createServer(async function(req, res) {
      const option = { explicitRoot: true }
      var parser = new xml2js.Parser(option);

    let xml_data = await fs.readFileSync(__dirname + "/../data.xml", "utf8");
    console.log(xml_data);
    let forecast = null;
    parser.parseString(xml_data, (err, data)=>{
        forecast = data.product.forecast;
    });
    let results = {}
    // console.log(forecast[0].area);
    forecast[0].area.forEach(data => {
        const location = data['$']['description'];
        let forecast = null;
        if(data['forecast-period']){
            // console.log(data['forecast-period']);
            forecast = data['forecast-period'][3]["text"][0]["_"];
        }
        if(forecast)
            results[location] = forecast;
    });

    res.write(JSON.stringify(results));
    res.end();
  })
  .listen(8080); //the server object listens on port 8080
