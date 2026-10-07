const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/themes/TemplateCinematic.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className="bg-emerald-50 text-gray-900 py-10"/g, 'className="bg-emerald-50 text-gray-900"');
content = content.replace(/className="bg-white text-gray-900 py-10"/g, 'className="bg-white text-gray-900"');
content = content.replace(/className="bg-white py-10"/g, 'className="bg-white"');
content = content.replace(/className="bg-emerald-50 py-10"/g, 'className="bg-emerald-50"');
content = content.replace(/<section className="py-20 bg-emerald-50">/g, '<section className="py-10 bg-emerald-50">'); // Also reduce timeline padding from 20 to 10 maybe? Let's make it py-10. Wait, `py-20` is 80px. `py-10` is 40px.

fs.writeFileSync(file, content);
console.log("Done");
