const fs = require('fs');
let content = fs.readFileSync('src/components/themes/TemplateBlueSnake.tsx', 'utf8');

if (!content.includes('import AudioGreeting')) {
    content = content.replace(
        "import Image from 'next/image';",
        "import Image from 'next/image';\nimport AudioGreeting from '../common/AudioGreeting';"
    );
    fs.writeFileSync('src/components/themes/TemplateBlueSnake.tsx', content);
}
