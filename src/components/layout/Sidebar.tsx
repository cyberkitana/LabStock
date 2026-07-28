import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FlaskConical,
  ClipboardList,
  BarChart3,
  Settings,
} from "lucide-react";


const menuItems = [

  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },

  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
  },

  {
    name: "Manage my Lab",
    href: "/lab-room",
    icon: FlaskConical,
  },

  {
    name: "Orders",
    href: "/orders",
    icon: ClipboardList,
  },

  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },

];



export default function Sidebar() {

  return (

    <aside

      className="
      flex
      min-h-screen
      w-72
      flex-col
      bg-slate-950
      px-6
      py-8
      text-white
      "

    >


      {/* Logo */}

      <div

        className="
        mb-10
        "

      >

        <h1

          className="
          text-2xl
          font-bold
          "

        >

          🧬 LabStock

        </h1>


        <p

          className="
          mt-1
          text-sm
          text-slate-400
          "

        >

          Laboratory Management System

        </p>


      </div>





      {/* Main navigation */}

      <nav

        className="
        flex-1
        space-y-2
        "

      >


        {menuItems.map((item) => {


          const Icon = item.icon;


          return (

            <Link

              key={item.name}

              href={item.href}

              className="
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-slate-300
              transition
              hover:bg-slate-800
              hover:text-white
              "

            >

              <Icon size={20} />


              <span

                className="
                text-sm
                font-medium
                "

              >

                {item.name}

              </span>


            </Link>

          );


        })}


      </nav>






      {/* Settings */}

      <div

        className="
        border-t
        border-slate-800
        pt-4
        "

      >

        <Link

          href="/settings"

          className="
          flex
          items-center
          gap-3
          rounded-xl
          px-4
          py-3
          text-slate-300
          transition
          hover:bg-slate-800
          hover:text-white
          "

        >

          <Settings size={20} />


          <span

            className="
            text-sm
            font-medium
            "

          >

            Settings

          </span>


        </Link>


      </div>


    </aside>


  );

}