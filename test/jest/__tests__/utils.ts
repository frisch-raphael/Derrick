/* eslint-disable vue/one-component-per-file */
import { defineComponent, ComponentPublicInstance, h, Suspense } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';


export class Wrapper {
    static wrap(component: { name: string }) {
        return defineComponent({
            components: { [component.name]: component },
            template: `
        <Suspense>
            <${component.name} />
        </Suspense>`,
        });
    }

    static async getWrapped(component: any) {
        const engagementTableWrapped = Wrapper.wrap(component);
        const wrapper = mount(engagementTableWrapped);
        await flushPromises();
        return wrapper.findComponent(component);
    }
}

export const mountSuspense = async (component: new () => ComponentPublicInstance, options?: any) => {

    const wrapper = mount(defineComponent({
        render() {
            return h(Suspense, null, {
                default: h(component),
                fallback: h('div', 'fallback')
            });
        }
    }), options);
    await flushPromises();
    return wrapper;
};
