let fetch = require("node-fetch");

const createRequest = (input, callback) => {
    let api_url = 'https://api.coincap.io/v2/rates/ethereum';
    //let dec_pre = input['data']['decimal_precision'] || 2
    let first_try_val
    let first_try_statusCode
    let response_vals = []
    let response_vals_statusCode

    // define options to send via request()
    const options = {
        url: api_url,
        json: true,
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getAPI() {
      let resp = await fetch(api_url)
      let payload = await resp.json()
      return [resp, payload]
    }

    async function buildVals() {
      for (let i=0; i<20; i++) {
        await getAPI()
        .then(result => {
          if (result[0].status >= 400 || result[0].body.error == "Error") {
              console.log('error')
          } else {
              response_vals_statusCode = result[0].status
              response_vals.push(Number(parseFloat(result[1]['data']['rateUsd']).toFixed(2)))
          }
        })
        await sleep(50)
      }
      return response_vals
    }

    async function buildVals2() {
        await getAPI()
        .then(result => {
          if (result[0].status >= 400 || result[0].body.error == "Error") {
              console.log('error')
          } else {
              response_vals_statusCode = result[0].status
              response_vals.push(Number(parseFloat(result[1]['data']['rateUsd']).toFixed(2)))
          }
        })
      return response_vals
    }

    buildVals2().
    then(() => {
      if (response_vals_statusCode >= 400) {
        callback(response_vals_statusCode, {
          jobRunID: input.id,
          status: "errored",
          error: "something didn't go well",
          statusCode: response_vals_statusCode
        })
      } else {
        console.log((response_vals.reduce((a, b) => a + b) / response_vals.length).toFixed(2))
        callback(200, {
          jobRunID: input.id,
          data: (response_vals.reduce((a, b) => a + b) / response_vals.length).toFixed(2).toString(),
          statusCode: 200
        })
      }
    })

    /**
    buildVals().
    then(() => {
      console.log((response_vals.reduce((a, b) => a + b) / response_vals.length).toFixed(2))
      callback(response_vals_statusCode, {
        jobRunID: input.id,
        data: (response_vals.reduce((a, b) => a + b) / response_vals.length).toFixed(2),
        statusCode: response_vals_statusCode
      })
    })
**/

/**
    // given the response vals, do something with them
    // if first_try_val is not undefined or null, send that back
    if (first_try_val !== null && first_try_val !== undefined) {
        callback(first_try_statusCode, {
            jobRunID: input.id,
            data: first_try_val,
            statusCode: first_try_statusCode
        });
    } else if (response_vals.length > 0) {
        // otherwise, take an average of the returned values
        // (can make fancier logic later but do this for now)
        callback(response_vals_statusCode, {
            jobRunID: input.id,
            data: response_vals.reduce((a, b) => a + b) / response_vals.length,
            statusCode: response_vals_statusCode
        });
    }
    // for now, if nothing came through cleanly, just do nothing
    // contract will need to re-trigger this function
**/


}


// boilerplate for serverless systems - may need modification
exports.gcpservice = (req, res) => {
    createRequest(req.body, (statusCode, data) => {
        res.status(statusCode).send(data);
    });
};

exports.handler = (event, context, callback) => {
    createRequest(event, (statusCode, data) => {
        callback(null, data);
    });
}

module.exports.createRequest = createRequest;
