import * as readline from 'readline';
import { checkStringConditional } from './check-string-conditional';

console.log(`\x1B[90m[string-conditional]\x1B[0m`);
console.log('Digite [data:] para adicionar o objeto de validação, [condition:] para escrever sua strCondition, ou [info:] para ver o data atual');

(async () => {
  let data = {}
  while(true){
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
    await new Promise((resolve) => {
      rl.question(`> `, (answer) => {
        rl.close();
  
        if(answer === 'clear'){
          process.stdout.write('\x1Bc');
        }else
        if(answer === 'exit'){
          process.exit()
        }else{
          try{
            const [type, ...unparsedValue] = answer.split(':')
            const value = unparsedValue.join(':')

            if(!['data', 'condition','info'].includes(type)) throw new Error(
              'É obrigatório iniciar o comando com [data:], [condition:] ou [info:]'
            )
            
            if(type === 'info') console.log(`DATA: ${JSON.stringify(data)}`)
            else if(type === 'data') data = JSON.parse(value.trim())
            else{ // 'condition'
              const output = checkStringConditional(value.trim(), data)
              console.log(`RESULT: ${output}\n\nDATA: ${JSON.stringify(data)}`)
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