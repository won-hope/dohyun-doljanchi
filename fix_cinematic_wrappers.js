const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/themes/TemplateCinematic.tsx');
let content = fs.readFileSync(file, 'utf8');

// We want to replace:
// <div className="...">
//   {config.useX !== false && <X ... />}
// </div>
// With:
// {config.useX !== false && (
//   <div className="...">
//     <X ... />
//   </div>
// )}

content = content.replace(
  /<div className="bg-emerald-50 text-gray-900" style={{ '--bg-color': '#ecfdf5', '--text-color': '#064e3b' } as React\.CSSProperties}>\s*\{config\.useTmi !== false && <TmiSection config=\{config\} \/>\}\s*<\/div>/g,
  `{config.useTmi !== false && (
      <div className="bg-emerald-50 text-gray-900" style={{ '--bg-color': '#ecfdf5', '--text-color': '#064e3b' } as React.CSSProperties}>
        <TmiSection config={config} />
      </div>
  )}`
);

content = content.replace(
  /<div className="bg-white text-gray-900">\s*\{config\.useGallery !== false && <Gallery config=\{config\} \/>\}\s*<\/div>/g,
  `{config.useGallery !== false && (
      <div className="bg-white text-gray-900">
        <Gallery config={config} />
      </div>
  )}`
);

content = content.replace(
  /\{config\.useRsvp !== false && config\.eventMode !== 'THANK_YOU' && \(\s*<div className="bg-emerald-50 text-gray-900" style={{ '--bg-color': '#ecfdf5', '--text-color': '#064e3b' } as React\.CSSProperties}>\s*<RsvpForm config=\{config\} \/>\s*<\/div>\s*\)\}/g,
  `{config.useRsvp !== false && config.eventMode !== 'THANK_YOU' && (
      <div className="bg-emerald-50 text-gray-900" style={{ '--bg-color': '#ecfdf5', '--text-color': '#064e3b' } as React.CSSProperties}>
        <RsvpForm config={config} />
      </div>
  )}` // Wait, this one already has condition wrapping the div!
);

fs.writeFileSync(file, content);
console.log("Done");
