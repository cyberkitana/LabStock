"use client";


import { useState } from "react";

import {
  createStorageLocation,
  updateStorageLocation,
  deleteStorageLocation
} from "@/actions/storage";
import { Trash2 } from "lucide-react";


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








function openAdd(){

setEditing(null);

setOpen(true);

}








function openEdit(location:any){

setEditing(location);

setOpen(true);

}








async function submit(
formData:FormData
){


if(editing){

await updateStorageLocation(formData);


}

else{

await createStorageLocation(formData);


}



setOpen(false);

setEditing(null);


}









return (

<div className="space-y-6">





{/* HEADER */}


<div className="
flex
items-center
justify-between
">


<div>

<h2 className="
text-xl
font-bold
text-gray-800
">

Storage Locations

</h2>


<p className="
text-sm
text-gray-500
">

Manage freezers, fridges, shelves and rooms

</p>


</div>





<button

onClick={openAdd}

className="
rounded-lg
bg-blue-600
px-4
py-2
text-white
hover:bg-blue-700
"

>

+ Add Storage

</button>


</div>









{/* FORM */}


{

open &&

<div className="
rounded-xl
border
bg-gray-50
p-5
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






<div>

<label className="
text-sm
font-medium
">

Name

</label>


<input

name="name"

required

defaultValue={
editing?.name ?? ""
}

placeholder="e.g. Main Cell Culture Fridge"

className="
mt-1
w-full
rounded-lg
border
px-3
py-2
"

/>


</div>










<div>

<label className="
text-sm
font-medium
">

Type

</label>



<select

name="type"

defaultValue={
editing?.type ?? ""
}

className="
mt-1
w-full
rounded-lg
border
bg-white
px-3
py-2
"

>


<option value="">

Select type

</option>


<option value="Freezer">

Freezer

</option>


<option value="Fridge">

Fridge

</option>


<option value="Shelf">

Shelf

</option>


<option value="Room">

Room

</option>


<option value="Cabinet">

Cabinet

</option>


</select>


</div>









<div>

<label className="
text-sm
font-medium
">

Temperature

</label>



<select

name="temperature"

defaultValue={
editing?.temperature ?? ""
}

className="
mt-1
w-full
rounded-lg
border
bg-white
px-3
py-2
"

>


<option value="">

Select temperature

</option>


<option value="-80°C">

-80°C

</option>


<option value="-20°C">

-20°C

</option>


<option value="4°C">

4°C

</option>


<option value="Room temperature">

Room temperature

</option>



</select>


</div>










<div className="
flex
justify-end
gap-3
">


<button

type="button"

onClick={()=>{

setOpen(false);

setEditing(null);

}}

className="
rounded-lg
border
px-4
py-2
"

>

Cancel

</button>





<button

type="submit"

className="
rounded-lg
bg-blue-600
px-4
py-2
text-white
"

>

{

editing

?

"Update"

:

"Save"

}


</button>



</div>





</form>


</div>

}



 








{/* STORAGE CARDS */}


<div className="
grid
grid-cols-1
md:grid-cols-2
gap-4
">


{

storageLocations.map(location=>(


<div

key={location.id}

className="
rounded-xl
border
bg-white
p-5
shadow-sm
"

>


<div className="
flex
justify-between
items-start
"

>


<div>


<h3 className="
font-semibold
text-lg
">

{location.name}

</h3>



<p className="
text-sm
text-gray-500
mt-1
">

{location.type ?? "No type"}

{" • "}

{location.temperature ?? "No temperature"}

</p>


</div>



</div>








<div className="
mt-4
flex
gap-3
"

>


<button

onClick={()=>openEdit(location)}

className="
rounded-lg
border
px-3
py-1.5
hover:bg-gray-100
"

>

Edit

</button>




<button

onClick={()=>deleteStorageLocation(location.id)}

className="
rounded-lg
bg-red-600
p-2
text-white
hover:bg-red-700
"

title="Delete storage location"

>

<Trash2 size={18}/>

</button>

</div>





</div>


))

}



</div>





</div>

);


}