const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

// Convert CSV to JSON
csv()
  .fromFile('./assets/voters.csv')
  .then((jsonObj) => {
    const voters = jsonObj.map((row) => ({
      id: row[0],
      name: row[1],
      hasVoted: false,
    }));

    // Save JSON to a file
    fs.writeFileSync(path.join(__dirname, 'voters.json'), JSON.stringify(voters, null, 2));
    console.log('CSV successfully converted to JSON');
  });
