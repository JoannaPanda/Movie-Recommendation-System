function rate(circle) {
    const circles = document.getElementsByClassName("circle-poster");
    const score = parseInt(circle.alt);

    for (let i = 0; i < circles.length; i++) {
        if (i < score) {
            circles[i].src = "../CommentImage/circle.png";
        } else {
            circles[i].src = "../CommentImage/emptyCircle.png";
        }
    }
    console.log("用户打分:", score);
    const scoreDisplay = document.getElementById("score");

    if (score == 1) scoreDisplay.textContent = "Terrible";
    if (score == 2) scoreDisplay.textContent = "Poor";
    if (score == 3) scoreDisplay.textContent = "Average";
    if (score == 4) scoreDisplay.textContent = "Very Good";
    if (score == 5) scoreDisplay.textContent = "Excellent";
}