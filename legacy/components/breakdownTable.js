export function renderBreakdownTable(container, headers, rows) {
  container.innerHTML = '';

  if (!rows || rows.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:1.5rem;color:var(--text-muted);font-size:0.85rem">No data available</div>';
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';

  const table = document.createElement('table');
  table.className = 'breakdown-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('table-row-enter');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  rows.forEach((row, ri) => {
    const tr = document.createElement('tr');
    tr.style.opacity = '0';
    tr.dataset.index = ri;

    headers.forEach((h, ci) => {
      const td = document.createElement('td');
      const val = row[ci] !== undefined ? row[ci] : (row[h] !== undefined ? row[h] : '');
      td.textContent = val;
      if (ci === 0) tr.appendChild(td);
      else tr.appendChild(td);
    });

    tbody.appendChild(tr);

    observer.observe(tr);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);
  container.appendChild(wrapper);

  return {
    destroy: () => observer.disconnect()
  };
}

export function renderSimpleTable(container, data) {
  container.innerHTML = '';

  if (!data || data.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--text-muted);font-size:0.85rem">No data</div>';
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => row[h]));

  return renderBreakdownTable(container, headers, rows);
}
