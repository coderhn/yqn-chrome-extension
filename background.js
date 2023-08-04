// chrome.webRequest.onCompleted.addListener(
//   (details, callback) => {
//     console.log('An authorization request has been detected');
//     if (details.url == 'https://httpbin.org/basic-auth/guest/guest') {
//       // Creating some credentials
//       const username = 'guest';
//       const password = 'guest';
//       // Creating an auth handler to use the credentials
//       const authCredentials = {
//         authCredentials: {
//           username: username,
//           password: password
//         }
//       };
//       callback(authCredentials);
//     }
//   },
//   { urls: ['https://httpbin.org/basic-auth/guest/guest'] },
//   ['asyncBlocking']
// );
