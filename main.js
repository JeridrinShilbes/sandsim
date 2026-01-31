const tileSize=10;
const screen=document.getElementById("sandBox");
const X=screen.width/tileSize;
const Y=screen.height/tileSize;


function main()
{
    const array=new Array(X*Y).fill(false);
    const numOfTiles=pickRand(1,X*Y);
    for(let i=0;i<Math.floor(numOfTiles/10);i++)
    {
        let c=pickRand(0,X*Y);
        while(array[c])c=pickRand(0,X*Y);
        array[c]=true;
    }
    renderState(array);
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
    ctx.fillStyle="red";
    let i=0;
    for(let tile of array)
    {
        if(tile)
        {
            let x=i%X;
            let y=Math.floor(i/Y);
            ctx.fillStyle=(Math.floor(Math.random()*1000)%20!==1)?"red":"green";
            ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize);
        }
        i++;
    }
}
const intervalId=setInterval(() => {
    main();
}, 300);