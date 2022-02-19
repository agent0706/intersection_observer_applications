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

const addLoadingTag = () => {
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('loading_text');
    loadingElement.textContent = '....Loading more cards';
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.appendChild(loadingElement);
};

const removeLoadingTag = () => {
    const loadingElement = document.querySelector('.loading_text');
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.removeChild(loadingElement);
};

const loadMoreCards = () => {
    return new Promise(resolve => {
        setTimeout(() => {
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
            resolve();
        }, 2000);
    });
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            addLoadingTag();
            loadMoreCards()
            .finally(() => removeLoadingTag());
        }
    });
}, options);

const lastCard = document.querySelector('.last');
observer.observe(lastCard);


