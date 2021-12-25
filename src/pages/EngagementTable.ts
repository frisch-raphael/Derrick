import { defineComponent, onMounted, ref, Ref } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import { Endpoints } from '../enums/enums';
import request from 'src/axios';
import BaseTable from 'src/ui/BaseTable.vue';
import { Columns, LooseDictionary } from 'src/types/types';
import { Column } from '../types/types';
import { debug } from 'console';


const columns = [
    {
        name: 'desc',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        sortable: true
    },
    { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
    { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
    { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
    { name: 'protein', label: 'Protein (g)', field: 'protein' },
    { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
]

const rows: LooseDictionary = [
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
    },
    {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        sodium: 337,
    },
    {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        sodium: 413,
    },
    {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        sodium: 327,
    },
    {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        sodium: 50,
    },
    {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        sodium: 38,
    },
    {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        sodium: 562,
    },
    {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        sodium: 326,
    },
    {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
    }
]

export default defineComponent({
    name: 'EngagementTable',
    components: {
        BaseTable
    },
    setup() {

        type EngagementColumn = { name: keyof IEngagement } & Column<IEngagement>
        let engagements: IEngagement[] = []
        type engagementRow = { name: string } & Partial<IEngagement>
        const engagementsRows: Ref<engagementRow[]> = ref([])
        const loading = ref(10)
        const engagementColumns: EngagementColumn[] = [
            {
                name: 'assessment_type', field: 'assessment_type', label: 'Assessment Type'
            }, {
                name: 'start_date', field: 'start_date', label: 'Start date'
            }, {
                name: 'end_date', field: 'end_date', label: 'End date',
            }, {
                name: 'language', field: 'language', label: 'Language',
            }]

        onMounted(async () => {
            const response = await request<IEngagement[]>({ method: 'get', url: Endpoints.Engagements })
            engagements = response.data
            loading.value = 20
            engagementsRows.value = engagements.map((e, index) => ({
                name: `#${index + 1} ${e.title}`,
                assessment_type: e.assessment_type,
                start_date: e.start_date,
                end_date: e.end_date,
                language: e.language
            }))
        })

        return {
            engagementsRows,
            engagementColumns,
            loading
        }
    },

});