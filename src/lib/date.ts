export function formatDate(
  value: Date | string | null | undefined
) {

  if (!value) {
    return "-";
  }


  const date = new Date(value);


  const day = String(
    date.getDate()
  ).padStart(2,"0");


  const month = String(
    date.getMonth()+1
  ).padStart(2,"0");


  const year = date.getFullYear();



  return `${day}/${month}/${year}`;

}






export function formatDateTime(
  value: Date | string | null | undefined
) {

  if (!value) {
    return "-";
  }


  const date = new Date(value);



  const day = String(
    date.getDate()
  ).padStart(2,"0");


  const month = String(
    date.getMonth()+1
  ).padStart(2,"0");


  const year = date.getFullYear();



  const hours = String(
    date.getHours()
  ).padStart(2,"0");



  const minutes = String(
    date.getMinutes()
  ).padStart(2,"0");



  return `${day}/${month}/${year} ${hours}:${minutes}`;

}