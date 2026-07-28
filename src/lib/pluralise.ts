export function pluralizeUnit(
  unit:string,
  quantity:number
){

  if(quantity === 1){
    return unit;
  }


  const fixedUnits = [
    "mL",
    "µL",
    "L",
    "g",
    "mg",
    "kg"
  ];


  if(fixedUnits.includes(unit)){
    return unit;
  }



  const irregular:any = {

    Box:"Boxes",

  };



  if(irregular[unit]){
    return irregular[unit];
  }



  if(unit.endsWith("s")){
    return unit;
  }



  return `${unit}s`;

}