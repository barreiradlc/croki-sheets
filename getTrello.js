// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
const fetch = require('node-fetch');

var key = 'de5f56260543681c187e83d60699cc36'
// let id = 'mkxuMaLT'
let id = 'mkxuMaLT'

function getCards(){
  // fetch(`https://api.trello.com/1/actions/${id}/board`, {
  //   method: 'GET',
  //   headers: {
  //     'Accept': 'application/json'
  //   }
  // })
  return fetch(`https://api.trello.com/1/boards/${id}?key=${key}&cards=open&lists=open`, {
    method: 'GET'
  })
  .then(res => res.json())
  .catch(err => console.error(err));
    .then(response => {
      console.log(
        `Response: ${response.status} ${response.statusText}`
      );
      console.log('------------')
      console.log(response)
      console.log(response.text())
      console.log(response.json())
      console.log('------------')
      return response.json();
    })

}




module.exports = getCards;