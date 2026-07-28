"use client";

import {
  ChevronDown,
  ChevronRight,
  History,
} from "lucide-react";

import {
  useState
} from "react";

import InventoryHistoryModal from "./InventoryHistoryModal";



type Props = {

  item:any;

  onEdit:(item:any)=>void;

};






export default function InventoryCard({

  item,

  onEdit,

}:Props){



const [open,setOpen] =
useState(false);


const [showHistory,setShowHistory] =
useState(false);





const quantity =
item.quantity ?? 0;


const minimumStock =
item.minimumStock ?? 0;








function getStatus(){


if(quantity <= 0){

return {

text:"Out of Stock",

style:
"bg-red-50 text-red-600"

};

}





if(quantity <= minimumStock){

return {

text:"Low Stock",

style:
"bg-yellow-50 text-yellow-700"

};

}





return {

text:"Available",

style:
"bg-green-50 text-green-700"

};


}





const status =
getStatus();









function formatUnit(

quantity:number,

unit:string

){


if(!unit)
return "";



const fixedUnits=[

"mL",
"L",
"µL",
"g",
"mg",
"kg"

];



if(
fixedUnits.includes(unit)
){

return unit;

}





if(quantity === 1){

return unit;

}





const plural:any={


Box:"Boxes",

box:"boxes",


Bottle:"Bottles",

bottle:"bottles",


Tube:"Tubes",

tube:"tubes",


Vial:"Vials",

vial:"vials",


Kit:"Kits",

kit:"kits"


};





return plural[unit] ?? `${unit}s`;

}





return (

<>

<div

className="
rounded-md
border
border-zinc-200
bg-white
"

>






<button

onClick={()=>
setOpen(!open)
}

className="
flex
w-full
items-center
justify-between
px-3
py-2.5
hover:bg-zinc-50
"

>




<div

className="
flex
min-w-0
items-center
gap-3
"

>


<h2

className="
truncate
text-sm
font-medium
text-zinc-900
"

>

{item.name}

</h2>





<span

className={`
rounded-full
px-2
py-0.5
text-xs
font-medium
${status.style}
`}

>

{status.text}

</span>





{

item.category && (

<span

className="
rounded-full
bg-blue-50
px-2
py-0.5
text-xs
text-blue-600
"

>

{item.category.name}

</span>

)

}




</div>







{

open

?

<ChevronDown size={16}/>

:

<ChevronRight size={16}/>

}



</button>









{


open && (

<div

className="
border-t
border-zinc-100
bg-zinc-50
p-4
space-y-3
"

>





<div>

<p className="text-xs text-zinc-500">

Stock Level

</p>

<p className="text-sm font-medium">

{quantity}

{" "}

{

item.specific

?

`${item.specific} `

:

""

}

{formatUnit(quantity,item.unit)}

</p>

</div>








<div>

<p className="text-xs text-zinc-500">

Minimum Stock

</p>

<p className="text-sm font-medium">

{minimumStock}

</p>

</div>







<div>

<p className="text-xs text-zinc-500">

Supplier

</p>

<p className="text-sm font-medium">

{item.supplier?.name ?? "-"}

</p>

</div>








<div>

<p className="text-xs text-zinc-500">

Batch Number

</p>

<p className="text-sm font-medium">

{item.batchNumber ?? "-"}

</p>

</div>








<div>

<p className="text-xs text-zinc-500">

Expiry Date

</p>

<p className="text-sm font-medium">

{

item.expiryDate

?

new Date(item.expiryDate)
.toLocaleDateString()

:

"-"

}

</p>

</div>









<div>

<p className="text-xs text-zinc-500">

Description

</p>


<div

className="
rounded-md
border
border-zinc-200
bg-white
p-2
text-sm
"

>

{

item.description || 
"No description"

}

</div>

</div>









<div

className="
flex
gap-2
pt-2
"

>





<button

type="button"

onClick={(e)=>{

e.stopPropagation();

onEdit(item);

}}

className="
rounded-md
bg-blue-600
px-3
py-1.5
text-sm
text-white
"

>

Edit

</button>







<button

type="button"

onClick={(e)=>{

e.stopPropagation();

setShowHistory(true);

}}

className="
flex
items-center
gap-1.5
rounded-md
border
border-zinc-200
bg-white
px-3
py-1.5
text-sm
hover:bg-zinc-100
"

>


<History size={14}/>

History


</button>







</div>







</div>

)

}




</div>








<InventoryHistoryModal


open={showHistory}


onClose={()=>
setShowHistory(false)
}


records={
item.records ?? []
}


itemName={
item.name
}


/>



</>

);


}