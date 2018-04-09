import favoriteGifs from '../actions/favoriteGifs';

const initialState = {
  fetching: false,
  selected2Add: {},
  selectedID2remove: '',
  data: [],
  pagination: {
    offset: 1,
    total_count: 0,
    count: 0,
    pages: 0
  },
  query: '',
  error: ''
};

const selectorTotalPages = ({total_count, count}) => 
  total_count > 0 ? Math.ceil(total_count / count) : 0;

const favoriteGifsReducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case favoriteGifs.types.GET_FAVORITE_GIFS_REQUESTED: {
      //console.log(JSON.stringify(action, null, 2), 'GET_FAVORITE_GIFS_REQUESTED');
      const newState = {...state};
      const newPagination = { ...newState.pagination };
      const { total_count } = newPagination;

      newPagination.pages = total_count > 0 
        ? selectorTotalPages(newPagination)
        : newState.pagination.pages;

      const movePrevious = action.payload && action.payload.movePrevious;
      if (movePrevious) {
        action.payload.offset = newState.pagination.offset - 1;
        action.payload.offset = action.payload.offset < 1 ? 1 : action.payload.offset;
        delete(action.payload.movePrevious);
      }

      const moveNext = action.payload && action.payload.moveNext;
      if (moveNext) {
        action.payload.offset = newState.pagination.offset + 1;
        if (total_count > 0) {
          const lastPage = selectorTotalPages(newPagination);
          action.payload.offset = action.payload.offset > lastPage 
            ? lastPage 
            : action.payload.offset;
        }
        delete(action.payload.moveNext);
      }

      const moveLast = action.payload && action.payload.moveLast;
      if (moveLast && total_count > 0) {
        const lastPage = selectorTotalPages(newPagination);
        action.payload.offset = lastPage;
        delete(action.payload.moveLast);
      }

      newState.query = action.payload && typeof(action.payload.query) !== 'undefined'
        ? action.payload.query 
        : newState.query;
      newState.pagination = {...newPagination, ...action.payload};

      const newStateRet = {
        ...newState,
        fetching: true
      };
      // console.log(JSON.stringify(newStateRet, null, 2), 'GET_FAVORITE_GIFS_REQUESTED');
      return newStateRet;
    }
    case favoriteGifs.types.GET_FAVORITE_GIFS_COMPLETED: {
      //console.log(JSON.stringify(action, null, 2), 'GET_FAVORITE_GIFS_COMPLETED');
      action.payload.pagination.pages  = selectorTotalPages(action.payload.pagination);
      const newState = {
        ...state,
        fetching: false,
        ...action.payload,
      };

      console.log(JSON.stringify(newState, null, 2), 'GET_FAVORITE_GIFS_COMPLETED');
      return newState;
    }
    case favoriteGifs.types.GET_FAVORITE_GIFS_FAILED: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }

    case favoriteGifs.types.ADD_FAVORITE_GIF_REQUESTED: {
      const newState = {...state};
      const newSelected2Add = { ...newState.selected2Add };
      newSelected2Add.saving = true;

      newState.selected2Add = {...newSelected2Add, ...action.payload};
      return {
        ...newState
      };
    }
    case favoriteGifs.types.ADD_FAVORITE_GIF_COMPLETED: {
      const newState = {...state};
      const newSelected2Add = { ...newState.selected2Add };
      newSelected2Add.saving = false;
      newState.selected2Add = newSelected2Add;
      newState.data = newState.data.filter(d => d.id !== action.payload.id);
      newState.data = [...[action.payload], ...newState.data];
      return {
        ...newState
      };
    }
    case favoriteGifs.types.ADD_FAVORITE_GIF_FAILED: {
      const newState = {...state};
      const newSelected2Add = { ...newState.selected2Add };
      newSelected2Add.saving = false;
      newSelected2Add.error = action.error;
      newState.selected2Add = newSelected2Add;

      return {
        ...newState
      };
    }

    case favoriteGifs.types.REMOVE_FAVORITE_GIF_REQUESTED: {
      const newState = {...state};
      newState.selectedID2remove = action.payload;

      return {
        ...newState
      };
    }
    case favoriteGifs.types.REMOVE_FAVORITE_GIF_COMPLETED: {
      const newState = {...state};
      newState.data = newState.data.filter(d => d.id !== action.payload);
      newState.data = [...newState.data];
      return {
        ...newState
      };
    }
    case favoriteGifs.types.REMOVE_FAVORITE_GIF_FAILED: {
      const newState = {...state};
      newState.error = action.error;

      return {
        ...newState
      };
    }
    default:
      return state;
  }
};

export default favoriteGifsReducer;