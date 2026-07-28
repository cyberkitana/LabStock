"use client";

import Image from "next/image";
import {
  Pencil,
  Trash2
} from "lucide-react";


type Props = {
  category: any;
  onEdit: (category: any) => void;
  onDelete: (id: string) => void;
};


export default function CategoryCard({
  category,
  onEdit,
  onDelete
}: Props) {


  return (

    <div
      className="
        group
        relative
        flex
        h-72
        w-full
        items-center
        justify-center
        transition-all
        duration-300
        hover:-translate-y-2
      "
    >


      {/* Flask */}

      <div
        className="
          relative
          h-full
          w-full
        "
      >

        <Image
          src="/images/t75-flask.png"
          alt="T75 cell culture flask"
          fill
          className="
            object-contain
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />


        {/* Category sticker */}

        <div
          className="
            absolute
            left-[32.5%]
            top-[50%]
            z-20
            -translate-x-1/2
            -translate-y-1/2
            rounded-md
            px-4
            py-2
            text-center
            shadow-md
            backdrop-blur-sm
          "
          style={{
            backgroundColor: `${category.colour || "#3B82F6"}dd`
          }}
        >

          <h2
            className="
              whitespace-nowrap
              text-sm
              font-semibold
              text-white
            "
          >
            {category.name}
          </h2>


          <p
            className="
              text-xs
              text-white/80
            "
          >
            {category._count?.items ?? 0} items
          </p>

        </div>


      </div>




      {/* Actions */}

      <div
        className="
          absolute
          bottom-2
          left-1/2
          z-50
          flex
          -translate-x-1/2
          gap-2
          opacity-0
          transition
          duration-200
          group-hover:opacity-100
        "
      >

        <button
          type="button"
          onClick={() => onEdit(category)}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            bg-white
            px-3
            py-2
            text-sm
            text-gray-700
            shadow-md
            hover:bg-gray-100
          "
        >

          <Pencil size={15}/>
          Edit

        </button>



        <button
          type="button"
          onClick={() => onDelete(category.id)}
          className="
            rounded-lg
            bg-red-500
            p-2
            text-white
            shadow-md
            hover:bg-red-600
          "
        >

          <Trash2 size={16}/>

        </button>


      </div>


    </div>

  );

}