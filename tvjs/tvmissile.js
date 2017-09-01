// Function for starting the game (Game Entry Point/Game Switch)//////////////////////////
startButton.onclick = function(){
  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  unHideComponents();
  openFullPage(document.documentElement);
  startGame();
}
///////////////////////////////////////////////////////////////////////////////////////////

// Function for restarting the game as each cycle completes
restartButton.onclick = function(){
  window.location.reload();
}

// Function for redirecting away from the page, either to the previous page on the history stack or to the Google page
noThanksButton.onclick = function(){
  if(history.back()){
    window.location.assign(history.back());
  }else{
    window.location.assign("https://www.google.ca");
  }
}

// Function to make the components of the game visible as soon as the game starts
function unHideComponents(){
  tank.style.visibility = "visible";
  missile.style.visibility = "visible";
  score.style.visibility = "visible";
}

// Fullscreen mode function
function openFullPage(page){
  if(page.requestFullscreen){
    page.requestFullscreen();
  }else if(page.webkitRequestFullScreen){
    page.webkitRequestFullScreen();
  }else if(page.msRequestFullscreen){
    page.msRequestFullscreen();
  }else if(page.mozRequestFullScreen){
    page.mozRequestFullScreen();
  }else{
    return;
  }
}

// Main function for running the game
function startGame(){
  var tank_pos = tank.getBoundingClientRect();
  var cannon_pos  = cannon.getBoundingClientRect();
  var missile_pos = missile.getBoundingClientRect();
  var barrel_pos = barrel.getBoundingClientRect();
  var barrel_left = barrel_pos.left;
  var missile_right = missile_pos.right;
  var cannon_left = cannon_pos.left;
  var cannon_top = cannon_pos.top;
  var missile_left = missile_pos.left;
  var missile_top = missile_pos.top;
  var tank_left = tank_pos.left;
  var shootScore = 5;

  // Initial counter reading
  score.innerHTML = 0;

  // Background sound effects
  missileDrop.play();
  missileDrop.volume = 0.3;
  missileDrop.loop = true;

  // Terminate each cycle of the game
  function terminate(){
    var rawShootScore = parseInt(score.innerHTML);
    clearInterval(missile_move);
    missileDrop.muted = true;
    missile_left = 0;
    missile.style.display = "none";
    cannon.style.display = "none";
    tank.style.visibility = "hidden";
    score.style.visibility = "hidden";
    gameOverScreen.style.display = "inline";
    gameScore.innerHTML = "GAME OVER!!\nYou scored " + Math.round(rawShootScore/75 * 100) + "%.";
  }


  function move(){
    missile.style.top = missile_top + "px";
    missile.style.left = missile_left + "px";
    missile_top = missile_top + 10;
    missile_left = missile_left + 1;

    // Blast effect
    function blast(){
      missile_top = 2;
      missile.style.backgroundColor = "orange";
      missile.style.boxShadow = "5px 1px 10px 25px orange";
      missile.style.width = "175px";
      missile.style.height = "25px";
      missile.style.borderRadius = "75%";
      missile.style.borderColor = "orange";
      missile.style.borderTopRightRadius = "75%";
      missile.style.borderBottomRightRadius = "75%";
      missile.style.borderStyle = "none";

      // Missile burst sound effect
      missileBurst.play();
    }

    if(missile_top > 600){
      // Missile blast
      blast();
    }else{
      missile.style.backgroundColor = "";
      missile.style.boxShadow = "";
      missile.style.borderColor = "";
      missile.style.width = "";
      missile.style.height = "";
      missile.style.borderTopRightRadius = "";
      missile.style.borderBottomRightRadius = "";
      missile.style.borderRadius = "";
      missile.style.borderStyle = "";
    }

  // The collision effect of the cannon and the missile
  if((Math.abs(cannon_left - missile_left) < 75) &&
    (Math.abs(cannon_top - missile_top) < 20)){

      // Missile blast
      blast();

      // Score counter
      score.innerHTML = shootScore;
      shootScore = shootScore + 5;
    }

    if(Math.abs(barrel_left - missile_left) < 120){
       terminate();
    }
  }

  // The rate of drop (movement) of the missile
  var missile_move = setInterval(move, 100);


  // Shooting the cannon from the tank
  tank.onclick = function(){
    if(cannon_left <= tank_left){
      cannon_left = tank_left;
    }

    // The movement of the cannon from the barrel to its destination
    function shoot(){
      cannon.style.visibility = "visible";
      cannon.style.left = cannon_left + "px";
      cannon_left = cannon_left - 10;
      tank.style.left = tank_left + 10 + "px"; // First part of recoil action of the tank
    }

    // The regulator for the rate of shooting
    var shoot_interval = setInterval(shoot, 5);

    // Second part of recoil action of the tank
    tank.onmouseup = function(){
      this.style.left = "";
      clearInterval(shoot_interval);
    }

    // Sound effect of the gun coming as shooting is done
    tankShoot.play();
  }
}
