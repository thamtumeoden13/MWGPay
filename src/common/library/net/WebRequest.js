export function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    withCredentials: true,
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'

    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
    .then(response => response.json()) // parses response to JSON 
    // .then(response => console.log({ response }))  // then log it out
    .catch((error) => {
     // console.log(error);
      return null
    })
}

export function postDataWithAuthenHeader(url, data, authenHeader) {
  // Default options are marked with *
  let _header = {
    'user-agent': 'Mozilla/4.0 MDN Example',
    'Access-Control-Allow-Origin': '*',
    'ClientID': authenHeader.ClientID,
    'AuthenData': authenHeader.AuthenData
  }
  if (!(data instanceof FormData)) {
    _header['Content-Type'] = 'application/json';
    data = JSON.stringify(data)
  }

  return fetch(url, {
    body: data, // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    withCredentials: true,
    headers: _header,
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
    .then(response => response.json()) // parses response to JSON
    // .then(text => console.log(text))  // then log it out
    .catch((error) => {
      //console.log(error);
      return null
    })
}


export default { postData, postDataWithAuthenHeader };