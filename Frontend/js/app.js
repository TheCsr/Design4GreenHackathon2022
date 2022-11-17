
/* When the page is loaded, a request is made to the server to fetch data, when the data is received, 
a custom event (courses-load) is triggered, with the courses object as payload, alpine js will receive
this event on the main page, thus load a global courses object that is accessible everywhere for filtering
The courses object contains not just courses data, but also different functions related to that data like filtering
*/

function getUniqueValues(arr,col){
    return Array.from(new Set(arr.map((item) => item[col])))
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
oReq.open('get', 'http://127.0.0.1:8000/courses', true);
oReq.send();
/*
document.addEventListener('alpine:init', () => {
        Alpine.data('courses', () => ({
            courses: [],
            showCourses: false
            getCourses() {

            function reqListener() {
                this.courses = JSON.parse(this.responseText).data.slice(0,100);
                console.log(this.courses.data)
                this.showCourses = true
            }

            function reqError(err) {
                console.log('Fetch Error :-S', err);
            }

            var oReq = new XMLHttpRequest();
            oReq.onload = reqListener;
            oReq.onerror = reqError;
            oReq.open('get', 'http://127.0.0.1:8000/courses', true);
            oReq.send();
            
            }
        }))
    })*/


