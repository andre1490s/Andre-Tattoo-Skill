/* Simulador mínimo e fiel de window.claude (contrato 0.2.73) para testar o app em Chromium headless.
   Carregue com page.addInitScript({path}). Ajuda: window.__mock.{seed,dump,reset,sampleJson,mcpHandlers,downloads}. */
(function () {
  const store = new Map();            // path -> data
  const listeners = new Set();        // {kind, path, q, next}
  const mock = (window.__mock = { downloads: [], mcpHandlers: {}, sampleJson: null, calls: [], sampleInputs: [] });
  const segs = p => p.split('/').filter(Boolean);
  const parentOf = p => segs(p).slice(0, -1).join('/');
  const clone = o => JSON.parse(JSON.stringify(o));
  const snapDoc = path => ({ id: segs(path).pop(), exists: store.has(path), data: () => (store.has(path) ? clone(store.get(path)) : undefined), metadata: { fromCache: false, hasPendingWrites: false } });
  const children = col => [...store.keys()].filter(k => parentOf(k) === col.replace(/^\/|\/$/g, ''));
  function runQuery(col, q) {
    let paths = children(col);
    let docs = paths.map(p => ({ p, d: store.get(p) }));
    (q.where || []).forEach(([f, op, v]) => { docs = docs.filter(({ d }) => op === '==' ? d[f] === v : op === '<' ? d[f] < v : op === '>' ? d[f] > v : op === '<=' ? d[f] <= v : op === '>=' ? d[f] >= v : true); });
    if (q.orderBy) docs.sort((a, b) => (a.d[q.orderBy[0]] > b.d[q.orderBy[0]] ? 1 : -1) * (q.orderBy[1] === 'desc' ? -1 : 1));
    if (q.limit) docs = docs.slice(0, q.limit);
    const arr = docs.map(({ p }) => snapDoc(p));
    return { docs: arr, size: arr.length, empty: !arr.length, docChanges: () => [], metadata: { fromCache: false, hasPendingWrites: false } };
  }
  function fire() { listeners.forEach(l => { try { l.kind === 'doc' ? l.next(snapDoc(l.path)) : l.next(runQuery(l.path, l.q)); } catch (e) { console.error('mock listener', e); } }); }
  function query(col, q) {
    const mk = patch => query(col, Object.assign({}, q, patch));
    return {
      where: (f, op, v) => mk({ where: (q.where || []).concat([[f, op, v]]) }),
      orderBy: (f, d) => mk({ orderBy: [f, d || 'asc'] }),
      limit: n => mk({ limit: n }),
      get: async () => runQuery(col, q),
      onSnapshot(next) { const l = { kind: 'col', path: col, q, next }; listeners.add(l); setTimeout(() => next(runQuery(col, q)), 0); return () => listeners.delete(l); },
    };
  }
  function docRef(path) {
    return {
      id: segs(path).pop(), path,
      get: async () => snapDoc(path),
      set: async d => { store.set(path, clone(d)); fire(); },
      update: async d => { store.set(path, Object.assign({}, store.get(path) || {}, clone(d))); fire(); },
      delete: async () => { store.delete(path); fire(); },
      onSnapshot(next) { const l = { kind: 'doc', path, next }; listeners.add(l); setTimeout(() => next(snapDoc(path)), 0); return () => listeners.delete(l); },
      collection: sub => colRef(path + '/' + sub),
    };
  }
  function colRef(path) {
    const base = query(path, {});
    return Object.assign({}, base, { path, doc: id => docRef(path + '/' + (id || 'auto' + Math.random().toString(36).slice(2, 9))), add: async d => { const r = docRef(path + '/auto' + Math.random().toString(36).slice(2, 9)); await r.set(d); return r; } });
  }
  const db = { doc: p => docRef(p), collection: p => colRef(p) };
  const user = { id: async () => 'u_test', me: async () => ({ id: 'u_test', name: 'André' }), isOwner: () => true, canEdit: () => true, can: () => true, profiles: async () => ({}) };
  const sample = async (input, opts) => ({ text: 'ok', truncated: false });
  sample.json = async (input, opts) => { mock.sampleInputs.push(input); return mock.sampleJson ? mock.sampleJson(input, opts) : { texto: 'Resposta de teste.', acoes: [] }; };
  sample.limits = async () => ({ images: false });
  const mcp = {
    callTool: async (server, tool, args) => { mock.calls.push([server, tool, args]); const h = (mock.mcpHandlers[server] || {})[tool]; return h ? h(args) : { payload: { events: [] } }; },
    server: async () => ({}), watchTool: () => () => {}, listTools: async () => [], describeTool: async () => { throw { code: 'unavailable' }; },
  };
  const permissions = { state: async () => 'granted', request: async () => ({}), manage: async () => {} };
  const downloads = { save: async r => { mock.downloads.push(r); return { status: 'saved' }; } };
  const caps = { db, user, sample, mcp, permissions, downloads };
  window.claude = { use: async n => caps[n] || null };
  mock.seed = (path, docs) => { Object.entries(docs).forEach(([id, d]) => store.set(path + '/' + id, clone(d))); fire(); };
  mock.dump = path => children(path).map(p => Object.assign({ id: segs(p).pop() }, store.get(p)));
  mock.reset = () => { store.clear(); fire(); };
})();
