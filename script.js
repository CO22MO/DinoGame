    var Player = document.getElementById("Player");
    var Obstacle = document.getElementById("Obstacle");
    var Alive = true;
    var Jumping = false;
    var CoolDown = false;
    var Score = 0;
    var record = 0;
    var Money = 0;
    var flag;
    var Totem = 1;
    var Dying = false
    var DeathSound = new Audio("./MusicLibrary/Minecraft Death sounds v.2.mp3");
    var JumpSound = new Audio("./MusicLibrary/JumpSound.wav");
    var TotemSound = new Audio("./Musiclibrary/TotemSound.mp3")

    const HighScore = localStorage.getItem('HighScore');

    document.getElementById('HighScore').textContent = HighScore;

    var Totems = localStorage.getItem('Totems')

    if(localStorage.getItem('Totems') < 0)
    {
        localStorage.setItem('Totems', 0);
    }

    document.getElementById('Totems').textContent = Totems;    



//Counts the current score and sets highscore if current score is higher than the previous record
function ScoreCount()
{
    setInterval(function()
    {
        if(Alive == true)
        {
            Score = Score + 1;
        
            document.getElementById("CurrentScore").textContent = Score;

            flag = 1;
        }
        else
        {
            if(Score > HighScore || document.getElementById("HighScore").textContent == "")
            {
                record = Score;
                document.getElementById("HighScore").textContent = record;  
                localStorage.setItem("HighScore", record);
            }

            //If you die the "You Died" screen will pop up giving the alternatives to restart or quit to main menu
            document.getElementById("Respawn").style.display = "flex"
            document.getElementById("TitleScreen").style.display = "flex"
            document.getElementById("YouDied").style.display = "flex"
            document.getElementById("DeathScreenScore").style.display = "flex"
            
            document.getElementById("DeathScreenScore").textContent = "Score: " + Score;
        }
    }, 1000);
}

//Check if jumping
document.addEventListener('keydown', event => 
{
    if (event.code === "Space" ||event.code === "ArrowUp") 
    {
        if(Jumping == false)
        {
            Jump();
        }
        else if(Jumping == true && CoolDown == false)
        {
            CoolDown = true;
            DoubleJump();
        }
    }
})





//Jump when pressing Spacebar or UpArrow
function Jump()
{
    if (Alive == true)
    {
        JumpSound.play();

        Jumping = true;

        Player.classList.add("Jump");

        setTimeout(function()
        {
            Player.classList.remove("Jump");
            Jumping = false;
        }, 500);
    }
}





//Double Jump when juping mid-air and setting cooldown on double jump
function DoubleJump()
{
    if (Alive == true)
    {
        var i = 10;
        Jumping = true;

        Player.classList.add("DoubleJump");

        setTimeout(function()
        {
            Player.classList.remove("DoubleJump");
            Jumping = false;
        }, 500);

        setInterval(function()
        {
            document.getElementById("Countdown").textContent = i;

            i = i-1;

            if(i < -1)
            {
                document.getElementById("Countdown").textContent = "";
            }
        }, 1000);

        setTimeout(function()
        {
            CoolDown = false;
        }, 11000);
    }
}





//Cancelling the jump when pressing DownArrow / crouching
document.addEventListener('keydown', event => 
{
    if (event.code === "ArrowDown") 
    {
        Crouch();
    }
})

//Returning to standing position when releasing DownArrow / uncrouching
document.addEventListener('keyup', event => 
{
    if (event.code === "ArrowDown") 
    {
        Stand();
    }
})

function Crouch()
{
    if(Jumping == false)
    {
        Player.classList.remove("Walking");
        Player.style.backgroundImage = "url('./ImageLibrary/Crouching.png')";
        Player.style.height = "80px";
        Player.style.top = "78vh";
    }
    else
    {
        Player.classList.remove("DoubleJump");
        Player.classList.remove("Jump");
    }
}

function Stand()
{
    Player.style.height = '130px';
    Player.style.top = "71.5vh";
    Player.classList.add("Walking");
    Player.style.backgroundImage = "url('./ImageLibrary/SteeveStanding.png')";
}






//Randomize the obstacle
function Obstacles()
{
    setInterval(function()
    {
        if(Alive == true)
        {
            var Type = Math.floor(Math.random() * 5 + 1);
            if(Type == 1)
            {
                document.getElementById("Obstacle").className = "Obstacle3"; //Phantom
            }
            else if(Type == 2 || Type == 3)
            {
                document.getElementById("Obstacle").className = "Obstacle2"; //Spider
            }
            else
            {
                document.getElementById("Obstacle").className = "Obstacle1"; //Zombie
            }
    
        }
    }, 1997);
}





//Check for collisions
function checkCollision() 
{
    setInterval(function()
    {
        if(Alive == true)
        {
            // Get the position and hitbox of the PLayer and Obstacle elements
            const player = document.getElementById("Player");
            const obstacle = document.getElementById("Obstacle");
            const playerRect = player.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();
            
            // Check if the two elements overlap
            if (playerRect.right >= obstacleRect.left && playerRect.left <= obstacleRect.right && playerRect.bottom >= obstacleRect.top && playerRect.top <= obstacleRect.bottom) 
            {
                 if (localStorage.getItem('Totems') >= 0 && Dying == false)
                {
                    if(localStorage.getItem('Totems') > 0)
                    {
                        TotemSound.play();
                    }

                    var Lives = localStorage.getItem('Totems');

                    localStorage.setItem('Totems', Lives - 1);

                    if(localStorage.getItem('Totems') >= 0)
                    {
                        document.getElementById('Totems').textContent = localStorage.getItem('Totems');
                    }

                    Dying = true
                }
                else if (localStorage.getItem('Totems') < 0)
                {
                    localStorage.setItem('Totems', 0);

                    //Pausing animations
                    Alive = false;
                    document.getElementById("Obstacle").style.animationPlayState = "paused";
                    Player.classList.remove("Walking");

                    DeathSound.play();

                    Player.style.backgroundImage = "url('./ImageLibrary/DeadSteeve.webp')";

                    document.getElementById("DeathNote").style.display = "flex";

                    if(document.getElementById("Obstacle").className == "Obstacle3")
                    {
                        document.getElementById("DeathNote").textContent = "Steve was hunted down by a Phantom";
                    }

                    if(document.getElementById("Obstacle").className == "Obstacle2")
                    {
                        document.getElementById("DeathNote").textContent = "Steve was jumped by a Spider";
                    }

                    if(document.getElementById("Obstacle").className == "Obstacle1")
                    {
                        document.getElementById("DeathNote").textContent = "Steve was eaten alive by a Zombie";
                    }
                    
                    Dying = true
                }
                

                setTimeout(function()
                {
                    Dying = false
                }, 1000);
            }
        }
    }, 10);
}





//Function to restart the animations and reset the current score
function Respawn()
{
    Alive = true;
    Score = 0;

    location.reload();
}



function Balance()
{
    setInterval(function()
    {
        document.getElementById("Coins").textContent = "Money = " + localStorage.getItem('HighScore');
    }, 50);
}

function Purchase(clicked_id)
{
    if(localStorage.getItem("HighScore") >= document.getElementById(clicked_id).id)
    {
        var Cost = document.getElementById(clicked_id).id

        var NewScore = localStorage.getItem("HighScore") - Cost

        localStorage.setItem("HighScore", NewScore)

        var Totems = Totem ++;

        localStorage.setItem('Totems', Totems)
    }
    else
    {
        alert("You too poor!")
    }
}