// Waiting for the DOM content to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function(){

    // Retrieving elements from the DOM
    const searchBtn = document.querySelector('.search-btn');
    const superHeroList = document.getElementById('superhero');
    const superHeroDetailsContent = document.querySelector('.superhero-details-content');
    const superHeroCloseBtn = document.getElementById('superhero-close-btn');
  
    // Event listener for closing superhero details
    superHeroCloseBtn.addEventListener('click', () => {
      superHeroDetailsContent.parentElement.classList.remove('showSuperHero');
      console.log("close");
    });
  
    // Event listener for search button click to fetch superhero list
    searchBtn.addEventListener('click', getSuperHeroList);
  
    // Function to fetch and display superhero list based on search input
    function getSuperHeroList() {
      // Retrieving search input value and trimming whitespaces
      let searchInputTxt = document.getElementById('search-input').value.trim();
  
      // Fetching superhero data from Marvel API based on search input
      fetch(`http://gateway.marvel.com/v1/public/characters?ts=1&apikey=94990c30eeadfb944e8ce703f46fb9df&hash=84942db7f1df9d6abda2409a1c16dcf5&nameStartsWith=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
          let html = "";
          if (data.data.results) {
            // Generating HTML for each superhero fetched
            data.data.results.forEach(element => {
              html += `
                <div class="superhero-item" data-id="${element.id}">
                  <div class="superhero-img">
                    <img src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt="superhero"/>
                  </div>
                  <div class="superhero-name">
                    <a href="#" class="superhero-info">
                      ${element.name}
                    </a>
                    <a href="#" class="superhero-btn">Add To Favourites</a>
                  </div>
                </div>`;
            });
            superHeroList.classList.remove('notFound');
          } else {
            html = "Sorry, we didn't find any superhero!";
            superHeroList.classList.add('notFound');
          }
  
          // Displaying generated HTML in the superhero list container
          superHeroList.innerHTML = html;
        })
    }
  
    // Event listener for clicking on superhero items to fetch detailed information
    superHeroList.addEventListener('click', getSuperHeroInfo);
  
    // Function to fetch detailed information of a selected superhero
    function getSuperHeroInfo(e) {
      e.preventDefault();
      if (e.target.classList.contains('superhero-info')) {
        let superHeroItem = e.target.parentElement.parentElement;
        fetch(`http://gateway.marvel.com/v1/public/characters?ts=1&apikey=94990c30eeadfb944e8ce703f46fb9df&hash=84942db7f1df9d6abda2409a1c16dcf5&id=${superHeroItem.dataset.id}`)
          .then(response => response.json())
          .then(data => superHeroModal(data.data.results));
      }
      // Handle adding superhero to favorites
      if(e.target.classList.contains('superhero-btn')){
        console.log('yes');
        if(e.target.classList.contains('is-favorite')){
          e.target.classList.remove('is-favorite');
          e.target.textContent = 'Removed';
        }else{
          e.target.classList.add('is-favorite');
          e.target.textContent='Added';
          const superHeroDB = new favoritesDB();
          const heroInfo = e.target.parentElement.parentElement;
          const superheroInfo ={
            id: heroInfo.dataset.id,
            image: heroInfo.querySelector('.superhero-img img').src,
            name: heroInfo.querySelector('.superhero-info').textContent
            
          }
          console.log(superheroInfo);
          superHeroDB.saveIntoDB(superheroInfo);
        }
      }
    }
  
    // Function to handle displaying superhero details in a modal
    function superHeroModal(element) {
      element = element[0];
      let html = `
        <h2 class="superhero-title">${element.name}</h2>
        <div class="superheros-img">
          <img src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}" alt="superhero"/>
        </div>
        <div class="superhero-instruct">
          <p>${element.description}</p>
        </div>`;
      // Displaying superhero details in the designated content container
      superHeroDetailsContent.innerHTML = html;
      superHeroDetailsContent.parentElement.classList.add('showSuperHero');
    }
  
  });
  