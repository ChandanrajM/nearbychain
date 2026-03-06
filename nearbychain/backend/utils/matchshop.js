function matchShop(userLocation,shops){

let bestShop=null
let bestScore=999999

shops.forEach(shop=>{

const distance=Math.sqrt(

(userLocation.lat-shop.lat)**2 +
(userLocation.lng-shop.lng)**2

)

const score=(distance*0.7)-(shop.rating*0.3)

if(score<bestScore){

bestScore=score
bestShop=shop

}

})

return bestShop

}

module.exports=matchShop