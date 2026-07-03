const fs = require('fs');
let html = fs.readFileSync('src/app/pages/checkout-page/checkout-page.html');
let newBuf = Buffer.alloc(html.length);
let j = 0;
for (let i = 0; i < html.length; i++) {
  if (html[i] !== 0x00) {
    newBuf[j++] = html[i];
  }
}
let cleanHtml = newBuf.slice(0, j).toString('utf8');
cleanHtml = cleanHtml.replace('<app-dialog [message]="dialogMessage()" [type]="dialogType()" (closeDialog)="closeDialog()"></app-dialog>', '');
cleanHtml = cleanHtml.replace(/\s+$/, '');
cleanHtml += '\n<app-dialog [message]="dialogMessage()" [type]="dialogType()" (closeDialog)="closeDialog()"></app-dialog>\n';
fs.writeFileSync('src/app/pages/checkout-page/checkout-page.html', cleanHtml, 'utf8');
console.log('Fixed checkout-page.html');
