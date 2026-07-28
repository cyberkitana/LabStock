import { prisma } from "@/lib/prisma";
import LabRoom from "@/components/LabRoom";


export default async function LabRoomPage() {


  const storageLocations = await prisma.storageLocation.findMany({

    orderBy:{
      name:"asc"
    }

  });



  const categories = await prisma.category.findMany({

    orderBy:{
      name:"asc"
    }

  });



  const suppliers = await prisma.supplier.findMany({

    orderBy:{
      name:"asc"
    }

  });




  return (

  <main

    className="
    min-h-screen
    bg-gray-50
    p-8
    "

  >


    <div

      className="
      max-w-6xl
      mx-auto
      "

    >


      {/* Page Header */}

      <div

        className="
        mb-8
        "

      >

        <h1

          className="
          text-3xl
          font-bold
          text-gray-800
          "

        >

          Manage My Lab

        </h1>


        <p

          className="
          mt-1
          text-gray-500
          "

        >

          Manage storage locations, inventory categories, and suppliers

        </p>


      </div>





      {/* Interactive Lab Room */}

<LabRoom

  storageLocations={storageLocations}

  categories={categories}

  suppliers={suppliers}

/>
    </div>


  </main>

);

}