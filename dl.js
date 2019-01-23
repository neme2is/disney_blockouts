const axios = require('axios');
const _ = require('lodash');
const endpoint = 'https://blockoutdates.disney.com/data/en/parks-feed.json'
const today = new Date(Date.now())


async function getDates () {
  let res = await axios.get(endpoint);
  const DCA = _.find(res.data, {id: 26});
  const DL = _.find(res.data, {id: 25});
  let list=[];
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
  return new Date(date.replace(/(\d{4})(\d{2})(\d{2})/, `$1-$2-$3`))
};

function checkDate (start, today, end) {
  if (start < today && today < end) {
    console.log('y');
  } else {
    console.log('n');
  }
}


(async () => {
  const value = await getDates() 
  console.log(value);
})()
ascjrd0q4vvrjuemqc5peps88s

jlgmqjaer9cqfpdice4piv1jpo@group.calendar.google.com
