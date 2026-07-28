/*
  INVENTORY PAGE

  Server component.

  Fetches:
  - Inventory items
  - Suppliers
  - Categories
  - Storage locations

  Passes data to InventoryTable.
*/


import { prisma } from "@/lib/prisma";

import InventoryTable from "@/components/InventoryTable";





export default async function InventoryPage(){



const inventoryItems =

await prisma.inventoryItem.findMany({

include:{


supplier:true,

category:true,

storage:true,


records:{

orderBy:{


createdAt:"desc"


}

}


},


orderBy:{


createdAt:"desc"


}


});







const suppliers =

await prisma.supplier.findMany({

orderBy:{


name:"asc"


}


});








const categories =

await prisma.category.findMany({

orderBy:{


name:"asc"


}


});








const storageLocations =

await prisma.storageLocation.findMany({

orderBy:{


name:"asc"


}


});









return (

<main

className="
p-8
"

>


<InventoryTable


inventoryItems={inventoryItems}


suppliers={suppliers}


categories={categories}


storageLocations={storageLocations}


/>


</main>


);


}