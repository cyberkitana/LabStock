"use server";

/*
  STORAGE LOCATION ACTIONS

  This file contains all database operations
  related to storage locations.

  Used by:
  - StorageManager component

  Functions:

  createStorageLocation()
    Adds a new freezer/fridge/shelf/room location.

  updateStorageLocation()
    Updates existing storage information.

  deleteStorageLocation()
    Removes a storage location.

*/


import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";








/*
  CREATE STORAGE LOCATION

  Required:
  - name

  Optional:
  - type
  - temperature

  Examples:

  Name:
  "Main Cell Culture Fridge"

  Type:
  "Fridge"

  Temperature:
  "4°C"

*/


export async function createStorageLocation(
formData:FormData
){


const name =
String(formData.get("name"))
.trim();



if(!name)
return;



await prisma.storageLocation.create({

data:{


name,


type:
String(formData.get("type") || "")
|| null,


temperature:
String(formData.get("temperature") || "")
|| null,


}

});



revalidatePath("/storage");


}









/*
  UPDATE STORAGE LOCATION

  Updates an existing storage entry.
*/


export async function updateStorageLocation(
formData:FormData
){


const id =
String(formData.get("id"));



if(!id)
return;



await prisma.storageLocation.update({

where:{
id
},


data:{


name:
String(formData.get("name"))
.trim(),



type:
String(formData.get("type") || "")
|| null,



temperature:
String(formData.get("temperature") || "")
|| null,


}


});



revalidatePath("/storage");


}









/*
  DELETE STORAGE LOCATION

  Removes a storage location.

  Inventory items should have optional
  storageId, so deletion will only work
  if Prisma relations allow it.
*/


export async function deleteStorageLocation(
id:string
){


await prisma.storageLocation.delete({

where:{
id
}

});


revalidatePath("/storage");


}