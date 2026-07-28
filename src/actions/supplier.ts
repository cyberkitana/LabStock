"use server";

/*
  SUPPLIER ACTIONS

  This file contains all database operations
  related to suppliers.

  Used by:
  - SupplierManager component

  Functions:
  - createSupplier()
      Adds a new supplier

  - updateSupplier()
      Updates existing supplier information

  - deleteSupplier()
      Removes supplier
*/


import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";





/*
  CREATE SUPPLIER

  Required:
  - name

  Optional:
  - contact
  - email
  - phone
  - website
*/


export async function createSupplier(
  formData:FormData
){


const name =
String(formData.get("name"))
.trim();


if(!name)
return;



await prisma.supplier.create({

data:{

name,


contact:
String(formData.get("contact") || "")
|| null,


email:
String(formData.get("email") || "")
|| null,


phone:
String(formData.get("phone") || "")
|| null,


website:
String(formData.get("website") || "")
|| null,


}

});



revalidatePath("/suppliers");


}









/*
  UPDATE SUPPLIER

  Updates an existing supplier
*/

export async function updateSupplier(
formData:FormData
){


const id =
String(formData.get("id"));



if(!id)
return;



await prisma.supplier.update({

where:{
id
},


data:{


name:
String(formData.get("name"))
.trim(),


contact:
String(formData.get("contact") || "")
|| null,


email:
String(formData.get("email") || "")
|| null,


phone:
String(formData.get("phone") || "")
|| null,


website:
String(formData.get("website") || "")
|| null,


}


});



revalidatePath("/suppliers");


}









/*
  DELETE SUPPLIER

  Removes supplier from database.

  Note:
  Inventory items should have supplierId
  optional, so deleting suppliers will
  need handling if items are attached.
*/


export async function deleteSupplier(
id:string
){


await prisma.supplier.delete({

where:{
id
}

});


revalidatePath("/suppliers");


}