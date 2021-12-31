import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import columbo from './columbo';
import {
  CommitOptions,
  createStore,
  DispatchOptions,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';
import { ColumboState } from './columbo/state';
import { Mutations } from 'src/store/columbo/mutations';
import { Actions } from 'src/store/columbo/actions';
import { Getters } from 'src/store/columbo/getters';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface State {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  columbo: ColumboState
}


// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<State>> = Symbol('vuex-key');

export type Store = Omit<
  VuexStore<State>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store
  }
}

// export default store(function (/* { ssrContext } */) {
//   const Store = createStore<State>({
//     modules: {
//       columbo
//     },

//     // enable strict mode (adds overhead!)
//     // for dev mode and --debug builds only
//     strict: !!process.env.DEBUGGING
//   });

//   return Store;
// });

export default createStore<State>({
  modules: {
    columbo
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: !!process.env.DEBUGGING
});

export function useStore() {
  return vuexUseStore(storeKey) as Store;
}