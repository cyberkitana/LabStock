/*
  SUPPLIER MANAGER COMPONENT

  Purpose:

  This client component manages the supplier section
  of LabStock.

  Responsibilities:

  - Display supplier business cards
  - Search suppliers
  - Add new suppliers
  - Edit existing supplier information
  - Delete suppliers
  - Display supplier contact information
  - Show supplier inventory count
  - Provide a hover flip card interface

  Features:

  FRONT OF CARD:
  - Supplier name
  - Contact person
  - Email
  - Phone number
  - Website
  - Edit/delete actions

  BACK OF CARD:
  - Number of products supplied by the supplier

  Connected to:

  - supplier.ts server actions
  - Supplier Prisma model
  - Inventory item relationships

*/
"use client";

import { useState } from "react";
import Image from "next/image";

import {
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "@/actions/supplier";

import { Trash2 } from "lucide-react";

/*
  Extracts supplier domain from website URL.

  Example:

  https://www.sigmaaldrich.com

  becomes:

  sigmaaldrich.com

*/

function getDomain(url:string){

  try{

    return new URL(url)
      .hostname
      .replace("www.","");

  }

  catch{

    return null;

  }

}
type Props = {

  suppliers:any[];

};



export default function SupplierManager({

  suppliers

}:Props){


const [editing,setEditing] = useState<any>(null);

const [open,setOpen] = useState(false);

const [search,setSearch] = useState("");
const [flipped,setFlipped] = useState<number | null>(null);



function startEdit(supplier:any){

  setEditing(supplier);

  setOpen(true);

}



function closeForm(){

  setEditing(null);

  setOpen(false);

}



const filteredSuppliers = suppliers.filter((supplier)=>{

  const term = search.toLowerCase();


  return (

    supplier.name?.toLowerCase().includes(term) ||

    supplier.contact?.toLowerCase().includes(term) ||

    supplier.email?.toLowerCase().includes(term)

  );


});

return (

<div className="space-y-8">

{/* SUPPLIER CONTROLS */}

<div className="
flex
items-center
justify-between
gap-4
">


{/* SEARCH BAR */}

<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search suppliers..."

className="
rounded-xl
border
px-4
py-2.5
w-80
outline-none
focus:ring-2
focus:ring-blue-500
"

/>

{/* ADD SUPPLIER BUTTON */}

<button

onClick={()=>{

setEditing(null);

setOpen(true);

}}

className="
rounded-xl
bg-blue-600
px-5
py-2.5
text-white
font-medium
hover:bg-blue-700
transition
"

>

+ New Supplier

</button>



</div>


{/* SUPPLIER SUMMARY */}

<div
className="
relative
overflow-hidden
rounded-2xl
bg-gradient-to-br
from-slate-900
via-blue-900
to-blue-700
px-6
py-5
w-fit
min-w-full
shadow-lg
"
>

{/* decorative glow */}

<div
className="
absolute
right-[-30px]
top-[-30px]
h-24
w-24
rounded-full
bg-white/10
"
></div>


<div
className="
absolute
bottom-[-40px]
left-[-20px]
h-28
w-28
rounded-full
bg-blue-400/20
"
></div>



<div className="relative z-10">


<p
className="
text-xs
uppercase
tracking-[0.25em]
text-blue-200
"
>

Supplier Network

</p>



<div
className="
mt-2
flex
items-end
gap-3
"
>

<p
className="
text-5xl
font-bold
text-white
"
>

{suppliers.length}

</p>


<p
className="
mb-1
text-sm
text-blue-100
"
>

research partners

</p>


</div>




<div
className="
flex
items-center
gap-2
text-sm
text-blue-100
"
>


</div>


</div>


</div>

{/* BUSINESS CARDS */}

<div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
gap-6
">


{

filteredSuppliers.map((supplier)=>(


<div

key={supplier.id}

className="
perspective
h-[220px]
w-[380px]
max-w-full
"

onMouseEnter={()=>setFlipped(supplier.id)}

onMouseLeave={()=>setFlipped(null)}

>

<div

className={`
relative
h-full
w-full
transition-transform
duration-700
ease-in-out
transform-style-preserve-3d
${flipped === supplier.id ? "rotate-y-180" : ""}
`}

>





{/* FRONT */}


<div

className="
absolute
inset-0
border
bg-white
p-6
shadow-sm
backface-hidden
"

>


<div className="
flex
items-center
gap-4
">


{/* SUPPLIER LOGO */}

<div

className="
h-9
w-9
rounded-lg
border
bg-white
flex
items-center
justify-center
overflow-hidden
"

>

{

supplier.website && getDomain(supplier.website)

?

<img

src={`https://www.google.com/s2/favicons?domain=${getDomain(supplier.website)}&sz=256`}

alt={supplier.name}

width={36}

height={36}

className="
object-contain
p-1
"

/>

:

<span

className="
text-lg
font-bold
text-blue-600
"

>

LS

</span>

}

</div>

<div>


<h3 className="
text-lg
font-bold
tracking-wide
text-slate-900
">

{supplier.name}

</h3>


<p className="
text-sm
text-gray-500
">

Laboratory Supplier

</p>


</div>


</div>






<div className="
mt-5
space-y-1
text-sm
text-gray-600
">

<div className="
my-4
border-t
border-gray-200
"/>

{supplier.contact && (

<p>
👤 {supplier.contact}
</p>

)}


{supplier.email && (

<p>
✉ {supplier.email}
</p>

)}


{supplier.phone && (

<p>
☎ {supplier.phone}
</p>

)}


{supplier.website && (

<p>
{supplier.website}
</p>

)}



</div>

</div>

{/* BACK */}


<div

className="
absolute
inset-0
bg-blue-600
p-6
text-white
shadow-xl
backface-hidden
rotate-y-180
"

>


<div className="
flex
h-full
flex-col
items-center
justify-center
text-center
">


<p className="
text-sm
uppercase
tracking-widest
opacity-80
">

Inventory Supplied:

</p>



<p className="
text-5xl
font-bold
">

{supplier._count?.items ?? 0}

</p>


<div className="
absolute
bottom-4
right-4
flex
gap-2
">


<button

onClick={()=>startEdit(supplier)}

className="
rounded-lg
border
bg-white
px-3
py-1.5
text-gray-900
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

>

<Trash2 size={16}/>

</button>


</div>

</div>


</div>







</div>


</div>


))

}


</div>

{/* ADD / EDIT SUPPLIER MODAL */}

{

open && (

<div

className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/40
p-4
overflow-y-auto
"

onClick={closeForm}

>


{/* MODAL BOX */}

<div

className="
w-full
max-w-lg
max-h-[85vh]
overflow-y-auto
rounded-2xl
bg-white
p-6
shadow-xl
"

onClick={(e)=>e.stopPropagation()}

>


<h3 className="
mb-5
text-xl
font-semibold
text-gray-800
">

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
space-y-4
"


>


<input

type="hidden"

name="id"

value={editing?.id ?? ""}

/>





<div className="space-y-1">

<label className="
text-sm
font-medium
text-gray-700
">

Supplier Name

</label>


<input

name="name"

required

defaultValue={editing?.name ?? ""}

className="
w-full
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
"

/>

</div>

<div className="space-y-1">

<label className="
text-sm
font-medium
text-gray-700
">
Contact Person
</label>

<input

name="contact"

defaultValue={editing?.contact ?? ""}

placeholder="Contact person"

className="
w-full
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
"

/>

</div>



<div className="space-y-1">

<label className="
text-sm
font-medium
text-gray-700
">
Email Address
</label>

<input

name="email"

type="email"

defaultValue={editing?.email ?? ""}

placeholder="Email"

className="
w-full
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
"

/>

</div>



<div className="space-y-1">

<label className="
text-sm
font-medium
text-gray-700
">
Phone Number
</label>

<input

name="phone"

defaultValue={editing?.phone ?? ""}

placeholder="Phone number"

className="
w-full
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
"

/>

</div>



<div className="space-y-1">

<label className="
text-sm
font-medium
text-gray-700
">
Website
</label>

<input

name="website"

defaultValue={editing?.website ?? ""}

placeholder="Website"

className="
w-full
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
"

/>

</div>

<div className="
flex
justify-end
gap-3
pt-4
">


<button

type="button"

onClick={closeForm}

className="
rounded-xl
border
px-5
py-2.5
hover:bg-gray-100
"

>

Cancel

</button>





<button

type="submit"

className="
rounded-xl
bg-blue-600
px-5
py-2.5
text-white
hover:bg-blue-700
"

>

{

editing

?

"Update Supplier"

:

"Save Supplier"

}

</button>


</div>



</form>


</div>


</div>


)

}

</div>


);


}