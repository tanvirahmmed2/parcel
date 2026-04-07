const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if(file.endsWith('.js') || file.endsWith('.md') || file.endsWith('.json') || file.endsWith('.css')){
          results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
files.push(path.join(__dirname, 'README.md'));
files.push(path.join(__dirname, 'package.json'));

let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/Steadfast Logistics/g, 'Parcel');
  content = content.replace(/Steadfast/g, 'Parcel');
  content = content.replace(/steadfast/g, 'parcel');
  content = content.replace(/STEADFAST/g, 'PARCEL');

  content = content.replace(/Percel/g, 'Parcel');
  content = content.replace(/percel/g, 'parcel');
  content = content.replace(/PERCEL/g, 'PARCEL');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});

console.log(`Updated ${changedCount} files.`);
