"use client";

import {
Folder,
FileText
} from "lucide-react";


type Props = {

suppliers:any[];

};



export default function SupplierFiles({

suppliers

}:Props){


return (

<section className="space-y-5">


<h2 className="text-xl font-bold">
📁 Supplier Files
</h2>



<div className="grid md:grid-cols-3 gap-6">


{
suppliers.map((supplier)=>(


<div

key={supplier.id}

className="
rounded-xl
border
bg-yellow-50
p-5
shadow-sm
"

>


<div className="flex gap-3 items-center">


<Folder
size={40}
className="text-yellow-600"
/>


<div>

<h3 className="font-bold">

{supplier.name}

</h3>


<p className="text-sm text-gray-500">

{supplier.items.length} items

</p>


</div>


</div>





<div className="mt-4 space-y-2">


{
supplier.items.map((item:any)=>(


<div
key={item.id}
className="flex gap-2 text-sm"
>


<FileText size={14}/>

{item.name}


</div>


))

}



</div>



</div>


))

}


</div>


</section>

);


}