// StatProd — page script
// Вставляет кнопку в заголовок окна #ProductionsRating (FoE Helper)
// По клику извлекает данные из Productions и открывает страницу рейтинга зданий

(function () {
  'use strict';

  if (window._foeStatProdPageLoaded) return;
  window._foeStatProdPageLoaded = true;

  /* ── Определение языка ── */
  const currentLang = (navigator.language || '').startsWith('ru') ? 'ru' : 'en';

  const uiTexts = {
    ru: {
      buttonText: '📊 Здания игрока',
      buttonTitle: 'Открыть рейтинг эффективности зданий',
      errorNoProductions: 'Productions не найден',
      errorExtract: 'Ошибка извлечения данных',
    },
    en: {
      buttonText: '📊 Player buildings',
      buttonTitle: 'Open building efficiency rating',
      errorNoProductions: 'Productions not found',
      errorExtract: 'Data extraction error',
    }
  };

  const t = uiTexts[currentLang];

  /* ── Стили кнопки ── */
  const css = `
    #StatProd-open-btn {
      background: #1a6fa8;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      white-space: nowrap;
      margin-right: 4px;
      line-height: 20px;
      vertical-align: middle;
    }
    #StatProd-open-btn:hover { background: #2589c8; }
    #StatProd-open-btn:disabled {
      background: #555;
      cursor: wait;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = 'statprod-btn-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Извлечение данных из Productions (world: MAIN — мы уже в нём) ── */
  function extractData() {
    if (typeof Productions === 'undefined') {
      return { error: 'Productions not found' };
    }

    const fullData = {
      exportTime: new Date().toISOString(),
      gameInfo: {
        era: typeof CurrentEra !== 'undefined' ? CurrentEra : null,
        playerId: typeof ExtPlayerID !== 'undefined' ? ExtPlayerID : null,
        url: window.location.href
      },

      buildings: Productions.BuildingsAll || [],
      buildingsProducts: Productions.BuildingsProducts || {},
      buildingsProductsGroups: Productions.BuildingsProductsGroups || {},
      combinedCityMapData: Productions.CombinedCityMapData || {},

      types: Productions.Types || [],
      fspQualifiedResources: Productions.FSPqualifiedResources || [],

      cityStats: {
        happinessBoost: Productions.HappinessBoost || 0,
        populationSum: Productions.PopulationSum || 0,
        happinessSum: Productions.HappinessSum || 0,
        boosts: Productions.Boosts || {}
      },

      efficiencySettings: Productions.efficiencySettings || {},

      rating: {
        data: Productions.Rating?.Data || {},
        types: Productions.Rating?.Types || [],
        presets: Productions.Rating?.Presets || {},
        activePreset: Productions.Rating?.getActivePreset ? Productions.Rating.getActivePreset() : null
      },

      buildingsByType: {},

      battleBoosts: {
        byBuilding: [],
        summary: {
          attacker: { attack: 0, defense: 0 },
          defender: { attack: 0, defense: 0 },
          byFeature: {
            all:              { attackerAttack: 0, attackerDefense: 0, defenderAttack: 0, defenderDefense: 0 },
            battleground:     { attackerAttack: 0, attackerDefense: 0, defenderAttack: 0, defenderDefense: 0 },
            guild_expedition: { attackerAttack: 0, attackerDefense: 0, defenderAttack: 0, defenderDefense: 0 },
            guild_raids:      { attackerAttack: 0, attackerDefense: 0, defenderAttack: 0, defenderDefense: 0 }
          }
        }
      },

      productionBoosts: {
        forge_points_production: { total: 0, buildings: [] },
        coin_production:         { total: 0, buildings: [] },
        supply_production:       { total: 0, buildings: [] },
        goods_production:        { total: 0, buildings: [] },
        special_goods_production:{ total: 0, buildings: [] }
      },

      resources: {
        strategy_points: { total: 0, motivated: 0, unmotivated: 0, buildings: [] },
        money:           { total: 0, motivated: 0, unmotivated: 0, buildings: [] },
        supplies:        { total: 0, motivated: 0, unmotivated: 0, buildings: [] },
        medals:          { total: 0, motivated: 0, unmotivated: 0, buildings: [] },
        premium:         { total: 0, buildings: [] },
        goods:           { total: 0, byEra: {}, buildings: [] },
        clan_goods:      { total: 0, byEra: {}, buildings: [] },
        special_goods:   { total: 0, buildings: [] },
        units:           { total: 0, byType: {}, buildings: [] },
        items:           { total: 0, byType: {}, buildings: [] }
      },

      fragments: { set: [], list: [], byBuilding: [] },

      goodsByEra: { previous: {}, current: {}, next: {} },

      buildingsDetailed: []
    };

    const fragmentsSet = new Set();

    for (const building of Productions.BuildingsAll) {
      if (!building) continue;

      const sizeLength = building.size?.length || building.sizeLength || 1;
      const sizeWidth  = building.size?.width  || building.sizeWidth  || 1;
      const sizeTiles  = sizeLength * sizeWidth;

      const buildingDetail = {
        id: building.id,
        entityId: building.entityId,
        name: building.name,
        type: building.type,
        era: building.eraName,
        size: `${sizeLength}x${sizeWidth}`,
        sizeTiles,
        population: building.population || 0,
        happiness:  building.happiness  || 0,
        isBoostable:    building.isBoostable || false,
        isPolivated:    building.state?.isPolivated || false,
        isCollectable:  building.state?.name === 'collectable',
        collectTime:    building.state?.times?.at || null,
        needsStreet:    building.needsStreet || 0,
        setBuilding:    building.setBuilding?.name   || null,
        chainBuilding:  building.chainBuilding?.name || null,
        boosts: [],
        productions: [],
        goodsProduction: {},
        guildGoodsProduction: {},
        battleStats: {
          attackerAttack: 0, attackerDefense: 0,
          defenderAttack: 0, defenderDefense: 0,
          byFeature: {}
        },
        productionBonuses: { fp: 0, coins: 0, supplies: 0, goods: 0 }
      };

      if (building.boosts && Array.isArray(building.boosts)) {
        for (const boost of building.boosts) {
          if (!boost || !boost.type) continue;
          const boostTypes   = Array.isArray(boost.type) ? boost.type : [boost.type];
          const boostValue   = boost.value   || 0;
          const boostFeature = boost.feature || 'all';

          for (const bt of boostTypes) {
            buildingDetail.boosts.push({ type: bt, value: boostValue, feature: boostFeature });

            if (bt === 'att_boost_attacker') { buildingDetail.battleStats.attackerAttack  += boostValue; fullData.battleBoosts.summary.attacker.attack  += boostValue; if (fullData.battleBoosts.summary.byFeature[boostFeature]) fullData.battleBoosts.summary.byFeature[boostFeature].attackerAttack  += boostValue; }
            if (bt === 'def_boost_attacker') { buildingDetail.battleStats.attackerDefense += boostValue; fullData.battleBoosts.summary.attacker.defense += boostValue; if (fullData.battleBoosts.summary.byFeature[boostFeature]) fullData.battleBoosts.summary.byFeature[boostFeature].attackerDefense += boostValue; }
            if (bt === 'att_boost_defender') { buildingDetail.battleStats.defenderAttack  += boostValue; fullData.battleBoosts.summary.defender.attack  += boostValue; if (fullData.battleBoosts.summary.byFeature[boostFeature]) fullData.battleBoosts.summary.byFeature[boostFeature].defenderAttack  += boostValue; }
            if (bt === 'def_boost_defender') { buildingDetail.battleStats.defenderDefense += boostValue; fullData.battleBoosts.summary.defender.defense += boostValue; if (fullData.battleBoosts.summary.byFeature[boostFeature]) fullData.battleBoosts.summary.byFeature[boostFeature].defenderDefense += boostValue; }

            if (bt === 'forge_points_production') { buildingDetail.productionBonuses.fp       = boostValue; fullData.productionBoosts.forge_points_production.total += boostValue; fullData.productionBoosts.forge_points_production.buildings.push({ name: building.name, value: boostValue }); }
            if (bt === 'coin_production')         { buildingDetail.productionBonuses.coins    = boostValue; fullData.productionBoosts.coin_production.total         += boostValue; fullData.productionBoosts.coin_production.buildings.push({ name: building.name, value: boostValue }); }
            if (bt === 'supply_production')       { buildingDetail.productionBonuses.supplies = boostValue; fullData.productionBoosts.supply_production.total       += boostValue; fullData.productionBoosts.supply_production.buildings.push({ name: building.name, value: boostValue }); }
            if (bt === 'goods_production')        { buildingDetail.productionBonuses.goods    = boostValue; fullData.productionBoosts.goods_production.total        += boostValue; fullData.productionBoosts.goods_production.buildings.push({ name: building.name, value: boostValue }); }
          }
        }
      }

      const allProductions = [
        ...(building.production       || []),
        ...(building.state?.production || [])
      ];

      for (const prod of allProductions) {
        if (!prod) continue;

        if (prod.type === 'resources' && prod.resources) {
          for (const [resType, amount] of Object.entries(prod.resources)) {
            if (amount > 0) {
              buildingDetail.productions.push({ type: 'resources', resource: resType, amount, doubleWhenMotivated: prod.doubleWhenMotivated || false });
              let finalAmount = amount;
              if (building.isBoostable && building.isPolivated && prod.doubleWhenMotivated) finalAmount = amount * 2;
              if (resType === 'strategy_points') { fullData.resources.strategy_points.total += finalAmount; if (building.isPolivated) fullData.resources.strategy_points.motivated += finalAmount; else fullData.resources.strategy_points.unmotivated += amount; fullData.resources.strategy_points.buildings.push({ name: building.name, amount: finalAmount, motivated: building.isPolivated }); }
              if (resType === 'money')    { fullData.resources.money.total    += finalAmount; if (building.isPolivated) fullData.resources.money.motivated    += finalAmount; else fullData.resources.money.unmotivated    += amount; fullData.resources.money.buildings.push({ name: building.name, amount: finalAmount }); }
              if (resType === 'supplies') { fullData.resources.supplies.total += finalAmount; if (building.isPolivated) fullData.resources.supplies.motivated  += finalAmount; else fullData.resources.supplies.unmotivated += amount; fullData.resources.supplies.buildings.push({ name: building.name, amount: finalAmount }); }
              if (resType === 'medals')   { fullData.resources.medals.total   += amount; fullData.resources.medals.buildings.push({ name: building.name, amount }); }
              if (resType === 'premium')  { fullData.resources.premium.total  += amount; fullData.resources.premium.buildings.push({ name: building.name, amount }); }
              if (resType.includes('good')) { fullData.resources.goods.total += amount; fullData.resources.goods.buildings.push({ name: building.name, good: resType, amount }); const era = building.eraName || 'unknown'; if (!fullData.resources.goods.byEra[era]) fullData.resources.goods.byEra[era] = 0; fullData.resources.goods.byEra[era] += amount; }
            }
          }
        }

        if (prod.type === 'guildResources' && prod.resources) {
          const amount = prod.resources.all_goods_of_age || Object.values(prod.resources)[0] || 0;
          buildingDetail.productions.push({ type: 'guildResources', resource: 'clan_goods', amount });
          fullData.resources.clan_goods.total += amount;
          fullData.resources.clan_goods.buildings.push({ name: building.name, amount });
          const era = building.eraName || 'unknown';
          if (!fullData.resources.clan_goods.byEra[era]) fullData.resources.clan_goods.byEra[era] = 0;
          fullData.resources.clan_goods.byEra[era] += amount;
        }

        if (prod.type === 'special_goods' && prod.resources) {
          let total = 0;
          for (const val of Object.values(prod.resources)) { if (typeof val === 'number') total += val; }
          buildingDetail.productions.push({ type: 'special_goods', resource: 'special_goods', amount: total });
          fullData.resources.special_goods.total += total;
          fullData.resources.special_goods.buildings.push({ name: building.name, amount: total });
        }

        if (prod.type === 'unit' && prod.resources) {
          for (const [unitType, amount] of Object.entries(prod.resources)) {
            if (amount > 0) {
              buildingDetail.productions.push({ type: 'unit', resource: unitType, amount });
              fullData.resources.units.total += amount;
              if (!fullData.resources.units.byType[unitType]) fullData.resources.units.byType[unitType] = 0;
              fullData.resources.units.byType[unitType] += amount;
              fullData.resources.units.buildings.push({ name: building.name, unit: unitType, amount });
            }
          }
        }

        if (prod.type === 'random' && prod.resources && Array.isArray(prod.resources)) {
          for (const res of prod.resources) {
            if (res && res.type) {
              const expectedValue = (res.amount || 0) * (res.dropChance || 0);
              if (expectedValue > 0) {
                buildingDetail.productions.push({ type: 'random', resource: res.name || res.type, amount: res.amount, dropChance: res.dropChance, expectedValue });
                if (res.type === 'unit')       { fullData.resources.units.total += expectedValue; if (!fullData.resources.units.byType[res.name]) fullData.resources.units.byType[res.name] = 0; fullData.resources.units.byType[res.name] += expectedValue; }
                if (res.type === 'consumable') { fullData.resources.items.total += expectedValue; if (!fullData.resources.items.byType[res.name]) fullData.resources.items.byType[res.name] = 0; fullData.resources.items.byType[res.name] += expectedValue; }
              }
            }
          }
        }

        if (prod.type === 'genericReward' && prod.resources) {
          const isFragment = prod.resources.subType === 'fragment';
          buildingDetail.productions.push({ type: 'genericReward', resource: prod.resources.name, amount: prod.resources.amount, isFragment });
          if (isFragment) {
            fragmentsSet.add(prod.resources.name);
            fullData.fragments.list.push({ name: prod.resources.name, building: building.name, amount: prod.resources.amount });
          }
        }
      }

      if (typeof CityBuildings !== 'undefined') {
        try {
          const goodsByEra = CityBuildings.getBuildingGoodsByEra(false, building, true);
          if (goodsByEra?.eras) {
            buildingDetail.goodsProduction = goodsByEra.eras;
            for (const [era, amount] of Object.entries(goodsByEra.eras)) {
              const eraNum        = parseInt(era);
              const currentEraNum = typeof CurrentEra !== 'undefined' ? CurrentEra : 0;
              if (eraNum === currentEraNum - 1) fullData.goodsByEra.previous[building.name] = (fullData.goodsByEra.previous[building.name] || 0) + amount;
              if (eraNum === currentEraNum)     fullData.goodsByEra.current[building.name]  = (fullData.goodsByEra.current[building.name]  || 0) + amount;
              if (eraNum === currentEraNum + 1) fullData.goodsByEra.next[building.name]     = (fullData.goodsByEra.next[building.name]     || 0) + amount;
            }
          }
          const guildGoodsByEra = CityBuildings.getBuildingGuildGoodsByEra(false, building, true);
          if (guildGoodsByEra?.eras) buildingDetail.guildGoodsProduction = guildGoodsByEra.eras;
        } catch(e) {}
      }

      if (!fullData.buildingsByType[building.type]) fullData.buildingsByType[building.type] = [];
      fullData.buildingsByType[building.type].push(building.name);
      fullData.buildingsDetailed.push(buildingDetail);

      if (buildingDetail.battleStats.attackerAttack > 0 || buildingDetail.battleStats.attackerDefense > 0 || buildingDetail.battleStats.defenderAttack > 0 || buildingDetail.battleStats.defenderDefense > 0) {
        fullData.battleBoosts.byBuilding.push(buildingDetail);
      }
    }

    fullData.fragments.set = Array.from(fragmentsSet);
    return fullData;
  }

  /* ── Обработчик клика по кнопке ── */
  function handleButtonClick(btn, messageType) {
    btn.disabled = true;

    let data;
    try {
      data = extractData();
    } catch (e) {
      console.error('[StatProd] Extraction error:', e);
      btn.disabled = false;
      return;
    }

    if (!data || data.error) {
      console.error('[StatProd]', data?.error || 'No data');
      btn.disabled = false;
      return;
    }

    window.postMessage({ type: messageType, payload: data }, '*');
    setTimeout(() => { btn.disabled = false; }, 2000);
  }

  /* ── Вставка кнопок в заголовок #ProductionsRating ── */
  function injectButton() {
    if (document.getElementById('StatProd-open-btn')) return;

    const ratingWindow = document.getElementById('ProductionsRating');
    if (!ratingWindow) return;

    const buttonsContainer =
      ratingWindow.querySelector('.win-btns') ||
      ratingWindow.querySelector('.foe-window-header') ||
      ratingWindow.querySelector('[data-type="buttons"]') ||
      ratingWindow.querySelector('.header') ||
      ratingWindow.firstElementChild;

    if (!buttonsContainer) return;

    // Кнопка "Рейтинг зданий"
    const btn = document.createElement('button');
    btn.id          = 'StatProd-open-btn';
    btn.textContent = t.buttonText;
    btn.title       = t.buttonTitle;
    btn.addEventListener('click', () => handleButtonClick(btn, 'STATPROD_OPEN'));
    buttonsContainer.insertBefore(btn, buttonsContainer.firstChild);

    // Кнопка "Статы игрока"
    const btnBattle = document.createElement('button');
    btnBattle.id          = 'StatBattle-open-btn';
    btnBattle.textContent = currentLang === 'ru' ? '⚔️ Статы игрока' : '⚔️ Player Stats';
    btnBattle.title       = currentLang === 'ru' ? 'Открыть таблицу боевых статов зданий' : 'Open building battle stats';
    btnBattle.style.cssText = `
      background: #7a1a6a; color: #fff; border: none; border-radius: 4px;
      padding: 2px 8px; font-size: 12px; font-weight: bold; cursor: pointer;
      white-space: nowrap; margin-right: 4px; line-height: 20px; vertical-align: middle;
    `;
    btnBattle.addEventListener('click', () => handleButtonClick(btnBattle, 'STATBATTLE_OPEN'));
    buttonsContainer.insertBefore(btnBattle, buttonsContainer.firstChild);
  }

  /* ── MutationObserver: ждём появления #ProductionsRating ── */
  const observer = new MutationObserver(() => {
    if (document.getElementById('ProductionsRating')) {
      injectButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // На случай если окно уже есть в DOM
  injectButton();

})();
