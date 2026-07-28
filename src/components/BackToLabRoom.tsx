"use client";

import { useRouter } from "next/navigation";

export default function BackToLabRoom(){

  const router = useRouter();


  return (

    <button

      onClick={()=>router.push("/lab-room")}

      className="
      mb-6
      rounded-lg
      bg-gray-800
      px-4
      py-2
      text-white
      hover:bg-gray-700
      "

    >

      ← Back to Lab Room

    </button>

  );

}