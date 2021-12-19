import { Context } from 'src/types/types';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'TheDrawer',
    props: {
        reportTitle: {
            type: String,
            required: true,
        },
        context: {
            type: Object as () => Context,
            required: true,
        },
    },
    setup(props) {
        const adminMenu = [
            { name: 'Administration', isTitle: true, isSeparator: true },
            { name: 'Configuration', icon: 'mdi-cog' },
            { name: 'Users', icon: 'mdi-account' },
            {
                name: 'Additional findings parameters',
                icon: 'mdi-plus-box-multiple',
            },
            { name: 'Templates', isTitle: true, isSeparator: true },
            { name: 'Reports', icon: 'mdi-book-open-blank-variant' },
            { name: 'Findings', icon: 'mdi-feature-search-outline' },
            { name: 'Technical tests', icon: 'mdi-test-tube' },
            { name: 'Exploitations', icon: 'mdi-bomb' },
            { name: 'UDOs', icon: 'mdi-collapse-all-outline' },
            { name: 'Plugins', isTitle: true, isSeparator: true },
            {
                name: 'Enable / Disable',
                icon: 'mdi-checkbox-blank-outline',
                isSeparator: false,
            },
            { name: 'Add plugin', icon: 'mdi-plus' },
        ];
        const engagementMenu = [
            { name: props.reportTitle, isTitle: true },
            { name: 'Engagement configuration', icon: 'mdi-cog', isTitle: false },
            { name: 'View charts', icon: 'mdi-chart-arc', isTitle: false },
            { name: 'Findings', icon: 'mdi-table-column-plus-after', isTitle: false },
            // eslint-disable-next-line max-len
            // {name: 'Add findings from templates', icon: 'mdi-table-column-plus-after'},
            { name: 'Exploitations', icon: 'mdi-bomb', isTitle: false },
            { name: 'UDOs', icon: 'mdi-collapse-all-outline', isTitle: false },
            // { name: "Generate", title: true },
            { name: null, icon: null, isSeparator: true, isTitle: false },
            { name: 'Docx', icon: 'mdi-book-check', isTitle: false },
            { name: 'Excel', icon: 'mdi-view-list', isTitle: false },
            { name: 'PowerPoint', icon: 'mdi-message-settings', isTitle: false },
            { name: null, icon: null, isSeparator: true, isTitle: false },
            { name: 'Other engagements', icon: 'mdi-arrow-right', isTitle: false },
        ];

        const getDrawerTitleClasses = (isTitle?: boolean) => {
            return isTitle ? 'text-weight-bold' : '';
        };

        const currentMenu =
            props.context == 'administration' ? adminMenu : engagementMenu;

        return {
            currentMenu,
            getDrawerTitleClasses,
        };
    },
    computed: {
        navigationDrawerName() {
            return this.context == 'administration' ? 'Admin pannel' : 'Reporting';
        },
    },
});