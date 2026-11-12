const stages = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

const OrderStatusSteps = ({status="PLACED"}) => {
    if(status==="CANCELLED"){
        return (
            <p>This order was cancelled,</p>
        )
    }
    const currentIndex=Math.max(stages.indexOf(status),0)
  return (
<ol aria-label="Order progress" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
{stages.map((stage,index)=>(
    <li key={stage} className="flex items-center gap-2">
        <span className={`flex h-4 w-4  shrink-0 rounded-full items-center  justify-center text-[10px] text-white  ${index <= currentIndex ? "bg-green-600": "bg-stone-300"}`}>{index <currentIndex? "✓": index+1}</span>
        <span className="text-sm">
            {stage.charAt(0)+stage.slice(1).toLowerCase()}
        </span>
    </li>
))}
</ol>
  )
}

export default OrderStatusSteps

