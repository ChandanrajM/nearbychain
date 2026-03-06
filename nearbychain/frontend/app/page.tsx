import Image from "next/image";

export default function Home() {

  return (

    <div style={{padding:"40px"}}>

      <h1>NearbyChain</h1>

      <p>Local services powered by blockchain</p>

      <br/>

      <a href="/shops">View Nearby Shops</a>

      <br/><br/>

      <a href="/dashboard">View Orders Dashboard</a>

    </div>

  )

}