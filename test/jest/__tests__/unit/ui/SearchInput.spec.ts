import { describe, expect, it } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import SearchInput from 'src/ui/SearchInput.vue';

// Specify here Quasar config you'll need to test your component
installQuasarPlugin();

describe('a SearchInput', () => {
  it('can mount', () => {
    const wrapper = mount(SearchInput);
    expect(wrapper).not.toBeNull();
  });

});
