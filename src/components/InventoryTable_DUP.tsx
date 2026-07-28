"use client";

import { useState } from "react";

import AddItemModal from "@/components/AddItemModal";
import UpdateStockModal from "@/components/UpdateStockModal";

import {
  formatDate,
  formatDateTime
} from "@/lib/date";

import {
  pluralizeUnit
} from "@/lib/pluralise";

import {
  PackagePlus,
  PackageMinus,
  ArrowDownCircle,
  ArrowUpCircle,
  RotateCcw
} from "lucide-react";



type Props = {

  inventoryItems:any[];

  suppliers:any[];

  categories:any[];

  storageLocations:any[];

};





function formatStock(item:any){

  const quantity =
    item.quantity ?? 0;


  const specific =
    item.specific
    ?
    `${item.specific} `
    :
    "";


  const unit =
    pluralizeUnit(
      item.unit ?? "Unit",
      quantity
    );


  return `${quantity} × ${specific}${unit}`;

}







function getStockStatus(item:any){

  const quantity =
    item.quantity ?? 0;


  const minimum =
    item.minimumStock ?? 5;



  if(quantity <= 0){

    return {

      label:"OUT OF STOCK",

      colour:"bg-red-100 text-red-700"

    };

  }



  if(quantity <= minimum){

    return {

      label:"LOW STOCK",

      colour:"bg-yellow-100 text-yellow-700"

    };

  }



  return {

    label:"IN STOCK",

    colour:"bg-green-100 text-green-700"

  };

}






function getExpiryStatus(date:any){

  if(!date){
    return null;
  }


  const expiry =
    new Date(date);


  const today =
    new Date();


  const difference =
    expiry.getTime() - today.getTime();


  const days =
    Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );



  if(days < 0){

    return {

      label:"EXPIRED",

      colour:"bg-red-100 text-red-700"

    };

  }



  if(days <= 30){

    return {

      label:"EXPIRING SOON",

      colour:"bg-yellow-100 text-yellow-700"

    };

  }



  return {

    label:"VALID",

    colour:"bg-green-100 text-green-700"

  };

}
export default function InventoryTable({

inventoryItems,

suppliers,

categories,

storageLocations

}:Props){



const [addOpen,setAddOpen] =
useState(false);



const [editItem,setEditItem] =
useState<any>(null);



const [stockItem,setStockItem] =
useState<any>(null);



const [openItem,setOpenItem] =
useState<string | null>(null);



const [openHistory,setOpenHistory] =
useState<string | null>(null);



const [search,setSearch] =
useState("");



const [categoryFilter,setCategoryFilter] =
useState("ALL");



const [supplierFilter,setSupplierFilter] =
useState("ALL");



const [lowStockOnly,setLowStockOnly] =
useState(false);



const [expiryOnly,setExpiryOnly] =
useState(false);



const [expiredOnly,setExpiredOnly] =
useState(false);

const filteredItems = inventoryItems.filter(item => {

  const matchesSearch =
    item.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      );


  const matchesCategory =
    categoryFilter === "ALL" ||
    item.category?.id === categoryFilter;


  const matchesSupplier =
    supplierFilter === "ALL" ||
    item.supplier?.id === supplierFilter;


  const matchesLowStock =
    !lowStockOnly ||
    item.quantity <= item.minimumStock;


  const expiryStatus =
    getExpiryStatus(item.expiryDate);


  const matchesExpiry =
    !expiryOnly ||
    expiryStatus?.label === "EXPIRING SOON";


  const matchesExpired =
    !expiredOnly ||
    expiryStatus?.label === "EXPIRED";


  return (
    matchesSearch &&
    matchesCategory &&
    matchesSupplier &&
    matchesLowStock &&
    matchesExpiry &&
    matchesExpired
  );

});

