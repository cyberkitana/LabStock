"use client";


type Props = {
  records:any[];
};


export default function StockTimeline({
  records
}:Props){


return (

<div className="mt-4">

<h3 className="font-semibold text-sm mb-2">
Stock History
</h3>


<div className="space-y-2">


{
records.length === 0 && (

<p className="text-sm text-gray-400">
No stock history yet
</p>

)

}



{
records.map((record)=>(


<div
key={record.id}
className="
border-l-2
pl-3
text-sm
"
>


<p className="font-medium">

{
record.type === "ADD"

? 
"Stock added"

:

"Stock updated"

}

</p>


<p className="text-gray-500">

Quantity:
{" "}
{record.quantity}

</p>



{
record.reason && (

<p className="text-gray-400">

{record.reason}

</p>

)

}



<p className="text-xs text-gray-400">

{
new Date(record.createdAt)
.toLocaleDateString()
}

</p>


</div>


))

}


</div>


</div>

);


}