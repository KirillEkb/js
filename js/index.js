const body = document.querySelector('.body');
const main = document.createElement('main');
main.classList.add('body__main','search-main');
const input = createElement('input', 'search-main__input','input');
input.type = 'text';
input.placeholder = 'enter keyword';
const autocomplete = createElement('ul', 'search-main__autocomplete', 'autocomplete');
const savedRepo = createElement('div', 'search-main__saved', 'saved');
const closeBtn = createElement('button', 'button', 'close-button', 'saved__close-button');

const debounce = function(fn, debounceTime) {
    let timer;
return function() {
    clearTimeout(timer)
    timer = setTimeout(() => {
        fn.apply(this,arguments)
    },debounceTime)
};
}



function createElement(elemTag, ...elemClass) {
    const elem = document.createElement(elemTag);
    if(elemClass) {
        elem.classList.add(...elemClass);
    }
    return elem
}

main.append(input, autocomplete);
body.append(main);

const clearingAutocomplite = function() {
    while(autocomplete.firstChild) {
        autocomplete.removeChild(autocomplete.firstChild)
    }
}

input.addEventListener('input', debounce(async function() {
    this.value = this.value.trim();
    if  (!this.value) {
        clearingAutocomplite();
    }
    let response = await fetch(`https://api.github.com/search/repositories?q=${this.value}&per_page=5`);
    let repos = await response.json();
    if (!repos.items.length) {
        autocomplete.textContent = 'nothing found for your request';
        return
    }
    function getListContent() {
        if (autocomplete.childNodes.length) {
            clearingAutocomplite();
        }
        let fragment = new DocumentFragment();
        for(let i=0; i<=4; i++) {
          let li = createElement('li', 'autocomplete__item', `autocomplete__item-${i}`);
          li.textContent = repos.items[i].name;
          li.dataset.name = repos.items[i].name;
          li.dataset.owner = repos.items[i].owner.login;
          li.dataset.stars = repos.items[i].stargazers_count;
          fragment.append(li);
        }
        return fragment;
      }
      autocomplete.append(getListContent());
},400));

autocomplete.addEventListener('click', function(evt) {
    if (evt.target.tagName == 'LI') {
        const li = evt.target;
        function newSaved(saved) {
            const user = createElement('div', 'saved__text');
            const owner = createElement('div', 'saved__text');
            const stars = createElement('div', 'saved__text');
            user.textContent = `Name: ${li.dataset.name}`;
            owner.textContent = `Owner: ${li.dataset.owner}`;
            stars.textContent = `Stars: ${li.dataset.stars}`;
            saved.append(user, owner, stars);
            return saved;
        }
            const cloned = savedRepo.cloneNode(false);
            const clonedBtn = closeBtn.cloneNode(true);
            clonedBtn.addEventListener('click', function(evt) {
                this.parentNode.remove()
            })
            cloned.append(clonedBtn);
            main.append(newSaved(cloned));
            input.value ='';
            clearingAutocomplite();
    }
})






