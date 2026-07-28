"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createCategory,
  updateCategory,
  deleteCategory
} from "@/actions/category";

import CategoryCard from "@/components/CategoryCard";


type Props = {
  categories:any[];
};


export default function CategoryManager({
  categories
}:Props){


const router = useRouter();


const [editing,setEditing] = useState<any>(null);


async function save(formData:FormData){

  if(editing){

    await updateCategory(formData);

    setEditing(null);

  }
  else{

    await createCategory(formData);

  }


  router.refresh();

}



async function remove(id:string){

  const confirmDelete =
    confirm("Delete this category?");


  if(!confirmDelete) return;


  await deleteCategory(id);

  router.refresh();

}



return (

<div className="space-y-8">


{/* CATEGORY FORM */}

<div
className="
rounded-2xl
border
bg-white
p-6
shadow-sm
"
>


<h2
className="
mb-4
text-lg
font-semibold
"
>

{editing ? "Edit Category" : "Create Category"}

</h2>



<form
key={editing?.id ?? "new"}
action={save}
className="
flex
flex-col
gap-3
md:flex-row
"
>


<input
type="hidden"
name="id"
value={editing?.id ?? ""}
/>



<input
name="name"
required
defaultValue={editing?.name ?? ""}
placeholder="Category name"
className="
flex-1
rounded-lg
border
px-3
py-2
"
/>



<div className="flex items-center gap-2">

<input
type="color"
name="colour"
defaultValue={
editing?.colour ?? "#3B82F6"
}
className="
h-10
w-14
cursor-pointer
rounded
"
/>


<span
className="
text-sm
text-gray-500
"
>
Colour
</span>

</div>




<button
type="submit"
className="
rounded-lg
bg-blue-600
px-5
py-2
text-white
hover:bg-blue-700
"
>

{editing ? "Update" : "Create"}

</button>




{editing && (

<button
type="button"
onClick={() => setEditing(null)}
className="
rounded-lg
border
px-5
py-2
"
>

Cancel

</button>

)}


</form>


</div>





{/* FLASK GRID */}

<div
className="
grid
grid-cols-1
gap-8
sm:grid-cols-2
lg:grid-cols-3
"
>


{
categories.map(category => (

<CategoryCard

key={category.id}

category={category}

onEdit={setEditing}

onDelete={remove}

/>

))
}


</div>


</div>

);


}