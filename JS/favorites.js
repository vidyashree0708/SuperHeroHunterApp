// Function to redirect to favorites page
function openFavoritesPage() {
    window.location.href = './favorites.html';
}

// Function to redirect to home page
function openHomePage() {
    window.location.href = './index.html';
}

// Class for managing favorites
class Favorites {
    // Method to display favorite superheroes
    displayFavorites(favoriteList) {
        const favoritesContainer = document.getElementById('favorites');
        favoritesContainer.innerHTML = ''; // Clear the container
        favoriteList.forEach(element => {
            // Create HTML elements for each favorite superhero
            const superheroItem = document.createElement('div');
            superheroItem.classList.add('superhero-item');
            superheroItem.setAttribute('data-id', element.id);
            superheroItem.innerHTML = `
                <div class="superhero-img">
                    <img src="${element.image}" alt="superhero"/>
                </div>
                <div class="superhero-name">
                    <a href="#" class="superhero-info">${element.name}</a>
                    <a href="#" class="superhero-btn remove-btn">Remove From Favorites</a>
                </div>
            `;
            // Add event listener to the remove button
            superheroItem.querySelector('.remove-btn').addEventListener('click', () => {
                this.removeFromFavorites(element.id); // Call remove function when the remove button is clicked
            });
            favoritesContainer.appendChild(superheroItem); // Append the superhero item to the container
        });
    }

    // Method to remove a superhero from favorites
    removeFromFavorites(id) {
        let superheroData = this.getFromLocalStorage();
        superheroData = superheroData.filter(superhero => superhero.id !== id);
        this.saveIntoLocalStorage(superheroData);
        this.displayFavorites(superheroData); // Update the display after removal
    }

    // Method to save superheroes into local storage
    saveIntoLocalStorage(superheroes) {
        localStorage.setItem('superhero', JSON.stringify(superheroes));
    }

    // Method to get superheroes from local storage
    getFromLocalStorage() {
        const superheroData = localStorage.getItem('superhero');
        return superheroData ? JSON.parse(superheroData) : [];
    }
}

// Class for managing favorites in local storage
class favoritesDB {
    // Method to save superhero into local storage
    saveIntoDB(superheros) {
        const superhero = this.getFromDB();
        superhero.push(superheros);
        localStorage.setItem('superhero', JSON.stringify(superhero));
    }

    // Method to get superheroes from local storage
    getFromDB() {
        let superhero;
        if (localStorage.getItem('superhero') == null) {
            superhero = [];
        } else {
            superhero = JSON.parse(localStorage.getItem('superhero'));
        }
        return superhero;
    }
}

// Code execution for displaying favorites on the favorites page
const favoritesContent = document.querySelector('#favorites');
if (favoritesContent) {
    const superHeroDB = new favoritesDB(); // Instantiate favoritesDB class
    const favouritesDisplay = new Favorites(); // Instantiate Favorites class
    const superheroData = superHeroDB.getFromDB(); // Get superheroes from local storage
    favouritesDisplay.displayFavorites(superheroData); // Display the favorites on the page
}
