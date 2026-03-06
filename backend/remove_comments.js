const fs = require('fs');

const seedPath = './prisma/seed.ts';
let content = fs.readFileSync(seedPath, 'utf-8');

// Replace python style comments
content = content.replace(/  # bug:[^\n`]*?(?=\\n|`|\n)/g, '');
// Replace JS style comments
content = content.replace(/  \/\/ bug:[^\n`]*?(?=\\n|`|\n)/g, '');
content = content.replace(/ \/\/ bug:[^\n`]*?(?=\\n|`|\n)/g, '');
content = content.replace(/ # bug:[^\n`]*?(?=\\n|`|\n)/g, '');
// Replace raw "# bug" and "// bug" without colon
content = content.replace(/  # bug/g, '');
content = content.replace(/  \/\/ bug/g, '');
content = content.replace(/ \/\/ bug/g, '');
content = content.replace(/ # bug/g, '');

fs.writeFileSync(seedPath, content);
console.log('Comments removed.');
