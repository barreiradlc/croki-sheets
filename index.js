const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const getCards = require('./getTrello')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatica   lly when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);

  console.log('cont')
  console.log(JSON.parse(content))
  console.log('cont')

  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  
  const sheets = google.sheets({ version: 'v4', auth });
  
  const Promise = require('promise');
  
  
  
  getCards()
    .then(( res ) => {
      console.log(res)
      append(sheets, '1jTiYgrsS3B1Au3W3A-ri8JVj4szPoeSjiS6aJs-kG0g','Página1!A1','INSERT_ROWS','USER_ENTERED', res)
    })
    .catch(( err ) => {
      console.debug(err)
    })
  // show(sheets, '1yXKXmPdEqS7aUovn-iouI7yeqF_wekBh1aZhQdJWvg4', 'Class Data!A1:E')
  // create(sheets, 'Teste Croki 123 reunião de uqarta feira')
  // update(sheets, '1RqCPRcW6lP8bCEKJIcjH8mEWJuOkVAoIaUoJTCHTS1o','Teste Croki')
  // append(sheets, '1yXKXmPdEqS7aUovn-iouI7yeqF_wekBh1aZhQdJWvg4','Página1!A1','INSERT_ROWS','RAW', cards)
}

async function append(sheets, spreadsheetId, range, insertDataOption, valueInputOption, _values) {
  console.log(_values)
  
  let values = [
    
      ["3", "Nome"],
      ["CEO", "Johnatan"]
      // Cell values ...
    
    // Additional rows ...
  ];
  // values = _values;


  return new Promise((resolve, reject) => {
    // [START sheets_append_values]

    // [START_EXCLUDE silent]
    console.log(JSON.stringify(_values))
    console.log('---------------------')
    // [END_EXCLUDE]
    let resource = {
      values,
    };
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      insertDataOption,
      valueInputOption,
      resource,
    }, (err, result) => {
      if (err) {
        // Handle error.
        console.log(err);
        // [START_EXCLUDE silent]
        reject(err);
        // [END_EXCLUDE]
      } else {
        console.log("-------------------------------------------");
        console.log(JSON.stringify(result));
        // console.log(`${result.updatesupdates.updatedCells} cells appended.`);
        // [START_EXCLUDE silent]
        resolve(result);
        // [END_EXCLUDE]
      }
    });
    // [END sheets_append_values]
  });
}

function update(sheets, spreadsheetId, title, find, replacement) {
  return new Promise((resolve, reject) => {
    // [START sheets_batch_update]
    let requests = [];
    // Change the spreadsheet's title.
    requests.push({
      updateSpreadsheetProperties: {
        properties: {
          title,
        },
        fields: 'title',
      },
    });
    // Find and replace text.
    requests.push({
      findReplace: {
        find,
        replacement,
        allSheets: true,
      },
    });
    // Add additional requests (operations) ...
    const batchUpdateRequest = {requests};
    sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: batchUpdateRequest,
    }, (err, response) => {
      if (err) {
        // Handle error
        console.log(err);
        // [START_EXCLUDE silent]
        return reject(err);
        // [END_EXCLUDE]
      } else {
        const findReplaceResponse = response.replies[1].findReplace;
        console.log(`${findReplaceResponse.occurrencesChanged} replacements made.`);
      }
      // [START_EXCLUDE silent]
      resolve(response);
      // [END_EXCLUDE]
    });
    // [END sheets_batch_update]
  });
}

function show(sheets, spreadsheetId, range) {
  sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      // console.log('Name, Major:');
      console.log('---------------');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[2]} ${row[3]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}
function create(sheets, title) {
  console.log(`create ${title}`)

  const resource = {
    properties: {
      title,
    },
  };


  return new Promise((resolve, reject) => {

    sheets.spreadsheets.create({
      resource,
      fields: 'spreadsheetId',
    }, (err, spreadsheet) => {
      if (err) {
        // Handle error.
        console.log(err);
        // [START_EXCLUDE silent]
        reject(err);
        // [END_EXCLUDE],
      } else {
        console.log(JSON.stringify(spreadsheet));
        console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
        // [START_EXCLUDE silent]
        resolve(spreadsheet.spreadsheetId);
        // [END_EXCLUDE]
      }
    });
  });
}
