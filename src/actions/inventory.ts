"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";



/*
  Prevents JavaScript timezone conversion problems.

  HTML date inputs return:
  YYYY-MM-DD

  This stores the exact date selected.
*/
function parseDate(value: string) {

  if (!value) {
    return null;
  }


  const [
    year,
    month,
    day
  ] = value.split("-");


  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

}






async function getSupplierId(name:string){

  if(!name)
    return undefined;


  const supplier =
    await prisma.supplier.upsert({

      where:{
        name
      },

      update:{},

      create:{
        name
      }

    });


  return supplier.id;

}

async function getCategoryId(name:string){

  if(!name)
    return undefined;


  const category =
    await prisma.category.findUnique({

      where:{
        name
      }

    });


  return category?.id;


}







async function getStorageId(name:string){

  if(!name)
    return undefined;


  const storage =
    await prisma.storageLocation.upsert({

      where:{
        name
      },

      update:{},

      create:{
        name
      }

    });


  return storage.id;

}









export async function addInventoryItem(
  formData:FormData
){


const supplierId =
await getSupplierId(
 String(formData.get("supplier") || "")
 .trim()
);



const categoryId =
await getCategoryId(
 String(formData.get("category") || "")
 .trim()
);



const storageId =
await getStorageId(
 String(formData.get("storage") || "")
 .trim()
);






const item =
await prisma.inventoryItem.create({

data:{


name:
String(formData.get("name")),



description:
String(
formData.get("description") || ""
),



quantity:
Number(
formData.get("quantity") || 0
),



minimumStock:
Number(
formData.get("minimumStock") || 5
),



unit:
String(
formData.get("unit") || "Unit"
),



specific:
String(
formData.get("specific") || ""
),



expiryDate:
parseDate(
String(formData.get("expiryDate") || "")
),



supplierId,

categoryId,

storageId


}


});







await prisma.inventoryRecord.create({

data:{


itemId:item.id,


type:"CREATED",


quantity:item.quantity,


previousQuantity:0,


newQuantity:item.quantity,


reason:"Initial stock"


}


});





revalidatePath("/inventory");


}














export async function updateInventoryItem(
formData:FormData
){


const id =
String(formData.get("id"));



const supplierId =
await getSupplierId(
String(formData.get("supplier") || "")
.trim()
);



const categoryId =
await getCategoryId(
String(formData.get("category") || "")
.trim()
);



const storageId =
await getStorageId(
String(formData.get("storage") || "")
.trim()
);






await prisma.inventoryItem.update({

where:{
id
},


data:{


name:
String(formData.get("name")),



description:
String(
formData.get("description") || ""
),



minimumStock:
Number(
formData.get("minimumStock") || 5
),



unit:
String(
formData.get("unit") || "Unit"
),



specific:
String(
formData.get("specific") || ""
),



expiryDate:
parseDate(
String(formData.get("expiryDate") || "")
),



supplierId,

categoryId,

storageId


}


});





revalidatePath("/inventory");


}















export async function updateStock(
formData:FormData
){


const itemId =
String(formData.get("itemId"));



const change =
Number(
formData.get("quantity")
);



if(!itemId || !change)
return;






const item =
await prisma.inventoryItem.findUnique({

where:{
id:itemId
}

});




if(!item)
return;






const newQuantity =
item.quantity + change;






await prisma.inventoryItem.update({

where:{
id:itemId
},


data:{
quantity:newQuantity
}


});








await prisma.inventoryRecord.create({

data:{


itemId,


type:
change > 0
?
"STOCK ADDED"
:
"STOCK REMOVED",



quantity:
Math.abs(change),



previousQuantity:
item.quantity,



newQuantity,



reason:
String(
formData.get("reason") || ""
)


}


});







revalidatePath("/inventory");


}