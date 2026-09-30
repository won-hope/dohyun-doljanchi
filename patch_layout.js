const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf8');

if (!content.includes('<meta name="color-scheme"')) {
  content = content.replace(
    '<html lang="ko" className={`${jua.variable} ${notoSans.variable}`}>',
    '<html lang="ko" className={`${jua.variable} ${notoSans.variable}`}>\n      <head>\n        <meta name="color-scheme" content="light only" />\n        <meta name="supported-color-schemes" content="light" />\n      </head>'
  );
}

fs.writeFileSync('src/app/layout.tsx', content);
