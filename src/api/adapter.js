const Adapter = {
  RAW: `raw`,
  ADAPTER: `adapted`
};

class ModelMovie {
  constructor(data, adapter) {
    this._adapter = adapter;
    this._data = data;
  }

  _adapt() {
    return {
      id: this._data.id,
      comments: this._data.comments,
      title: this._data[`film_info`].title,
      alternativeTitle: this._data[`film_info`][`alternative_title`],
      poster: this._data[`film_info`].poster,
      director: this._data[`film_info`].director,
      starring: this._data[`film_info`].actors,
      writers: this._data[`film_info`].writers,
      releaseDate: new Date(this._data[`film_info`].release.date),
      country: this._data[`film_info`].release[`release_country`],
      duration: this._data[`film_info`].runtime,
      genresList: this._data[`film_info`].genre,
      rate: this._data[`film_info`][`total_rating`],
      description: this._data[`film_info`].description,
      ageRestriction: this._data[`film_info`][`age_rating`],
      personalRate: this._data[`user_details`][`personal_rating`],
      isWatched: this._data[`user_details`][`already_watched`],
      isFavorite: this._data[`user_details`].favorite,
      isInWatchList: this._data[`user_details`].watchlist,
      watchingDate: new Date(this._data[`user_details`][`watching_date`])
    };
  }

  _toRAW() {
    const {
      id,
      comments,
      title,
      alternativeTitle,
      poster,
      director,
      starring,
      writers,
      releaseDate,
      country,
      duration,
      genresList,
      rate,
      description,
      ageRestriction,
      personalRate,
      isWatched,
      isFavorite,
      isInWatchList,
      watchingDate
    } = this._data;
    return {
      id,
      comments,
      [`film_info`]: {
        title,
        [`alternative_title`]: alternativeTitle,
        poster,
        director,
        actors: starring,
        writers,
        release: {
          date: releaseDate,
          [`release_country`]: country
        },
        runtime: duration,
        genre: genresList,
        [`total_rating`]: rate,
        description,
        [`age_rating`]: ageRestriction
      },
      [`user_details`]: {
        [`personal_rating`]: personalRate,
        [`already_watched`]: isWatched,
        favorite: isFavorite,
        watchlist: isInWatchList,
        [`watching_date`]: watchingDate
      }
    };
  }

  static convertToRAW(data) {
    const movie = new ModelMovie(data, Adapter.RAW);
    return movie._toRAW();
  }

  static parseMovie(data) {
    const movie = new ModelMovie(data, Adapter.ADAPTED);
    return movie._adapt();
  }

  static parseMoviesList(data) {
    return data.map(ModelMovie.parseMovie);
  }
}

class ModelComment {
  constructor(data, adapter) {
    this._adapter = adapter;
    this._data = data;
  }

  _adapt() {
    return {
      id: this._data.id,
      text: this._data.comment,
      author: this._data.author,
      emoji: this._data.emotion,
      date: new Date(this._data.date)
    };
  }

  _toRAW() {
    const { id, text, author, emoji, date } = this._data;
    return {
      id,
      comment: text,
      author,
      emotion: emoji,
      date
    };
  }

  static convertToRAW(data) {
    const comment = new ModelComment(data, Adapter.RAW);
    return comment._toRAW();
  }

  static parseComment(data) {
    const comment = new ModelComment(data, Adapter.ADAPTED);
    return comment._adapt();
  }

  static parseCommentsList(data) {
    return data.map(ModelComment.parseComment);
  }
}

export { ModelMovie, ModelComment };
