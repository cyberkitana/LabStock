"use client";

import { updateStock } from "@/actions/inventory";


type Props = {
  item:any;
  onClose:()=>void;
};


export default function UpdateStockModal({
  item,
  onClose
}:Props){


async function submit(formData:FormData){

  await updateStock(formData);

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
max-w-md
rounded-2xl
bg-white
p-6
shadow-xl
"
>


<h2
className="
text-xl
font-bold
mb-5
"
>
Update Stock
</h2>



<form
action={submit}
className="space-y-4"
>


<input
type="hidden"
name="itemId"
value={item.id}
/>



<div>

<label className="text-sm font-medium">
Item
</label>

<input

disabled

value={item.name}

className="
mt-1
w-full
rounded-lg
border
bg-gray-100
px-3
py-2
"

/>

</div>





<div>

<label className="text-sm font-medium">
Storage Location
</label>


<select

name="storageId"

required

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
Select storage
</option>


{

item.locations?.map((location:any)=>(

<option

key={location.storageId}

value={location.storageId}

>

{location.storage.name}

(current: {location.quantity})

</option>

))

}


</select>


</div>







<div>

<label className="text-sm font-medium">
Quantity change
</label>

<p className="text-xs text-gray-500">
Use positive numbers to add stock, negative numbers to remove stock.
</p>


<input

name="quantity"

type="number"

required

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

<label className="text-sm font-medium">
Reason
</label>


<select

name="reason"

className="
mt-1
w-full
rounded-lg
border
px-3
py-2
bg-white
"

>


<option value="">
Select reason
</option>


<option value="New stock received">
New stock received
</option>


<option value="Used in experiment">
Used in experiment
</option>


<option value="Damaged stock">
Damaged stock
</option>


<option value="Expired stock removed">
Expired stock removed
</option>


<option value="Stock correction">
Stock correction
</option>


</select>


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
bg-green-600
px-4
py-2
text-white
"

>
Update Stock
</button>



</div>



</form>



</div>


</div>

);

}