const axios = require('axios');

const moment = require('moment');

const methods = {
  get: 'get',
  post: 'post',
  patch: 'patch',
  delete: 'delete',
};

const requestGenerator = (getBase) => (method, uri) => (data = {}) => {
  let requestPromise;
  switch (method) {
    case methods.get:
    case methods.delete:
      requestPromise = axios[method](`${getBase()}/${uri}`, {
        params: data,
      });
      break;
    default:
      requestPromise = axios[method](`${getBase()}/${uri}`, data);
      break;
  }
  return requestPromise
    .then(({ data }) => data)
    .catch(e => e.response.data);
};

const getApiBase = () => 'localhost:11236';
// const getApiBase = () => 'http://localhost:3030'
const r = requestGenerator(getApiBase);

const api = {
  getChargers: r('get', 'charger'),
  getLeviton: async () => {
    const res = await r('get', 'evr/leviton/evr?limit=300')();
    return {data: res.data.map(d => ({ ...d, time: moment(d.timestamp).format('MMM DD h:mma') })).reverse()};
  },
  charger: (chargerId) => ({
    getMeterValues: r('get', `charger/${chargerId}/meterValues`),
    getStatus: r('get', `charger/${chargerId}/status?recent=true`),
    getAllStatus: r('get', `charger/${chargerId}/status`),
    getChargeProfile: r('get', `charger/${chargerId}/profile/current`),
    getAllProfiles: r('get', `charger/${chargerId}/profile`),
    getTransactions: r('get', `charger/${chargerId}/transaction`),
  }),
  transactions: ({
    getTransactions: r('get', 'charger/transaction'),
  }),
  newflyer: ({
    getAll: r('get', 'bus'),
    specific: (busId) => ({
      getRoute: r('get', `bus/${busId}`),
      getAllRoutes: (numOfDays) => r('get', `bus/${busId}/route/useful?days=${numOfDays}`)(),
    }),
  }),
  
}

module.exports = api;
