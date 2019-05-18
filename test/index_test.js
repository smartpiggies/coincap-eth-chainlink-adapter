const assert = require('chai').assert;
const createRequest = require('../fetchtest.js').createRequest;

describe('createRequest', () => {

  context('Requests data', () => {
    // The value here doesn't matter, we just want to be sure that the adapter returns the same
    const jobID = "278c97ffadb54a5bbb93cfec5f7b5503";
    // Update the parameters in the data to match actual requests for the target API
    const req = {
      id: jobID,
      data: {
        decimal_precision: 2
      }
    };

    it('Should return data to the node', function () {
      createRequest(req, (statusCode, data) => {
        //assert.equal(statusCode, 200);
        assert.equal(statusCode, "good", "statusCode did not return correctly");
        assert.equal(data.jobRunID, jobID, "jobID did not return correctly");
        //assert.isNotEmpty(data.data, "data did not return correctly");
        console.log(data.data)
      }) //end request

    }) //end test
  })
})
