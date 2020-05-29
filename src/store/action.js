import { getUser, getAddressList } from "../service/getData";
import { USERINFO, LOCATION } from "./mutation-types.js";

export default {
  async refreshUserInfo({ commit, state }) {
    let res = await getUser();
    commit(USERINFO, res);
  },
  async refreshLocation({ commit, state }) {
    let res = await getAddressList();
    commit(LOCATION, res);
  },
};
