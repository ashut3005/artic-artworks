import { DataTable } from 'primereact/datatable';
import type { DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';

import type { Artwork } from '../types/artwork';
import { fetchArtworks } from '../api/artworks';
import { useArtworkSelection } from '../hooks/useArtworkSelection';
import { SelectionOverlay } from './SelectionOverlay';

export function ArtTable() {
  const [rows, setRows] = useState<Artwork[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔥 used to force re-render when deselecting
  // const [, forceRender] = useState(0);

  const selection = useArtworkSelection();
  const rowsPerPage = 12;
  const pageStartIndex = (page - 1) * rowsPerPage;

  useEffect(() => {
    setLoading(true);
    fetchArtworks(page)
      .then(res => {
        setRows(res.rows);
        setTotal(res.total);
        // forceRender(v => v + 1); // ensure UI sync
      })
      .finally(() => setLoading(false));
  }, [page]);

  const onPageChange = (e: DataTablePageEvent) => {
    setPage((e.page ?? 0) + 1);
  };

  /* 🔥 VISUAL SELECTION FROM INDEX */
  const selectedRows = rows.filter((_, index) =>
    selection.isSelected(pageStartIndex + index)
  );

  const titleHeader = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <SelectionOverlay
        onSelect={(count) =>
          selection.applyBulkSelectionIntent(count, pageStartIndex)
        }
        trigger={
          <i
            className="pi pi-chevron-down"
            style={{ fontSize: '0.75rem', cursor: 'pointer' }}
          />
        }
      />
      <span>TITLE</span>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
        Selected: {selection.getSelectedCount()} rows
      </div>

      <DataTable
        value={rows}
        paginator
        lazy
        rows={rowsPerPage}
        totalRecords={total}
        first={pageStartIndex}
        onPage={onPageChange}
        loading={loading}
        selection={selectedRows}
        selectionMode="checkbox"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"

        paginatorLeft={
          <span>
            Showing <strong>{pageStartIndex + 1}</strong> to{' '}
            <strong>{Math.min(pageStartIndex + rowsPerPage, total)}</strong>{' '}
            of <strong>{total}</strong> entries
          </span>
        }

        onSelectionChange={(e) => {
          const selected = e.value as Artwork[];
          const diff = selected.length - selectedRows.length;

          if (diff > 0) {
            for (let i = 0; i < diff; i++) {
              selection.selectRow();
            }
          }

          if (diff < 0) {
            for (let i = 0; i < Math.abs(diff); i++) {
              selection.deselectRow(pageStartIndex);
            }
            // forceRender(v => v + 1); // 🔥 re-sync UI
          }
        }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="title" header={titleHeader} />
        <Column field="place_of_origin" header="PLACE OF ORIGIN" />
        <Column field="artist_display" header="ARTIST" />
        <Column
          header="INSCRIPTIONS"
          body={(row: Artwork) => row.inscriptions ?? 'N/A'}
        />
        <Column field="date_start" header="START DATE" />
        <Column field="date_end" header="END DATE" />
      </DataTable>
    </div>
  );
}
