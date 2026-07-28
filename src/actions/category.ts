"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";



export async function createCategory(
formData:FormData
){

const name =
String(formData.get("name"))
.trim();


const colour =
String(formData.get("colour"))
.trim();



if(!name)
return;



await prisma.category.create({

data:{
name,
colour
}

});


revalidatePath("/categories");

}





export async function updateCategory(
formData:FormData
){

const id =
String(formData.get("id"));


const name =
String(formData.get("name"))
.trim();


const colour =
String(formData.get("colour"))
.trim();



if(!id)
return;



await prisma.category.update({

where:{
id
},


data:{
name,
colour
}

});


revalidatePath("/categories");

}



export async function deleteCategory(id:string){

await prisma.category.delete({

where:{
id
}

});


revalidatePath("/categories");

}