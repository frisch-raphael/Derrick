import { ActionType } from 'src/store/columbo/action-types';
import { Mutations } from 'src/store/columbo/mutations';
import { ActionTree, ActionContext  } from 'vuex';
import { State } from '../index';
import { ColumboState } from './state';
import { HeaderMenuStateUpdate } from './types';
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
    payload: number
  ): Promise<number>
}

const actions: ActionTree<ColumboState, State> = {
  [ActionType.updateRessourceMenu](context, update: HeaderMenuStateUpdate) {
    context.commit('updateRessourceMenus', update);
  }
};

export default actions;
