import { StringConditionalTypes } from "..";

export const checkStringConditional = (strConditional: string, datas: Record<string, any>,conditionalName = 'anonymous') => {
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
  
  if(condition.length === 0) return false;

  const unionConditionals : string[] = [];
  const groupConditionals : Array<{
    type: StringConditionalTypes,
    value: string
  }[]> = [];

  condition.forEach((c) => {
    if(c.type === 'logic'){
      unionConditionals.push(c.value);
      return;
    }

    let unionLen = unionConditionals.length;
    if(groupConditionals[unionLen]) groupConditionals[unionLen].push(c);
    else groupConditionals[unionLen] = [c];
  });

  if(unionConditionals.length !== 0 && (unionConditionals.length * 2) !== groupConditionals.length) throw new Error(
    `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Proporção de uniões e grupos não está dentro do esperado. (${strConditional})`
  );

  const callbackOperator = (val_1: string | number, val_2: string | number, operator: string) => {
    if(isNaN(Number(val_1)) || isNaN(Number(val_2))){
      val_1 = String(val_1);
      val_2 = String(val_2);
    }else{
      val_1 = Number(val_1);
      val_2 = Number(val_2);
    }
    switch (operator) {
      case 'eq':  return val_1 === val_2;
      case 'lt':  return val_1 <   val_2;
      case 'lte': return val_1 <=  val_2;
      case 'gt':  return val_1 >   val_2;
      case 'gte': return val_1 >=  val_2;
    }
    return false;
  }
  const callbackArrayOperator = (arr: (string | number)[], val: string | number, operator: 'contains') => {
    let isNumber = !isNaN(Number(val)) && !arr.find(v => isNaN(Number(v)));
    if(isNumber){
      val = Number(val);
      arr = arr.map(v => Number(v));
    }else{
      val = String(val);
      arr = arr.map(v => String(v));
    }

    switch(operator){
      case 'contains': return arr.includes(val);
    }
    return false;
  }

  try{
    let matchesConditional : boolean[] = [];
    groupConditionals.forEach((condition) => {
      let values : (string | number | (string | number)[])[] = [];
      let operators : string[] = [];
      if(condition.length % 2 === 0) throw new Error(
        `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Deve seguir o modelo de prop/value, operator, prop/value, ... (${strConditional})`
      );
      condition.forEach((c, i) => {
        if(i % 2 === 0){
          if(['logic','operator'].includes(c.type)) throw Error(
            `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. É obrigatório que o index par seja ocupado por uma propriedade ou valor (${strConditional})`
          );

          values.push(
            c.type === 'prop' ? datas[c.value] ?? undefined : c.type === 'value' ? c.value : undefined
          );
        }else{
          if(c.type !== 'operator') throw Error(
            `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. É obrigatório que o index ímpar seja ocupado por um operador (${strConditional})`
          );

          operators.push(c.value);
        }
      });
      if(operators.length !== 0 && (operators.length * 2) !== values.length) throw new Error(
        `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Proporção de valores e operadores não está dentro do esperado. (${strConditional})`
      );

      let matchOperation : boolean | undefined = undefined;
      operators.forEach((op, i) => {
        if(matchOperation !== undefined && !matchOperation) return;

        if(op === 'contains'){
          if(!values[i * 2]) matchOperation = false;
          else{
            if(!Array.isArray(values[i * 2])) values[i * 2] = [values[i * 2] as string | number];
            if(!Array.isArray(values[(i*2) + 1])) matchOperation = callbackArrayOperator(
              values[i * 2] as Array<string | number>,
              values[(i*2) + 1] as string | number,
              op
            )
            else throw new Error(
              `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Em uma comparação de 'item contém na lista', a lista deve vir primeiro, e depois o valor a ser procurado. (${strConditional})`    
            )
          }
        }
        else{
          if(Array.isArray(values[i * 2]) || Array.isArray(values[(i*2) + 1])) throw new Error(
            `[string-conditional: ${conditionalName}]: Padrão de condicional fora do esperado. Não é possível executar essa operação em um valor do tipo lista. (${strConditional})`
          )
          else matchOperation = callbackOperator(
            values[i * 2] as string | number,
            values[(i*2) + 1] as string | number,
            op
          );
        }
      });

      matchesConditional.push(matchOperation ?? false);
    });

    const callbackUnion = (val_1: boolean, val_2: boolean, condition: string) => {
      switch (condition) {
        case 'and': return val_1 && val_2;
        case 'or': return val_1 || val_2;
      }
      return false;
    }

    if(unionConditionals.length === 0) return matchesConditional.length === 0 ? false : matchesConditional[0];

    let unionMatch : boolean | undefined;
    unionConditionals.forEach((uni, i) => {
      if(unionMatch !== undefined && !unionMatch) return;
      unionMatch = callbackUnion(
        matchesConditional[i * 2],
        matchesConditional[(i*2) + 1],
        uni
      );
    });

    return unionMatch;
  }catch(e){
    console.error(e);
    return false;
  }
};