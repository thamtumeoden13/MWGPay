
function arrayBufferToBase64String(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer)
    var byteString = ''
    for (var i=0; i<byteArray.byteLength; i++) {
      byteString += String.fromCharCode(byteArray[i])
    }
    return btoa(byteString)
  }
  function base64StringToArrayBuffer(b64str) {
    var byteStr = atob(b64str)
    var bytes = new Uint8Array(byteStr.length)
    for (var i = 0; i < byteStr.length; i++) {
      bytes[i] = byteStr.charCodeAt(i)
    }
    return bytes.buffer
  }
  function textToArrayBuffer(str) {
    var buf = unescape(encodeURIComponent(str)) // 2 bytes for each char
    var bufView = new Uint8Array(buf.length)
    for (var i=0; i < buf.length; i++) {
      bufView[i] = buf.charCodeAt(i)
    }
    return bufView
  }
  function arrayBufferToText(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer)
    var str = ''
    for (var i=0; i<byteArray.byteLength; i++) {
      str += String.fromCharCode(byteArray[i])
    }
    return str
  }
  function arrayBufferToBase64(arr) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(arr)))
  }

function stringToArrayBuffer(str){
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  
  function arrayBufferToString(byteArray){
    //var byteArray = new Uint8Array(str);
    var byteString = '';
    for(var i=0; i < byteArray.byteLength; i++) {
        byteString += String.fromCodePoint(byteArray[i]);
    }
    return byteString;
  }

  String.prototype.replaceAll = function(f,r){return this.split(f).join(r);}

  function Base64UrlDecode(str)
  {
      let rs = str;
      //rs = rs.replaceAll("-", "+"); // 62nd char of encoding
      //rs = rs.replaceAll("_", "/"); // 63rd char of encoding
    /*switch (rs.Length % 4) // Pad with trailing '='s
    {
        case 0: break; // No pad chars in this case
        case 2: rs += "=="; break; // Two pad chars
        case 3: rs += "="; break; // One pad char
        
            
    }*/
    return rs;
  }

export function GenRSAKey(keysize)
{
    return new Promise((resolve, reject) => {
        
        window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: keysize, //can be 1024, 2048, or 4096
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            true, //whether the key is extractable (i.e. can be used in exportKey)
            ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
        )
        .then(function(key){
            //returns a keypair object
            //console.log(key);
            //console.log(key.publicKey);
            //console.log(key.privateKey);
            //publicKey= key.publicKey;
    
            window.crypto.subtle.exportKey(
              "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
              key.privateKey //can be a publicKey or privateKey, as long as extractable was true
          )
          .then(function(keydata){

            //console.log(JSON.stringify(keydata));
    
            const rsapublickeyxml = "<RSAKeyValue><Modulus>" + Base64UrlDecode(keydata.n)
            + "</Modulus><Exponent>" + Base64UrlDecode(keydata.e) + "</Exponent></RSAKeyValue>";
            const rsaprivatekeyxml = "<RSAKeyValue><Modulus>" + Base64UrlDecode(keydata.n)
      + "</Modulus><Exponent>" + Base64UrlDecode(keydata.e)
      + "</Exponent><P>" + Base64UrlDecode(keydata.p)
      + "</P><Q>" + Base64UrlDecode(keydata.q) 
      + "</Q><DP>" + Base64UrlDecode(keydata.dp)
      + "</DP><DQ>" + Base64UrlDecode(keydata.dq)
      + "</DQ><InverseQ>" + Base64UrlDecode(keydata.qi)
      + "</InverseQ><D>" + Base64UrlDecode(keydata.d)
      + "</D></RSAKeyValue>";
      //return keydata;
           const rsaKeyResult = {PublicKey: rsapublickeyxml, 
                PrivateKey: rsaprivatekeyxml,
                Modulus: keydata.n,
                Exponent: keydata.e,
                P: keydata.p,
                Q: keydata.q,
                DP: keydata.dp,
                DQ: keydata.dq,
                InverseQ: keydata.qi,
                D: keydata.d
      
              
              };
              //console.log(rsaKeyResult);
              resolve(rsaKeyResult);   
              //return rsaKeyResult;
           
          })
          .catch(function(err){
              console.error(err);
          });
    
            
    
            
        })
        .catch(function(err){
            console.error(err);
        });

      });



    
    //return rsaKeyResult;
}

export function ExportRSAKeyToPkcs8(key)
{
    return new Promise((resolve, reject) => {
    window.crypto.subtle.exportKey(
        "pkcs8", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        key //can be a publicKey or privateKey, as long as extractable was true
    )
    .then(function(keydata){
        //returns the exported key data
        
        //console.log(keydata);
        resolve(arrayBufferToBase64String(keydata));
    })
    .catch(function(err){
        //console.error(err);
    });
});
}

