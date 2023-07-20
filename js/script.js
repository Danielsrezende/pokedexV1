const container = document.querySelector('.pokemons')
const loadingScreen = document.getElementById('loading-screen')
document.getElementById('loading-screen').style.display = 'none'

// Cria a lista de pokemons

function pokemonCard(pokemon, index) {
  const pokemonsInfos = document.createElement('div')
  pokemonsInfos.classList.add('pokemon-info')
  pokemonsInfos.id = index

  pokemonsInfos.addEventListener('click', () => {
    getMoreInfos(pokemon, index)
  })

  // Cria a tag Id no card
  const pokemonId = document.createElement('div')
  pokemonId.classList.add('pokemon-id')
  pokemonId.innerHTML = `<span>#${String(index).padStart(3, '0')}</span>`
  pokemonsInfos.appendChild(pokemonId)

  // Cria o container da imagem
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('image-container')

  // Busca a imagem na API
  const pokemonImage = document.createElement('div')
  pokemonImage.classList.add('image')
  const img = document.createElement('img')
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`

  // Adiciona as imagens nos cards

  pokemonImage.appendChild(img)
  imageContainer.appendChild(pokemonImage)

  // Adiciona os nomes dos pokemons

  const pokemonName = document.createElement('div') 
  pokemonName.classList.add('pokemon-name')
  pokemonName.innerHTML = `<span>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>`
  
  imageContainer.appendChild(pokemonName)

  // Busca os tipos de Pokemon

  const pokemonTypes = document.createElement('div')
  pokemonTypes.classList.add('pokemon-types')

  async function getPokemonTypes () {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
      
      if (!response.ok) {
        throw new Error('Não foi possível carregar os tipos!')
      }

      const dataTypes = await response.json()

      const typePromises = dataTypes.types.map(type => fetch(type.type.url))
      const typeResponses = await Promise.all(typePromises)
      const typeDatas = await Promise.all(typeResponses.map(response => response.json()))

      typeDatas.forEach(typeData => {
        const typeIcon = document.createElement('img')
        typeIcon.src = `${getTypeImg(typeData.name)}`
        pokemonTypes.appendChild(typeIcon)
      });
    } catch (error) {
      console.error(error)
    }
  }
  
  getPokemonTypes()

  imageContainer.appendChild(pokemonTypes)
  pokemonsInfos.appendChild(imageContainer)
  container.appendChild(pokemonsInfos)
}

async function getMoreInfos () {
  // Trava o Scroll da pagina
  document.body.style.overflow = 'hidden'

  // Pega o container
  const container = document.querySelector('.container')

  // Escurece a pagina
  const overlay = document.createElement('div')
  overlay.classList.add('overlay')

  // cria o card
  const pokemonInfos = document.createElement('div')
  pokemonInfos.classList.add('pokemon-infos')
  overlay.appendChild(pokemonInfos)

  // Adiciona o topo do card
  const cardheader = document.createElement('div');
  cardheader.classList.add('card-header');
  pokemonInfos.appendChild(cardheader);

  container.appendChild(overlay)


}

// Busca os Pokemons

async function getPokemons(qtdPokemons) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${qtdPokemons}`)
    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados!')
    }

    const data = await response.json()
    container.innerHTML = ""

    data.results.forEach((ele, index) => {
      pokemonCard(ele, index + 1)
    })

  } catch (error) {
    console.error(error)
  }
}

getPokemons(24)

const getTypeImg = (type) => {
  switch (type) {
      case "bug":
      return "img/bug.svg"
      case "dark":
      return "img/dark.svg"
      case "ghost":
      return "img/ghost.svg"
      case "grass":
      return "img/grass.svg"
      case "dragon":
      return "img/dragon.svg"
      case "electric":
      return "img/electric.svg"
      case "fairy":
      return "img/fairy.svg"
      case "fighting":
      return "img/fighting.svg"
      case "fire":
      return "img/fire.svg"
      case "flying":
      return "img/flying.svg"
      case "ground":
      return "img/ground.svg"
      case "ice":
      return "img/ice.svg"
      case "normal":
      return "img/normal.svg"
      case "poison":
      return "img/poison.svg"
      case "psychic":
      return "img/psychic.svg"
      case "rock":
      return "img/rock.svg"
      case "steel":
      return "img/steel.svg"
      case "water":
      return "img/water.svg"
      default:
      return "#"
  }
  }
  