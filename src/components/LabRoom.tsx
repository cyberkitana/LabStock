"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LabRoomModal from "./LabRoomModal";
type StorageLocation = {

  id:string;
  name:string;
  createdAt:Date;

};


type Category = {

  id:string;
  name:string;
  colour:string;

};


type Supplier = {

  id:string;
  name:string;
  contact:string | null;

};
export default function LabRoom({

  storageLocations,

  categories,

  suppliers

}:{

  storageLocations:StorageLocation[];

  categories:Category[];

  suppliers:Supplier[];

}) {


  const [selected, setSelected] = useState<string | null>(null);



  const [hovered, setHovered] = useState<string | null>(null);
const router = useRouter();

  function openStorage(name:string){


  if(name === "Categories"){

    router.push("/categories");

    return;

  }



  if(name === "Storage"){

    router.push("/storage");

    return;

  }



  if(name === "Suppliers"){

    router.push("/suppliers");

    return;

  }



  setSelected(name);

}



  return (

    <div

      className="
      relative
      w-full
      max-w-6xl
      mx-auto
      overflow-hidden
      rounded-2xl
      "

    >



      {/* BASE LAB IMAGE */}

      <Image

        src="/images/lab.png"

        alt="Laboratory room"

        width={1600}

        height={900}

        className="
        w-full
        h-auto
        "

        priority

      />






      {/* FREEZER VISUAL */}

      <Image

        src="/images/freezer.png"

        alt="Freezer"

        fill

        className={`
          absolute
          inset-0
          object-contain
          pointer-events-none
          transition-all
            duration-300
            ease-out
          ${
            hovered === "Freezer"
              ? "scale-[1.04] drop-shadow-xl"
              : "scale-100"
          }
        `}

      />





      {/* SHELF VISUAL */}

      <Image

        src="/images/shelf.png"

        alt="Shelves"

        fill

        className={`
          absolute
          inset-0
          object-contain
          pointer-events-none
           transition-all
            duration-300
            ease-out
          ${
            hovered === "Shelves"
            ? "scale-[1.04] drop-shadow-xl"
              : "scale-100"
          }
        `}

      />





      {/* FILE VISUAL */}

      <Image

        src="/images/file.png"

        alt="Files"

        fill

        className={`
          absolute
          inset-0
          object-contain
          pointer-events-none
           transition-all
            duration-300
            ease-out
          ${
            hovered === "Files"
            ? "scale-[1.04] drop-shadow-xl"
              : "scale-100"
          }
        `}

      />








      {/* FREEZER HOTSPOT */}
      
          <div
  className="
  absolute
  left-[15%]
  top-[30%]
  z-10
  rounded-lg
  bg-slate-900/80
  px-3
  py-1
  text-sm
  font-medium
  text-white
  shadow-lg
  select-none
pointer-events-none
  "
>
Storage Locations
</div>
      <button

        onMouseEnter={()=>setHovered("Freezer")}

        onMouseLeave={()=>setHovered(null)}

        onClick={()=>openStorage("Storage")}

        className="
        absolute
        left-[15%]
        top-[30%]
        w-[18%]
        h-[45%]
        cursor-pointer
        "

      />







      {/* SHELF HOTSPOT */}
<div
  className="
  absolute
  left-[40%]
  top-[25%]
  z-10
  rounded-lg
  bg-slate-900/80
  px-3
  py-1
  text-sm
  font-medium
  text-white
  shadow-lg
  select-none
pointer-events-none
  "
>
Inventory Categories
</div>
      <button

        onMouseEnter={()=>setHovered("Shelves")}

        onMouseLeave={()=>setHovered(null)}

        onClick={()=>openStorage("Categories")}

        className="
        absolute
        left-[40%]
        top-[25%]
        w-[30%]
        h-[35%]
        cursor-pointer
        "

      />








      {/* FILE HOTSPOT */}
<div
  className="
  absolute
  left-[63%]
  top-[60%]
  z-10
  rounded-lg
  bg-slate-900/80
  px-3
  py-1
  text-sm
  font-medium
  text-white
  shadow-lg
  select-none
pointer-events-none
  "
>
Suppliers
</div>
      <button

        onMouseEnter={()=>setHovered("Files")}

        onMouseLeave={()=>setHovered(null)}

        onClick={()=>openStorage("Suppliers")}

        className="
        absolute
        left-[63%]
        top-[60%]
        w-[15%]
        h-[25%]
        cursor-pointer
        "

      />

      <LabRoomModal

  selected={selected}

  close={()=>setSelected(null)}

  storageLocations={storageLocations ?? []}

  categories={categories ?? []}

  suppliers={suppliers ?? []}

/>

    </div>

  );

}