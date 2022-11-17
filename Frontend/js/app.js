

let event = new CustomEvent("courses-load", {
    detail: {
      courses: []
    }
  });

function reqListener() {
    console.log(this.responseText)
    let courses = JSON.parse(this.responseText).data.data.slice(0,100);
    console.log(courses)
    event.detail.courses = courses
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


