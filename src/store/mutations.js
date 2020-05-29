import {
  USERINFO,
  LOCATION,
  RECORD_USERINFO,
  SAVE_GEOHASH
} from './mutation-types.js'

import {
  setStore,
  getStore
} from '../config/mUtils';

export default {
  [USERINFO](state, info) {
    if (state.userinfo && (state.userinfo.username !== info.username)) {
      return;
    }
    if (!state.login) {
      return;
    }
    if (!info.message) {
      state.userinfo = {
        ...info
      }
    } else {
      state.userinfo == null;
    }
  },
  [LOCATION](state, {
    latitude,
    longitude
  }) {
    state.latitude = latitude;
    state.longitude = longitude;
  },
  [RECORD_USERINFO](state, userInfo) {
    state.userInfo = userInfo;
    state.login = true;
    setStore('user_id', userInfo.user_id);
  },
  [SAVE_GEOHASH](state, geohash) {
    state.geohash = geohash
  }

}
