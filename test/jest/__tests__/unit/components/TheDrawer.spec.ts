/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount, shallowMount } from '@vue/test-utils';
// import { QBtn } from 'quasar';
import TheDrawer from 'src/components/TheDrawer';

// // Specify here Quasar config you'll need to test your component
installQuasarPlugin();

describe('TheDrawer', () => {
  it('has getDrawerTitleClasses method', () => {
    const wrapper = shallowMount(TheDrawer);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(typeof wrapper.vm.getDrawerTitleClasses).toBe('function');
  });

  it('can show the administration pannel', () => {
    const wrapper = mount(TheDrawer, {
      props: {
        context: 'administration',
      },
    } as any);
    const adminMenuElement = wrapper.findComponent(
      "[data-test='Configuration']"
    );
    expect(adminMenuElement.exists()).toBe(true);
    expect(adminMenuElement.text()).toEqual('Configuration');
  });

  it('can show the engagement pannel', () => {
    const wrapper = mount(TheDrawer, {
      props: { context: 'administration' }
    } as any);
    const engagementMenuElement = wrapper.findComponent("[data-test='Findings']");
    // expect(wrapper.findComponent(QItem).exists()).toBe(true);
    expect(engagementMenuElement.exists()).toBe(true);
    expect(engagementMenuElement.text()).toEqual('Findings');
  });


  it('display the correct title', () => {
    const dummyTitle = 'Penetration test'
    const wrapper = mount(TheDrawer, {
      props: { context: 'engagement', reportTitle: dummyTitle }
    } as any);
    expect(wrapper.html()).toContain(dummyTitle);
  });
  // it('activates a menu item when clicked', () => {
  //   const wrapper = shallowMount(TheDrawer);
  //   wrapper.findComponent('[data-test]=Administration')
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   expect(typeof wrapper.vm.getDrawerTitleClasses).toBe('function');
  // });
});

// describe('MyButton', () => {
//   it('has increment method', () => {
//     const wrapper = mount(MyButton);
//     const { vm } = wrapper;

//     expect(typeof vm.increment).toBe('function');
//   });

//   it('can check the inner text content', () => {
//     const wrapper = mount(MyButton);
//     const { vm } = wrapper;

//     expect((vm.$el as HTMLElement).textContent).toContain('rocket muffin');
//     expect(wrapper.find('.content').text()).toContain('rocket muffin');
//   });

//   it('sets the correct default data', () => {
//     const wrapper = mount(MyButton);
//     const { vm } = wrapper;

//     expect(typeof vm.counter).toBe('number');
//     expect(vm.counter).toBe(0);
//   });

//   it('correctly updates counter when button is pressed', async () => {
//     const wrapper = shallowMount(MyButton);
//     const { vm } = wrapper;
//     const button = wrapper.findComponent(QBtn);
//     await button.trigger('click');
//     expect(vm.counter).toBe(1);
//   });
// });
