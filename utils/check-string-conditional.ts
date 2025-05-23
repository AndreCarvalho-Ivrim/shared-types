import { StringConditionalTypes } from "..";
import { getRecursiveValue, replaceAll } from "./recursive-datas";

export const handleStringConditionalExtendingFlowData = (conditional: string, data: Record<string, any>, flow_data: { data: any, [key: string]: any }, prefix: 'flow_data' | 'observer' = 'flow_data') => {
  const pattern = prefix === 'flow_data' ? /\$flow_data:([^ ]+)/g : /\$observer:([^ ]+)/g;
  const matches = conditional.split(';').reduce((acc, curr) => [
    ...acc,
    ...((curr.matchAll(pattern) as any) ?? []) as string[]
  ], [] as string[]) as string[];

  const contents = matches.map(match => match[1]);

  contents.map((key) => {
    const value = getRecursiveValue(key, {
      data: {
        ...flow_data.data,
        ...(prefix === 'flow_data' ? {
          _id: flow_data._id,
          current_step_id: flow_data.current_step_id,
          changed_step_at: flow_data.changed_step_at,
          created_at: flow_data.created_at,
          updated_at: flow_data.updated_at
        } : {})
      }
    });
    data[`${prefix}:${key}`] = value;
  })

  return data;
}
export const handleSTRCExtendingFlowDataAndObserver = (conditional: string, data: Record<string, any>, flow_data: { data: any, [key: string]: any }, observer: Record<string, any>) => {
  if (observer && Object.keys(observer).length > 0) data = handleStringConditionalExtendingFlowData(
    conditional, data, { data: observer }, 'observer'
  )
  if (flow_data) data = handleStringConditionalExtendingFlowData(
    conditional, data, flow_data
  )
  return data;
}
/**
 * Condicionais descritas em string, com separador ponto e vírgula. Para explicar a função \
 * de cada bloco da condicional, é necessário iniciar com um préfixo:
 * 
 * $: é utilizado para referênciar variáveis \
 * \#: é utilizado para referência operadores \
 * \*: é utilizado para referência valores hardcode \
 * &: é utilizado para referência operadores lógicos
 * 
 * Exemplo: 
 * 
 * ``` $variable1;#eq;*value1;&and;$variable;#gte;*2 ```
 * 
 * Este exemplo está verificada se a variável ```variable1``` é igual a string "value1" e \
 * se a variável ```variable2``` é maior ou igual ao número 2.
 * 
 * **Operadores**
 * - eq
 * - lt
 * - lte
 * - gt
 * - gte
 * - in
 * - nin
 * - not
 * - filled (exclusivo para arrays)
 * - contains (exclusivo para arrays)
 * 
 * **Operadores Lógicos**
 * - and
 * - or \
 * sufixo -begin: (o segundo fator da condicional está em uma abertura de parêntese)
 * - and-begin 
 * - or-begin
 * sufixo [-end,-end, ...]: (o segundo fator da condicional fecha um(ou mais) parênteses aberto)
 * - and-end | and-end-end | and-end-end-end...
 * - or-end  | or-end-end  | or-end-end-end...
 * 
 * **Valores especiais**
 * - !!: quando usar este simbolo irá verificar se a variável é verdadeira
 * - !: quando usar este simbolo irá verificar se a variável é falsa
 * - >0, <2: quando usar o operador filled, podemos usar uma expressão parecida com essa \
 * para fazer verificações de length (length maior que 0, length menor que 2)
 */
