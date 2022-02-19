const options = {
    root: null,
    rootMargin: '10px',
    threshold: 1
};
let currentCount = 9;

const addNewCardToList = (cardsContainer) => {
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.textContent = currentCount;
    currentCount += 1;
    cardsContainer.appendChild(newCard);
    return newCard;
};

const loadMoreCards = () => {
    const cardsContainer = document.querySelector('.cards-container');
    const currentLastCard = document.querySelector('.last');
    for (let i = 0; i < 5; i++) {
        const newCard = addNewCardToList(cardsContainer);
        // if the newCard is the last card, observe it and unobserve the previous last card
        if  (i === 4) {
            newCard.classList.add('last');
            observer.unobserve(currentLastCard);
            observer.observe(newCard);
        }
    }
    currentLastCard.classList.remove('last');
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            loadMoreCards();
        }
    });
}, options);

const lastCard = document.querySelector('.last');
observer.observe(lastCard);