return (
  <div className="space-y-6">

<div className="
flex
items-center
justify-between
">

<h1 className="
text-2xl
font-bold
">

Inventory

</h1>



<button

onClick={()=>setAddOpen(true)}

className="
rounded-lg
bg-blue-600
px-4
py-2
text-white
hover:bg-blue-700
"

>

+ Add Item

</button>


</div>







<div className="
rounded-xl
border
bg-white
p-4
space-y-4
">


<div className="
flex
flex-col
md:flex-row
gap-3
">



<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="Search inventory..."

className="
flex-1
rounded-lg
border
px-3
py-2
outline-none
focus:ring-2
focus:ring-blue-500
"

/>






<select

value={categoryFilter}

onChange={(e)=>
setCategoryFilter(e.target.value)
}

className="
rounded-lg
border
px-3
py-2
"

>

<option value="ALL">

All Categories

</option>


{

categories.map(category=>(

<option

key={category.id}

value={category.id}

>

{category.name}

</option>

))

}


</select>







<select

value={supplierFilter}

onChange={(e)=>
setSupplierFilter(e.target.value)
}

className="
rounded-lg
border
px-3
py-2
"

>

<option value="ALL">

All Suppliers

</option>


{

suppliers.map(supplier=>(

<option

key={supplier.id}

value={supplier.id}

>

{supplier.name}

</option>

))

}


</select>



</div>







<div className="
flex
gap-5
text-sm
">


<label className="
flex
items-center
gap-2
">


<input

type="checkbox"

checked={lowStockOnly}

onChange={(e)=>
setLowStockOnly(
e.target.checked
)
}

/>

Low stock only


</label>





<label className="
flex
items-center
gap-2
">


<input

type="checkbox"

checked={expiryOnly}

onChange={(e)=>
setExpiryOnly(
e.target.checked
)
}

/>

Expiring soon


</label>





<label className="
flex
items-center
gap-2
">


<input

type="checkbox"

checked={expiredOnly}

onChange={(e)=>
setExpiredOnly(
e.target.checked
)
}

/>

Expired


</label>



</div>


<div className="space-y-3">

{

filteredItems.length === 0 &&

<div className="
rounded-xl
border
bg-white
p-6
text-center
text-gray-500
">

No inventory items found

</div>

}





{

filteredItems.map(item=>{


const status =
getStockStatus(item);



const expiryStatus =
getExpiryStatus(
item.expiryDate
);



const expanded =
openItem === item.id;





return (

<div

key={item.id}

className="
rounded-xl
border
bg-white
overflow-hidden
"

>



<button

onClick={()=>{

setOpenItem(

expanded

?

null

:

item.id

);

}}

className="
w-full
p-4
text-left
hover:bg-gray-50
"

>



<div className="
flex
items-center
justify-between
gap-4
">



<div className="
min-w-0
">



<div className="
flex
items-center
gap-2
">


<h2 className="
font-semibold
text-lg
">

{item.name}

</h2>




<span className={`

rounded-full
px-3
py-1
text-xs
font-medium
${status.colour}

`}>

{status.label}

</span>


{

expiryStatus
&&

expiryStatus.label !== "VALID"

&&

<span className={`

rounded-full
px-3
py-1
text-xs
font-medium
${expiryStatus.colour}

`}>

{expiryStatus.label}

</span>

}



</div>






<p className="
text-sm
text-gray-500
mt-1
">

{item.supplier?.name ?? "-"}

{" • "}


{

item.category?.name &&


<span

style={{

backgroundColor:
`${item.category.colour}20`,

color:
item.category.colour

}}

className="
inline-flex
rounded-full
px-2
py-0.5
text-xs
font-medium
"

>

{item.category.name}

</span>

}


</p>


</div>








<div className="
flex
items-center
gap-4
flex-shrink-0
">



<span className="
font-medium
">

{formatStock(item)}

</span>




<span className="
text-xl
">

{

expanded

?

"▲"

:

"▼"

}

</span>



</div>



</div>



</button>
{expanded && (

<div className="
border-t
p-5
space-y-5
">



{

item.description &&

<div>

<h3 className="
text-sm
font-semibold
text-gray-700
">

Description

</h3>


<p className="
text-gray-600
">

{item.description}

</p>


</div>

}







<div className="
grid
grid-cols-1
md:grid-cols-2
gap-4
">





<div>

<p className="
text-sm
text-gray-500
">

Supplier

</p>


<p className="font-medium">

{item.supplier?.name ?? "-"}

</p>

</div>






<div>

<p className="
text-sm
text-gray-500
">

Category

</p>


<p className="font-medium">

{item.category?.name ?? "-"}

</p>

</div>






<div>

<p className="
text-sm
text-gray-500
">

Storage

</p>


<p className="font-medium">

{item.storage?.name ?? "-"}

</p>

</div>






<div>

<p className="
text-sm
text-gray-500
">

Expiry

</p>


<p className="font-medium">

{formatDate(item.expiryDate)}

</p>

</div>






<div>

<p className="
text-sm
text-gray-500
">

Minimum stock

</p>


<p className="font-medium">

{item.minimumStock ?? 5}

</p>

</div>






<div>

<p className="
text-sm
text-gray-500
">

Unit

</p>


<p className="font-medium">

{item.unit}

</p>

</div>




</div>








<div className="
flex
gap-3
pt-2
">





<button

onClick={()=>setEditItem(item)}

className="
rounded-lg
border
px-4
py-2
hover:bg-gray-100
"

>

Edit Item

</button>

<button

onClick={()=>setStockItem(item)}

className="
rounded-lg
bg-green-600
px-4
py-2
text-white
hover:bg-green-700
"

>
Update Stock

</button>

</div>
<div className="
border-t
pt-4
">



<button

onClick={()=>setOpenHistory(

openHistory === item.id

?

null

:

item.id

)}

className="
flex
items-center
gap-2
font-semibold
"

>

History

<span>

{

openHistory === item.id

?

"▲"

:

"▼"

}

</span>


</button>








{

openHistory === item.id &&

<div className="
mt-5
relative
space-y-6
">

{

item.records?.length === 0 &&

<p className="
text-sm
text-gray-500
">

No stock history yet

</p>

}



{

item.records?.map((record:any,index:number)=>(

<div
key={record.id}
className="
relative
pl-8
"
>


{/* timeline line */}

{

index !== item.records.length - 1 &&

<div
className="
absolute
left-2
top-5
bottom-[-24px]
w-px
bg-gray-200
"
/>

}



{/* timeline dot */}

{/* timeline icon */}

<div

className="
absolute
left-[-4px]
top-0
h-6
w-6
rounded-full
bg-white
flex
items-center
justify-center
"

>

{

record.type === "STOCK ADDED" ? (

<PackagePlus
size={20}
className="text-green-600"
/>

) : record.type === "STOCK REMOVED" ? (

<PackageMinus
size={20}
className="text-red-600"
/>

) : (

<PackagePlus
size={20}
className="text-blue-600"
/>

)

}

</div>

<div>

<div className="
flex
justify-between
items-start
">

<div>

<p className="
font-semibold
text-gray-900
">

{record.type}

</p>


<p className="
text-xs
text-gray-500
mt-1
">

{formatDateTime(record.createdAt)}

</p>

</div>



<p className="
text-sm
font-semibold
text-gray-700
">

{record.quantity} units

</p>


</div>




<div className="
mt-4
text-sm
">

<p className="
text-gray-500
">

Stock change </p> 
  <p className="
  font-medium
  text-gray-900
  "> {record.previousQuantity ?? "-"} {" → "} {record.newQuantity ?? "-"}

</p>

<div>

<p className="
text-gray-500
">


</p>

</div>


</div>




{

record.reason &&

<div
className="
mt-3
rounded-lg
bg-gray-50
p-2
text-sm
"
>

<strong>
Reason:
</strong>

{" "}

{record.reason}

</div>

}



</div>


</div>


))

}


</div>

}


</div>
</div>

)}



</div>

);

})}

</div>
</div>
<AddItemModal

open={
addOpen || !!editItem
}


editItem={editItem}


onClose={()=>{

setAddOpen(false);

setEditItem(null);

}}



data={{

suppliers,

categories,

storageLocations

}}


/>
{
  stockItem && (
    <UpdateStockModal
      item={stockItem}
      onClose={() => setStockItem(null)}
    />
  )
}

</div>

);

}