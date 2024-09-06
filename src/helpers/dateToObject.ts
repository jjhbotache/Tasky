export default function parseDate(dateString:string) { // might be an string like '2024-09-21'
  // Dividir la cadena de fecha en partes
  const [year, month, day] = dateString.split('-');
  
  // Devolver un objeto con el día, mes y año
  return {
    day: parseInt(day, 10),
    month: parseInt(month, 10),
    year: parseInt(year, 10),
  };
}

