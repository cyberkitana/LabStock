"use client";


import { useState } from "react";
import { updateInventoryItem } from "@/actions/inventory";
import { X } from "lucide-react";



type Props = {

  open:boolean;

  onClose:()=>void;

  item:any;

};





export default function EditItemModal({

  open,

  onClose,

  item

}:Props){



const [loading,setLoading] = useState(false);




if(!open || !item)
  return null;





async function handleSubmit(
  formData:FormData
){

  setLoading(true);


  await updateInventoryItem(formData);

  setLoading(false);

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
bg-black/30
p-4
"

>


<div

className="
w-full
max-w-lg
rounded-xl
bg-white
p-6
shadow-lg
"

>


<div

className="
mb-5
flex
items-center
justify-between
"

>

<h2

className="
text-xl
font-semibold
"

>

Edit Item

</h2>



<button

onClick={onClose}

>

<X size={20}/>

</button>


</div>






<form

action={handleSubmit}

className="
space-y-4
"

>





<input

name="name"

defaultValue={item.name}

className="
w-full
rounded-lg
border
p-3
"

/>







<textarea

name="description"

defaultValue={
item.description ?? ""
}

className="
w-full
rounded-lg
border
p-3
"

/>







<div

className="
grid
grid-cols-2
gap-3
"

>


<input

name="quantity"

type="number"

defaultValue={
item.quantity
}

className="
rounded-lg
border
p-3
"

/>




<input

name="unit"

defaultValue={
item.unit
}

className="
rounded-lg
border
p-3
"

/>


</div>








<input

name="specific"

placeholder="Specific (optional e.g. 500 mL)"

defaultValue={
item.specific ?? ""
}

className="
w-full
rounded-lg
border
p-3
"

/>







<input

name="batchNumber"

placeholder="Batch number (optional)"

defaultValue={
item.batchNumber ?? ""
}

className="
w-full
rounded-lg
border
p-3
"

/>








<div

className="
flex
justify-end
gap-3
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

disabled={loading}

className="
rounded-lg
bg-blue-600
px-4
py-2
text-white
disabled:opacity-50
"

>

{

loading

?

"Saving..."

:

"Save Changes"

}


</button>



</div>





</form>





</div>


</div>

);


}