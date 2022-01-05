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
import { MutationType } from '../store/columbo/mutations-types';
import { EngagementState } from '../enums/enums';
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

        const isCreateEngagementOpen = ref(false);
        const engagementToCreate: Ref<Partial<IEngagement> & { title: string }> = ref({ title: '' });
        const engagementRestClient = new RestClient(ApiRessource.Engagement);
        const engagements: Ref<IEngagement[]> = ref([]);

        const response = await request<IEngagement[]>({ method: 'get', url: '/engagements' });
        engagements.value = response.data;

        const engagementsRowsFromBackend = engagements.value.map((e, i) => ({
            name: `Engagement ${i + 1}`,
            ...e
        }));

        await store.dispatch(ActionType.updateRessourceTable,
            { ressource: RessourceName.Engagement, rows: engagementsRowsFromBackend }
        );

        const reinit = () => {
            store.commit(MutationType.updateRessourceMenu, { ressource: RessourceName.Engagement, isOpen: false });
            isCreateEngagementOpen.value = false;
            engagementToCreate.value = { title: '', state: EngagementState.Ongoing };
        };
        const updateEngagementToCreate = (engagement: IEngagement) =>
            engagementToCreate.value = { ...engagement, state: EngagementState.Ongoing };
        const createEngagement = async () => {
            const engagementFromBackend = await new RestClient(ApiRessource.Engagement).create<IEngagement>(engagementToCreate.value);
            const engagementRowNumber = store.getters.baseTableRows(RessourceName.Engagement).length;
            const newEngagementRow = { ...engagementFromBackend, name: `Engagement ${engagementRowNumber + 1}` };
            store.commit(MutationType.addOneRessourceTable, { ressource: RessourceName.Engagement, row: newEngagementRow });
            reinit();
        };

        return {
            engagementColumns,
            engagementRestClient,
            isCreateEngagementOpen,
            engagementForm,
            hideAll: reinit,
            createEngagement,
            updateEngagementToCreate
        };
    },

});