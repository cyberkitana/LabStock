"use client";

import { Pencil } from "lucide-react";


type Props = {
  category: any;
  itemCount?: number;
  lowStockCount?: number;
  onEdit: () => void;
};


export default function CategoryBox({
  category,
  itemCount = 0,
  lowStockCount = 0,
  onEdit
}: Props) {


  return (

    <div
      className="
      group
      relative
      h-52
      w-64
      cursor-pointer
      perspective
      "
    >


      <div
        className="
        relative
        h-full
        w-full
        transition-all
        duration-300
        group-hover:-translate-y-3
        "
      >


        {/* top face */}
        <div
          className="
          absolute
          left-3
          top-0
          h-10
          w-[calc(100%-12px)]
          rounded-t-xl
          opacity-80
          "
          style={{
            backgroundColor: category.colour
          }}
        />


        {/* side face */}
        <div
          className="
          absolute
          right-0
          top-5
          h-[calc(100%-20px)]
          w-6
          rounded-r-xl
          brightness-75
          "
          style={{
            backgroundColor: category.colour
          }}
        />


        {/* front face */}
        <div
          className="
          absolute
          bottom-0
          left-0
          h-[calc(100%-20px)]
          w-[calc(100%-24px)]
          rounded-xl
          p-5
          shadow-xl
          flex
          flex-col
          justify-between
          "
          style={{
            backgroundColor: category.colour
          }}
        >


          <div>

            <h2
              className="
              text-xl
              font-bold
              text-white
              "
            >
              {category.name}
            </h2>


            <p
              className="
              mt-2
              text-sm
              text-white/80
              "
            >
              {itemCount} items
            </p>

          </div>




          <div
            className="
            flex
            justify-between
            items-end
            "
          >


            <div>

              {
                lowStockCount > 0 && (

                  <p
                    className="
                    rounded-full
                    bg-white/20
                    px-3
                    py-1
                    text-xs
                    text-white
                    "
                  >
                    ⚠ {lowStockCount} low stock
                  </p>

                )
              }

            </div>



            <button

              onClick={(e)=>{

                e.stopPropagation();
                onEdit();

              }}

              className="
              rounded-full
              bg-white/20
              p-2
              text-white
              hover:bg-white/40
              "

            >

              <Pencil size={16}/>

            </button>


          </div>


        </div>


      </div>


    </div>

  );

}