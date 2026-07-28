"use client";

import { useState } from "react";


type Option = {
  id:string;
  name:string;
};



type Props = {

  name:string;

  label:string;

  options:Option[];

  defaultValue?:string;

  placeholder?:string;

};





export default function SearchableSelect({

name,

label,

options,

defaultValue="",

placeholder="Type or select"

}:Props){


const [value,setValue] =
useState(defaultValue);



const [open,setOpen] =
useState(false);




const filtered =
options.filter(option=>

option.name
.toLowerCase()
.includes(
value.toLowerCase()
)

);







return (

<div className="relative">


<label
className="
text-sm
font-medium
"
>

{label}

</label>





<input

name={name}

value={value}

onChange={(e)=>{

setValue(e.target.value);

setOpen(true);

}}

onFocus={()=>setOpen(true)}

onBlur={()=>{

setTimeout(
()=>setOpen(false),
150
);

}}

placeholder={placeholder}

className="
mt-1
w-full
rounded-lg
border
bg-white
px-3
py-2.5
outline-none
focus:ring-2
focus:ring-blue-500
"

/>








{
open && filtered.length > 0 && (

<div

className="
absolute
z-50
mt-1
max-h-48
w-full
overflow-y-auto
rounded-lg
border
bg-white
shadow-lg
"

>


{
filtered.map(option=>(

<button

type="button"

key={option.id}

onMouseDown={()=>{

setValue(option.name);

setOpen(false);

}}

className="
block
w-full
px-3
py-2
text-left
hover:bg-gray-100
"

>

{option.name}

</button>


))

}


</div>


)

}





</div>

);

}