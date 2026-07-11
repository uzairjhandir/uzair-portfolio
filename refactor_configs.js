const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (file.endsWith('.config.ts') || file.endsWith('config.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src/app/(admin)/admin'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find resource string
  const resourceMatch = content.match(/resource:\s*["']([^"']+)["']/);
  const endpointMatch = content.match(/endpoint:\s*["'][^"']+["'],?\s*/);
  
  if (resourceMatch && endpointMatch) {
    const resourceName = resourceMatch[1];
    // Remove endpoint line completely
    content = content.replace(endpointMatch[0], '');
    
    // Add import if missing
    if (!content.includes('ResourceKey')) {
        content = `import { ResourceKey } from "@/lib/api/resources";\n` + content;
    }
    
    // Change resource type cast
    content = content.replace(/resource:\s*["']([^"']+)["']/, `resource: "$1" as ResourceKey`);
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