export function ExportRawRSAPublicKey(key)
{
    return new Promise((resolve, reject) => {
    window.crypto.subtle.exportKey(
        "spki", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        key //can be a publicKey or privateKey, as long as extractable was true
    )
    .then(function(keydata){
        //returns the exported key data
        
       // console.log(keydata);
        resolve(arrayBufferToBase64String(keydata));
    })
    .catch(function(err){
        //console.error(err);
    });
});
}

export function GenRSAKey2(keysize)
{
    return new Promise((resolve, reject) => {
        
        window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: keysize, //can be 1024, 2048, or 4096
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            true, //whether the key is extractable (i.e. can be used in exportKey)
            ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
        )
        .then(function(key){
           
            resolve(key);
            
        })
        .catch(function(err){
            console.error(err);
        });

      });
}




export function RSAEncryptString(inputString, RSAKey)
{
    const data = stringToArrayBuffer(inputString);
    //console.log(data);
    return new Promise((resolve, reject) => {
    window.crypto.subtle.importKey(
        "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        {   //this is an example jwk key, other key types are Uint8Array objects
            kty: "RSA",
            e: RSAKey.Exponent,
            n: RSAKey.Modulus,
            alg: "RSA-OAEP-256",
            ext: true,
        },
        {   //these are the algorithm options
            name: "RSA-OAEP",
            hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt"] //"encrypt" or "wrapKey" for public key import or
                    //"decrypt" or "unwrapKey" for private key imports
    )
    .then(function(publicKey){
        //returns a publicKey (or privateKey if you are importing a private key)
        //console.log(publicKey);
        window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
                //label: Uint8Array([...]) //optional
            },
            publicKey, //from generateKey or importKey above
            data //ArrayBuffer of data you want to encrypt
        )
        .then(function(encrypted){
            //returns an ArrayBuffer containing the encrypted data
           // console.log(new Uint8Array(encrypted));
            //const encryptedBytes = new Uint8Array(encrypted);

           // resolve(encryptedBytes);   
            const encryptedString = arrayBufferToBase64String(encrypted); 
            //console.log(encryptedString);
            resolve(encryptedString);   
             
        })
        .catch(function(err){
            
            console.error(err);
            reject(err);
        });

    })
    .catch(function(err){
        console.error(err);
        reject(err);
    });
});
}

export function RSADecryptString(inputString, RSAKey)
{
    const data = base64StringToArrayBuffer(inputString);
    // console.log(data);
    // console.log('D: '+ RSAKey.D);
    // console.log('dp: '+ RSAKey.DP);
    // console.log('dq: '+ RSAKey.DQ);
    // console.log('e: '+ RSAKey.Exponent);
    // console.log('n: '+ RSAKey.Modulus);
    // console.log('q: '+ RSAKey.Q);
    // console.log('q: '+ RSAKey.InverseQ);
    return new Promise((resolve, reject) => {
    window.crypto.subtle.importKey(
        "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        {   //this is an example jwk key, other key types are Uint8Array objects
           
            
            
            
           /* alg:"RSA-OAEP-256",
            d:"CEKHW29ZaR5LowlPFmxc5TpwglCPkBXmgLZS1m8IJpHTge9lgH1NGMelKKetzrE3J5s7m4GFp3COqmmlJZvvMTByIwQDktW2t-U0hX0FP4tciv1m45YDJEoMqQ0GprzJnfXrOjmDw02b5Sp0frHZhLcYnWiiLz6GMlkccbohDDE",
            dp:"ObVgWy29sNHkgL9LlejpMHTkYoBsr16pXl69Gk8EwuiUuhVZ7k7XN07F7AB7Akivmaxc2p4fzNQAHHxscVnT1w",
            dq:"iGrDHuC67xJjKiiNMZNk1xB3zX69l9vO5wVik5I-QFbW5ytm7E7-WlWtJ6brq_4S1mr7T02Leo0m4XJZTRgbmQ",
            e:"AQAB",
            kty:"RSA",
            n:"h86mmMWcGKS4igP9ae-Dw1Q-_R1HVL4Dw66IuA9Ssih3cVnABlh5pZ6Aucq5HqL-IEQHHLeAIEEhdY0jRpaYKYKM0PvFldPKtgsAA1DzPH1PqaGIAJKh1KwWKZhZL5IiCEcPUGNgOof1qw5IUxAjFGIjkThB-J6pN0-8IbEZn98","p":"vd7_K_fWV0KT6N0cZ9nX8eO16bmWBPPWrlowXOVsQHuu9qhWGrdrGRmUGqkLDLuCivtKQkcaWJl3Lu4BlzvKSw",
            q:"txtLDvaKWqZYFkrOJjGiKUfVyvP9DnfEXoY2Ak-vD1jYgkr3aQeNtQtwErqRNRnSSF1LYFzBMtR6rm8lt0vEPQ",
            qi:"V01pNzEl8UIhTniKJg7Fqd3sflf_E1L9EAu9MoNnkC-I1KGJiC0uZjXPXCBcc5mrbVcWiZb805E6pNCouZo0Hg"*/


            kty: "RSA",
            e: RSAKey.Exponent,
            n: RSAKey.Modulus,
            p: RSAKey.P,
            q: RSAKey.Q,
            dp: RSAKey.DP,
            dq: RSAKey.DQ,
            qi: RSAKey.InverseQ,
            d: RSAKey.D,
            alg: "RSA-OAEP-256"
        },
        {   //these are the algorithm options
            name: "RSA-OAEP",
            hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["decrypt"] //"encrypt" or "wrapKey" for public key import or
                    //"decrypt" or "unwrapKey" for private key imports
    )
    .then(function(privateKey){
        //returns a publicKey (or privateKey if you are importing a private key)
        //console.log(privateKey);
        window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
                //label: Uint8Array([...]) //optional
            },
            privateKey, //from generateKey or importKey above
            data //ArrayBuffer of data you want to encrypt
        )
        .then(function(decrypted){
            //returns an ArrayBuffer containing the encrypted data
           // console.log(new Uint8Array(decrypted));
            const decryptedBytes = new Uint8Array(decrypted);
            const decryptedString = arrayBufferToString(decryptedBytes); 
            //console.log(decryptedString);
            resolve(decryptedString);   
             
        })
        .catch(function(err){
            
            console.error(err);
            //reject(err);
        });

    })
    .catch(function(err){
        console.error(err);
        //reject(err);
    });
});
}

