
/* When the page is loaded, a request is made to the server to fetch data, when the data is received, 
a custom event (courses-load) is triggered, with the courses object as payload, alpine js will receive
this event on the main page, thus load a global courses object that is accessible everywhere for filtering
The courses object contains not just courses data, but also different functions related to that data like filtering
*/


window.post = function(url, data) {
    return fetch(url, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
}

window.buildQuoteEmail = function(idString){
    let msg = "Hello,\n I would like to receive a quote for the following courses included in this pdf : " + baseUrl[mode] + "/export/?ids=" + idString + "\n Regards, \n Client"
    return encodeURIComponent(msg) 
}


function getUniqueValues(arr,col){
    return Array.from(new Set(arr.map((item) => item[col])))
}



var mode = 'local' // Or prod
var baseUrl = {
    local: "http://127.0.0.1:8000",
    prod: "http://54.36.98.185:3000"
}






let event = new CustomEvent("courses-load", {
    detail: {
      courses: {
        search : "",
        allFilters : {},
        selectedFilters : {
            trainingType : "",
            organisationType : "",
            location : "",
            duration : 1,
        },
        markers: [],
        data: [],
        get filteredCourses() {
            if (this.search === "") {
              return this.data;
            }
            console.log("Filter function is running",this.selectedFilters.duration)
            let filteringKeys = ['Course Title','Short Description', 'Organisation Name']
            return this.data.filter(e => {
                const entries = Object.entries(e);
                console.log(entries)
                return entries.some(entry=>entry[1]?entry[1].toString().includes(this.search):false);
            })
        },
        loadMarkers(){
            console.log("data",this.data)
            console.log("Loading Markers....")
            this.data.forEach(course => {
                if(course['Location'] !="National"){
                    let marker = L.marker([course['Latitude'], course['Longitude']]).addTo(window.map);
                    this.markers.push(marker)
                    
                }
                else{
                    let nationalMarker = L.marker([46.22, 2.21]).addTo(window.map);
                    nationalMarker._icon.classList.add("huechange");
                    this.markers.push(nationalMarker)
                }
            });
            console.log(this.markers)
            
        }


        

      }
    }
  });

function reqListener() {
    console.log(this.responseText)
    let courses = JSON.parse(this.responseText).data.data.slice(0,100);
    console.log(courses)
    event.detail.courses.data = courses
    event.detail.courses.allFilters =  {
        orgType : getUniqueValues(courses,"Organisation Type"),
        trainingType : getUniqueValues(courses,"Type of Training"),
        location: getUniqueValues(courses,"Location"),
        durationMax : 60,
        durationMin : 0
    }
    console.log(event)
    window.dispatchEvent(event);
}

function reqError(err) {
    console.log('Fetch Error :-S', err);
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.onerror = reqError;
oReq.open('get', baseUrl[mode]+'/courses', true);
oReq.send();



