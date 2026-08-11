"use client";

import ItemCard from "./InventoryCard";
import { useState } from "react";


export default function InventorySection({items}:any){

  const [selected,setSelected] = useState(null);


  function handleEdit(item:any){

    setSelected(item);

  }


  return (

    <section className="space-y-3">


      {items.map((item:any)=>(

        <ItemCard

          key={item.id}

          item={item}

          onEdit={()=>handleEdit(item)}

        />

      ))}


    </section>

  );

}