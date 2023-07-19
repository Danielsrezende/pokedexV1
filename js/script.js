const container = document.querySelector('.pokemons')
const loadingScreen = document.getElementById('loading-screen')
document.getElementById('loading-screen').style.display = 'none'

function pokemonCard(pokemon, index) {
  const pokemonInfo = document.createElement('div')
  pokemonInfo.classList.add('pokemon-info')
  pokemonInfo.id = index

  // Cria a tag Id no card
  const pokemonId = document.createElement('div')
  pokemonId.classList.add('pokemon-id')
  pokemonId.innerHTML = `<span>#${String(index).padStart(3, '0')}</span>`
  pokemonInfo.appendChild(pokemonId);

  // Cria o container da imagem
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  // busca a imagem na API
  const pokemonImage = document.createElement('div')
  pokemonImage.classList.add('image')
  const img = document.createElement('img')
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`;

  // Adiciona as imagens nos cards

  pokemonImage.appendChild(img);
  imageContainer.appendChild(pokemonImage);

  // Adiciona os nomes dos pokemons

  const pokemonName = document.createElement('div') 
  pokemonName.classList.add('pokemon-name')
  pokemonName.innerHTML = `<span>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>`;
  
  imageContainer.appendChild(pokemonName);


  pokemonInfo.appendChild(imageContainer);
  container.appendChild(pokemonInfo);
}

async function getPokemons(qtdPokemons) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${qtdPokemons}`)
    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados!')
    }

    const data = await response.json()
    container.innerHTML = "";

    data.results.forEach((ele, index) => {
      pokemonCard(ele, index + 1)
    })

  } catch (error) {
    console.error(error)
  }
}

getPokemons(24)