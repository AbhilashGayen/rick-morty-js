const characterList = document.getElementById('character');
const episodeCloseBtn = document.getElementById('episode-close-btn');
const episodeDetailsContent = document.querySelector('.character-details-content');

characterList.addEventListener('click', getEpisodes);
episodeCloseBtn.addEventListener('click', () => {
  episodeDetailsContent.parentElement.classList.remove('showEpisodes')
});

getCharacters();

function getCharacters() {
  fetch(`https://rickandmortyapi.com/api/character`)
    .then(response => response.json())
    .then(data => {
      let html = '';
      if (data.results) {
        data.results.forEach(character => {
          html += `
                <div class="character-card" data-id="${character.id}" data-episodes="${character.episode}">
                            <div class="character-card-img">
                                <img src=${character.image} alt="">
                            </div>
                            <div class="character-card-content">
                                <div class="section">
                                    <h2 class="episodes-btn">${character.name}</h2>
                                    <span class="status">  
                                        ${character.status == "Alive" 
                                          ? `<span class="status-icon status-alive"></span>` 
                                          : `<span class="status-icon status-dead"></span>`
                                        } 
                                        ${character.status}
                                    </span>
                                </div>
                                <div class="section">
                                    <label>Last known location:</label>
                                    <span class="sub-text">${character.location.name}</span>
                                </div>
                                <div class="section">
                                    <label>First seen in:</label>
                                    <span class="sub-text">${character.origin.name}</span>
                                </div>
                            </div>
                        </div>
              `;
        });
      }
      characterList.innerHTML = html;
    });
}

function getEpisodes(e) {
  e.preventDefault();
  if (e.target.classList.contains('episodes-btn')) {
    const episodeItem = e.target.parentElement.parentElement.parentElement;
    const episodeList = episodeItem.dataset.episodes.split(',');
    const episodeNumbers = episodeList.map(x => x.replace(/^\D+/g, ''));
    fetch(`https://rickandmortyapi.com/api/episode/${episodeNumbers}`)
      .then(response => response.json())
      .then(data => {
        const episodeDetails = data.length ? data : [data];
        if (episodeDetails.length) {
          episodeModal(episodeDetails, episodeItem.dataset.name);
        }
      });
  }

  function episodeModal(episodes, name) {
    let html = `
        <div class="character-episodes">
            <h3>Episodes</h3>
            <ul>
              ${episodes.map(episode => `<li>${episode.name}</li>`).join('')}
            </ul>
        </div>
    `;
    episodeDetailsContent.innerHTML = html;
    episodeDetailsContent.parentElement.classList.add('showEpisodes');
  }
}