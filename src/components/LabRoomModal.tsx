"use client";


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



type Props = {

  selected:string | null;

  close:()=>void;

  storageLocations:StorageLocation[];

  categories:Category[];

  suppliers:Supplier[];

};



export default function LabRoomModal({

  selected,

  close,

  storageLocations,

  categories,

  suppliers

}:Props){



  if(!selected) return null;




  return (

    <div

      className="
      absolute
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
      "

    >



      <div

        className="
        bg-white
        rounded-2xl
        p-6
        shadow-xl
        w-[450px]
        max-h-[80%]
        overflow-y-auto
        "

      >



        <h2

          className="
          text-2xl
          font-bold
          text-gray-800
          "

        >

          {selected}

        </h2>





        {/* STORAGE LOCATIONS */}

        {selected === "Storage" && (

          <div className="mt-4 space-y-3">


            {(storageLocations ?? []).map(location=>(

              <div

                key={location.id}

                className="
                rounded-lg
                border
                p-3
                "

              >

                <p className="font-semibold">

                  {location.name}

                </p>


                <p className="text-sm text-gray-500">

                  Created:

                {new Date(location.createdAt).toLocaleDateString()}

                </p>


              </div>

            ))}


          </div>

        )}







        {/* CATEGORIES */}

        {selected === "Categories" && (

          <div className="mt-4 space-y-3">


            {(categories ?? []).map(category=>(

              <div

                key={category.id}

                className="
                rounded-lg
                border
                p-3
                "

              >

                <p className="font-semibold">

                  {category.name}

                </p>


              </div>

            ))}


          </div>

        )}








        {/* SUPPLIERS */}

        {selected === "Suppliers" && (

          <div className="mt-4 space-y-3">


            {(suppliers ?? []).map(supplier=>(

              <div

                key={supplier.id}

                className="
                rounded-lg
                border
                p-3
                "

              >

                <p className="font-semibold">

                  {supplier.name}

                </p>


                <p className="text-sm text-gray-500">

                  {supplier.contact ?? "No contact details"}

                </p>


              </div>

            ))}


          </div>

        )}






        <button

          onClick={close}

          className="
          mt-6
          rounded-lg
          bg-gray-800
          px-4
          py-2
          text-white
          hover:bg-gray-700
          "

        >

          Close

        </button>



      </div>


    </div>

  );

}