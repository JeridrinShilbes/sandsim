const tileSize=10;
const tileColor="yellow";
let frameRate=24;
let currentGravity=0;
let pour=true;

const screen=document.getElementById("sandBox");
const button=document.getElementById("togglePlay");
const gFlip=document.getElementById("gravityFlip");
const Pour=document.getElementById("pour");
gFlip.addEventListener("click",rotateGravity);

const X=screen.width/tileSize;
const Y=screen.height/tileSize;

Pour.addEventListener("click",()=>
{
    pour=(pour)?false:true;
})

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
    let reverse=true;
    if(currentGravity>1)reverse=false;
    if(reverse)
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
    else
    {
    {
        for(let i=0;i<array.length;i++)
        {
            const tile=array[i];
            if(tile)
            {
                array[i]=false; //clear prev pos
                array[findFlow(i,array)]=true;
            }
        }
    }
    }
}
//function to find the direction to flow into
const findFlow=(ind,array)=>
{
    const x=ind%X;
    const y=Math.floor(ind/X);

    const dirRules=[
        {fwd:X,l:X-1,r:X+1,dx:0,dy:1},
        {fwd:1,l:X+1,r:1-X,dx:1,dy:0},
        {fwd:-X,l:1-X,r:-1-X,dx:0,dy:-1},
        {fwd:-1,l:-1-X,r:X-1,dx:-1,dy:0}
    ];
    const rules=dirRules[currentGravity];
    const newX=x+rules.dx;
    const newY=y+rules.dy;
    if(newX<0 || newX>X-1 || newY<0 || newY>Y-1)return ind;

    const canMoveLeft=checkFree(ind,rules.l,array);
    const canMoveRight=checkFree(ind,rules.r,array);
    const canMovStraight=checkFree(ind,rules.fwd,array);

    if(canMovStraight)return ind+rules.fwd;
    if(canMoveLeft && canMoveRight)return (Math.floor(Math.random()*3213)%2===1)?ind+rules.l:ind+rules.r;
    if(canMoveLeft)return ind+rules.l;
    if(canMoveRight)return ind+rules.r;
    return ind;
}
//main animation functioon
function animateMain(array)
{
    if(pour)
        {
            array[Math.floor(X/2)]=true;
            // array[pickRand(0,Math.floor(X*Y/5))]=true;
        }
    stepSingle(array);
    renderState(array);
}
//function to update gravity
function rotateGravity()
{
    currentGravity=(currentGravity+1)%4;
}
//function to check if the tile is free to move to
const checkFree=(i,offset,array)=>
{
    const newI=i+offset;
    if(newI<0 || newI>=X*Y || array[newI])return false;
    const oldX=i%X;
    const newX=newI%X;
    const oldY=Math.floor(i/X);
    const newY=Math.floor(newI/X);
    if(Math.abs(oldX-newX)>1 || Math.abs(oldY-newY)>1 )return false;
    return true;
}

main();
