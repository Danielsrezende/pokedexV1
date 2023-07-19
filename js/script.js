const container = document.querySelector('.pokemons')
const loadingScreen = document.getElementById('loading-screen')
document.getElementById('loading-screen').style.display = 'none'

function pokemonContainer(pokemon, index) {
  const pokemonInfo = document.createElement('div')
  pokemonInfo.classList.add('pokemon-info')
  pokemonInfo.id = index
}

async function getPokemons(qtdPokemons) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${qtdPokemons}`)

    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados!')
    }

    const data = await response.json();
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

getPokemons()