export const checkStringConditional = (strConditional: string, datas: Record<string, any>, conditionalName = 'anonymous'): boolean => {
  let condition: {
    type: StringConditionalTypes,
    value: string
  }[] = strConditional.split(';').filter(c => c.length > 0).map((c) => {
    let identifier = c.substring(0, 1);
    return {
      type:
        identifier === '$' ? 'prop' :
          identifier === '#' ? 'operator' :
            identifier === '*' ? 'value' :
              identifier === '&' ? 'logic' : undefined,
      value: c.substr(1, c.length - 1)
    } as {
      type: StringConditionalTypes | undefined,
      value: string
    };
  }).filter(c => c.type !== undefined) as {
    type: StringConditionalTypes,
    value: string
  }[];
  
  if (condition.length === 0) return false;

  const unionConditionals: string[] = [];
  const groupConditionals: Array<{
    type: StringConditionalTypes,
    value: string
  }[]> = [];

  condition.forEach((c) => {
    if (c.type === 'logic') {
      unionConditionals.push(c.value);
      return;
    }

    let unionLen = unionConditionals.length;
    if (groupConditionals[unionLen]) groupConditionals[unionLen].push(c);
    else groupConditionals[unionLen] = [c];
  });

  if (unionConditionals.length !== 0 && (unionConditionals.length + 1) !== groupConditionals.length) throw new Error(
    `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Proporção de uniões e grupos não está dentro do esperado. (${strConditional})`
  );

  const callbackOperator = (val_1: string | number | boolean | any[], val_2: string | number | boolean | any[], operator: string) => {
    //#region HANDLE POSSIBLE BOOL
    [val_1, val_2].forEach((val) => {
      if (val === 'true') val = true
      else if (val === 'false') val = false
    })
    //#endregion HANDLE POSSIBLE BOOL

    if (val_2 === '!!') return !!val_1;
    if (val_2 === '!') return !val_1 || val_1 === 'false';

    if (Array.isArray(val_1)) throw new Error(
      'O primeiro valor não pode ser uma lista'
    )
    if (Array.isArray(val_2)) {
      if (operator !== 'in' && operator !== 'nin') throw new Error(
        `Está operação(${operator}) não pode ser realizada com itens do tipo lista`
      )

      val_2 = val_2.map((v) => String(v))
    } else {
      if (isNaN(Number(val_1)) || isNaN(Number(val_2))) {
        val_1 = String(val_1);
        val_2 = String(val_2);
      } else {
        val_1 = Number(val_1);
        val_2 = Number(val_2);
      }
    }

    switch (operator) {
      case 'eq': return val_1 === val_2;
      case 'lt': return val_1 < val_2;
      case 'lte': return val_1 <= val_2;
      case 'gt': return val_1 > val_2;
      case 'gte': return val_1 >= val_2;
      case 'in':
        if (!val_2 || (Array.isArray(val_2) && val_2.length === 0)) return false;
        if (!Array.isArray(val_2)) val_2 = String(val_2).split(',');

        return val_2.includes(String(val_1));
      case 'nin':
        if (!val_2 || (Array.isArray(val_2) && val_2.length === 0)) return true;
        if (!Array.isArray(val_2)) val_2 = String(val_2).split(',');

        return !val_2.includes(String(val_1));
      case 'not': return val_1 !== val_2;
    }
    return false;
  }
  const callbackArrayOperator = (arr: (string | number)[], val: string | number, operator: 'contains' | 'filled') => {
    if (operator === 'filled') {
      const len = arr.length;
      let isFilled = len > 0
      if (val === '!') return !isFilled;
      if (val === '!!') return isFilled;
      if (!isFilled) return Number(val) === 0;

      if (typeof val !== 'string' || (!(
        ['>', '<'].includes(val.slice(0, 1)) && !isNaN(Number(val.slice(1)))
      ) && isNaN(Number(val)))) return isFilled

      if (['>', '<'].includes(val.slice(0, 1))) {
        const num = Number(val.slice(1));
        return val.slice(0, 1) === '>' ? len > num : len < num
      }

      return len == Number(val)
    }

    if (operator === 'contains') {
      let isNumber = !isNaN(Number(val)) && !arr.find(v => isNaN(Number(v)));
      if (isNumber) {
        val = Number(val);
        arr = arr.map(v => Number(v));
      } else {
        val = String(val);
        arr = arr.map(v => String(v));
      }

      return arr.includes(val);
    }

    return false;
  }

  try {
    let matchesConditional: boolean[] = [];
    groupConditionals.forEach((condition) => {
      let values: (string | number | (string | number)[])[] = [];
      let operators: string[] = [];
      if (condition.length % 2 === 0) throw new Error(
        `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Deve seguir o modelo de prop/value, operator, prop/value, ... (${strConditional})`
      );
      condition.forEach((c, i) => {
        if (i % 2 === 0) {
          if (['logic', 'operator'].includes(c.type)) throw Error(
            `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. É obrigatório que o index par seja ocupado por uma propriedade ou valor (${strConditional})`
          );

          if (c.type === 'prop') values.push(
            getRecursiveValue(c.value, { data: datas }) ?? undefined
          );
          else if (c.type === 'value') {
            const helpers = getCodeHelpers(c.value, true);
            if (!helpers) values.push(c.value)
            else {
              let value = c.value;

              helpers.forEach(([code, param, splitParam]) => {
                switch (code) {
                  case '@now': value = handleCodeHelper__now(value, code, param); break;
                  case 'linearArithmetic':
                    if(!param) throw new Error(`Erro code: ${code}`)
                    const parsedParams: number[] = [];
                    (splitParam ?? []).forEach(shortcode => {
                      const valueToReplace = getRecursiveValue(shortcode, { data: datas }) ?? Number(shortcode);              
                      parsedParams.push(valueToReplace);
                    });
                    value = handleCodeHelpers({
                      chParam: param,
                      codeHelper: code,
                      parsedParams: parsedParams
                    });
                    break;
                  default: console.error(`[helper: ${code}] Helper inválido ou ainda não possui tratamento`); break;
                }
              });

              values.push(value);
            }
          }
          else values.push('');
        } else {
          if (c.type !== 'operator') throw Error(
            `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. É obrigatório que o index ímpar seja ocupado por um operador (${strConditional})`
          );

          operators.push(c.value);
        }
      });
        
      if (operators.length !== 0 && (operators.length * 2) !== values.length) throw new Error(
        `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Proporção de valores e operadores não está dentro do esperado. (${strConditional})`
      );

      let matchOperation: boolean | undefined = undefined;
      operators.forEach((op, i) => {
        if (matchOperation !== undefined && !matchOperation) return;

        if (op === 'contains' || op === 'filled') {
          if (!values[i * 2]) matchOperation = false;
          else {
            if (!Array.isArray(values[i * 2])) values[i * 2] = [values[i * 2] as string | number];
            if (!Array.isArray(values[(i * 2) + 1])) matchOperation = callbackArrayOperator(
              values[i * 2] as Array<string | number>,
              values[(i * 2) + 1] as string | number,
              op
            )
            else throw new Error(
              `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Em uma comparação de 'item contém na lista', a lista deve vir primeiro, e depois o valor a ser procurado. (${strConditional})`
            )
          }
        }
        else {
          if ((
            Array.isArray(values[i * 2]) || Array.isArray(values[(i * 2) + 1])
          ) && !(
            typeof values[(i * 2) + 1] === 'string' && ['!!', '!'].includes(values[(i * 2) + 1] as string)
          ) && !(
            !Array.isArray(values[i * 2]) && ['nin', 'in'].includes(op)
          )) throw new Error(
            `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Não é possível executar essa operação em um valor do tipo lista. (${strConditional})`
          )
          else matchOperation = callbackOperator(
            values[i * 2],
            values[(i * 2) + 1],
            op
          );
        }
      });

      matchesConditional.push(matchOperation ?? false);
    });

    const callbackUnion = (val_1: boolean, val_2: boolean, condition: string) => {
      switch (condition) {
        case 'and': return val_1 && val_2;
        case 'or': 
          if(val_1 || val_2) return true;
          return;
      }
      return false;
    }

    if (unionConditionals.length === 0) return matchesConditional.length === 0 ? false : matchesConditional[0];

    const handleRecursiveUnionMatch = ({ unionConditionals, initialMatch }:{
      unionConditionals: string[],
      initialMatch: boolean,
      matchesConditional: boolean[]
    }) => {
      let unionMatch: boolean | undefined;
      let inParentesesDepth = 0;
      for(const [i, uni] of unionConditionals.entries()){
        if (unionMatch !== undefined && !unionMatch) break;
    
        let parsedUni = uni;
        
        if(uni.includes('-end')) parsedUni = replaceAll(
          uni, '-end',''
        );

        if(uni.includes('-begin')){
          inParentesesDepth++;
          if(inParentesesDepth > 1) continue;

          parsedUni = parsedUni.replace('-begin','')

          const secondMatch = handleRecursiveUnionMatch({
            unionConditionals: unionConditionals.slice(i + 1),
            initialMatch: matchesConditional[i + 1],
            matchesConditional: matchesConditional.slice(i + 1)
          })

          unionMatch = callbackUnion(
            i === 0 ? initialMatch : unionMatch!,
            !!secondMatch,
            parsedUni
          );

          continue;
        }
        
        if(inParentesesDepth === 0) unionMatch = callbackUnion(
          i === 0 ? matchesConditional[0] : unionMatch!,
          matchesConditional[i + 1],
          parsedUni
        );

        if(uni.includes('-end')){
          if(inParentesesDepth <= 0) break;
          else{
            const countClosures = (uni.match(/-end/g) ?? []).length
            inParentesesDepth-= countClosures;
          }
        }

        if(inParentesesDepth < 0) break;
      }

      return unionMatch
    }

    let unionMatch: boolean | undefined = handleRecursiveUnionMatch({
      unionConditionals,
      initialMatch: matchesConditional[0],
      matchesConditional
    });

    return !!unionMatch;
  } catch (e) {
    console.error(e);
    return false;
  }
};
export const makeStrc = (arrStrc: Array<{
  '$'?: string,
  '#'?: 'eq' |'lt' |'lte' |'gt' |'gte' |'in' |'nin' |'not' |'filled' | 'contains',
  '*'?: string,
  /** Se o -end for mais de 2 fechamentos use o as any para ignorar o erro de tipagem */
  '&'?: 'and' | 'or' | 'and-begin' | 'or-begin' | 'and-end' | 'or-end' | 'and-end-end' | 'or-end-end'
}>) => {
  return arrStrc.map(strc => {
    if(strc['$']) return `$${strc['$']}`;
    if(strc['#']) return `#${strc['#']}`;
    if(strc['*']) return `*${strc['*']}`;
    if(strc['&']) return `&${strc['&']}`;
  }).join(';')
}
/**
 * Lida com shortcodes do tipo \@[\<variavel>]
 * 
 * Obs. Se quiser acessar alguma posição de um array utilize {} em vez de [],\
 * para não dar erro no regex. Exemplo:
 * 
 * ```
 *  searched: \@[array{0}] 
 *  extracted: array{0}
 * ```
 */
