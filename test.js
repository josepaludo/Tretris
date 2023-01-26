let a = 0;
let b = 0;
let c = 0;

function currentTime() {

    if (a/100 == 1) {
        console.log(time);
    }
    let t = setTimeout(function(){ currentTime() }, 1000);
}

currentTime();
