import { useRef, useState } from 'react';

export function useArtworkSelection() {
  const [selectedCount, setSelectedCount] = useState(0);

  const selectionStartIndex = useRef(0);

  const isSelected = (globalIndex: number) => {
    return (
      globalIndex >= selectionStartIndex.current &&
      globalIndex < selectionStartIndex.current + selectedCount
    );
  };


  const selectRow = () => {
    setSelectedCount(prev => prev + 1);
  };


  const deselectRow = (pageStartIndex: number) => {
    setSelectedCount(prev => Math.max(0, prev - 1));
    selectionStartIndex.current = pageStartIndex;
  };


  const applyBulkSelectionIntent = (count: number, pageStartIndex: number) => {
    if (!Number.isInteger(count) || count <= 0) return;
    selectionStartIndex.current = pageStartIndex;
    setSelectedCount(count);
  };

  const getSelectedCount = () => selectedCount;

  return {
    isSelected,
    selectRow,
    deselectRow,
    applyBulkSelectionIntent,
    getSelectedCount,
  };
}
