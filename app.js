let client_id = "7c54b6c759954f4db09959ce5cebe0b0";
let api_key = "AIzaSyA0rzoqoGjmjf6zcol28U8FCkgm9FK5_as"
let lyricsType = "pinyin"
localStorage.setItem("client_id", client_id);

function onPageLoad() {
  console.log("Refresh");
  if (window.location.href.length > 60) {
    localStorage.setItem(
      "access_token",
      location.hash.substr(1).split("&")[0].split("=")[1]
      
    );
    console.log("Token retrieved from URL")
    window.location.href = "https://fulgul.github.io/Lyricer/";
    }
    access_token = localStorage.getItem("access_token");
    if (access_token != undefined) {
        document.querySelector(".display-container").classList.remove("hide");
        document.querySelector(".auth").classList.add("hide");
    }

    }
    
document.querySelector(".button-auth").addEventListener("click", function () {
    Authenticate();
  });
  
  
  function Authenticate() {
    location =
      "https://accounts.spotify.com/authorize?client_id=" +
      client_id +
      "&redirect_uri=https://fulgul.github.io/Lyricer/&scope=user-read-playback-state&response_type=token";
  }


document.querySelector(".button-main").addEventListener("click", function(){
    access_token = localStorage.getItem("access_token");
    console.log(access_token);
    if (access_token != undefined) {
    document.querySelector(".display-container").classList.remove("hide");
    document.querySelector(".auth").classList.add("hide");
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.spotify.com/v1/me/player/currently-playing", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Authorization", "Bearer " + access_token);
    request.send();
    request.onload = async function () {
    console.log(this)
      if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        let songName = data["item"]["name"]
        let songArtist = data["item"]["artists"][0]["name"]
        console.log(data);
        console.log(songName)
        console.log(songArtist)
        query = songName + " " + songArtist + " lyrics pinyin";
        url ='http://www.google.com/search?q=' + query;
        url = 'https://www.googleapis.com/customsearch/v1?key=' + api_key + '&cx=b60861df679924f5d&q=' + query
        document.querySelector(".button-main").classList.add("hide")

        let response = await fetch(url)
        let results = await response.json()
        /*
        results["items"].forEach(result => {
            console.log(result)
            if(result["displayLink"] == "jspinyin.net" || result["displayLink"] == "lyricspinyin.com"){
                
                if(result["link"].search(songName) != -1 && result["link"].search(songArtist) != -1){
                    console.log(result)
                }
            }
            
        });
        */
       let link
       console.log(results["items"])
       if (results != undefined){
        results["items"].every(result => {
            if(lyricsType === "pinyin" && result["displayLink"] === "jspinyin.net"){
                link = result["link"]
                return false
            }
            else if(lyricsType === "both"){
                link = result["link"]
                return false
            }
            else if(lyricsType === "english" && result["displayLink"] === "lyricspinyin.com"){
                link = result["link"]
                return false
            }
            else{
                return true
            }
        })
        
        console.log(link)
        window.location.href = link
       }
       else{
        document.querySelector(".msg").innerHTML = "Lyrics could not be found"
        console.log("No matches found")
       }
        
        document.querySelector(".display-container").innerHTML = ""
      } 
      else if (this.status == 401) {
        Authenticate();
      }
      else if (this.status == 204){
        document.querySelector(".msg").innerHTML = "No track currently playing"
        console.log("No track currently playing")
       }
    };
    }

    });

var buttons = document.getElementsByClassName("button");
var arr = [...buttons];

arr.forEach((element, index) => {
  element.addEventListener("click", () => {
    element.style.opacity = "1";
    if (index == 0) {
        lyricsType = "pinyin"
      } else if (index == 1) {
        lyricsType = "both"
      } else {
        lyricsType = "english"
      }
    arr
      .filter(function (item) {
        return item != element;
      })
      .forEach((item) => {
        item.style.opacity = "0";
      });
  });
});