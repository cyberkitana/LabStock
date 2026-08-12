"use client";


import {
  X,
  Plus,
  Minus,
  Pencil,
  PackagePlus
} from "lucide-react";



type Props = {

  open:boolean;

  onClose:()=>void;

  records:any[];

  itemName:string;

};





export default function InventoryHistoryModal({

  open,

  onClose,

  records,

  itemName


}:Props){



if(!open) return null;





function formatDate(date:string){

  return new Date(date)
    .toLocaleString();

}







function getIcon(type:string){


  switch(type){


    case "STOCK_ADDED":

      return (
        <Plus
          size={18}
          className="text-green-600"
        />
      );



    case "STOCK_REMOVED":

      return (
        <Minus
          size={18}
          className="text-red-600"
        />
      );



    case "EDIT":

      return (
        <Pencil
          size={18}
          className="text-blue-600"
        />
      );



    default:

      return (
        <PackagePlus
          size={18}
          className="text-zinc-600"
        />
      );


  }

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
rounded-2xl
bg-white
shadow-xl
"

>




{/* HEADER */}

<div

className="
flex
items-center
justify-between
border-b
p-5
"

>


<div>


<h2

className="
text-xl
font-bold
"

>

Record History

</h2>



<p

className="
text-sm
text-zinc-500
"

>

{itemName}

</p>


</div>





<button

onClick={onClose}

>

<X/>

</button>



</div>









{/* RECORDS */}

<div

className="
max-h-[500px]
space-y-4
overflow-y-auto
p-5
"

>

{

records.length === 0 ? (


<div

className="
rounded-xl
bg-zinc-50
p-5
text-center
text-zinc-500
"

>

No history recorded yet.

</div>


)

:

(

records.map((record)=>(

<div

key={record.id}

className="
rounded-xl
border
p-4
"

>




<div

className="
flex
items-start
gap-3
"

>



<div

className="
rounded-full
bg-zinc-100
p-2
"

>

{getIcon(record.type)}

</div>







<div

className="flex-1"

>


<div

className="
flex
justify-between
"

>


<h3

className="
font-semibold
"

>


{

record.type === "STOCK_ADDED"

?

"Stock Added"


:

record.type === "STOCK_REMOVED"

?

"Stock Removed"


:

record.type === "EDIT"

?

"Item Updated"


:

"Item Created"


}


</h3>



<span

className="
text-sm
text-zinc-500
"

>

{

formatDate(record.createdAt)

}

</span>


</div>








<p

className="
mt-2
text-sm
"

>


Quantity change:

{" "}


<strong>


{

record.quantity > 0

?

"+"

:

""

}


{record.quantity}


</strong>


</p>









{

record.previousQuantity !== null && (

<p

className="
text-sm
text-zinc-500
"

>

Stock:

{" "}

{record.previousQuantity}

{" → "}

{record.newQuantity}

</p>

)

}








{

record.reason && (

<div

className="
mt-3
rounded-lg
bg-zinc-50
p-3
text-sm
"

>


<strong>

Reason:

</strong>


{" "}


{record.reason}



</div>

)

}





</div>



</div>





</div>



))


)


}





</div>







</div>



</div>


);


}