export const getShortcodes = (content: string): string[] => {
  var sintaxes = /@\[([^\]]+)\]/g;
  if (!content) return [];
  var matches = (content.match(sintaxes) ?? []) as string[];
  return matches.map(m => m.substr(2, m.length - 3));
}
/**
 * - Se não existir code helper retornará undefined
 * - Se exitir code helper a resposta será um array de arrays de 1-3 posições, onde:
 * 
 * 1º: Code helper \
 * 2º: Caso existam parametros, retornará uma string com todos parametros \
 * 3º: Caso split_params for true e o code helper ter parametros, retornará o array de \
 * parametros separado, considerando separação por virgular, ou por operadores aritméticos
 */
export const getCodeHelpers = (value: string, split_params = false): Array<[string, string?, string[]?]> | undefined => {
  if (!value || typeof value !== 'string' || !value.includes('__')) return

  const regex = /__(.*?)__/g;
  const matches = value.match(regex);

  if (!matches || matches.length === 0) return;

  const codes = matches.map(match => match.replace(/__/g, ''));

  const extractedContents = codes.map(code => {
    const regexContent = /([^()]+)\(([^()]+)\)/;
    const matchContent = regexContent.exec(code);
    if (matchContent) {
      //#region HANDLE MASKED PARENTHESES
      const availableParenthesesMasks = { '&#40;': '(','&#41;': ')' };

      Object.entries(availableParenthesesMasks).forEach(([mask,  unmasked]) => {
        if(!matchContent[2].includes(mask))  return;

        matchContent[2] = replaceAll(matchContent[2], mask, unmasked)
      });
      //#endregion HANDLE MASKED PARENTHESES
      
      if (split_params) {
        let toSplitParams = matchContent[2]
        
        let shortcodes = getShortcodes(toSplitParams)

        let shortcodesToReplace: Array<[string, string]> = []
        shortcodes.forEach((code, i) => {
          const toReplace: [string, string] = [`param_${i}`, `@[${code}]`]
          toSplitParams = replaceAll(toSplitParams, toReplace[1], toReplace[0])
          shortcodesToReplace.push(toReplace)
        })

        return [
          matchContent[1],
          matchContent[2],
          toSplitParams.split(/[,+*/-]/).map((p) => {
            shortcodesToReplace.reverse().forEach((toReplace) => {
              p = replaceAll(p, toReplace[0], toReplace[1])
            })
            return p;
          })
        ];
      }

      else return [matchContent[1], matchContent[2]];
    }
    return [code];
  });

  return extractedContents as Array<[string, string?]>;
}
/**
 * Esta função recebe o value(string) contendo o codehelper de data, e faz o replace com o valor resultante.
 * 
 * Se não passar parametros(exemplo: ```__@now__```), retornará a data atual no padrão dd/mm/yyyy
 * 
 * Parâmetros:
 * - Pode ser passado adição ou subtração de dias (exemplo: ```__@now(+2)__```). Neste caso o valor retornado \
 * será no padrão yyyy-mm-dd
 * - Pode ser passado parametros de formatação usando as nomenclaturas abaixo junto com o separador de sua \
 * escolha: 
 * ``` ['isostring', 'Y', 'y', 'm', 'd', 'h', 'i', 's'] ```
 * - Pode ser passado ambos os parametros, desde que a soma/subtração venha antes, e depois o parametro de \
 * formatação, usando a separação de vírgula entre os parametros. Exemplo:
 * ```__@now(-3,d/m/Y)__```
 * Neste caso retornando a data de três dias atrás no formato dd/mm/yyyy
 */
