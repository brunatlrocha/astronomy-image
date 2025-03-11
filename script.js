document.addEventListener('DOMContentLoaded', () => {
  const dateForm = document.getElementById('dateForm');
  const apodContainer = document.getElementById('apodContainer');
  const favoritesList = document.getElementById('favoritesList');

  dateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dateInput = document.getElementById('dateInput').value;

      const apodData = await fetchApodData(dateInput);

      displayApodData(apodData);
  });

  apodContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
          const hdUrl = e.target.getAttribute('data-hdurl');
          if (hdUrl) {
              window.open(hdUrl, '_blank');
          }
      }

      if (e.target.tagName === 'BUTTON') {
          const parentContainer = e.target.closest('.apod-item');
          const imageUrl = parentContainer.getAttribute('data-url');
          const imageTitle = parentContainer.getAttribute('data-title');
          const imageHdUrl = parentContainer.getAttribute('data-hdurl');
          const imageDate = parentContainer.getAttribute('data-date');

          addToFavorites(imageUrl, imageTitle, imageHdUrl, imageDate);

          loadFavorites();
      }
  });

  favoritesList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
          const parentLi = e.target.closest('li');
          const imageUrl = parentLi.getAttribute('data-url');

          removeFavorite(imageUrl);

          parentLi.remove();
      }
  });

  loadFavorites();
});

async function fetchApodData(date) {
  const apiKey = 'CcHJTxiNMcDfCI0e3scFC5Vhr4cKFvJ0ePe8yacs';
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching APOD data:', error);
  }
}

function displayApodData(apodData) {
  const apodContainer = document.getElementById('apodContainer');
  apodContainer.innerHTML = '';

  const apodImage = document.createElement('img');
  apodImage.src = apodData.url;
  apodImage.alt = apodData.title;
  apodImage.setAttribute('data-hdurl', apodData.hdurl);

  const apodTitle = document.createElement('h2');
  apodTitle.textContent = apodData.title;

  const apodDate = document.createElement('p');
  apodDate.textContent = `Date: ${apodData.date}`;

  const apodExplanation = document.createElement('p');
  apodExplanation.textContent = apodData.explanation;

  const saveToFavoritesButton = document.createElement('button');
  saveToFavoritesButton.textContent = 'Save to Favorites';

  const apodItemContainer = document.createElement('div');
  apodItemContainer.classList.add('apod-item');
  apodItemContainer.setAttribute('data-url', apodData.url);
  apodItemContainer.setAttribute('data-title', apodData.title);
  apodItemContainer.setAttribute('data-hdurl', apodData.hdurl);
  apodItemContainer.setAttribute('data-date', apodData.date);

  apodItemContainer.appendChild(apodImage);
  apodItemContainer.appendChild(apodTitle);
  apodItemContainer.appendChild(apodDate);
  apodItemContainer.appendChild(apodExplanation);
  apodItemContainer.appendChild(saveToFavoritesButton);

  apodContainer.appendChild(apodItemContainer);
}

function addToFavorites(url, title, hdUrl, date) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const newFavorite = { url, title, hdUrl, date };
  favorites.push(newFavorite);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFavorites() {
  const favoritesList = document.getElementById('favoritesList');
  favoritesList.innerHTML = '';

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favorites.forEach((favorite) => {
      const li = document.createElement('li');
      li.setAttribute('data-url', favorite.url);

      const img = document.createElement('img');
      img.src = favorite.url;
      img.alt = favorite.title;

      const title = document.createElement('h3');
      title.textContent = favorite.title;

      const button = document.createElement('button');
      button.textContent = 'Remove';

      li.appendChild(img);
      li.appendChild(title);
      li.appendChild(button);
      favoritesList.appendChild(li);
  });
}

function removeFavorite(imageUrl) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const updatedFavorites = favorites.filter((favorite) => favorite.url !== imageUrl);

  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
}