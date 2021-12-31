import { Module } from 'vuex';
import { State } from '../index';
import state, { ColumboState } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const columboModule: Module<ColumboState, State> = {
  actions,
  getters,
  mutations,
  state
};

export default columboModule;
