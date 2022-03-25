import { ParentRessource, GenericRessource } from 'src/types/types';
import { onMounted, Ref } from 'vue';
import { RessourceName } from 'src/enums/enums';
import RestClient from 'src/classes/api/restClient';
import { useUiStore } from 'src/stores/ui';
import { useConfigStore } from 'src/stores/config';

export const prepareRessourceTable = (
    ressourceName: RessourceName,
    isLoading: Ref<boolean>,
    parentRessource?: ParentRessource
) => {
    onMounted(async () => {
        const store = useUiStore();
        const configStore = useConfigStore();

        isLoading.value = true;
        store.updateRessourceTable(ressourceName, []);
        try {
            const ressourcesPromise = new RestClient(ressourceName, parentRessource).index<GenericRessource>();
            const configPromise = configStore.fetchConfigTranslationEntries();
            const promises = await Promise.all([ressourcesPromise, configPromise]);
            const ressources = promises[0];

            store.updateRessourceTable(ressourceName, ressources || []);
        } catch (err) {
            console.error(err);
        }
        isLoading.value = false;
    });
};