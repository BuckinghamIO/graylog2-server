import Reflux from 'reflux';
import jQuery from 'jquery';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import jsRoutes from 'routing/jsRoutes';
import fetch from 'logic/rest/FetchProvider';

import IndicesActions from 'actions/indices/IndicesActions';

const IndicesStore = Reflux.createStore({
  listenables: [IndicesActions],
  indices: undefined,
  closedIndices: undefined,

  init() {
    IndicesActions.list();
  },
  getInitialState() {
    return { indices: this.indices, closedIndices: this.closedIndices };
  },
  list() {
    const urlList = URLUtils.qualifyUrl(jsRoutes.controllers.api.IndicesApiController.list().url);
    const promiseList = fetch('GET', urlList).then((response) => {
      this.indices = response.indices;
      return { indices: response.indices };
    });

    const urlListClosed = URLUtils.qualifyUrl(jsRoutes.controllers.api.IndicesApiController.listClosed().url);
    const promiseListClosed = fetch('GET', urlListClosed).then((response) => {
      this.closedIndices = response.indices;
      return { closedIndices: response.indices };
    });

    const promise = Promise.all([promiseList, promiseListClosed]).then((values) => {
      const result = jQuery.extend(values[0], values[1]);
      this.trigger(result);

      return result;
    });

    IndicesActions.list.promise(promise);
  },
  close(indexName) {
    const url = URLUtils.qualifyUrl(jsRoutes.controllers.api.IndicesApiController.close(indexName).url);
    const promise = fetch('POST', url);

    IndicesActions.close.promise(promise);
  },
  delete(indexName) {
    const url = URLUtils.qualifyUrl(jsRoutes.controllers.api.IndicesApiController.delete(indexName).url);
    const promise = fetch('DELETE', url);

    IndicesActions.delete.promise(promise);
  },
  closeCompleted() {
    IndicesActions.list();
  },
  deleteCompleted() {
    IndicesActions.list();
  },
});

export default IndicesStore;
