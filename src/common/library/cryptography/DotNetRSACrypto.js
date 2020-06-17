import {System} from './DotNetJS/System.Security.Cryptography.RSA.js';
import {System_Security_Cryptography_SHA1} from './DotNetJS/System.Security.Cryptography.SHA1.js';
import {System_Security_Cryptography_SHA256} from './DotNetJS/System.Security.Cryptography.SHA256.js';
System.Security.Cryptography.SHA1 = System_Security_Cryptography_SHA1;
System.Security.Cryptography.SHA256 = System_Security_Cryptography_SHA256;

function toHexString(byteArray) {
	var s = '';
	byteArray.forEach(function(byte) {
	  s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
	});
	return s;
  }

export function HashingSHA1(plainText)
{
	var data = System.Text.Encoding.Unicode.GetBytes(plainText);
	var ha = new System.Security.Cryptography.SHA1();
	var hash = ha.ComputeHash(data);
	return toHexString(hash); 
	 
}

export function HashingSHA256(plainText)
{
	var data = System.Text.Encoding.Unicode.GetBytes(plainText);
	var ha = new System.Security.Cryptography.SHA256();
	var hash = ha.ComputeHash(data);
	return toHexString(hash); 
	 
}

export function GetNewRsaProvider(dwKeySize) {
    if (!dwKeySize) dwKeySize = 512;
    return new System.Security.Cryptography.RSACryptoServiceProvider(dwKeySize);
}

export function GenRSAKey(dwKeySize) {
    //var keySize = Number(document.frmTestRSA.cboRSAKeySize.value);
    var rsa = GetNewRsaProvider(dwKeySize);
    const publicKey = rsa.ToXmlString(false);
    const privateKey = rsa.ToXmlString(true);
    return { PublicKey: publicKey, PrivateKey: privateKey };

}

export function GetRSAKey(rsaKey,  includePrivateParameters) {
		
    var rsa = GetNewRsaProvider();
    // Import parameters from xml.
    rsa.FromXmlString(rsaKey);
    // Export RSA key to RSAParameters and include:
    //    false - Only public key required for encryption.
    //    true  - Private key required for decryption.
    return rsa.ExportParameters(includePrivateParameters);
}


export function encryptData(rsaKey, dwKeySize,  plainText)
	{
		    //var plainText = document.frmTestRSA.txtPlainText.value;
			var bytes = System.Text.Encoding.Unicode.GetBytes(plainText);
			//console.log('plain text byte2');
			//console.log(bytes);
			var doOaepPadding = true;
			// ------------------------------------------------
			// Encrypt
			// ------------------------------------------------
			var rsa = GetNewRsaProvider();
			// Import the RSA Key information.
			rsa.ImportParameters(GetRSAKey(rsaKey, false));
			const keySize = dwKeySize / 8;
			const maxLength = keySize - 42;
			const dataLength = bytes.length;
			const iterations = dataLength / maxLength;
			var sb =  new System.Text.StringBuilder(); 
            //console.log("maxLength",maxLength);
            //console.log("dataLength",dataLength);
            //console.log("iterations",iterations);
			 for (let i = 0; i <= iterations; i++)
            {			
				const tempLength = (dataLength - maxLength * i > maxLength) ? maxLength : dataLength - maxLength * i;
				//console.log(tempLength);
				var tempBytes = new Array(tempLength);    
				//console.log(tempBytes.length); 
				System.Buffer.BlockCopy(bytes, maxLength * i, tempBytes, 0, tempBytes.length);
				//console.log('tempBytes');
				//console.log("tempBytes",tempBytes);
				let encryptedBytes = rsa.Encrypt(tempBytes, doOaepPadding);
				//console.log('encrypted text byte2');
				//console.log("encryptedBytes",encryptedBytes);

				System.Array.Reverse(encryptedBytes);
				//console.log('encrypted text byte2 Reverse');
				//console.log(encryptedBytes);

                sb.Append(System.Convert.ToBase64String(encryptedBytes));
			}

			
			return sb.ToString();

	}
	
	export function decryptData(rsaKey, dwKeySize, encryptedText)
	{
		
			//var encryptedBytes = System.Convert.HexStringToBytes($("EncryptedTextBox").value);
			//var encryptData = document.frmTestRSA.txtEncryptedText.value;
			var rsa = GetNewRsaProvider();
			// Import the RSA Key information.
			rsa.ImportParameters(GetRSAKey(rsaKey, true));
			const doOaepPadding = true;
			//const base64BlockSize = parseInt(((dwKeySize / 8) % 3 != 0) ? (((dwKeySize / 8) / 3) * 4) + 4 : ((dwKeySize / 8) / 3) * 4);
			const base64BlockSize = parseInt(((Math.floor(dwKeySize / 8)) % 3 != 0) ? ((Math.floor((Math.floor(dwKeySize / 8)) / 3)) * 4) + 4 : (Math.floor((Math.floor(dwKeySize / 8)) / 3)) * 4);

			//const base64BlockSize1 = parseInt(((Math.floor(dwKeySize / 8) % 3 != 0) ? (((Math.floor(dwKeySize / 8)) / 3) * 4) + 4 : ((Math.floor(dwKeySize / 8)) / 3) * 4);
			
			//console.log(encryptedText.length);
			/*if(base64BlockSize > encryptedText.length )
				base64BlockSize = encryptedText.length;*/
			//console.log(base64BlockSize1);
			//console.log(base64BlockSize);
			const iterations = encryptedText.length / base64BlockSize;
			//console.log(iterations);
			//console.log("encryptedText.length:  " + encryptedText.length.toString());
			let lstencryptedBytes = new Array(0);
			for (let i = 0; i < iterations; i++)
            {
				const startIndex = base64BlockSize * i;
				let tempText = encryptedText.substr(startIndex, base64BlockSize);
				
				//console.log('----');
				//console.log("i: " + i.toString() + " - Start Index: " + startIndex.toString() +  " - tempText length: "+ tempText.length.ToString() + " -base64BlockSize: " + base64BlockSize.toString());
				//console.log('TextText:' + tempText) ;
				//console.log('----');
				
				let encryptedBytes = System.Convert.FromBase64String(tempText);
				//console.log('encrypted text byte2');
				//console.log(encryptedBytes);
				System.Array.Reverse(encryptedBytes);
				//console.log('encrypted text byte2 Reverse');
				//console.log(encryptedBytes);
				let decryptedBytes = rsa.Decrypt(encryptedBytes, doOaepPadding);
				//console.log('decryptedBytes');
				//console.log(decryptedBytes);
				lstencryptedBytes = lstencryptedBytes.concat(decryptedBytes);
				//console.log('lstencryptedBytes');
				//console.log(lstencryptedBytes);
			}
			
			

			
			const decryptedString = System.Text.Encoding.Unicode.GetString(lstencryptedBytes);
			return decryptedString;

	}
