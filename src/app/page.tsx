import InventoryCard from "@/components/InventoryCard";
import SupplierFiles from "@/components/SupplierFiles";
import { prisma } from "@/lib/prisma";
import { addInventoryItem } from "@/actions/inventory";


export default async function HomePage() {


  const items = await prisma.inventoryItem.findMany({

    include: {
      category: true,
      supplier: true,
      records: true,
    },

    orderBy: {
      createdAt: "desc",
    },

  });



  const suppliers = await prisma.supplier.findMany({

    include:{
      items:true,
    },

    orderBy:{
      name:"asc",
    },

  });



  const categories = await prisma.category.findMany({

    orderBy:{
      name:"asc",
    },

  });




  return (

    <main className="p-8 space-y-8">


      <h1 className="text-3xl font-bold">
        LabStock Inventory
      </h1>




      {/* ADD ITEM */}


      <form

        action={addInventoryItem}

        className="
          border
          rounded-xl
          p-6
          space-y-4
          max-w-xl
        "

      >


        <h2 className="text-xl font-semibold">
          Add Inventory Item
        </h2>



        <input

          name="name"

          placeholder="Item name"

          className="
            border
            p-2
            rounded
            w-full
          "

          required

        />




        <input

          name="description"

          placeholder="Description"

          className="
            border
            p-2
            rounded
            w-full
          "

        />




        <input

          name="quantity"

          type="number"

          placeholder="Quantity"

          className="
            border
            p-2
            rounded
            w-full
          "

        />




        <input

          name="minimumStock"

          type="number"

          defaultValue={5}

          placeholder="Minimum stock"

          className="
            border
            p-2
            rounded
            w-full
          "

        />




        <input

          name="unit"

          placeholder="Unit (box, bottle, vial...)"

          className="
            border
            p-2
            rounded
            w-full
          "

        />





        {/* CATEGORY */}

        <select

          name="category"

          className="
            border
            p-2
            rounded
            w-full
          "

        >

          <option value="">
            Select category
          </option>


          {
            categories.map((category)=>(

              <option

                key={category.id}

                value={category.name}

              >

                {category.name}

              </option>

            ))
          }


        </select>





        {/* SUPPLIER */}

        <select

          name="supplier"

          className="
            border
            p-2
            rounded
            w-full
          "

        >

          <option value="">
            Select supplier
          </option>



          {
            suppliers.map((supplier)=>(

              <option

                key={supplier.id}

                value={supplier.name}

              >

                {supplier.name}

              </option>


            ))
          }



        </select>






        <input

          name="specific"

          placeholder="Specific details"

          className="
            border
            p-2
            rounded
            w-full
          "

        />




        <input

          name="batchNumber"

          placeholder="Batch number"

          className="
            border
            p-2
            rounded
            w-full
          "

        />





        <input

          name="expiryDate"

          type="date"

          className="
            border
            p-2
            rounded
            w-full
          "

        />





        <button

          className="
            bg-black
            text-white
            px-4
            py-2
            rounded
          "

        >

          Add Item

        </button>



      </form>






      {/* SUPPLIER FILES */}

      <SupplierFiles

        suppliers={suppliers}

      />







      {/* INVENTORY CARDS */}


      <section className="space-y-3">


        <h2 className="text-xl font-semibold">
          Inventory
        </h2>



        {
          items.map((item)=>(

            <InventoryCard

              key={item.id}

              item={item}

              onEdit={()=>{}}

            />


          ))
        }



      </section>




    </main>

  );

}