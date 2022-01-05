import { ActionType } from 'src/store/columbo/action-types';
import { Mutations } from 'src/store/columbo/mutations';
import { ActionTree, ActionContext } from 'vuex';
import { State } from '../index';
import { ColumboState } from './state';
import { HeaderMenuStateUpdate, RessourceTableUpdate } from './types';
import { MutationType } from './mutations-types';
// type Context = ActionContext<ColumboStateInterface, State>;

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
  [ActionType.updateRessourceMenu](
    { commit }: AugmentedActionContext,
    payload: HeaderMenuStateUpdate
  ): Promise<void>,
  [ActionType.updateRessourceTable](
    { commit }: AugmentedActionContext,
    payload: RessourceTableUpdate
  ): Promise<void>,
}

const actions: ActionTree<ColumboState, State> = {
  [ActionType.updateRessourceMenu]({ commit }, update: HeaderMenuStateUpdate) {
    commit(MutationType.updateRessourceMenu, update);
  },
  [ActionType.updateRessourceTable]({ commit }, update: RessourceTableUpdate) {
    commit(MutationType.updateRessourceTable, update);
  }
};

export default actions;
