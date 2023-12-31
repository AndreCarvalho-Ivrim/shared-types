export const handleRegexId = (id: string, item: { data: any }) => {
  const pattern = /@\[(.*?)\]/g;
  const matches = id.match(pattern);
  
  if(!matches) return undefined;

  const replacers : { id: string, default?: string }[] = [];
  matches.forEach(match => {
    const values = match.substring(2, match.length - 1).split('|');
    replacers.push({
      id: values[0],
      default: values.length === 2 ? values[1] : undefined
    })
  });
  
  let value = id
  replacers.forEach((replacer) => {
    let temp = getRecursiveValue(replacer.id, item)

    const toReplace = `@[${replacer.id}${replacer.default ? `|${replacer.default}`:''}]`;

    var max = 50;
    do{
      value = value.replace(toReplace, temp ?? replacer.default)
      max--;
      if(max === 0){
        console.error('[findedAuthTemplate->loop] O replacer repetiu mais de 20x');
        break;
      }
    }while(value.includes(toReplace))
  })
  return value;
}
export const getRecursiveValue = (id: string, item: { data: any }) => {
  if(!item || !item.data) return;

  let value : undefined | any = undefined;

  const handledRegexId = handleRegexId(id, item)
  if(handledRegexId) return handledRegexId;

  if(item.data[id] !== undefined) value = item.data[id];
  else if(id.includes('.')){
    let ids = id.split('.');

    if(ids.length === 0) value = undefined;
    else{
      const recursiveValue = (data: any, id: string, ids: string[]) : any => {
        if(!data) return;
        if(ids.length === 0){
          return data[id] ?? undefined;
        }

        return recursiveValue(data[id], ids[0], ids.slice(1));
      }

      value = recursiveValue(item.data, ids[0], ids.slice(1));
    }
  }

  return value;
}
export const handleFillable = (id: string, flowData: any, value: any, i: number = 0, cumulative:  string[]) => {
  if(id.includes('.')){
    let ids = id.split('.');
    if(ids.length === 0) return flowData;

    flowData = handleRecursiveValue(ids, flowData, value, i, cumulative);
    delete flowData[id];
  }else{
    if(cumulative.includes(id)){
      if(!flowData[id]) flowData[id] = [];
      flowData[id][i] = value;
    }
    else flowData[id] = value;
  }

  return flowData;
}
const handleRecursiveValue = (ids: string[], data: any, value: any, i: number, cumulative: string[]) => {
  const isLastLevel = ids.length === 1;
  const id = ids[0];

  if(isLastLevel){
    if(cumulative.includes(id)){
      if(!data[id]) data[id] = [];
      data[id][i] = value;

      return data;
    }
    else{
      data[id] = value;
      return data;
    }
  }
  if(cumulative.includes(id)){
    if(!data[id]) data[id] = [];
    data[id][i] = handleRecursiveValue(
      ids.slice(1),
      data[id][i] ?? {},
      value,
      i,
      cumulative
    );
      
    return data;
  }
  else{
    if(!data[id]) data[id] = {};
    data[id] = handleRecursiveValue(
      ids.slice(1),
      data[id],
      value,
      i,
      cumulative
    );
      
    return data;
  }
}
export const replaceAll = (content: string, search: string, replacer: string) => {
  if(!content || content.length === 0 || !search || search.length === 0 || search === replacer) return content;

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSearch, 'g');

  return content.replace(regex, replacer)
}