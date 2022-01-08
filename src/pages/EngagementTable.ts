import { defineComponent, ref, Ref } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import RestClient from '../classes/api/engagement';
import BaseDialog from 'src/ui/BaseDialog.vue';
import { engagementForm } from '../forms/engagement';
import RessourceForm from 'src/components/RessourceForm.vue';
import { ApiRessource, RessourceName } from 'src/enums/enums';
import { useStore } from 'src/store';
import { ActionType } from '../store/columbo/action-types';
import { engagementColumns } from 'src/pages/columns';

export default defineComponent({
    name: 'EngagementTable',
    components: {
        BaseTable,
        RessourceForm,
        BaseDialog
    },
    async setup() {
        const store = useStore();

        const engagementRestClient = new RestClient(ApiRessource.Engagement);
        const engagements: Ref<IEngagement[]> = ref([]);

        const response = await request<IEngagement[]>({ method: 'get', url: '/engagements' });
        engagements.value = response.data;

        const engagementsRowsFromBackend = engagements.value.map((e, i) => ({
            // name: `Engagement ${i + 1}`,
            ...e
        }));

        await store.dispatch(ActionType.updateRessourceTable,
            { ressource: RessourceName.Engagement, rows: engagementsRowsFromBackend }
        );


        return {
            engagementColumns,
            engagementRestClient,
            engagementForm,
        };
    },

});