import {create} from 'zustand';
import {funds as mockFunds} from '../constants/mockData';

export const useFundStore = create((set, get) => ({
  funds: mockFunds,
  selectedIds: [],
  toggleSelect: id => {
    const {selectedIds} = get();
    const exists = selectedIds.includes(id);
    if (exists) {
      set({selectedIds: selectedIds.filter(x => x !== id)});
      return {ok: true};
    }
    if (selectedIds.length >= 5) {
      return {ok: false, reason: 'over_limit'};
    }
    set({selectedIds: [...selectedIds, id]});
    return {ok: true};
  },
  clearSelection: () => set({selectedIds: []}),
  getSelectedFunds: () => {
    const {funds, selectedIds} = get();
    return funds.filter(f => selectedIds.includes(f.id));
  },
}));
