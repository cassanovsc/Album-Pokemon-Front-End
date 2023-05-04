/*
  --------------------------------------------------------------------------------------
  Função para atualizar a tabela do álbum de acordo com os pokémons salvos
  --------------------------------------------------------------------------------------
*/
const updateAlbumTable = () => {
  let table = document.getElementById('album-table');
  table.innerHTML = '';
  let i;
  let plan_html = '<tbody>'
  
  for (i = 0; i < all_pokemons.length; i++) {
    caught_pokemon = my_album.some((pokemon) => {return pokemon.id === all_pokemons[i].id;});
    plan_html += '<tr><td><div class="imgTable">'
                  + ((caught_pokemon) ? ('<img src="img/pokemon/' + all_pokemons[i].id + '.svg">') : '')
                  + '</div></td><td>#' + all_pokemons[i].id + '</td><td>'
                  + ((caught_pokemon) ? (all_pokemons[i].nome) : '')
                  + '</td><td>'
                  + ((caught_pokemon) ? (all_pokemons[i].tipos[0].nome + ((all_pokemons[i].tipos.length === 2) ? (' / ' + all_pokemons[i].tipos[1].nome) : '')) : '')
                  + '</td><td'
                  + ((caught_pokemon) ? ' class="removeAvailable" onClick="removePokemonAlbum(' + all_pokemons[i].id +')">X' : '>')
                  + '</td></tr>';
  }
  table.innerHTML += plan_html + '</tbody>';
}


/*
  --------------------------------------------------------------------------------------
  Promise para obter a lista de todos os pokémons existentes do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getAllPokemon = new Promise((resolve, reject) =>{
  let url = 'http://127.0.0.1:5000/pokemons';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      resolve(data.pokemons);
      /*data.pokemons.forEach(pokemon => insertList(pokemon.id, pokemon.nome, pokemon.tipos))*/
      
    })
    .catch((error) => {
      console.error('Error:', error);
      reject(error);
    })
  });


/*
  --------------------------------------------------------------------------------------
  Promise para obter a lista de todos os pokémons do álbum do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getAlbum = new Promise((resolve, reject) =>{
  let url = 'http://127.0.0.1:5000/album_pokemon?id=1';
  fetch(url, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
      resolve(data.pokemons);
    })
    .catch((error) => {
      console.error('Error:', error);
      reject(error);
    });
});


/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
const startAlbum = async () => {
  all_pokemons = await getAllPokemon;
  my_album = await getAlbum;
  updateAlbumTable();
}


/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
let all_pokemons;
let my_album;
startAlbum();


/*
  --------------------------------------------------------------------------------------
  Função para colocar um pokémon no álbum do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postAlbumPokemon = async (pokemonId) => {
  const formData = new FormData();
  formData.append('pokemon_id', pokemonId);
  formData.append('album_id', 1);

  let url = 'http://127.0.0.1:5000/album_pokemon';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      my_album = data.pokemons;
      updateAlbumTable();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um pokémon do álbum de acordo com o click no botão X
  --------------------------------------------------------------------------------------
*/
const removePokemonAlbum = (pokemonId) => {
  my_album = my_album.filter(pokemon => pokemon.id != pokemonId);
  updateAlbumTable();
  
  let url = 'http://127.0.0.1:5000/album_pokemon?pokemon_id=' + pokemonId;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para pegar pokémons aleatoriamente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getPacotePokemon = async (inputQtde) => {
  let url = 'http://127.0.0.1:5000/pacote_pokemons?qtde=' + inputQtde;
  fetch(url, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
      showCards(data);
      updateClickPokeball(false);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para habilitar e desabilitar a pokébola de conseguir obter novas figurinhas
  --------------------------------------------------------------------------------------
*/
const updateClickPokeball = (available) => {
  if (available) {
    var pokebola = document.getElementById("pokebola");
    pokebola.classList.add("pokebolaAvailable");
    pokebola.classList.remove("pokebolaUnavailable");
    pokebola.setAttribute('onclick', "getPacotePokemon(5)");
    
    var tipPokebola = document.getElementById("tipPokebola");
    tipPokebola.classList.add("showDisplay");
    tipPokebola.classList.remove("hideDisplay");
    
    var tipCard = document.getElementById("tipCard");
    tipCard.classList.add("hideDisplay");
    tipCard.classList.remove("showDisplay");
  } else {
    var pokebola = document.getElementById("pokebola");
    pokebola.classList.remove("pokebolaAvailable");
    pokebola.classList.add("pokebolaUnavailable");
    pokebola.removeAttribute("onclick");
    
    var tipPokebola = document.getElementById("tipPokebola");
    tipPokebola.classList.remove("showDisplay");
    tipPokebola.classList.add("hideDisplay");
    
    var tipCard = document.getElementById("tipCard");
    tipCard.classList.remove("hideDisplay");
    tipCard.classList.add("showDisplay");
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir cards pokémon na lista de cards disponíveis
  --------------------------------------------------------------------------------------
*/
const showCards = (data) => {
  const cards = document.querySelectorAll('.column');
  for (var i = 0; i < cards.length; i++) {
    repeated_pokemon = my_album.some( (pokemon) => {return pokemon.id === data.pokemons[i].id;});

    let plan_html = '<div class="card" onclick="' 
                      + ((repeated_pokemon) ? 'removeCard(this)"' : ('saveCard(this, ' + data.pokemons[i].id + ')"'))
                      + '"><div class="img-pokemon"><div class="img-center">\
                      <img src="img/pokemon/' + data.pokemons[i].id + '.svg" alt="pokeball">\
                      </div></div><h3>#' + data.pokemons[i].id + '<br>' + data.pokemons[i].nome + '</h3>\
                      <div class="tipos">';

    data.pokemons[i].tipos.forEach(tipo => {plan_html += '<p>' + tipo.nome + '</p>';});
    
    plan_html += '</div><div class="action-card ';
    
    if (repeated_pokemon) {
      plan_html += 'repeated_pokemon"><h3>REPETIDO<br><br>CLIQUE PARA DESCARTAR</h3></div></div>';
    } else {
      plan_html += 'new_pokemon"><h3>NOVO<br><br>CLIQUE PARA SALVAR</h3></div></div>';
    }

    cards[i].innerHTML = plan_html;
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir cards pokémon na lista de cards no álbum
  --------------------------------------------------------------------------------------
*/
const saveCard = (card, pokemonId) => {
  card.remove();
  postAlbumPokemon(pokemonId);
  if (document.getElementsByClassName("card").length === 0) {
    updateClickPokeball(true);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para remover card pokémon da lista de cards disponíveis
  --------------------------------------------------------------------------------------
*/
function removeCard(card) {
  card.remove();
  if (document.getElementsByClassName("card").length === 0) {
    updateClickPokeball(true);
  }
}
