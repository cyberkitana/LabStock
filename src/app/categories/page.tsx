import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryManager from "@/components/CategoryManager";


export default async function CategoriesPage() {


  const categories = await prisma.category.findMany({

    orderBy: {
      name: "asc"
    },

    include: {

      _count: {

        select: {

          items: true

        }

      }

    }

  });



  console.log("CATEGORIES FROM DB:", categories);




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
              text-3xl
              font-bold
              text-gray-800
              "

            >

              Categories

            </h1>



            <p

              className="
              text-gray-500
              mt-1
              "

            >

              Organise your inventory into storage groups

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








        {/* Category shelf */}

        <div

          className="
          rounded-2xl
          bg-white
          border
          p-6
          shadow-sm
          "

        >


          <CategoryManager

            categories={categories}

          />


        </div>





      </div>


    </main>

  );


}