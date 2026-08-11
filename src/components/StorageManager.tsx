"use client";

import { useState } from "react";

import {
  createStorageLocation,
  updateStorageLocation,
  deleteStorageLocation
} from "@/actions/storage";

import {
  Trash2,
  Snowflake,
  Refrigerator,
  Package,
  Plus,
  X,
  Pencil
} from "lucide-react";


type Props = {
  storageLocations:any[];
};



export default function StorageManager({
  storageLocations
}:Props){


const [editing,setEditing] =
useState<any>(null);

const [open,setOpen] =
useState(false);

const [expanded,setExpanded] =
useState<string | null>(null);



function openAdd(){

  setEditing(null);
  setOpen(true);

}



function openEdit(location:any){

  setEditing(location);
  setOpen(true);

}




async function submit(formData:FormData){

  if(editing){

    await updateStorageLocation(formData);

  }
  else{

    await createStorageLocation(formData);

  }


  setOpen(false);
  setEditing(null);

}




function getIcon(type:string){


  if(type === "Freezer")
    return <Snowflake size={28}/>;


  if(type === "Fridge")
    return <Refrigerator size={28}/>;


  return <Package size={28}/>;


}




return (

<div className="space-y-8">


{/* HEADER */}

<div className="flex justify-between items-center">


<div>

</div>


<button

onClick={openAdd}

className="
flex
items-center
gap-2
rounded-lg
bg-blue-600
px-4
py-2
text-white
"

>

<Plus size={18}/>

Add Storage

</button>


</div>





{/* ADD FORM */}

{
open &&

<div className="
rounded-xl
border
bg-gray-50
p-6
">


<form

action={submit}

className="space-y-4"

>


<input

type="hidden"

name="id"

value={editing?.id ?? ""}

/>



<input

name="name"

required

defaultValue={editing?.name ?? ""}

placeholder="Storage name"

className="
w-full
rounded-lg
border
px-3
py-2
"

/>




<select

name="type"

defaultValue={editing?.type ?? ""}

className="
w-full
rounded-lg
border
px-3
py-2
"

>

<option value="">
Type
</option>

<option>
Freezer
</option>

<option>
Fridge
</option>

<option>
Shelf
</option>

<option>
Room
</option>

<option>
Cabinet
</option>


</select>





<select

name="temperature"

defaultValue={editing?.temperature ?? ""}

className="
w-full
rounded-lg
border
px-3
py-2
"

>

<option value="">
Temperature
</option>

<option>-80°C</option>

<option>-20°C</option>

<option>4°C</option>

<option>Room temperature</option>


</select>





<div className="flex justify-end gap-3">


<button

type="button"

onClick={()=>{

setOpen(false);
setEditing(null);

}}

className="
border
rounded-lg
px-4
py-2
"

>

Cancel

</button>



<button

className="
rounded-lg
bg-blue-600
px-4
py-2
text-white
"

>

Save

</button>


</div>



</form>


</div>

}






{/* STORAGE MAP */}


<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-5
">


{

storageLocations.map(location=>{


const itemCount =
location.items?.length ?? 0;


const totalQuantity =
location.items?.reduce(
(sum:any,item:any)=>
sum + item.quantity,
0
) ?? 0;



const isOpen =
expanded === location.id;



return (


<div

key={location.id}

className="
rounded-2xl
border
bg-white
shadow-sm
overflow-hidden
"

>


<div className="
p-6
"

>


<div className="
flex
justify-between
"

>


<div className="
flex
gap-4
items-center
"


>


<div className="
rounded-xl
bg-blue-100
p-3
text-blue-700
"

>

{getIcon(location.type)}

</div>


<div>


<h3 className="
font-bold
text-lg
">

{location.name}

</h3>


<p className="
text-sm
text-gray-500
">

{location.type ?? "Storage"}

{" • "}

{location.temperature ?? "-"}

</p>


</div>


</div>


</div>






<div className="
mt-5
grid
grid-cols-2
gap-3
"


>

<div className="
rounded-lg
bg-gray-50
p-3
"

>

<p className="text-xs text-gray-500">
Items
</p>

<p className="font-bold">
{itemCount}
</p>

</div>



<div className="
rounded-lg
bg-gray-50
p-3
"

>

<p className="text-xs text-gray-500">
Quantity
</p>

<p className="font-bold">
{totalQuantity}
</p>

</div>


</div>





<button

onClick={()=>setExpanded(
isOpen ? null : location.id
)}

className="
w-full
rounded-lg
bg-gray-900
px-3
py-2
text-white
"

>

{
isOpen
?
"Hide Contents"
:
"View Contents"
}


</button>


</div>





{

isOpen &&

<div className="
border-t
p-5
space-y-3
">


{

itemCount === 0

?

<p className="text-gray-500 text-sm">
No items stored here.
</p>

:

location.items.map((entry:any)=>(


<div

key={entry.id}

className="
rounded-lg
bg-gray-50
p-3
"

>


<div className="font-medium">

{entry.item.name}

</div>


<div className="text-sm text-gray-500">

{entry.quantity} {entry.item.unit}

</div>


</div>


))


}


</div>

}






<div className="
flex
gap-3
border-t
p-4
"


>

<button

onClick={()=>openEdit(location)}

className="
flex
items-center
gap-2
rounded-lg
border
px-3
py-2
"

>

<Pencil size={16}/>

Edit

</button>



<button

onClick={()=>deleteStorageLocation(location.id)}

className="
rounded-lg
bg-red-600
p-2
text-white
"

>

<Trash2 size={18}/>

</button>


</div>



</div>


)


})


}



</div>



</div>


);


}