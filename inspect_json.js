const fs = require('fs');

const stream = fs.createReadStream('./base-de-donnee/fr-esr-mon_master.json', {encoding: 'utf8'});
let data = '';

stream.on('data', (chunk) => {
  data += chunk;

  if (data.includes('}]') || data.includes('},')) {
    try {
    
        const firstObjEnd = data.indexOf('}');
        if (firstObjEnd !== -1) {
            const firstObjStr = data.substring(data.indexOf('{'), firstObjEnd + 1);
            const obj = JSON.parse(firstObjStr);
            console.log(JSON.stringify(Object.keys(obj), null, 2));
            console.log('Sample Data:', JSON.stringify(obj, null, 2));
            process.exit(0);
        }
    } catch (e) {
   
    }
  }
  // Safety break if too much data
  if (data.length > 100000) {
      console.log("Could not parse first object in first 100kb");
      process.exit(1);
  }
});