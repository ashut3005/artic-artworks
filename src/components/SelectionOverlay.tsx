import { OverlayPanel } from 'primereact/overlaypanel';
import type { OverlayPanel as OverlayPanelType } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useRef, useState } from 'react';

interface Props {
  onSelect: (count: number) => void;
  trigger: React.ReactNode;
}

export function SelectionOverlay({ onSelect, trigger }: Props) {
  const opRef = useRef<OverlayPanelType>(null);
  const [value, setValue] = useState<string>('');

  return (
    <>
      {/* 🔽 Trigger (arrow near TITLE) */}
      <span
        onClick={(e) => opRef.current?.toggle(e)}
        style={{ cursor: 'pointer', display: 'inline-flex' }}
      >
        {trigger}
      </span>

      <OverlayPanel ref={opRef} style={{ width: '400px' }}>
        <div style={{ padding: '10px' }}>
          {/* Title */}
          <div style={{ fontWeight: 600, marginBottom: '6px' }}>
            Select Multiple Rows
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '0.8rem',
              color: '#6b7280',
              marginBottom: '10px',
            }}
          >
            Enter number of rows to select across all pages
          </div>

          {/* Input + Button */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* 🔢 Number input with spinner */}
            <InputText
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g., 20"
              min={0}
              style={{
                flex: 1,
                height: '36px',
              }}
            />

            {/* 🔵 Blue Select button */}
            <Button
              label="Select"
              size="small"
              style={{
                height: '36px',
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
              }}
              onClick={() => {
                const count = Number(value);
                if (count > 0) {
                  onSelect(count);
                  setValue('');
                  opRef.current?.hide();
                }
              }}
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
}
