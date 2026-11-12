import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
    <main> 
        <section className="mx-auto grid  max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">

            <div>
                <p>Made for everyday</p>
                <h1>Find your next favourite thing.</h1>
            <p>Useful,thoughtful pieces for your home and daily life. Take a look around</p>
            <Link to="/shop">Explore the collection</Link>
            </div>
            <div className=" overflow-hidden rounded-2xl bg-stone-200">
                 <img src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1200&q=85" alt="A warm,modern living space"className="h-80 w-full object-cover md:h[480px]"/>
            </div>
             </section>

<section id="shop" className="mx-auto max-w-7xl px-6 py-12">
    <p className="text-sm text-stone-500">A good place to start</p>
    <h2>Shop the collection</h2>

</section>
    </main>
    
    </>
  )
}

export default Home

