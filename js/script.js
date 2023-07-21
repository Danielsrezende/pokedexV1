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
      })
    } catch (error) {
      console.error(error)
    }
  }
  
  getPokemonTypes()

  imageContainer.appendChild(pokemonTypes)
  pokemonsInfos.appendChild(imageContainer)
  container.appendChild(pokemonsInfos)
}

// Cria a modal de detalhes 

async function getMoreInfos (pokemon, index) {
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
  const cardheader = document.createElement('div')
  cardheader.classList.add('card-header')
  pokemonInfos.appendChild(cardheader)

  // Adiciona o id no card

  const pokemonId = document.createElement('span')
  pokemonId.innerHTML = `#${String(index).padStart(3, '0')}`
  cardheader.appendChild(pokemonId)

  // Cria o botão de fechar a modal
  const exitButton = document.createElement('div')
  exitButton.classList.add('exit-button')
  cardheader.appendChild(exitButton)

  const iconExit = document.createElement('i')
  iconExit.classList.add('fa-solid')
  iconExit.classList.add('fa-xmark')
  exitButton.appendChild(iconExit)

  exitButton.addEventListener('click', () => {
    overlay.remove()
    document.body.style.overflow = 'auto'
  })

  // Cria botão de ir ao pokemon anterior
  const iconPrev = document.createElement('i')
  iconPrev.classList.add('fa-solid')
  iconPrev.classList.add('fa-chevron-left')
  pokemonInfos.appendChild(iconPrev)

  iconPrev.addEventListener('click', () => {
    overlay.remove()
    setTimeout(() => {
      getNextPokemon(index - 1)
    }, 100)
  })

  // Cria o botão de ir ao proximo pokemon
  const iconLater = document.createElement('i')
  iconLater.classList.add('fa-solid')
  iconLater.classList.add('fa-chevron-right')
  pokemonInfos.appendChild(iconLater)

  iconLater.addEventListener('click', () => {
    overlay.remove()
    setTimeout(() => {
        getNextPokemon(index + 1)
    }, 100)
  })

  // Cria o Container do card
  const cardContainer = document.createElement('div')
  cardContainer.classList.add('pokemon-container')
  pokemonInfos.appendChild(cardContainer)

  // Adiciona o topo do card
  const cardTop = document.createElement('div')
  cardTop.classList.add('card-top')
  cardContainer.appendChild(cardTop)

  // Adiciona a imagem no card

  const pokemonImagem = document.createElement('div')
  pokemonImagem.classList.add('image')
  cardTop.appendChild(pokemonImagem)

  const img = document.createElement('img')
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`
  pokemonImagem.appendChild(img)

  // Adiciona Container dos detalhes

  const pokemonIntroduction = document.createElement('div')
  pokemonIntroduction.classList.add('pokemon-introduction')
  cardTop.appendChild(pokemonIntroduction)

  // Adiciona o nome do pokemon no card

  const pokemonName = document.createElement('h2')
  pokemonName.innerHTML = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`
  pokemonIntroduction.appendChild(pokemonName)

  // Adiciona os Tipos de pokemon no card

  const pokemonTypes = document.createElement('div')
  pokemonTypes.classList.add('pokemon-types')
  pokemonIntroduction.appendChild(pokemonTypes)

  async function getTypesPokemon() {
      const data = await getPokemonData(index)
      data.types.forEach(type => {
          const typeItem = document.createElement('li')
          typeItem.id = type.type.name
          typeItem.innerText = type.type.name
          pokemonTypes.appendChild(typeItem)
      })
  }

  getTypesPokemon()

  // busca a especie do pokemon

  async function getSpecies(data) {
    const response = await fetch(data.species.url)

    if (!response.ok) {
        throw new Error('Erro ao buscar dados da API')
    }

    const speciesData = await response.json()
    return speciesData
  }

  async function getPokemonResume() {
    const data = await getPokemonData(index)

    const speciesData = await getSpecies(data)
    const summary = speciesData.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text
    const pokemonResume = document.createElement('div')
    pokemonResume.classList.add('pokemon-resume')
    pokemonResume.innerHTML = `<p>${summary}</p>`
    pokemonIntroduction.appendChild(pokemonResume)

  }

  getPokemonResume().then(() => {
    getPokemonStatus()
    getPokemonEvolution().then(() => {
        getWeaknessesPokemon()
    })
  })

  async function getPokemonStatus() {
    const data = await getPokemonData(index)

    const stats = [
        { name: 'Attack', value: data.stats.find(stat => stat.stat.name === "attack").base_stat },
        { name: 'Defense', value: data.stats.find(stat => stat.stat.name === "defense").base_stat },
        { name: 'HP', value: data.stats.find(stat => stat.stat.name === "hp").base_stat },
        { name: 'Spc. Attack', value: data.stats.find(stat => stat.stat.name === "special-attack").base_stat },
        { name: 'Spc. Defense', value: data.stats.find(stat => stat.stat.name === "special-defense").base_stat },
        { name: 'Speed', value: data.stats.find(stat => stat.stat.name === "speed").base_stat }
    ]

    const pokemonStatus = document.createElement('div')
    pokemonStatus.classList.add('pokemon-status')
    cardContainer.appendChild(pokemonStatus)

    const titlePokemonStatus = document.createElement('h2')
    titlePokemonStatus.innerText = 'Statistics'
    pokemonStatus.appendChild(titlePokemonStatus)

    const status = document.createElement('div')
    status.classList.add('status')
    pokemonStatus.appendChild(status)

    const statisticName = document.createElement('div')
    statisticName.classList.add('statistic-name')
    status.appendChild(statisticName)

    const statBar = document.createElement('div')
    statBar.classList.add('statistic-bars')
    status.appendChild(statBar)

    stats.forEach(stat => {
  
        const statName = document.createElement('li')
        statName.innerText = `${stat.name}:`
        statisticName.appendChild(statName)

        const barsValue = document.createElement('li')
        statBar.appendChild(barsValue)

        const bars = document.createElement('div')
        bars.classList.add('statistic-bar')
        bars.id = stat.name.toLowerCase()
        bars.style.width = `${stat.value}px`
        barsValue.appendChild(bars)

        const statValue = document.createElement('span')
        statValue.innerText = stat.value
        barsValue.appendChild(statValue)
    })
}

async function getPokemonEvolution() {
   
    const data = await getPokemonData(index)
    const speciesData = await getSpecies(data)
    try {
        const response = await fetch(speciesData.evolution_chain.url)

        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API')
        }

        const evolutionChainData = await response.json()
        const evolutionChain = getEvolutionChain(evolutionChainData.chain, [])
        const pokemonEvolutions = document.createElement('div')
        pokemonEvolutions.classList.add('pokemon-evolutions')
        cardContainer.appendChild(pokemonEvolutions)

        const titlePokemonEvolutions = document.createElement('h2')
        titlePokemonEvolutions.innerText = 'Evolutions'
        pokemonEvolutions.appendChild(titlePokemonEvolutions)

        const evolutionList = document.createElement('ul')
        pokemonEvolutions.appendChild(evolutionList)
        
        evolutionChain.forEach((pokemon, index) => {
            const evolutionItem = document.createElement('li')
            evolutionItem.classList.add('info-card')
            evolutionItem.id = pokemon.id

            evolutionItem.addEventListener('click', () => {
                overlay.remove()
                setTimeout(() => {
                    getMoreInfos(pokemon, evolutionItem.id)
                }, 300)
            })

            const imagemEvolution = document.createElement('img')
            imagemEvolution.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
            imagemEvolution.alt = pokemon.name
            const pokemonEvolution = document.createElement('span')
            pokemonEvolution.innerText = pokemon.name
            
            if (pokemon.level != undefined) {
                const formEvolution = document.createElement('li')
                formEvolution.classList.add('requirement-evolution')

                const lvlItem = document.createElement('span')
                lvlItem.innerText = pokemon.level
                const lvlText = document.createElement('span')
                lvlText.innerText = 'lvl'
                
                formEvolution.appendChild(lvlItem)
                formEvolution.appendChild(lvlText)
                evolutionList.appendChild(formEvolution)
            } 
            
            if (pokemon.typeEvolution) {
                const formEvolution = document.createElement('li')
                formEvolution.classList.add('requirement-evolution')
                
                if (pokemon.typeEvolution.icon) {
                    const typeEvolutionIcon = document.createElement('img')
                    typeEvolutionIcon.classList.add('item-evolution')
                    typeEvolutionIcon.src = pokemon.typeEvolution.icon
                    formEvolution.appendChild(typeEvolutionIcon)
                }

                if (pokemon.typeEvolution.data) {
                    const typeEvolutionData = document.createElement('span')
                    typeEvolutionData.innerText = pokemon.typeEvolution.data
                    formEvolution.appendChild(typeEvolutionData)
                }

                if (pokemon.typeEvolution.name) {
                    const typeEvolutionName = document.createElement('span')
                    typeEvolutionName.innerText = pokemon.typeEvolution.name
                    formEvolution.appendChild(typeEvolutionName)
                }

                evolutionList.appendChild(formEvolution)
            }
            
            evolutionItem.appendChild(imagemEvolution)
            evolutionItem.appendChild(pokemonEvolution)
            evolutionList.appendChild(evolutionItem)
        })

        function getEvolutionChain(chain, chainArray) {
            const pokemonName = chain.species.name
            const pokemonId = chain.species.url.split('/')[6]
            const evolutionDetails = chain.evolution_details[0]
            
            if (evolutionDetails) {
                // console.log(evolutionDetails)
                if (evolutionDetails.min_level) {
                    chainArray.push({ name: pokemonName, id: pokemonId, level: evolutionDetails.min_level })
                } else if (evolutionDetails.item) {
                    const itemName = evolutionDetails.item.name
                    const itemUrl = `https://pokeapi.co/api/v2/item/${evolutionDetails.item.url.split('/')[6]}/`
                    const itemSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`
                    chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: itemName, icon: itemSpriteUrl, url: itemUrl } })
                } else if (evolutionDetails.min_level) {
                    chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Lvl', data: evolutionDetails.min_level } })
                } else if (evolutionDetails.min_happiness) {
                    chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Happiness', data: evolutionDetails.min_happiness } })
                } else if (evolutionDetails.min_affection) {
                    chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Affection', data: evolutionDetails.min_affection } })
                } else if (evolutionDetails.trigger.name === 'trade') {
                    chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: {data: evolutionDetails.trigger.name } })
                } else if (evolutionDetails.min_beauty) {
                    chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Beauty', data: evolutionDetails.min_beauty } })
                } else if (evolutionDetails.known_move) {
                    chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Move', data: evolutionDetails.known_move.name } })
                } else if (evolutionDetails.location) {
                    chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Level up near route', data: evolutionDetails.location.name } })
                }
             
            } else {
                chainArray.push({ name: pokemonName, id: pokemonId })
            }
        
            if (chain.evolves_to.length > 0) {
                chain.evolves_to.forEach(pokemon => {
                    getEvolutionChain(pokemon, chainArray)
                })
            }
            
            return chainArray
        }

    } catch (error) {
        console.error(error)
    }

}

async function getWeaknessesPokemon() {
    const data = await getPokemonData(index)
    try {
        const response = await fetch(data.types[0].type.url)

        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API')
        }

        const weaknessesData = await response.json()
        const weaknesses = weaknessesData.damage_relations.double_damage_from
        const pokemonWeaknesses = document.createElement('div')
        pokemonWeaknesses.classList.add('pokemon-weaknesses')
        pokemonWeaknesses.classList.add('pokemons-types')
        cardContainer.appendChild(pokemonWeaknesses)

        const titlePokemonWeaknesses = document.createElement('h2')
        titlePokemonWeaknesses.innerText = 'Weaknesses'
        pokemonWeaknesses.appendChild(titlePokemonWeaknesses)

        const weaknessList = document.createElement('ul')
        pokemonWeaknesses.appendChild(weaknessList)
        weaknesses.forEach(weakness => {
            const weaknessItem = document.createElement('li')
            weaknessItem.innerText = weakness.name
            weaknessItem.id = weakness.name
            weaknessList.appendChild(weaknessItem)
        })
        
        const advantages = weaknessesData.damage_relations.double_damage_to
        const pokemonAdvantage = document.createElement('div')
        pokemonAdvantage.classList.add('pokemon-weaknesses')
        pokemonAdvantage.classList.add('pokemons-types')
        cardContainer.appendChild(pokemonAdvantage)

        const titlePokemonAdvantage = document.createElement('h2')
        titlePokemonAdvantage.innerText = 'Advantage'
        pokemonAdvantage.appendChild(titlePokemonAdvantage)

        const advantageList = document.createElement('ul')
        pokemonAdvantage.appendChild(advantageList)
        
        advantages.forEach(advantage => {
            const advantageItem = document.createElement('li')
            advantageItem.innerText = advantage.name
            advantageItem.id = advantage.name
            advantageList.appendChild(advantageItem)
        })
        

    } catch (error) {
        console.error(error)
    }
  }
  container.appendChild(overlay)
}

//

async function getPokemonData(index) {
  try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
      
      if (!response.ok) {
          throw new Error('Erro ao buscar dados da APi.')
      }

      const data = await response.json()

      return data

  } catch (error) {
      console.error(error)
  }
}

//

const buttonPesquisa = document.querySelector('.barra-pesquisa button');

buttonPesquisa.addEventListener('click', function() {
    const searchPokemon = document.querySelector('.barra-pesquisa input');
    if (searchPokemon.value != "") {
        searchPokemons(searchPokemon.value);
    } else {
        getPokemons(24);
    }
})

let pokemonList = [];

async function getPokemonList() {
  try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      const data = await response.json()
      pokemonList = data.results
  } catch (error) {
      console.error(error)
  }
}

async function searchPokemons(pesquisa) {
  loadingScreen.style.display = 'flex'
  pesquisa = pesquisa.toLowerCase()

  if (pokemonList.length === 0) {
      await getPokemonList()
  }

  let filteredPokemon = []

  if (!isNaN(pesquisa)) { // Verifica se a pesquisa é um número
      const pokemon = pokemonList.find(pokemon => {
          return parseInt(pokemon.url.split("/")[6]) === parseInt(pesquisa)
      })
      if (pokemon) {
          filteredPokemon.push(pokemon)
      }
  } else {
      filteredPokemon = pokemonList.filter(pokemon => {
          return pokemon.name.includes(pesquisa)
      })
  }

  filteredPokemon.sort((a, b) => {
      return a.url.split("/")[6] - b.url.split("/")[6]
  })

  container.innerHTML = ''
  const pokemonPromises = filteredPokemon.map(pokemon => {
      return fetch(pokemon.url)
          .then(response => response.json())
  })

  const pokemonData = await Promise.all(pokemonPromises)

  pokemonData.forEach(pokemon => {
    pokemonCard(pokemon, pokemon.id)
  })
  loadingScreen.style.display = 'none'
}

const typesPokemon = document.querySelectorAll('.pokemons-types-container li')

typesPokemon.forEach(element => {
  element.addEventListener('click', async (event) => {
    try {
      if (element.id == 'nenhum') {
        getPokemons(24)
        return
      }

      const type = event.target.id
      const url = `https://pokeapi.co/api/v2/type/${type}`
      loadingScreen.style.display = 'flex'

      const typeResponse = await fetch(url)

      if (!typeResponse.ok) {
        throw new Error('Erro ao buscar dados da API.')
      }

      const typeData = await typeResponse.json()
      const pokemonList = typeData.pokemon

      const pokemonPromises = pokemonList.map(pokemon => fetch(pokemon.pokemon.url))
      const pokemonResponses = await Promise.all(pokemonPromises)

      if (!pokemonResponses.every(response => response.ok)) {
        throw new Error('Erro ao buscar dados da API.')
      }

      const pokemonDataList = await Promise.all(pokemonResponses.map(response => response.json()))
      container.innerHTML = ""
      pokemonDataList.forEach(pokemonData => {
        pokemonCard(pokemonData, pokemonData.id)
      })
      loadingScreen.style.display = 'none'
    } catch (error) {
      console.error(error)
    }
  })
})

// busca o proximo pokemon
async function getNextPokemon(index) {
  try {
    idPokemon = parseInt(index)

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)

    if (!response.ok) {
        throw new Error('Erro ao buscar dados da API.')
    }  

    const pokemonData = await response.json()
    getMoreInfos(pokemonData, pokemonData.id)

  } catch (error) {
      console.error(error)
  }
}

//

// Busca os Pokemons

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
  