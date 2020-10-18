var data = {};
var reviewData = {};
var currentLocation = sessionStorage.getItem("currentLocation");
document
  .getElementById("location")
  .setAttribute("placeholder", currentLocation);
var resid = sessionStorage.getItem("resid");
const userKey = "60791269ddb9be63171edcc77383ec3d";

function loadData() {
  let url = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + resid;
  //console.log("---", url);
  //console.log(userKey);
  let resFetch = fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "user-key": userKey,
    },
  });
  resFetch
    .then((res) => res.json())
    .then((res) => {
      //console.log("+++", res);
      data = res;
      document.getElementById("curPage").innerText =
        "/home/Orders/" + data["name"];
      document.getElementById("restaurantImg").src = data["featured_image"];
      document.getElementById("hotelName").innerText = data["name"];
      document.getElementById("cusines").innerText = data["cuisines"];
      document.getElementById("locality_verbose").innerText =
        data["location"]["locality_verbose"];
      document.getElementById("isOpened").innerText =
        (data["is_delivering_now"] === 1 ? "Orders Opened" : "Orders Closed") +
        "-" +
        data["timings"];
      data["is_delivering_now"] === 1
        ? (document.getElementById("isOpened").style.color = "green")
        : (document.getElementById("isOpened").style.color = "orange");
    })
    .catch((err) => console.log("ERROR:", err));
  //console.log("---",data)
}

function menuHandle(menuItem) {
  //console.log(menuItem.innerText);
  document
    .getElementsByClassName("active")[0]
    .setAttribute("class", "menuItem");
  menuItem.setAttribute("class", "menuItem active");
  var restaurantContent = document.getElementsByClassName("restaurantContent");
  while (restaurantContent[0].firstChild) {
    restaurantContent[0].removeChild(restaurantContent[0].firstChild);
  }

  if (menuItem.innerText === "Overview") {
    let url =
      "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + resid;
    //console.log("---", url);
    //console.log(userKey);
    let resFetch = fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "user-key": userKey,
      },
    });
    resFetch
      .then((res) => res.json())
      .then((res) => {
        //console.log("+++", res);
        data = res;
        let contentDiv = document.createElement("div");
        let abooutText = document.createElement("div");
        abooutText.setAttribute("class", "abtTxt");
        abooutText.innerText = "About this place";

        let moreInfo = document.createElement("div");
        moreInfo.setAttribute("class", "moreInfo");
        let highLights = document.createElement("div");
        highLights.setAttribute("class", "highLights");
        highLights.innerText = "HighLights";

        let ul = document.createElement("div");
        ul.setAttribute("class", "moreInfoList");
        for (let i = 0; i < data.highlights.length; i++) {
          let li = document.createElement("li");
          li.setAttribute("class", "moreInfoListItem");
          li.innerHTML =
            '<i class="fas fa-check-square listyle" style="color:green"></i>' +
            data.highlights[i];
          //console.log(data.highlights[i]);
          ul.appendChild(li);
        }
        moreInfo.append(highLights, ul);

        contentDiv.append(abooutText, moreInfo);
        restaurantContent[0].append(contentDiv);
      });
  } else if (
    menuItem.innerText === "Order Online" ||
    menuItem.innerText === "Menu" ||
    menuItem.innerText === "Photos"
  ) {
    restaurantContent[0].innerText =
      "No Relevant content available in zomato API";
  } else if (menuItem.innerText === "Reviews") {
    let url = "https://developers.zomato.com/api/v2.1/reviews?res_id=" + resid;
    let reviewFetch = fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "user-key": userKey,
      },
    });
    reviewFetch
      .then((res) => res.json())
      .then((res) => {
        reviewData = res;
        //console.log(reviewData);
        //console.log(userKey);

        for (let i = 0; i < reviewData.user_reviews.length; i++) {
          let reviewDiv = document.createElement("div");
          reviewDiv.setAttribute("class", "reviewDiv");
          let imgDiv = document.createElement("div");
          imgDiv.setAttribute("class", "profileImgDiv");
          let img = document.createElement("img");
          img.setAttribute(
            "src",
            reviewData.user_reviews[i]["review"]["user"]["profile_image"]
          );
          img.setAttribute("class", "profileImg");
          img.setAttribute("width", "50px");
          img.setAttribute("height", "50px");
          img.setAttribute(
            "style",
            "border-radius: 50%; border: 1px solid black;"
          );
          imgDiv.appendChild(img);

          let profileName = document.createElement("div");
          profileName.setAttribute("class", "profileName");
          profileName.innerText =
            reviewData.user_reviews[i]["review"]["user"]["name"];
          //console.log(reviewData.user_reviews[i]["review"]["user"]["name"]);

          let rating = reviewData.user_reviews[i]["review"]["rating"] - 1;
          let ratingDiv = document.createElement("div");
          ratingDiv.setAttribute("class", "ratingDiv2");
          for (let j = 0; j < 5; j++) {
            //console.log();
            let starSec = document.createElement("i");
            starSec.setAttribute("class", "fas fa-star");
            if (j <= rating) {
              starSec.style.color =
                reviewData.user_reviews[i]["review"]["rating_color"];
            } else {
              starSec.style.color = "grey";
            }
            ratingDiv.append(starSec);
          }
          let ratingValueSpn = document.createElement("span");
          ratingValueSpn.innerText = "(" + (rating + 1) + ")";
          ratingDiv.append(ratingValueSpn);

          let reviewTxt = reviewData.user_reviews[i]["review"]["review_text"];
          reviewTxtDiv = document.createElement("div");
          reviewTxtDiv.setAttribute("class", "reviewTxtDiv");

          reviewTxtDiv.innerText = reviewTxt;

          reviewDiv.append(imgDiv, profileName, ratingDiv, reviewTxtDiv);
          restaurantContent[0].append(reviewDiv);
        }
      });
  }
}

function goHome() {
  window.location.href = "index.html";
}
setTimeout(() => {
  loadData();
  menuHandle(document.getElementsByClassName("menuItem")[0]);
}, 1000);
