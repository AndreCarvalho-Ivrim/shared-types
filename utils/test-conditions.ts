import * as readline from 'readline';
import { checkStringConditional, getCodeHelpers, getShortcodes } from './check-string-conditional';

console.log(`\x1B[90m[string-conditional]\n`);
console.log('Digite help para listar todos os prefixos de funcionalidades\x1B[0m\n')

const obs = '\x1B[90m[obs: funções com dois pontos necessitam de conteúdo adicional]\x1B[0m\n';
const helpInfo =        '. . (Ver o data atual)'
const helpData =        '. . (Adicionar o objeto de validação)'
const helpCondition =   '. . (Escrever sua strCondition)'
const helpCodeHelpers = '. . (Extrair code helpers de uma string)'
const helpShortcodes =  '. . (Extrair shortcodes de uma string)'
const help = `${obs}\nhelp\n. . (Listar todos os prefixos de funcionalidades executadas pelo strc)\n\ninfo \n${helpInfo}\n\ndata: \n${helpData}\n\ncondition: \n${helpCondition}\n\ncode-helpers: \n${helpCodeHelpers}\n\nshortcodes: \n${helpShortcodes}\n`;

(async () => {
  let data = {}
  while(true){
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
    await new Promise((resolve) => {
      rl.question(`> `, (answer) => {
        rl.close();

        answer = answer.trim()
        
        if(answer === 'clear') process.stdout.write('\x1Bc');
        else if(answer === 'exit') process.exit()
        else if(answer === 'help') console.log(help) 
        else if(answer === 'info') console.log(`DATA: ${JSON.stringify(data)}`)
        else{
          try{
            const [type, ...unparsedValue] = answer.split(':')
            const value = unparsedValue.join(':').trim()
            
            let output : any;
            switch(type){
              case 'data': data = JSON.parse(value); break;
              case 'condition':
                output = checkStringConditional(value, data)
                console.log(`RESULT: ${output}\n\nDATA: ${JSON.stringify(data)}`)
                break;
              case 'code-helpers':
                output = getCodeHelpers(value)
                console.log(`CODE HELPERS:\n\n${JSON.stringify(output)}`)
                break;
              case 'shortcodes':
                output = getShortcodes(value)
                console.log(`SHORTCODES:\n\n${JSON.stringify(output)}`)
                break;
              default: 
                console.log(`\n\x1B[31m[invalid-prefix]:\x1B[0m\n\n`, help)
                break;
            }
          }catch(e: any){
            if(!e.message) throw new Error(e)
            console.log(`\n\x1B[31m[cmd-error]:\x1B[0m\n\n`, e.message)
          }
        }
  
        resolve(true)
      });
    });
  }
})()