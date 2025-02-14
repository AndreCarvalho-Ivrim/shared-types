import moment from "moment";

type AvailableTypes = ':date';
export const checkFieldTypeAvailableTypes: AvailableTypes[] = [':date'];

export const checkFieldType = (key: string, value: any) => {
  const type = checkFieldTypeAvailableTypes.find(type => key.includes(type));

  switch (type) {
    case ':date':
      return handleDateType(value);
    default:
      return value;
  }
}

const handleDateType = (date: Date) => moment(date).format('DD/MM/YYYY');