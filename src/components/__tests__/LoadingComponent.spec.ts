import { describe, expect, it } from "vitest";
import LoadingComponentVue from "../LoadingComponent.vue";

import { mount } from "@vue/test-utils";

describe("LoadingComponentVue", () => {
  const wrapper = mount(LoadingComponentVue);

  it("should render correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });
});
