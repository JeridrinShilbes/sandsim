const tileSize=5;
const tileColor="yellow";
const frameRate=64;
const availabeGravity=("-y","x","y","-x");
let currentGravity=0;

const screen=document.getElementById("sandBox");
const button=document.getElementById("togglePlay");
const gFlip=document.getElementById("gravityFlip");
gFlip.addEventListener("click",rotateGravity);

const X=screen.width/tileSize;
const Y=screen.height/tileSize;



function main()
{
    const array=new Array(X*Y).fill(false);
    let intervalId=null;
    button.addEventListener("click",()=>{
        if(button.innerText==="Start")
        {
            button.innerText="Stop!";
            intervalId=setInterval(() => {
                animateMain(array);
            }, Math.floor(1000/frameRate));
        }
        else{
            clearInterval(intervalId);
            intervalId=null;
            button.innerText="Start";
        }
    })
}
const pickRand=(start,end)=>
{
    return Math.floor(start+(Math.random()*(end-start)));
}
//function that renders the current frame
const renderState=(array)=>
{
    const ctx=screen.getContext("2d");
    ctx.moveTo(0,0);
    ctx.clearRect(0,0,screen.width,screen.height);
    ctx.fillStyle=tileColor;
    for(const [i,tile] of array.entries())
    {
        if(tile)
        {
            let x=i%X;
            let y=Math.floor(i/X);
            ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize);
        }
    }
}
//fill random squares
const randFill=(array)=>
{
    const numOfTiles=pickRand(1,X*Y);
    for(let i=0;i<Math.floor(numOfTiles/10);i++)
    {
        let c=pickRand(0,X*Y);
        while(array[c])c=pickRand(0,X*Y);
        array[c]=true;
    }
}
//function that steps one in to the future
const stepSingle=(array)=>
{
    for(let i=array.length -1;i>=0;i--)
    {
        const tile=array[i];
        if(tile)
        {
            array[i]=false; //clear prev pos
            array[findFlow(i,array)]=true;
        }
    }
}
//function to find the direction to flow into
const findFlow=(ind,array)=>
{
    const x=ind%X;
    const y=Math.floor(ind/X);
    if(y==Y-1)return ind;

    const left=(x==0 || array[ind+X-1]);
    const middle=(array[ind+X]);
    const right=(x==0 || array[ind+X+1]);

    if(middle && right && left)return ind;

    if(!middle)return ind+X;

    if(!right && !left)return (Math.floor(Math.random()*1000)%2===1)?ind+X-1:ind+X+1;

    if(!left)return ind+X-1;

    if(!right)return ind+X+1;
}
//main animation functioon
function animateMain(array)
{
    array[pickRand(0,Math.floor(X*Y/5))]=true;
    stepSingle(array);
    renderState(array);
}
//function to update gravity
function rotateGravity()
{
    currentGravity=(currentGravity+1)%4;
    console.log(currentGravity);
}


main();
