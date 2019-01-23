const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const _ = require('lodash');
const {google} = require('googleapis');
const disneyCal = process.env.disneyCal;
const calendarId = process.env.calendarId;
const calIdTest = process.env.calIdTest;
const token = {
  "access_token": process.env.access_token,
  "refresh_token": process.env.refresh_token,
  "scope": process.env.scope,
  "token_type": process.env.token_type,
  "expiry_date": process.env.expiry_date,
}
const oAuth2Client = new google.auth.OAuth2(
  process.env.client_id, process.env.client_secret, process.env.redirect_uris);
oAuth2Client.setCredentials(token);
const calendar = google.calendar({version: 'v3', auth: oAuth2Client});

async function getDates () {
  let list = [];
  let res = await axios.get(disneyCal);
  const DCA = _.find(res.data, {id: 26});
  const DL = _.find(res.data, {id: 25});
  const blockouts = _.find(DCA, 'blockouts');
  // console.log(blockouts.blockouts);
  _.forEach(blockouts.blockouts, function(value) {
    if (_.find(value.passes, {term_id: 12})) {
      // console.log(value.passes);
      list.push({start:value.start_date, end:value.end_date});
    }
  })
  // console.log(list);
  return list
}


function dateFormat (date) {
  return date.replace(/(\d{4})(\d{2})(\d{2})/, `$1-$2-$3`)
};

function checkDate (start, today, end) {
  if (start < today && today < end) {
    console.log('y');
  } else {
    console.log('n');
  }
}

function writeToCal (start_date, end_date) {
  calendar.events.insert({
    calendarId: calIdTest,
    resource: {
      "end": {
        "dateTime": `${end_date}T22:00:00-08:00`,
      },
      "start": {
        "dateTime": `${start_date}T7:00:00-08:00`,
      },
      "summary": "Disneyland Blocked",
    }
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err + start_date + end_date);
    const events = res.data;
    if (events) {
      console.log(`Event created: ${events.id}  end: ${end_date}`);
      console.log(events.start)
      console.log(events.end)
    } else {
      console.log('No upcoming events found.');
    }
  });  
}


(async () => {
  const value = await getDates() 
  // console.log(value);
  _.forEach(value, function(date) {
    let end = dateFormat(date.end);
    let start = dateFormat(date.start);
    console.log(`end date: ${end} and start: ${start}`)
    writeToCal(start, end);
  })
})()
