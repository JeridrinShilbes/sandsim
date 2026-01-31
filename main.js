const tileSize=5;
const screen=document.getElementById("sandBox");
const X=screen.width/tileSize;
const Y=screen.height/tileSize;
const tileColor="yellow";
const frameRate=64;


function main()
{
    const array=new Array(X*Y).fill(false);

    renderState(array);
    document.addEventListener("keydown",()=>
    {
        setInterval(() => {
            animateMain(array);
        }, Math.floor(1000/frameRate));
    },{once:true});
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
            const newPos=findFlow(i,array);
            array[i]=false; //clear prev pos
            switch(newPos)
            {
                case 0:
                    array[i]=true;
                    break;
                case 1:
                    array[i+X-1]=true;
                    break;
                case 2:
                    array[i+X]=true;
                    break;
                case 3:
                    array[i+X+1]=true;
                    break;
            }
        }
    }
}
//function to find the direction to flow into
const findFlow=(ind,array)=>
{
    const x=ind%X;
    const y=Math.floor(ind/X);
    if(y==Y-1)return 0;
    const left=(x==0 || array[ind+X-1]);
    const middle=(array[ind+X]);
    const right=(x==0 || array[ind+X+1]);
    if(middle && right && left)return 0;
    if(!middle)return 2;
    if(!right && !left)return (Math.floor(Math.random()*1000)%2===1)?1:3;
    if(!left)return 1;
    if(!right)return 3;
}
//main animation functioon
function animateMain(array)
{
    array[pickRand(0,Math.floor(X*Y/5))]=true;
    stepSingle(array);
    renderState(array);
}

main();
