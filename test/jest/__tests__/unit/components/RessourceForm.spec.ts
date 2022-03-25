import { useConfigStore } from './../../../../../src/stores/config';
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { engagementForm } from 'src/forms/engagement';
import RessourceForm from 'src/components/RessourceForm.vue';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from '@jest/globals';
import { mount } from '@vue/test-utils';
// import { QBtn } from 'quasar';
import BaseInputForm from 'src/ui/form/BaseInputForm.vue';
import { createTestingPinia } from '@pinia/testing';

describe('A ressource form', () => {

  it('sends update event when lower component is updated', () => {
    const wrapper = mount(RessourceForm, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })]
      },
      props: {
        ressourceFormConfig: engagementForm,
      },
    });
    useConfigStore();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapper.findComponent(BaseInputForm).vm.$emit('update:modelValue', 'test');
    expect(wrapper.emitted('ressourceFormUpdate')).toBeTruthy();
  });



});