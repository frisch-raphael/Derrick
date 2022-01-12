/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
// import { QBtn } from 'quasar';
import TheDrawer from 'src/components/TheDrawer';

// // Specify here Quasar config you'll need to test your component
installQuasarPlugin();

const engagementMenuElementSelector = "[data-cy='Findings']";
const adminMenuElementSelector = "[data-cy='Configuration']";
const toAdminElementSelector = "[data-cy='drawer-admin-button']";
const toEngagementsElementSelector = "[data-cy='Other engagements']";

describe('TheDrawer', () => {

  it('has element from the administration menu', async () => {
    const wrapper = mount(TheDrawer);
    wrapper.vm.switchDrawerContext('admin');
    await wrapper.find(toAdminElementSelector).trigger('click');
    const adminMenuElement = wrapper.findComponent(adminMenuElementSelector);
    expect(adminMenuElement.exists()).toBe(true);
  });

  it('has element from the engagement menu', () => {
    const wrapper = mount(TheDrawer);

    // const wrapper = mount(TheDrawer, {
    //   props: { context: 'administration' }
    // } as any);
    const engagementMenuElement = wrapper.find(engagementMenuElementSelector);
    // expect(wrapper.findComponent(QItem).exists()).toBe(true);
    expect(engagementMenuElement.exists()).toBe(true);
    expect(engagementMenuElement.text()).toEqual('Findings');
  });


  it('display the correct title', () => {
    const dummyTitle = 'Penetration test';
    const wrapper = mount(TheDrawer, {
      props: { reportTitle: dummyTitle }
    } as any);
    expect(wrapper.html()).toContain(dummyTitle);
  });

  it('can switch from administration to engagements', () => {
    const wrapper = mount(TheDrawer);
    const engagementButtonSwitcher = wrapper.findComponent("[data-cy='drawer-report-button']");
    // expect(wrapper.findComponent(QItem).exists()).toBe(true);
    expect(engagementButtonSwitcher.exists()).toBe(true);
    wrapper.vm.switchDrawerContext('engagement');
    const engagementMenuElement = wrapper.findComponent(engagementMenuElementSelector);
    expect(engagementMenuElement.exists()).toBe(true);
  });


  it('can switch from engagements to administration', async () => {
    const wrapper = mount(TheDrawer);
    const element = wrapper.find(toAdminElementSelector);
    // expect(wrapper.findComponent(QItem).exists()).toBe(true);
    expect(element.exists()).toBe(true);
    await element.trigger('click');
    wrapper.vm.switchDrawerContext('admin');
    const adminMenuElement = wrapper.findComponent(adminMenuElementSelector);
    expect(adminMenuElement.exists()).toBe(true);
  });

  it('has a go to other engagements button', () => {
    const wrapper = mount(TheDrawer);
    const element = wrapper.findComponent(toEngagementsElementSelector);
    // expect(wrapper.findComponent(QItem).exists()).toBe(true);
    expect(element.exists()).toBe(true);
  });


});
