import { defineComponent, ref, Ref } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { Column } from 'src/types/types';
import RestClient from '../classes/api/engagement';
import BaseDialog from 'src/ui/BaseDialog.vue';
import { engagementForm } from '../forms/engagement';
import RessourceForm from 'src/components/RessourceForm.vue';
import { ApiRessource, RessourceName } from 'src/enums/enums';
import { useStore } from 'src/store';
import { MutationType } from '../store/columbo/mutations-types';

export default defineComponent({
    name: 'EngagementTable',
    components: {
        BaseTable,
        RessourceForm,
        BaseDialog
    },
    props: {
        test: {
            type: String,
            default: ''
        }
    },
    async setup() {
        const store = useStore();

        const isCreateEngagementOpen = ref(false);
        const engagementRestClient = new RestClient(ApiRessource.Engagement);
        type EngagementColumn = { name: keyof IEngagement } & Column<IEngagement>
        let engagements: IEngagement[] = [];
        type engagementRow = { name: string } & Partial<IEngagement>
        const engagementsRows: Ref<engagementRow[]> = ref([]);
        const engagementColumns: EngagementColumn[] = [
            {
                name: 'title', field: 'title', label: 'Title', required: true
            }, {
                name: 'assessment_type', field: 'assessment_type', label: 'Assessment Type', required: true
            }, {
                name: 'start_date', field: 'start_date', label: 'Start date'
            }, {
                name: 'end_date', field: 'end_date', label: 'End date'
            }, {
                name: 'language', field: 'language', label: 'Language', required: true
            }];

        const response = await request<IEngagement[]>({ method: 'get', url: '/engagements' });
        engagements = response.data;
        engagementsRows.value = engagements.map((e, i) => ({
            name: `Engagement ${i + 1}`,
            ...e
        }));

        const hideAll = () => {
            store.commit(MutationType.updateRessourceMenu, { ressource: RessourceName.Engagement, isOpen: false });
            isCreateEngagementOpen.value = false;
        };

        return {
            engagementsRows,
            engagementColumns,
            engagementRestClient,
            isCreateEngagementOpen,
            engagementForm,
            hideAll
        };
    },

});