export function RSAEncryptString2(inputString, publicKey)
{
    const data = stringToArrayBuffer(inputString);
    return new Promise((resolve, reject) => {
    
        //console.log(publicKey);
        window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
                //label: Uint8Array([...]) //optional
            },
            publicKey, //from generateKey or importKey above
            data //ArrayBuffer of data you want to encrypt
        )
        .then(function(encrypted){
            //returns an ArrayBuffer containing the encrypted data
            //console.log(new Uint8Array(encrypted));
            //const encryptedBytes = new Uint8Array(encrypted);
            const encryptedString = arrayBufferToBase64String(encrypted); 
            //const encryptedString = arrayBufferToString(encryptedBytes); 
            //console.log(encryptedString);
            resolve(encryptedString);   
             
        })
        .catch(function(err){
            
            console.error(err);
            reject(err);
        });

});
}

export function RSADecryptString2(inputString, privateKey)
{
    //const data = stringToArrayBuffer(inputString);
    //console.log(data);
    //console.log(RSAKey);
    const data = base64StringToArrayBuffer(inputString);
    return new Promise((resolve, reject) => {
    
        //console.log(privateKey);
        window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
                //label: Uint8Array([...]) //optional
            },
            privateKey, //from generateKey or importKey above
            data //ArrayBuffer of data you want to encrypt
        )
        .then(function(decrypted){
            //returns an ArrayBuffer containing the encrypted data
            
            const decryptedBytes = new Uint8Array(decrypted);
            //console.log(decryptedBytes);
            const decryptedString = arrayBufferToString(decryptedBytes); 
            //console.log(decryptedString);
            resolve(decryptedString);   
             
        })
        .catch(function(err){
            
            console.error(err);
            //reject(err);
        });
    
});
}


export function ImportRSAPkcs8Key(key)
{
    const keyBuffer = base64StringToArrayBuffer(key);
    const keyData = new Uint8Array(keyBuffer);
    //console.log(keyBuffer);
    return new Promise((resolve, reject) => {
    window.crypto.subtle.importKey(
        "pkcs8", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        keyBuffer,
        {   //these are the algorithm options
            name: "RSA-OAEP",
            hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["decrypt"] //"encrypt" or "wrapKey" for public key import or
                    //"decrypt" or "unwrapKey" for private key imports
    )
    .then(function(privateKey){
        //returns a publicKey (or privateKey if you are importing a private key)
        console.log(privateKey);
        resolve(privateKey);
    })
    .catch(function(err){
        console.error(err);
    });
    });
}

export function ImportPublicKey(key)
{
    const keyBuffer = base64StringToArrayBuffer(key);
    const keyData = new Uint8Array(keyBuffer);
    //console.log(keyBuffer);
    return new Promise((resolve, reject) => {
    window.crypto.subtle.importKey(
        "spki", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        keyBuffer,
        {   //these are the algorithm options
            name: "RSA-OAEP",
            hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt"] //"encrypt" or "wrapKey" for public key import or
                    //"decrypt" or "unwrapKey" for private key imports
    )
    .then(function(publicKey){
        //returns a publicKey (or privateKey if you are importing a private key)
        //console.log(publicKey);
        resolve(publicKey);
    })
    .catch(function(err){
        //console.error(err);
    });
    });
}

export default {GenRSAKey, GenRSAKey2,RSAEncryptString,RSADecryptString, RSAEncryptString2, RSADecryptString2, ExportRSAKeyToPkcs8, ExportRawRSAPublicKey, ImportRSAPkcs8Key, ImportPublicKey};