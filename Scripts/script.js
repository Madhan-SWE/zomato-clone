var userKey = "60791269ddb9be63171edcc77383ec3d"
var currentLocation = "Chennai";
var currentResQuery = "";
var entityType="city"
var entityId="7"



function getLocationSuggestions()
{
    let tempLocation = document.getElementById("location").value;
    if(tempLocation!=="")
    {
        currentLocation=tempLocation
    }
    else
    {
        currentLocation="Chennai";
    }
    
    let locationUrl = "https://developers.zomato.com/api/v2.1/locations?query=" +
                       currentLocation;

    let locationFetch = fetch(locationUrl,{
        method: "GET",
        headers: {"Accept": "application/json",
                  "user-key":"60791269ddb9be63171edcc77383ec3d"
                 }
                })
    
    locationFetch.then(response => response.json())
        .then(json =>{
            console.log(json)
            if(json["location_suggestions"].length>0){
                entityType = json["location_suggestions"][0]["entity_type"]
                entityId = json["location_suggestions"][0]["entity_id"]}
                console.log("--",entityType)
                console.log("==",entityId)
        })
        .catch((err) => console.log("ERROR :", err));
}


function searchQuery()
{
    let query = document.getElementById("query").value;
    let url = "https://developers.zomato.com/api/v2.1/search?entity_id=" + 
    entityId + "&entity_type=" + entityType + "&q=" + query;
    //url = "https://developers.zomato.com/api/v2.1/search?entity_id=7&entity_type=city&q=biriyani"
    console.log(url);

    let searchFetch = fetch(url,{
        method: "GET",
        headers: {"Accept": "application/json",
                  "user-key":"60791269ddb9be63171edcc77383ec3d"
                 }
                })
    searchFetch.then(response => response.json())
    .then(json =>{
        
        let hasDelieveryRestaurants = json.restaurants.filter((res)=>{
           
           return res["restaurant"]["has_online_delivery"] === 1 &&
           res["restaurant"]["is_delivering_now"] ===1
        })

        let selectedRestaurants = []

        for(let i=0;i<hasDelieveryRestaurants.length && selectedRestaurants.length<5 ;i++)
        {
            if(selectedRestaurants.filter((e)=> e["restaurant"]["id"] === 
            hasDelieveryRestaurants[i]["restaurant"]["id"])
            .length ===0)
            {
                selectedRestaurants.push(hasDelieveryRestaurants[i])
                //console.log(selectedRestaurants.length)
                console.log(hasDelieveryRestaurants[i]["restaurant"]["name"])
            }
        }

        let suggestionsDiv = document.createElement("div");
        suggestionsDiv.setAttribute("class", "suggestionsDiv");
        for(let i=0;i<selectedRestaurants.length;i++)
        {
            let resDiv = document.createElement("div");
            resDiv.setAttribute("class", "resDiv");

            let imgDiv = document.createElement("div");
            imgDiv.setAttribute("class", "resImgDiv");

            let img = document.createElement("img");
            img.setAttribute("src", selectedRestaurants[i]["restaurant"]["thumb"]);
            img.setAttribute("width", "60px");
            img.setAttribute("height", "60px");
            imgDiv.append(img);

            let hotelDiv = document.createElement("div");
            hotelDiv.setAttribute("class", "hotelDiv");



            let hotelName =  document.createElement("span");
            console.log(";;;;;",selectedRestaurants[i]["restaurant"]["name"])
            hotelName.innerText = selectedRestaurants[i]["restaurant"]["name"];
            hotelDiv.append(hotelName);
  
            let ratingDiv = document.createElement("div");
            ratingDiv.setAttribute("class", "ratingDiv");
            let starSec = document.createElement("i");
            starSec.setAttribute("class", "fas fa-star");
            let ratingSpan = document.createElement("span");
            ratingSpan.innerText = selectedRestaurants[i]["restaurant"]["user_rating"]["aggregate_rating"] + 
            "(" + selectedRestaurants[i]["restaurant"]["user_rating"]["votes"]+")";
            ratingDiv.append(starSec, ratingSpan)

            let orderNow = document.createElement("div");
            orderNow.innerText = "Order Now";
            orderNow.setAttribute("class", "orderNowbtn");
            orderNow.setAttribute("data-resId",selectedRestaurants[i]["restaurant"]["id"]);


            resDiv.append(imgDiv);
            resDiv.append(hotelDiv);
            resDiv.append(ratingDiv);
            resDiv.append(orderNow);
            
            suggestionsDiv.append(resDiv)


            
        }
        if(selectedRestaurants.length === 0)
        {
            suggestionsDiv.innerText = "Oops! We could not understand what you mean, try rephrasing the query."
        }
        


        let suggestions = document.getElementsByClassName("suggesitons")
        while(suggestions[0].firstChild)
        {
            suggestions[0].removeChild(suggestions[0].firstChild);
        }
        //suggestions[0].childNodes = [];
        //console.log(suggestionsDiv)
        suggestions[0].append(suggestionsDiv)
        console.log(suggestions)
        



        })
}

getLocationSuggestions()
searchQuery()