import axios from 'axios';

import { API_URL } from '../constants';

export const REQUEST_POST_BEER = 'POST_BEER'
export const RECEIVE_POST_BEER = 'RECEIVE_POST_BEER'

//TODO figure out if we want to keep this
export const receivePostBeerAction = json => ({
  type: RECEIVE_POST_BEER,
  beer: json,
  receivedAt: Date.now()
})

export const requestPostBeer = () => ({
  type: REQUEST_POST_BEER,
})

export const postBeer = beer => dispatch => {
  dispatch(requestPostBeer())
  beer.abv = parseFloat(beer.abv);
  beer.rating = parseFloat(beer.rating);
  let headers = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` };
  return axios.post(`${API_URL}/beer`, beer, {headers} )
    .then(res => {
       receivePostBeerAction(res.data);
    }
    ,err => console.log("Error Post:", err))
}
