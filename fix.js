const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src/app/(admin)/admin/homepage'), function(filePath) {
  if (filePath.endsWith('form.tsx')) {
    let code = fs.readFileSync(filePath, 'utf8');
    code = code.replace(/resolver: zodResolver\((.*?)\),/g, 'resolver: zodResolver($1) as any,');
    code = code.replace(/form\.handleSubmit\(handleSubmit\)/g, 'form.handleSubmit(handleSubmit as any)');
    fs.writeFileSync(filePath, code);
  }
});
