"use client";

import {
  addInventoryItem,
  updateInventoryItem
} from "@/actions/inventory";

import SearchableSelect from "@/components/SearchableSelect";


type Props = {

  open:boolean;

  onClose:()=>void;

  editItem?:any;

  data?:{

    suppliers?:any[];

    categories?:any[];

    storageLocations?:any[];

  };

};





export default function AddItemModal({

  open,

  onClose,

  editItem,

  data={}

}:Props){



if(!open)
return null;



const suppliers =
data.suppliers ?? [];

const categories =
data.categories ?? [];

const storageLocations =
data.storageLocations ?? [];






async function submit(
formData:FormData
){


if(editItem){

await updateInventoryItem(formData);

}

else{

await addInventoryItem(formData);

}


onClose();


}






return (

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
"
>


<div
className="
w-full
max-w-xl
max-h-[90vh]
overflow-y-auto
rounded-2xl
bg-white
p-6
shadow-xl
"
>


<h2
className="
mb-6
text-xl
font-bold
"
>

{
editItem
?
"Edit Inventory Item"
:
"Add Inventory Item"
}

</h2>





<form
action={submit}
className="space-y-4"
>



<input
type="hidden"
name="id"
value={editItem?.id ?? ""}
/>





<div>

<label className="text-sm font-medium">
Item name
</label>

<input
name="name"
required
defaultValue={editItem?.name ?? ""}
className="
mt-1
w-full
rounded-lg
border
px-3
py-2.5
"
/>

</div>






<div>

<label className="text-sm font-medium">
Description
</label>


<textarea
name="description"
defaultValue={editItem?.description ?? ""}
className="
mt-1
w-full
rounded-lg
border
px-3
py-2.5
"
/>

</div>







<div>

<label className="text-sm font-medium">
Specific / Size
</label>


<input
name="specific"
defaultValue={editItem?.specific ?? ""}
placeholder="e.g. 50 mL, High glucose, Large"
className="
mt-1
w-full
rounded-lg
border
px-3
py-2.5
"
/>

</div>








<div
className="
grid
grid-cols-2
gap-4
"
>


<div>

<label className="text-sm font-medium">
Quantity
</label>


<input

type="number"

name="quantity"

defaultValue={
editItem?.quantity ?? 0
}

disabled={!!editItem}

className="
mt-1
w-full
rounded-lg
border
px-3
py-2.5
disabled:bg-gray-100
"

/>


{
editItem &&

<p className="
mt-1
text-xs
text-gray-500
">

Use Update Stock to change quantity

</p>

}

</div>






<div>

<label className="text-sm font-medium">
Minimum stock
</label>


<input

type="number"

name="minimumStock"

defaultValue={
editItem?.minimumStock ?? 5
}

className="
mt-1
w-full
rounded-lg
border
px-3
py-2.5
"

/>

</div>


</div>







<div>

<label className="text-sm font-medium">
Unit
</label>


<select

name="unit"

defaultValue={
editItem?.unit ?? "Unit"
}

className="
mt-1
w-full
rounded-lg
border
bg-white
px-3
py-2.5
"

>


<option value="Unit">
Unit
</option>

<option value="Box">
Box
</option>

<option value="Bottle">
Bottle
</option>

<option value="Tube">
Tube
</option>

<option value="Vial">
Vial
</option>

<option value="Kit">
Kit
</option>

<option value="Bag">
Bag
</option>

<option value="mL">
mL
</option>

<option value="µL">
µL
</option>

<option value="g">
g
</option>

<option value="mg">
mg
</option>

<option value="kg">
kg
</option>


</select>

</div>









<div>

<label className="text-sm font-medium">
Category
</label>


<select

name="category"

defaultValue={
editItem?.category?.name ?? ""
}

className="
mt-1
w-full
rounded-lg
border
bg-white
px-3
py-2.5
"

>


<option value="">
Select category
</option>


{

categories.map(category=>(

<option

key={category.id}

value={category.name}

>

{category.name}

</option>

))

}


</select>


</div>










<div>

<label className="text-sm font-medium">
Supplier
</label>


<select

name="supplier"

defaultValue={
editItem?.supplier?.name ?? ""
}

className="
mt-1
w-full
rounded-lg
border
bg-white
px-3
py-2.5
"

>


<option value="">
Select supplier
</option>


{

suppliers.map(supplier=>(

<option

key={supplier.id}

value={supplier.name}

>

{supplier.name}

</option>

))

}


</select>


</div>









<div>

<label className="text-sm font-medium">
Storage Location
</label>


<select

name="storage"

defaultValue={
editItem?.storage?.name ?? ""
}

className="
mt-1
w-full
rounded-lg
border
bg-white
px-3
py-2.5
"

>


<option value="">
Select storage location
</option>


{

storageLocations.map(storage=>(

<option

key={storage.id}

value={storage.name}

>

{storage.name}

</option>

))

}


</select>


</div>

<div>

<label className="text-sm font-medium">
Expiry date
</label>


<input

type="date"

name="expiryDate"

defaultValue={

editItem?.expiryDate

?

new Date(editItem.expiryDate)
.toISOString()
.substring(0,10)

:

""

}

className="
mt-1
w-full
rounded-lg
border
px-3
py-2.5
"

/>


</div>








<div

className="
flex
justify-end
gap-3
pt-4
"

>


<button

type="button"

onClick={onClose}

className="
rounded-lg
border
px-5
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
px-5
py-2
text-white
"

>

{

editItem

?

"Update"

:

"Save"

}

</button>


</div>



</form>


</div>


</div>

);


}