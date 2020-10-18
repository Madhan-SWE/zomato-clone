var collectionsData = {};
const userKey2 = "60791269ddb9be63171edcc77383ec3d";
var currentLocation = "Chennai";
var currentResQuery = "";
var entityType = "city";
var entityId = "7";
var longitude = "";
var latitude = "";
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Failed to get location");
  }
}

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log(longitude);
  console.log(latitude);
}

function getLocationSuggestions() {
  let tempLocation = document.getElementById("location").value;
  console.log(tempLocation);
  if (tempLocation !== "") {
    currentLocation = tempLocation;
  } else {
    currentLocation = "Chennai";
  }

  let locationUrl =
    "https://developers.zomato.com/api/v2.1/locations?query=" + currentLocation;

  let locationFetch = fetch(locationUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "user-key": userKey2,
    },
  });
  console.log("key: ---", userKey2)
  locationFetch
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (json["location_suggestions"].length > 0) {
        entityType = json["location_suggestions"][0]["entity_type"];
        entityId = json["location_suggestions"][0]["entity_id"];
      }
      console.log("--", entityType);
      console.log("==", entityId);
    })
    .catch((err) => console.log("ERROR :", err));
}

function searchQuery() {
  if (document.getElementById("currentLocation")) {
    document.getElementById("currentLocation").innerText = currentLocation;
  }
  let query = document.getElementById("query").value;
  let url =
    "https://developers.zomato.com/api/v2.1/search?entity_id=" +
    entityId +
    "&entity_type=" +
    entityType +
    "&q=" +
    query;
  console.log(url);

  let searchFetch = fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "user-key": userKey2,
    },
  });
  searchFetch
    .then((response) => response.json())
    .then((json) => {
      var hasDelieveryRestaurants = [];
      if ("restaurants" in json) {
        var hasDelieveryRestaurants = json.restaurants.filter((res) => {
          return (
            /*res["restaurant"]["has_online_delivery"] === 1 &&
          res["restaurant"]["is_delivering_now"] === 1*/
            true
          );
        });
      }

      let selectedRestaurants = [];

      for (
        let i = 0;
        i < hasDelieveryRestaurants.length && selectedRestaurants.length < 5;
        i++
      ) {
        if (
          selectedRestaurants.filter(
            (e) =>
              e["restaurant"]["id"] ===
              hasDelieveryRestaurants[i]["restaurant"]["id"]
          ).length === 0
        ) {
          selectedRestaurants.push(hasDelieveryRestaurants[i]);
          console.log(hasDelieveryRestaurants[i]["restaurant"]["name"]);
        }
      }

      let suggestionsDiv = document.createElement("div");
      suggestionsDiv.setAttribute("class", "suggestionsDiv");
      for (let i = 0; i < selectedRestaurants.length; i++) {
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

        let hotelName = document.createElement("span");
        console.log(";;;;;", selectedRestaurants[i]["restaurant"]["name"]);
        hotelName.innerText = selectedRestaurants[i]["restaurant"]["name"];
        hotelDiv.append(hotelName);

        let ratingDiv = document.createElement("div");
        ratingDiv.setAttribute("class", "ratingDiv");
        let starSec = document.createElement("i");
        starSec.setAttribute("class", "fas fa-star");
        let ratingSpan = document.createElement("span");
        ratingSpan.innerText =
          selectedRestaurants[i]["restaurant"]["user_rating"][
            "aggregate_rating"
          ] +
          "(" +
          selectedRestaurants[i]["restaurant"]["user_rating"]["votes"] +
          ")";
        ratingDiv.append(starSec, ratingSpan);

        let orderNow = document.createElement("div");
        orderNow.innerText = "Order Now";
        orderNow.setAttribute("class", "orderNowbtn");
        orderNow.setAttribute(
          "data-resId",
          selectedRestaurants[i]["restaurant"]["id"]
        );
        orderNow.setAttribute("onclick", "storeInSession(this)");

        resDiv.append(imgDiv);
        resDiv.append(hotelDiv);
        resDiv.append(ratingDiv);
        resDiv.append(orderNow);

        suggestionsDiv.append(resDiv);
      }
      if (selectedRestaurants.length === 0) {
        suggestionsDiv.innerText =
          "Oops! We could not understand what you mean, try rephrasing the query.";
      }

      let suggestions = document.getElementsByClassName("suggesitons");
      while (suggestions[0].firstChild) {
        suggestions[0].removeChild(suggestions[0].firstChild);
      }
      suggestions[0].append(suggestionsDiv);
      console.log(suggestions);
      document.getElementById("suggestions").style.visibility = "visible";
    });
}

function storeInSession(item) {
  console.log(item.dataset.resid);
  sessionStorage.setItem("resid", item.dataset.resid);
  sessionStorage.setItem("currentLocation", currentLocation);
  window.location.href = "orderPage.html";
}

document.addEventListener("click", function (event) {
  let exTarget = document.getElementById("suggestions");
  var isClickInside = exTarget.contains(event.target);
  console.log(isClickInside);
  console.log(event.target);
  if (!isClickInside) {
    exTarget.style.visibility = "hidden";
  }
});

function addCollections() {
  let url =
    "https://developers.zomato.com/api/v2.1/collections?city_id=" + entityId;
  console.log(url);
  let collectionsFetch = fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "user-key": userKey2,
    },
  });

  collectionsFetch
    .then((res) => res.json())
    .then((res) => {
      collectionsData = res;

      collectionsSection = document.getElementById("collections");
      let collectionsDiv = document.createElement("div");
      collectionsDiv.setAttribute("class", "collectionsContainer");
      let h = document.createElement("h1");
      h.innerText = "Collections";
      collectionsDiv.appendChild(h);

      let p = document.createElement("p");
      p.innerText =
        "Explore curated lists of top restaurants, cafes, pubs, and bars in " +
        currentLocation +
        " based on trends";
      collectionsDiv.appendChild(p);
      for (let i = 0; i < collectionsData.collections.length; i++) {
        console.log(i);
        let collectionItem = document.createElement("div");
        collectionItem.setAttribute("class", "collectionItem");

        let collectionImg = document.createElement("img");
        collectionImg.setAttribute("width", "100%");
        collectionImg.setAttribute("height", "100%");
        collectionImg.setAttribute(
          "src",
          collectionsData.collections[i]["collection"]["image_url"]
        );
        collectionImg.setAttribute("class", "collectionImg");

        collectionTextDiv = document.createElement("div");
        collectionTextDiv.setAttribute("class", "collectionTextDiv");
        collectionTextDiv.innerHTML =
          collectionsData.collections[i]["collection"]["title"] +
          "<br>" +
          collectionsData.collections[i]["collection"]["res_count"] +
          " - Places";

        collectionItem.append(collectionImg);
        collectionItem.appendChild(collectionTextDiv);
        collectionsDiv.append(collectionItem);
        console.log(collectionsDiv);
      }
      collectionsSection.append(collectionsDiv);
    })
    .catch((err) => console.log(err));
}

function loadBody()
{
getLocationSuggestions();
addCollections();
}
