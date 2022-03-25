import { DataTest } from 'src/enums/enums';
import { defineComponent, ref, Ref } from 'vue';

type MenuElement = { name?: string, icon?: string, isSeparator?: boolean, isTitle?: boolean, goto?: string }


export default defineComponent({
    name: 'TheDrawer',
    props: {
        reportTitle: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const adminMenu: MenuElement[] = [
            { name: 'Columbo administration', isTitle: true, isSeparator: false },
            { name: 'Configuration', icon: 'mdi-cog' },
            { name: 'Users', icon: 'mdi-account' },
            {
                name: 'Additional findings parameters',
                icon: 'mdi-plus-box-multiple',
            },
            { name: 'Templates', isTitle: true, isSeparator: true },
            { name: 'Reports', icon: 'mdi-book-open-blank-variant' },
            { name: 'Findings', icon: 'mdi-feature-search-outline', goto: 'template_findings' },
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
        const engagementMenu: MenuElement[] = [
            { name: props.reportTitle, isTitle: true },
            { name: 'Engagement configuration', icon: 'mdi-cog' },
            { name: 'View charts', icon: 'mdi-chart-arc' },
            { name: 'Findings', icon: 'mdi-table-column-plus-after' },
            // eslint-disable-next-line max-len
            // {name: 'Add findings from templates', icon: 'mdi-table-column-plus-after'},
            { name: 'Exploitations', icon: 'mdi-bomb' },
            { name: 'UDOs', icon: 'mdi-collapse-all-outline' },
            // { name: "Generate", title: true },
            { name: undefined, icon: undefined, isSeparator: true },
            { name: 'Docx', icon: 'mdi-book-check' },
            { name: 'Excel', icon: 'mdi-view-list' },
            { name: 'PowerPoint', icon: 'mdi-message-settings' },
            { name: undefined, icon: undefined, isSeparator: true },
            { name: 'Other engagements', icon: 'mdi-arrow-right', goto: 'engagements' },
        ];
        const storedcontext: Ref<'admin' | 'engagement'> = ref('engagement');

        const getDrawerTitleClasses = (isTitle?: boolean) => {
            return isTitle ? 'text-weight-bold' : '';
        };

        const isUserAdmin = () => {
            return true;
        };

        const currentMenu: Ref<MenuElement[]> = ref(engagementMenu);
        // const currentMenu =
        // props.context == 'administration' ? adminMenu : engagementMenu;
        const switchDrawerContext = (context: 'admin' | 'engagement') => {
            currentMenu.value = context == 'admin' ? adminMenu : engagementMenu;
            storedcontext.value = context;
        };

        return {
            DataTest,
            storedcontext,
            currentMenu,
            getDrawerTitleClasses,
            isUserAdmin,
            switchDrawerContext
        };
    }

});