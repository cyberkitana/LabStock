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
  h-screen
  overflow-hidden
  bg-gray-50
  p-6
  "

>
    <div

  className="
  max-w-6xl
  h-full
  mx-auto
  flex
  flex-col
  "

>
      {/* Page Header */}

      <div

        className="
        mb-15
        "

      >


        <p

          className="
          mt-1
          text-gray-1000
          font-semibold
          "

        >

          Manage your Storage Locations, Inventory Categories, and Suppliers

        </p>


      </div>





      {/* Interactive Lab Room */}

<div

  className="
  flex-1
  min-h-0
  flex
  items-center
  justify-center
  "

>

  <LabRoom

    storageLocations={storageLocations}

    categories={categories}

    suppliers={suppliers}

  />

</div>
    </div>


  </main>

);

}