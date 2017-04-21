export default {
  state: {
    list: []
  },
  reducers: {
    add(state, item) {
      const list = [...state.list, item];
      return { ...state, list };
    },
    delete(state, item) {
      const list = state.list.filter(v => v !== item);
      return { ...state, list };
    }
  }
};