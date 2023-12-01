const pathImages = "./src/assets/icons/";

const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
    playerSides: {
        player: "player-cards",
        playerBOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },

}


const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Papper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
];

async function removeAllCarsImages(){
    let {computerBOX, playerBOX} = state.playerSides;

    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove())

    imgElements = playerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove())
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "WIN";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "LOSE";
        state.score.computerScore++;
    }
    try{
        await playAudio(duelResults);
    } catch {}

    return duelResults;
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function setCardsField(playerId){
    await removeAllCarsImages();
    let computerCardId = await getRandomCardId();
    
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[playerId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(playerId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function resetCardSprites(){
    state.cardSprites.name.textContent = "Selecione uma carta";
    state.cardSprites.type.textContent = "";
    state.cardSprites.avatar.src = "";
}

async function resetFielCards(){
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
}

async function resetDuel(){
    resetCardSprites();
    resetFielCards();
    state.actions.button.style.display = "none";
    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

async function drawSelectedCard(id){
    state.cardSprites.avatar.src = cardData[id].img;
    state.cardSprites.name.innerText = cardData[id].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[id].type;
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("data-id", idCard);

    if(fieldSide === state.playerSides.player){
        cardImage.classList.add("card");
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard);
        });
 
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function drawCards(cardNumber, fieldSide) {
    for(let i = 0; i < cardNumber; i++){
        randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

function init(){
    drawCards(5, state.playerSides.player);
    drawCards(5, state.playerSides.computer);
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    const bgm = document.getElementById("bgm");
    bgm.play();

}

init();