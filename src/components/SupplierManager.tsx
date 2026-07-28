"use client";

/*
  SUPPLIER MANAGER COMPONENT

  Client component responsible for:
  
  - Displaying suppliers
  - Adding suppliers
  - Editing suppliers
  - Deleting suppliers

  Connected to:
  - supplier.ts server actions
  - Supplier Prisma model

*/


import { useState } from "react";

import {
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "@/actions/supplier";
import { Trash2 } from "lucide-react";





type Props = {

  suppliers:any[];

};







export default function SupplierManager({

suppliers

}:Props){



const [editing,setEditing] =
useState<any>(null);



const [open,setOpen] =
useState(false);








function startEdit(supplier:any){

setEditing(supplier);

setOpen(true);

}









function closeForm(){

setEditing(null);

setOpen(false);

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

Suppliers

</h2>


<p className="
text-sm
text-gray-500
">

Manage companies and supplier information

</p>


</div>





<button

onClick={()=>{

setEditing(null);

setOpen(true);

}}

className="
rounded-lg
bg-blue-600
px-4
py-2
text-white
hover:bg-blue-700
"

>

+ Add Supplier

</button>



</div>









{/* SUPPLIER LIST */}


<div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
gap-4
">



{

suppliers.map((supplier)=>(


<div

key={supplier.id}

className="
rounded-xl
border
bg-white
p-5
shadow-sm
"

>


<h3 className="
font-semibold
text-lg
">

{supplier.name}

</h3>





<div className="
mt-3
space-y-1
text-sm
text-gray-600
">


{

supplier.contact &&

<p>

Contact:
{" "}
{supplier.contact}

</p>

}




{

supplier.email &&

<p>

Email:
{" "}
{supplier.email}

</p>

}




{

supplier.phone &&

<p>

Phone:
{" "}
{supplier.phone}

</p>

}




{

supplier.website &&

<p>

Website:
{" "}
{supplier.website}

</p>

}



</div>







<div className="
mt-4
flex
gap-2
">


<button

onClick={()=>startEdit(supplier)}

className="
rounded-lg
border
px-3
py-1.5
text-sm
hover:bg-gray-100
"

>

Edit
</button>

<button

onClick={()=>deleteSupplier(supplier.id)}

className="
rounded-lg
bg-red-600
p-2
text-white
hover:bg-red-700
"

title="Delete supplier"

>

<Trash2 size={18}/>

</button>

</div>





</div>


))

}




</div>









{/* ADD / EDIT FORM */}


{

open &&

<div className="
rounded-xl
border
bg-gray-50
p-6
"


>



<h3 className="
mb-4
font-semibold
"

>

{

editing

?

"Edit Supplier"

:

"Add Supplier"

}


</h3>








<form

action={async(formData)=>{


if(editing){

await updateSupplier(formData);

}

else{

await createSupplier(formData);

}


closeForm();


}}


className="
space-y-3
"


>


<input

type="hidden"

name="id"

value={editing?.id ?? ""}

/>







<input

name="name"

required

defaultValue={
editing?.name ?? ""
}

placeholder="Supplier name *"

className="
w-full
rounded-lg
border
px-3
py-2
"

/>







<input

name="contact"

defaultValue={
editing?.contact ?? ""
}

placeholder="Contact person (optional)"

className="
w-full
rounded-lg
border
px-3
py-2
"

/>







<input

name="email"

type="email"

defaultValue={
editing?.email ?? ""
}

placeholder="Email (optional)"

className="
w-full
rounded-lg
border
px-3
py-2
"

/>







<input

name="phone"

defaultValue={
editing?.phone ?? ""
}

placeholder="Phone number (optional)"

className="
w-full
rounded-lg
border
px-3
py-2
"

/>







<input

name="website"

defaultValue={
editing?.website ?? ""
}

placeholder="Website (optional)"

className="
w-full
rounded-lg
border
px-3
py-2
"

/>









<div className="
flex
gap-3
pt-3
">


<button

type="submit"

className="
rounded-lg
bg-blue-600
px-5
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





<button

type="button"

onClick={closeForm}

className="
rounded-lg
border
px-5
py-2
"

>

Cancel

</button>



</div>




</form>




</div>


}



</div>


);


}