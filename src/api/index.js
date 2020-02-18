import { getUniqueID, getErrorMessage } from "./../utils/index";
import { ModelMovie, ModelComment } from "./adapter";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const delay = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const API = class {
  constructor({ endPoint, authorization }) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  static toJSON(response) {
    return response.json();
  }

  static checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      const contentType = response.headers.get(`content-type`);
      if (!contentType || !contentType.includes(`application/json`)) {
        throw new Error(`Oops, something went wrong!`);
      }
      return response.json().then(error => {
        throw new Error(getErrorMessage(error));
      });
    }
  }

  getMovies() {
    return delay(3000)
      .then(() => {
        return this._load({ url: `movies` });
      })
      .then(API.toJSON)
      .then(ModelMovie.parseMoviesList);
  }

  updateMovie(movie) {
    return delay(3000)
      .then(() => {
        return this._load({
          url: `movies/${movie.id}`,
          method: Method.PUT,
          body: JSON.stringify(ModelMovie.convertToRAW(movie)),
          headers: new Headers({ "Content-Type": `application/json` })
        });
      })
      .then(API.toJSON)
      .then(ModelMovie.parseMovie);
  }

  getComments({ id }) {
    return delay(3000)
      .then(() => {
        return this._load({ url: `comments/${id}` });
      })
      .then(API.toJSON)
      .then(ModelComment.parseCommentsList);
  }

  createComment(id, data) {
    return delay(3000)
      .then(() => {
        return this._load({
          url: `comments/${id}`,
          method: Method.POST,
          body: JSON.stringify(ModelComment.convertToRAW(data)),
          headers: new Headers({ "Content-Type": `application/json` })
        });
      })
      .then(API.toJSON)
      .then(ModelComment.parseComment);
  }

  deleteComment({ id }) {
    return delay(3000).then(() => {
      return this._load({ url: `comments/${id}`, method: Method.DELETE });
    });
  }

  _load({ url, method = Method.GET, body = null, headers = new Headers() }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, { method, body, headers })
      .then(API.checkStatus)
      .catch(error => {
        throw error;
      });
  }
};

const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
const AUTHORIZATION = `Basic ${getUniqueID()}`;
const api = new API({ endPoint: END_POINT, authorization: AUTHORIZATION });

export default api;