export const handleCodeHelper__now = (value: string, code: string, param?: string) => {
  const date = new Date();
  var replacer = '';

  //#region HELPERS
  const chars = ['isostring', 'Y', 'y', 'm', 'd', 'h', 'i', 's']
  const replaceDateChar = (p: string, value: string, date: Date) => {
    let replacer = '';
    if (p === 'isostring') replacer = String(date.toISOString());
    else if (p === 'Y') replacer = String(date.getFullYear());
    else if (p === 'y') replacer = String(date.getFullYear() - 2000);
    else if (p === 'm') replacer = String(date.getMonth() + 1).padStart(2, '0');
    else if (p === 'd') replacer = String(date.getDate()).padStart(2, '0');
    else if (p === 'h') replacer = String(date.getHours()).padStart(2, '0');
    else if (p === 'i') replacer = String(date.getMinutes()).padStart(2, '0');
    else if (p === 's') replacer = String(date.getSeconds()).padStart(2, '0');

    if (!replacer) return value;

    return replaceAll(value, p, replacer)
  }
  const handleFormatReplacers = (chars: string[], param: string, date: Date) : string => {
    if (chars.some((char) => param.includes(char))) {
      return chars.reduce((acc, curr) => {
        if (acc.includes(curr)) return replaceDateChar(curr, acc, date)
        return acc;
      }, param)
    }
    else throw new Error(`(${param}) Replacer de data inválido`);
  }
  //#endregion HELPERS

  if(param){
    let dateIsChanged = true;
    const splitedParam = param.split(',')
    const num = splitedParam[0].slice(1);

    if(param.indexOf('+') === 0) {
      if (num.includes('m')) {
        date.setMinutes(
          date.getMinutes() + Number(num.slice(0, num.indexOf('m'))) 
        )
      }
      else date.setDate(
        date.getDate() + Number(num)
      )
    }
    else if(param.indexOf('-') === 0) { 
      if (num.includes('m')) {
        date.setMinutes(
          date.getMinutes() - Number(num.slice(0, num.indexOf('m'))) 
        )
      }
      else date.setDate(
        date.getDate() - Number(num)
      )
    }
    else dateIsChanged = false;

    if(dateIsChanged){
      if(splitedParam.length > 1) replacer = handleFormatReplacers(
        chars,
        splitedParam[1],
        date
      );
      else replacer = handleFormatReplacers(
        chars,
        'Y-m-d',
        date
      );
    }
    else replacer = handleFormatReplacers(
      chars,
      splitedParam[0],
      date
    );
  }else replacer = handleFormatReplacers(
    chars,
    'd/m/Y',
    date
  );

  var searchValue = param ? `__${code}(${param})__` : `__${code}__`;

  return replaceAll(value, searchValue, replacer);
}
export const handleCodeHelper__diffInDays = ({ data, param, value }:{ value: string, param: string, data: any }) => {
  const code = '@diffInDays';
  
  let replacer = ''
  if(param  && data){
    const handleParseDate = ({ data, key }:{ key?: string, data: any }) : Date | undefined => {
      if(!key || ['-','+'].includes(key.slice(0, 1))){
        const now = new Date();
        now.setHours(0,0,0,0);

        if(key){
          const isPlus = key.slice(0, 1) === '+';
          const num = Number(key.slice(1));

          if(isNaN(num)) return;

          now.setDate(
            isPlus ? now.getDate() + num : now.getDate() - num
          );
        }

        return now;
      }

      const value = getRecursiveValue(key, { data });
      
      if(!value) return;
      
      if(value instanceof Date){
        value.setHours(0,0,0,0);
        return value;
      }
      
      if(typeof value !== 'string' || value.length < 10) return;
      
      const separator = value.includes('-') ? '-' : value.includes('/') ? '/' : undefined
      let splited = value.slice(0, 10).split(separator ?? '')
      if(!separator || splited.length !== 3) return;

      if(splited[0].length === 2) splited = [...splited.reverse()]
      return new Date(`${splited.join('-')}T00:00:00`)
    }

    let [dateFrom, dateTo, isAbs] = param.split(',') as [string?,string?,(string | boolean)?];

    if(!dateFrom || ['null', 'undefined'].includes(dateFrom)) dateFrom = undefined;
    if(!dateTo || ['null', 'undefined'].includes(dateTo)) dateTo = undefined;
    isAbs = isAbs === 'true';
    
    const date1 = handleParseDate({ key: dateFrom, data });
    const date2 = handleParseDate({ key: dateTo, data });
    
    if(date1 && date2){
      const diffInMS = date2.getTime() - date1.getTime();
      let diffInDays = Math.floor(diffInMS / (1000 * 60 * 60 * 24));

      if(isAbs) diffInDays = Math.abs(diffInDays);

      replacer = String(diffInDays); 
    }
  }
  
  var searchValue = param ? `__${code}(${param})__` : `__${code}__`;

  return replaceAll(value, searchValue, replacer);
}
const avHandleCodeHelpers = ['sum', 'sumWithMultiplier', 'len', 'linearArithmetic', 'distinct', 'groupByAndSum'];
export const handleCodeHelpers = ({ codeHelper, chParam, parsedParams }: {
  codeHelper: string,
  chParam: string,
  parsedParams: any[]
}) => {
  let value: any = undefined;
  
  if (codeHelper === 'sum') {
    if (!chParam || (parsedParams ?? []).length === 0) return undefined;

    let arr = parsedParams;

    if (!Array.isArray(arr)) value = 0;
    else value = arr.reduce((acc, curr) => {
      let val = typeof curr === 'object' ? 0 : Number(curr);
      if (isNaN(val)) val = 0;
      return acc + val;
    }, 0)
  } else
  if (codeHelper === 'sumWithMultiplier') {
    if (!chParam || (parsedParams ?? []).length === 0) return;

    let arr = parsedParams;

    if (!Array.isArray(arr)) value = 0;
    else value = arr.reduce((acc, curr) => {
      if (Array.isArray(curr)) {
        curr = curr.filter((v) => !(
          typeof v === 'object' || isNaN(Number(v))
        )).map((v) => Number(v))

        if (curr.length === 0) return acc;

        curr = (curr as number[]).reduce((acc, curr) => acc * curr, 1)
      }

      let val = typeof curr === 'object' ? 0 : Number(curr);
      if (isNaN(val)) val = 0;
      return acc + val;
    }, 0)
  } else
  if (codeHelper === 'len') {
    if (!chParam || (parsedParams ?? []).length === 0) return;

    let arr = parsedParams;

    if (!Array.isArray(arr)) value = 0;
    else value = arr.length;
  } else
  if (codeHelper === 'linearArithmetic') {
    if (!chParam || (parsedParams ?? []).length < 2) throw new Error(
      'É obrigatório informar pelo menos dois valores e um operador para usar o code-helper de calculo aritmético linear'
    )

    const operators = chParam.match(/[\+\-\*\/]/g) || [];

    value = Array.from(parsedParams.entries()).reduce((acc, [i, curr]) => {
      if (acc === undefined) return acc;
      if (typeof curr === 'object') return acc;

      let v = Number(curr)
      if (isNaN(v) || operators.length < (i - 1)) return acc;

      if (i === 0) return v;

      switch (operators[(i - 1)]) {
        case '+': return acc + v;
        case '-': return acc - v;
        case '/': return v === 0 ? undefined : acc / v;
        case '*': return acc * v;
        default:
          console.log(`[invalid-aritmetic-operator${operators[(i - 1)]}]`)
          throw new Error('Operador inválido')
      }
    }, 0 as number | undefined)
  } else
  if (codeHelper === 'distinct') {
    if (!chParam || !Array.isArray(parsedParams)) return [];

    return parsedParams.filter((item, index) => parsedParams.findIndex(
      (curr) => typeof item === 'object' ? JSON.stringify(curr) === JSON.stringify(item) : curr === item
    ) === index)
  } else
  if (codeHelper === 'groupByAndSum') {
    if (!chParam || !Array.isArray(parsedParams)) return {};
    const paramSplit = chParam.split(',');

    const result = parsedParams.reduce((acc, item) => {
      if (!acc[item[paramSplit[1]]]) {
        acc[item[paramSplit[1]]] = 0;
      }

      acc[item[paramSplit[1]]] += item[paramSplit[2]];

      return acc;
    }, {});

    return Object.entries(result).map(([name, value]) => ({
      name,
      value
    }));
  } else throw new Error(
    'Não há suporte para este code-helper'
  )

  return value
}
export const handleAndReplaceCodeHelpers = async ({ value, specificFn, data }:{
  value: string, specificFn?: Partial<Record<'user' | 'count' | 'uuid', (params: {
    param?: string,
    value: any
  }) => Promise<any>>>,
  /** Não é a raiz do flow-data */
  data: any
}) => {
  if(typeof value !== 'string') return value;

  let returnValue : any = value;

  const errorRequiredParam = (code: string) => `O parametro é obrigatório no codehelper ${code}`
  const extractedContents = getCodeHelpers(value);

  if (extractedContents && extractedContents.length > 0) {
    for (const [code, param] of extractedContents) {
      switch (code) {
        case '@now': returnValue = handleCodeHelper__now(returnValue, code, param); break;
        case '@user':
          if(!specificFn?.user) throw new Error(
            'É obrigatório passar a função especifica para lidar com o codehelper @user, por parametro'
          )

          returnValue = await specificFn.user({ param, value: returnValue });
          break;
        case '@count':
          if(!specificFn?.count) throw new Error(
            'É obrigatório passar a função especifica para lidar com o codehelper @count, por parametro'
          )

          returnValue = await specificFn.count({ param, value: returnValue });
          break;
        case '@uuid':
          if(!specificFn?.uuid) throw new Error(
            'É obrigatório passar a função especifica para lidar com o codehelper @uuid, por parametro'
          )

          returnValue = await specificFn.uuid({ param, value: returnValue });
          break;
        case 'sum':
          if(!param) throw new Error(errorRequiredParam(code))

          const valueCurrentSum = getRecursiveValue(param, { data });

          returnValue = handleCodeHelpers({
            codeHelper: code,
            chParam: param,
            parsedParams: valueCurrentSum
          }); break;
        case 'lenDistinct':
          if(!param) throw new Error(errorRequiredParam(code))

          const valueCurrentDistinct = getRecursiveValue(param, { data });

          returnValue = handleCodeHelpers({
            chParam: param,
            codeHelper: 'distinct',
            parsedParams: valueCurrentDistinct
          })

          if(Array.isArray(returnValue)) returnValue = handleCodeHelpers({
            codeHelper: 'len',
            chParam: param,
            parsedParams: returnValue
          });
          else returnValue = undefined;
          break;
        case 'groupByAndSum':
          if(!param) throw new Error(errorRequiredParam(code))
          
          const paramSplit = param.split(',');
          const valueCurrentGroup = getRecursiveValue(paramSplit[0], { data });

          returnValue = handleCodeHelpers({
            codeHelper: code,
            chParam: param,
            parsedParams: valueCurrentGroup
          });
          break;
        case 'orderBy':
          let [array_id, col_to_order, orientation] = (param ?? '').split(',');

          //#region VALIDATION
          if (!array_id || !col_to_order) {
            console.error('[observer] O parâmetro da função orderBy não é válido', { param });
            continue;
          }

          if(!orientation) orientation = 'asc'
          if(!['asc','desc'].includes(orientation)){
            console.error('[observer] Orientação de orderBy inválida', { orientation, param })
            continue;
          }
          
          const array_to_order = getRecursiveValue(array_id, { data })
          
          if (!Array.isArray(array_to_order)) {
            console.error('[observer] O valor a ser ordenado não é um array');
            continue;
          }
          //#endregion VALIDATION

          const isDesc = orientation === 'desc'

          returnValue = array_to_order.sort((a, b) => {
            const colA = getRecursiveValue(col_to_order, { data: a })
            const colB = getRecursiveValue(col_to_order, { data: b })

            const isNumberOrdenation = !isNaN(Number(colA)) && !isNaN(Number(colB))

            if(isNumberOrdenation) return isDesc ? colB - colA : colA - colB
            
            if (colA < colB) return isDesc ? 1 : -1;
            if (colA > colB) return isDesc ? -1 : 1;
            return 0;
          });
          break;
        default: throw new Error(
          'Valor de replace no observer inválido'
        );
      }
    }
  }

  return returnValue;
}
/** O data não é a raiz do flow-data */
export const handleAndReplaceSyncCodeHelpers = (value: string, data: any) : any => {
  if(typeof value !== 'string') return value;

  let returnValue : any = value;

  const errorRequiredParam = (code: string) => `O parametro é obrigatório no codehelper ${code}`
  const extractedContents = getCodeHelpers(value, true);

  if (extractedContents && extractedContents.length > 0) {
    for (const [code, param, parsedParams] of extractedContents) {
      switch (code) {
        case '@now': returnValue = handleCodeHelper__now(returnValue, code, param); break;
        case 'sum':
          if(!param) throw new Error(errorRequiredParam(code))

          const valueCurrentSum = getRecursiveValue(param, { data });

          returnValue = handleCodeHelpers({
            codeHelper: code,
            chParam: param,
            parsedParams: valueCurrentSum
          }); break;
        case 'lenDistinct':
          if(!param) throw new Error(errorRequiredParam(code))

          const valueCurrentDistinct = getRecursiveValue(param, { data });

          returnValue = handleCodeHelpers({
            chParam: param,
            codeHelper: 'distinct',
            parsedParams: valueCurrentDistinct
          })

          if(Array.isArray(returnValue)) returnValue = handleCodeHelpers({
            codeHelper: 'len',
            chParam: param,
            parsedParams: returnValue
          });
          else returnValue = undefined;
          break;
        case 'filterLen':
          if(!param || param.split(',').length !== 2) throw new Error(errorRequiredParam(code));
          else{
            const [id, condition] = param.split(',')

            const valueToFilter = getRecursiveValue(id, { data })
            if(!Array.isArray(valueToFilter)) returnValue = 0;
            else{
              const filtered = valueToFilter.filter((item) => checkStringConditional(condition, item));
              returnValue = filtered.length;
            }
          }
          break;
        case 'groupByAndSum':
          if(!param) throw new Error(errorRequiredParam(code))
          
          const paramSplit = param.split(',');
          const valueCurrentGroup = getRecursiveValue(paramSplit[0], { data });

          returnValue = handleCodeHelpers({
            codeHelper: code,
            chParam: param,
            parsedParams: valueCurrentGroup
          });
          break;
        case 'orderBy':
          let [array_id, col_to_order, orientation] = (param ?? '').split(',');

          //#region VALIDATION
          if (!array_id || !col_to_order) {
            console.error('[observer] O parâmetro da função orderBy não é válido', { param });
            continue;
          }

          if(!orientation) orientation = 'asc'
          if(!['asc','desc'].includes(orientation)){
            console.error('[observer] Orientação de orderBy inválida', { orientation, param })
            continue;
          }
          
          const array_to_order = getRecursiveValue(array_id, { data })
          
          if (!Array.isArray(array_to_order)) {
            console.error('[observer] O valor a ser ordenado não é um array');
            continue;
          }
          //#endregion VALIDATION

          const isDesc = orientation === 'desc'

          returnValue = array_to_order.sort((a, b) => {
            const colA = getRecursiveValue(col_to_order, { data: a })
            const colB = getRecursiveValue(col_to_order, { data: b })

            const isNumberOrdenation = !isNaN(Number(colA)) && !isNaN(Number(colB))

            if(isNumberOrdenation) return isDesc ? colB - colA : colA - colB
            
            if (colA < colB) return isDesc ? 1 : -1;
            if (colA > colB) return isDesc ? -1 : 1;
            return 0;
          });
          break;
        default: 
          returnValue = 1;
          if(avHandleCodeHelpers.includes(code)){
            if(!param) throw new Error(errorRequiredParam(code))
            
            const valuesParseds = (parsedParams ? parsedParams : [param]).map((p) => {
              const shortcodes = getShortcodes(p);
              if(shortcodes.length !== 1) return p;

              return getRecursiveValue(shortcodes[0], { data })
            })
  
            returnValue = handleCodeHelpers({
              codeHelper: code,
              chParam: param,
              parsedParams: valuesParseds
            });
            
            break;
          }
          console.error('invalid codehelper', { code, param });
      }
    }
  }

  return returnValue;
}
export const isMatchCaseInsensitiveWithoutAccentuation = (matchs: string[], value: string) => {
  const normalizeText = (text: string) => (
    text.toLowerCase()
      .normalize("NFD") // Decompõe caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remove marcas diacríticas (acentos)
      .trim()
  );
  
  const normalizedMessage = normalizeText(value);
  return matchs.some(match => normalizeText(match) === normalizedMessage);
}