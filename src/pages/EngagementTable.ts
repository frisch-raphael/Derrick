import { defineComponent, ref, Ref } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import RestClient from '../classes/api/restClient';
import BaseDialog from 'src/ui/BaseDialog.vue';
import { engagementForm } from '../forms/engagement';
import RessourceForm from 'src/components/RessourceForm.vue';
import { RessourceName } from 'src/enums/enums';
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

        const engagementRestClient = new RestClient(RessourceName.Engagement);
        const engagements: Ref<IEngagement[]> = ref([]);

        const response = await request<IEngagement[]>({ method: 'get', url: '/engagements' });
        engagements.value = response.data;



        await store.dispatch(ActionType.updateRessourceTable,
            { ressource: RessourceName.Engagement, rows: engagements.value }
        );


        return {
            engagementColumns,
            engagementRestClient,
            engagementForm,
        };
    },

});