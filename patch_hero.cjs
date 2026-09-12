const fs = require('fs');
let content = fs.readFileSync('src/components/3d/HeroModel.tsx', 'utf8');

// Add level-up spring
content = content.replace(
  `import { useRef, useMemo } from 'react';`,
  `import { useRef, useEffect, useState } from 'react';\nimport { useSpring, a } from '@react-spring/three';`
);

content = content.replace(
  `export default function HeroModel({ characterClass, element, level }: HeroModelProps) {`,
  `export default function HeroModel({ characterClass, element, level }: HeroModelProps) {\n  const [prevLevel, setPrevLevel] = useState(level);\n  const { scale } = useSpring({\n    scale: level > prevLevel ? 1.2 : 1,\n    config: { mass: 1, tension: 200, friction: 10 },\n    onRest: () => setPrevLevel(level)\n  });`
);

// We need to change the main group to a.group
content = content.replace(
  `<group ref={groupRef} position={[0, -1.5, 0]}>`,
  `<a.group ref={groupRef} position={[0, -1.5, 0]} scale={scale}>`
);
content = content.replace(
  `</group>\n  );\n}`,
  `</a.group>\n  );\n}`
);

fs.writeFileSync('src/components/3d/HeroModel.tsx', content);
