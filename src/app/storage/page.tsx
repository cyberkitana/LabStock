import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StorageManager from "@/components/StorageManager";


export default async function StoragePage(){


  const storageLocations = await prisma.storageLocation.findMany({

  include:{
    items:{
      include:{
        item:true
      }
    }
  },

  orderBy:{
    name:"asc"
  }

});

  return (

    <main

      className="
      min-h-screen
      p-8
      bg-gray-50
      "

    >


      <div

        className="
        max-w-7xl
        mx-auto
        "

      >





        {/* Header */}

        <div

          className="
          flex
          items-center
          justify-between
          mb-8
          "

        >



          <div>


            <h1

              className="
              text-2xl
              font-bold
              text-gray-800
              "

            >

              Laboratory Storage Locations

            </h1>



            <p

              className="
              mt-1
              text-gray-500
              "

            >

        

            </p>


          </div>






          <Link

            href="/lab-room"

            className="
            rounded-lg
            bg-gray-800
            px-4
            py-2
            text-white
            hover:bg-gray-700
            "

          >

            ← Back to Lab Room

          </Link>



        </div>









        {/* Storage management area */}

        <div

          className="
          rounded-2xl
          border
          bg-white
          p-6
          shadow-sm
          "

        >


          <StorageManager

            storageLocations={storageLocations}

          />


        </div>





      </div>


    </main>


  );


}