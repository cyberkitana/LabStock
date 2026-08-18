import { prisma } from "@/lib/prisma";

import CategoryManager from "@/components/CategoryManager";
import SupplierManager from "@/components/suppliers/SupplierManager";
import StorageManager from "@/components/storage/StorageManager";


/*
  MANAGEMENT PAGE

  Central location for:

  - Inventory categories
  - Suppliers
  - Storage locations

  This page only retrieves data and passes it
  into the existing managers.

  The managers handle:
  - adding
  - editing
  - deleting
*/


export default async function ManagementPage(){


const categories = await prisma.category.findMany({

orderBy:{
name:"asc"
},

include:{
_count:{
select:{
items:true
}
}
}

});




const suppliers = await prisma.supplier.findMany({

orderBy:{
name:"asc"
}

});





const storageLocations = await prisma.storageLocation.findMany({

orderBy:{
name:"asc"
}

});






return (

<main

className="
min-h-screen
bg-gray-50
p-8
"

>


<div

className="
max-w-7xl
mx-auto
space-y-8
"

>


<h1

className="
text-3xl
font-bold
text-gray-800
"

>

Laboratory Management

</h1>



<p

className="
text-gray-500
"

>

Manage categories, suppliers and storage locations

</p>







<div

className="
rounded-2xl
bg-white
border
p-6
shadow-sm
"

>

<h2 className="
text-xl
font-semibold
mb-4
">

Categories

</h2>


<CategoryManager

categories={categories}

/>


</div>









<div

className="
rounded-2xl
bg-white
border
p-6
shadow-sm
"

>

<h2 className="
text-xl
font-semibold
mb-4
">

Suppliers

</h2>


<SupplierManager

suppliers={suppliers}

/>


</div>









<div

className="
rounded-2xl
bg-white
border
p-6
shadow-sm
"

>

<h2 className="
text-xl
font-semibold
mb-4
">

Storage Locations

</h2>


<StorageManager

storageLocations={storageLocations}

/>


</div>







</div>


</main>

);


}