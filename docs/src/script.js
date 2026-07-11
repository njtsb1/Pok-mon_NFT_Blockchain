(() => {
  // Elements
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const langSelect = document.getElementById('lang');
  const pokemonList = document.getElementById('pokemon-list');
  const mintBtn = document.getElementById('mint-btn');
  const mintModal = document.getElementById('mint-modal');
  const mintForm = document.getElementById('mint-form');
  const showSolidity = document.getElementById('show-solidity');
  const solidityModal = document.getElementById('solidity-modal');
  const solidityClose = document.getElementById('solidity-close');
  const attackerSelect = document.getElementById('attacker');
  const defenderSelect = document.getElementById('defender');
  const battleForm = document.getElementById('battle-form');
  const battleLog = document.getElementById('battle-log');
  const appTitle = document.getElementById('app-title');
  const appSubtitle = document.getElementById('app-subtitle');
  const titleLarge = document.getElementById('title-large');
  const description = document.getElementById('description');
  const footerText = document.getElementById('footer-text');

  // Default data (simulated minted tokens)
  const defaultPokemons = [
  { name: 'Bulbasaur', level: 5, img: './public/bulbasaur.jpeg', owner: '0xOwner' },
  { name: 'Charmander', level: 4, img: './public/charmander.jpeg', owner: '0xOwner' },
  { name: 'Pikachu', level: 6, img: './public/pikachu.jpeg', owner: '0xOwner' },
  { name: 'Squirtle', level: 3, img: './public/squirtle.jpeg', owner: '0xOwner' }
];

  // Storage keys
  const THEME_KEY = 'poke_theme';
  const LANG_KEY = 'poke_lang';
  const POKES_KEY = 'poke_tokens';

  // Translations
  const i18n = {
    'en': {
      title: 'Pokemon NFT Blockchain',
      subtitle: 'Simulated ERC-721 battle demo',
      create: 'Create New Pokemon',
      showSolidity: 'Show Solidity',
      yourPokemons: 'Your Pokemons',
      battleArena: 'Battle Arena',
      attacker: 'Attacker',
      defender: 'Defender',
      battle: 'Battle',
      mintTitle: 'Create New Pokemon',
      mint: 'Mint',
      cancel: 'Cancel',
      footer: 'Local demo • No blockchain required • Accessible and responsive',
      description: 'Create, mint and simulate battles with ERC-721 style Pokemons (local simulation).'
    },
    'pt-BR': {
      title: 'Pokemon NFT Blockchain',
      subtitle: 'Demonstração de batalha simulada ERC-721',
      create: 'Criar Novo Pokemon',
      showSolidity: 'Mostrar Solidity',
      yourPokemons: 'Seus Pokemons',
      battleArena: 'Arena de Batalha',
      attacker: 'Atacante',
      defender: 'Defensor',
      battle: 'Batalhar',
      mintTitle: 'Criar Novo Pokemon',
      mint: 'Mintar',
      cancel: 'Cancelar',
      footer: 'Demonstração local • Sem blockchain • Acessível e responsivo',
      description: 'Crie, minte e simule batalhas com Pokemons no estilo ERC-721 (simulação local).'
    },
    'es': {
      title: 'Pokemon NFT Blockchain',
      subtitle: 'Demostración de batalla simulada ERC-721',
      create: 'Crear Nuevo Pokemon',
      showSolidity: 'Mostrar Solidity',
      yourPokemons: 'Tus Pokemons',
      battleArena: 'Arena de Batalla',
      attacker: 'Atacante',
      defender: 'Defensor',
      battle: 'Batalla',
      mintTitle: 'Crear Nuevo Pokemon',
      mint: 'Mintear',
      cancel: 'Cancelar',
      footer: 'Demo local • Sin blockchain • Accesible y responsivo',
      description: 'Crea, mintea y simula batallas con Pokemons estilo ERC-721 (simulación local).'
    }
  };

  // Utilities
  const saveTheme = (theme) => localStorage.setItem(THEME_KEY, theme);
  const saveLang = (lang) => localStorage.setItem(LANG_KEY, lang);
  const savePokes = (pokes) => localStorage.setItem(POKES_KEY, JSON.stringify(pokes));
  const loadPokes = () => {
    const raw = localStorage.getItem(POKES_KEY);
    if (!raw) {
      savePokes(defaultPokemons);
      return defaultPokemons.slice();
    }
    try { return JSON.parse(raw); } catch { savePokes(defaultPokemons); return defaultPokemons.slice(); }
  };

  // State
  let pokemons = loadPokes();

  // Theme handling
  const applyTheme = (theme) => {
    if (theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
    themeToggle.setAttribute('aria-pressed', theme === 'light');
    saveTheme(theme);
  };

  const initTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
    else applyTheme('dark'); // default dark
    themeToggle.addEventListener('click', () => {
      const isLight = root.classList.toggle('light');
      applyTheme(isLight ? 'light' : 'dark');
    });
  };

  // Language handling
  const applyLang = (lang) => {
    const t = i18n[lang] || i18n['en'];
    appTitle.textContent = t.title;
    appSubtitle.textContent = t.subtitle;
    titleLarge.textContent = t.title;
    description.textContent = t.description;
    document.getElementById('cards-title').textContent = t.yourPokemons;
    document.getElementById('battle-title').textContent = t.battleArena;
    document.querySelector('label[for="attacker"]').textContent = t.attacker;
    document.querySelector('label[for="defender"]').textContent = t.defender;
    document.querySelector('#mint-title').textContent = t.mintTitle;
    document.getElementById('mint-submit').textContent = t.mint;
    document.getElementById('mint-cancel').textContent = t.cancel;
    document.getElementById('footer-text').textContent = t.footer;
    document.getElementById('mint-btn').textContent = t.create;
    document.getElementById('show-solidity').textContent = t.showSolidity;
    document.querySelector('#battle-form button[type="submit"]').textContent = t.battle;
    saveLang(lang);
  };

  const initLang = () => {
    const saved = localStorage.getItem(LANG_KEY) || 'en';
    langSelect.value = saved;
    applyLang(saved);
    langSelect.addEventListener('change', (e) => applyLang(e.target.value));
  };

  // Render functions
  function renderList() {
    pokemonList.innerHTML = '';
    pokemons.forEach((p, idx) => {
      const li = document.createElement('li');
      li.className = 'pokemon-card';
      li.setAttribute('role', 'listitem');

      const img = document.createElement('img');
      img.src = p.img;
      img.alt = `${p.name} image`;
      img.loading = 'lazy';

      const info = document.createElement('div');
      info.className = 'pokemon-info';
      const name = document.createElement('p');
      name.className = 'pokemon-name';
      name.textContent = `${p.name} #${idx}`;
      const meta = document.createElement('p');
      meta.className = 'pokemon-meta';
      meta.textContent = `Level ${p.level} • Owner ${p.owner}`;

      info.appendChild(name);
      info.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'card-actions';
      const incBtn = document.createElement('button');
      incBtn.className = 'small-btn';
      incBtn.textContent = '+ Level';
      incBtn.title = 'Increase level (simulate training)';
      incBtn.addEventListener('click', () => {
        p.level += 1;
        savePokes(pokemons);
        renderAll();
      });

      const transferBtn = document.createElement('button');
      transferBtn.className = 'small-btn';
      transferBtn.textContent = 'Transfer';
      transferBtn.title = 'Simulate transfer to another owner';
      transferBtn.addEventListener('click', () => {
        const newOwner = prompt('New owner address (simulated):', p.owner) || p.owner;
        p.owner = newOwner;
        savePokes(pokemons);
        renderAll();
      });

      actions.appendChild(incBtn);
      actions.appendChild(transferBtn);

      li.appendChild(img);
      li.appendChild(info);
      li.appendChild(actions);
      pokemonList.appendChild(li);
    });
    populateSelects();
  }

  function populateSelects() {
    [attackerSelect, defenderSelect].forEach(sel => {
      sel.innerHTML = '';
      pokemons.forEach((p, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `${p.name} #${idx} (Lv ${p.level})`;
        sel.appendChild(opt);
      });
    });
  }

  function renderAll() {
    renderList();
  }

  // Battle logic (mirrors solidity logic provided)
  function battle(attIdx, defIdx) {
    if (attIdx === defIdx) {
      return { ok: false, message: 'Cannot battle the same Pokemon' };
    }
    if (attIdx < 0 || defIdx < 0 || attIdx >= pokemons.length || defIdx >= pokemons.length) {
      return { ok: false, message: 'Invalid Pokemon id' };
    }
    const attacker = pokemons[attIdx];
    const defender = pokemons[defIdx];

    // Simulate owner check: require attacker.owner === caller (we simulate caller as '0xOwner')
    const caller = '0xOwner';
    if (attacker.owner !== caller) {
      return { ok: false, message: 'Only the owner can battle with this Pokemon (simulated)' };
    }

    if (attacker.level >= defender.level) {
      attacker.level += 2;
      defender.level += 1;
      savePokes(pokemons);
      return { ok: true, message: `${attacker.name} wins and gains 2 levels; ${defender.name} gains 1 level.` };
    } else {
      attacker.level += 1;
      defender.level += 2;
      savePokes(pokemons);
      return { ok: true, message: `${defender.name} was stronger; ${defender.name} gains 2 levels; ${attacker.name} gains 1 level.` };
    }
  }

  // Event handlers
  mintBtn.addEventListener('click', () => {
    if (typeof mintModal.showModal === 'function') mintModal.showModal();
    else alert('Dialog not supported in this browser.');
  });

  document.getElementById('mint-cancel').addEventListener('click', () => mintModal.close());

  mintForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('poke-name').value.trim() || 'Unnamed';
    const img = document.getElementById('poke-img').value;
    const owner = document.getElementById('owner-address').value.trim() || '0xOwner';
    const newPoke = { name, level: 1, img, owner };
    pokemons.push(newPoke);
    savePokes(pokemons);
    mintModal.close();
    renderAll();
    battleLog.textContent = `Minted ${name} (simulated).`;
  });

  showSolidity.addEventListener('click', () => {
    if (typeof solidityModal.showModal === 'function') solidityModal.showModal();
  });
  solidityClose.addEventListener('click', () => solidityModal.close());

  battleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const att = parseInt(attackerSelect.value, 10);
    const def = parseInt(defenderSelect.value, 10);
    const result = battle(att, def);
    battleLog.textContent = result.message;
    renderAll();
  });

  // Keyboard accessibility: close dialogs with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mintModal.open) mintModal.close();
      if (solidityModal.open) solidityModal.close();
    }
  });

  // Init
  initTheme();
  initLang();
  renderAll();

  // Expose for debugging (optional)
  window._PokeSim = { pokemons, savePokes, renderAll };
})();
