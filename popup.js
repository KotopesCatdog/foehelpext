// =============================================
// FOEhelp_RU — popup.js (с поддержкой локализации)
// =============================================

// Элементы
const extractBtn = document.getElementById('extractPlayerDataButton');
const importCityBtn = document.getElementById('importCityEntitiesButton');
const openKitsBtn = document.getElementById('openSelectionKitsButton');
const statusEl = document.getElementById('statusMessage');
const updateLink = document.getElementById('updateLink');

// Функция обновления статуса с локализацией
function setStatusMessage(key, substitutions = null) {
    const message = chrome.i18n.getMessage(key, substitutions);
    if (message) {
        statusEl.textContent = message;
    } else {
        statusEl.textContent = key;
    }
}

// Функция получения локализованной ошибки
function getErrorMessage(errorKey, defaultMessage) {
    const message = chrome.i18n.getMessage(errorKey);
    return message ? message : defaultMessage;
}

// Проверка обновлений при открытии попапа
chrome.storage.local.get(['updateAvailable', 'latestVersion', 'updateUrl'], (result) => {
    if (result.updateAvailable && updateLink) {
        updateLink.href = result.updateUrl;
        const updateTitle = chrome.i18n.getMessage('updateAvailableTitle', result.latestVersion);
        updateLink.title = updateTitle;
        updateLink.style.display = 'inline-block';
        
        // Обновляем текст бейджа (может быть NEW или НОВАЯ в зависимости от языка)
        const updateText = chrome.i18n.getMessage('updateAvailable');
        if (updateText) {
            updateLink.textContent = updateText;
        }
    }
});

// Функция проверки открыто ли окно "Рейтинг эффективности"
async function isRatingWindowOpen() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) return false;
        
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                const ratingWindow = document.querySelector('#ProductionsRating');
                return ratingWindow && ratingWindow.offsetParent !== null;
            }
        });
        
        return results?.[0]?.result || false;
    } catch (err) {
        console.error('Error checking window:', err);
        return false;
    }
}

// Функция извлечения данных (с проверкой при нажатии)
async function extractPlayerData() {
    setStatusMessage('checkingWindow');
    
    const windowOpen = await isRatingWindowOpen();
    
    if (!windowOpen) {
        setStatusMessage('openRatingWindow');
        setTimeout(() => { 
            if (statusEl) setStatusMessage('readyToWork'); 
        }, 3000);
        return;
    }
    
    setStatusMessage('extractingData');
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            world: 'MAIN',
            function: fullExportFromProductions
        });
        
        if (chrome.runtime.lastError) {
            setStatusMessage('errorOccurred', [chrome.runtime.lastError.message]);
            return;
        }
        
        if (!results || !results[0] || !results[0].result) {
            setStatusMessage('productionsNotFound');
            return;
        }
        
        const r = results[0].result;
        if (r.error) {
            setStatusMessage('errorOccurred', [r.error]);
            return;
        }
        
        setStatusMessage('fileSaved', [r.filename]);
        setTimeout(() => { 
            if (statusEl) setStatusMessage('readyToWork'); 
        }, 5000);
        
    } catch (err) {
        console.error(err);
        setStatusMessage('errorOccurred', [err.message]);
    }
}

// Функция импорта City Entities
function importCityEntities() {
    setStatusMessage('extractingBuildings');
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            world: 'MAIN',
            function: exportCityEntitiesFromGame
        }, (results) => {
            if (chrome.runtime.lastError) {
                setStatusMessage('errorOccurred', [chrome.runtime.lastError.message]);
                return;
            }
            if (!results || !results[0] || !results[0].result) {
                setStatusMessage('mainParserNotFound');
                return;
            }
            const r = results[0].result;
            if (r.error) {
                setStatusMessage('errorOccurred', [r.error]);
                return;
            }
            setStatusMessage('buildingsSaved', [r.filename, r.total, r.sizeMB]);
            setTimeout(() => { 
                if (statusEl) setStatusMessage('readyToWork'); 
            }, 7000);
        });
    });
}

// Функция открытия страницы Selection Kits
async function openSelectionKits() {
    setStatusMessage('extractingKits');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Извлекаем данные из игры (та же логика, что раньше, но без скачивания — возвращаем объект)
    let results;
    try {
        results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            world: 'MAIN',
            func: () => {
                if (typeof MainParser === 'undefined' || !MainParser.SelectionKits) {
                    return { error: 'MainParser.SelectionKits not found' };
                }

                const selectionKitsData = {};

                for (const [kitId, kitData] of Object.entries(MainParser.SelectionKits || {})) {
                    if (!kitData) continue;

                    let options = [];
                    if (kitData.options && Array.isArray(kitData.options)) {
                        options = kitData.options;
                    } else if (kitData.eraOptions) {
                        const currentEraOptions = kitData.eraOptions[CurrentEra] || Object.values(kitData.eraOptions)[0];
                        if (currentEraOptions && currentEraOptions.options) options = currentEraOptions.options;
                    }

                    if (options.length === 0) continue;

                    const choices = [];
                    for (const option of options) {
                        const item = option.item;
                        if (!item) continue;

                        const choice = { type: null, id: null, name: null, amount: option.amount || 1 };

                        if (item.__class__ === 'BuildingItemPayload') {
                            choice.type = 'building';
                            choice.id = item.cityEntityId;
                            choice.name = MainParser.CityEntities?.[item.cityEntityId]?.name || item.cityEntityId;
                        } else if (item.__class__ === 'UpgradeKitPayload') {
                            choice.type = 'upgrade_kit';
                            choice.id = item.upgradeItemId;
                            choice.name = MainParser.BuildingUpgrades?.[item.upgradeItemId]?.upgradeItem?.name || item.upgradeItemId;
                        } else if (item.__class__ === 'SelectionKitPayload') {
                            choice.type = 'selection_kit';
                            choice.id = item.selectionKitId;
                            choice.name = MainParser.SelectionKits?.[item.selectionKitId]?.name || item.selectionKitId;
                        } else {
                            choice.type = item.__class__;
                            choice.id = item.id || item.cityEntityId || item.upgradeItemId || item.selectionKitId;
                            choice.name = item.name || 'Unknown item';
                        }
                        choices.push(choice);
                    }

                    selectionKitsData[kitId] = {
                        name: kitData.name || kitId,
                        description: kitData.description || '',
                        choices: choices
                    };
                }

                return {
                    exportedAt: new Date().toISOString(),
                    total: Object.keys(selectionKitsData).length,
                    selectionKits: selectionKitsData
                };
            }
        });
    } catch (err) {
        setStatusMessage('errorOccurred', [err.message]);
        return;
    }

    if (chrome.runtime.lastError) {
        setStatusMessage('errorOccurred', [chrome.runtime.lastError.message]);
        return;
    }
    if (!results || !results[0] || !results[0].result) {
        setStatusMessage('selectionKitsNotFound');
        return;
    }

    const r = results[0].result;
    if (r.error) {
        setStatusMessage('selectionKitsNotFound');
        return;
    }

    // Сохраняем данные в chrome.storage.session — доступно всем страницам расширения
    await chrome.storage.session.set({ kitsData: r });

    const kitsUrl = chrome.runtime.getURL('kits.html');
    await chrome.tabs.create({ url: kitsUrl });

    window.close();
}

// Обработчики событий
extractBtn.addEventListener('click', extractPlayerData);
importCityBtn.addEventListener('click', importCityEntities);
openKitsBtn.addEventListener('click', openSelectionKits);

// Кнопка Bubble Shooter
const openBubbleBtn = document.getElementById('openBubbleButton');

openBubbleBtn.addEventListener('click', () => {
    const url = chrome.runtime.getURL('bubble.html');
    chrome.tabs.create({ url: url });
});

// Кнопка QI-Plan
const openKvagBtn = document.getElementById('openKvagButton');
if (openKvagBtn) {
    openKvagBtn.addEventListener('click', () => {
        const url = chrome.runtime.getURL('kvag.html');
        chrome.tabs.create({ url: url });
    });
}


// ======================
// FULL EXPORT FROM PRODUCTIONS (полный оригинальный код)
// ======================
function fullExportFromProductions() {
    if (typeof Productions === 'undefined') {
        return { error: "Productions not found" };
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
                    all: { attackerAttack: 0, attackerDefense: 0, defenderAttack: 0, defenderDefense: 0 },
                    battleground: { attackerAttack: 0, attackerDefense: 0, defenderAttack: 0, defenderDefense: 0 },
                    guild_expedition: { attackerAttack: 0, attackerDefense: 0, defenderAttack: 0, defenderDefense: 0 },
                    guild_raids: { attackerAttack: 0, attackerDefense: 0, defenderAttack: 0, defenderDefense: 0 }
                }
            }
        },

        productionBoosts: {
            forge_points_production: { total: 0, buildings: [] },
            coin_production: { total: 0, buildings: [] },
            supply_production: { total: 0, buildings: [] },
            goods_production: { total: 0, buildings: [] },
            special_goods_production: { total: 0, buildings: [] }
        },

        resources: {
            strategy_points: { total: 0, motivated: 0, unmotivated: 0, buildings: [] },
            money: { total: 0, motivated: 0, unmotivated: 0, buildings: [] },
            supplies: { total: 0, motivated: 0, unmotivated: 0, buildings: [] },
            medals: { total: 0, motivated: 0, unmotivated: 0, buildings: [] },
            premium: { total: 0, buildings: [] },
            goods: { total: 0, byEra: {}, buildings: [] },
            clan_goods: { total: 0, byEra: {}, buildings: [] },
            special_goods: { total: 0, buildings: [] },
            units: { total: 0, byType: {}, buildings: [] },
            items: { total: 0, byType: {}, buildings: [] }
        },

        fragments: {
            set: [],
            list: [],
            byBuilding: []
        },

        goodsByEra: {
            previous: {},
            current: {},
            next: {}
        },

        buildingsDetailed: []
    };

    const fragmentsSet = new Set();

    for (const building of Productions.BuildingsAll) {
        if (!building) continue;

        const sizeLength = building.size?.length || building.sizeLength || 1;
        const sizeWidth = building.size?.width || building.sizeWidth || 1;
        const sizeTiles = sizeLength * sizeWidth;

        const buildingDetail = {
            id: building.id,
            entityId: building.entityId,
            name: building.name,
            type: building.type,
            era: building.eraName,
            size: `${sizeLength}x${sizeWidth}`,
            sizeTiles: sizeTiles,
            population: building.population || 0,
            happiness: building.happiness || 0,
            isBoostable: building.isBoostable || false,
            isPolivated: building.state?.isPolivated || false,
            isCollectable: building.state?.name === 'collectable',
            collectTime: building.state?.times?.at || null,
            needsStreet: building.needsStreet || 0,
            setBuilding: building.setBuilding?.name || null,
            chainBuilding: building.chainBuilding?.name || null,
            boosts: [],
            productions: [],
            goodsProduction: {},
            guildGoodsProduction: {},
            battleStats: {
                attackerAttack: 0,
                attackerDefense: 0,
                defenderAttack: 0,
                defenderDefense: 0,
                byFeature: {}
            },
            productionBonuses: {
                fp: 0,
                coins: 0,
                supplies: 0,
                goods: 0
            }
        };

        if (building.boosts && Array.isArray(building.boosts)) {
            for (const boost of building.boosts) {
                if (!boost || !boost.type) continue;
                const boostTypes = Array.isArray(boost.type) ? boost.type : [boost.type];
                const boostValue = boost.value || 0;
                const boostFeature = boost.feature || 'all';

                for (const bt of boostTypes) {
                    buildingDetail.boosts.push({
                        type: bt,
                        value: boostValue,
                        feature: boostFeature
                    });

                    if (bt === 'att_boost_attacker') {
                        buildingDetail.battleStats.attackerAttack += boostValue;
                        fullData.battleBoosts.summary.attacker.attack += boostValue;
                        if (fullData.battleBoosts.summary.byFeature[boostFeature]) {
                            fullData.battleBoosts.summary.byFeature[boostFeature].attackerAttack += boostValue;
                        }
                    }
                    if (bt === 'def_boost_attacker') {
                        buildingDetail.battleStats.attackerDefense += boostValue;
                        fullData.battleBoosts.summary.attacker.defense += boostValue;
                        if (fullData.battleBoosts.summary.byFeature[boostFeature]) {
                            fullData.battleBoosts.summary.byFeature[boostFeature].attackerDefense += boostValue;
                        }
                    }
                    if (bt === 'att_boost_defender') {
                        buildingDetail.battleStats.defenderAttack += boostValue;
                        fullData.battleBoosts.summary.defender.attack += boostValue;
                        if (fullData.battleBoosts.summary.byFeature[boostFeature]) {
                            fullData.battleBoosts.summary.byFeature[boostFeature].defenderAttack += boostValue;
                        }
                    }
                    if (bt === 'def_boost_defender') {
                        buildingDetail.battleStats.defenderDefense += boostValue;
                        fullData.battleBoosts.summary.defender.defense += boostValue;
                        if (fullData.battleBoosts.summary.byFeature[boostFeature]) {
                            fullData.battleBoosts.summary.byFeature[boostFeature].defenderDefense += boostValue;
                        }
                    }

                    if (bt === 'forge_points_production') {
                        buildingDetail.productionBonuses.fp = boostValue;
                        fullData.productionBoosts.forge_points_production.total += boostValue;
                        fullData.productionBoosts.forge_points_production.buildings.push({ name: building.name, value: boostValue });
                    }
                    if (bt === 'coin_production') {
                        buildingDetail.productionBonuses.coins = boostValue;
                        fullData.productionBoosts.coin_production.total += boostValue;
                        fullData.productionBoosts.coin_production.buildings.push({ name: building.name, value: boostValue });
                    }
                    if (bt === 'supply_production') {
                        buildingDetail.productionBonuses.supplies = boostValue;
                        fullData.productionBoosts.supply_production.total += boostValue;
                        fullData.productionBoosts.supply_production.buildings.push({ name: building.name, value: boostValue });
                    }
                    if (bt === 'goods_production') {
                        buildingDetail.productionBonuses.goods = boostValue;
                        fullData.productionBoosts.goods_production.total += boostValue;
                        fullData.productionBoosts.goods_production.buildings.push({ name: building.name, value: boostValue });
                    }
                }
            }
        }

        const allProductions = [
            ...(building.production || []),
            ...(building.state?.production || [])
        ];

        for (const prod of allProductions) {
            if (!prod) continue;

            if (prod.type === 'resources' && prod.resources) {
                for (const [resType, amount] of Object.entries(prod.resources)) {
                    if (amount > 0) {
                        const prodInfo = {
                            type: 'resources',
                            resource: resType,
                            amount: amount,
                            doubleWhenMotivated: prod.doubleWhenMotivated || false
                        };
                        buildingDetail.productions.push(prodInfo);

                        let finalAmount = amount;
                        if (building.isBoostable && building.isPolivated && prod.doubleWhenMotivated) {
                            finalAmount = amount * 2;
                        }

                        if (resType === 'strategy_points') {
                            fullData.resources.strategy_points.total += finalAmount;
                            if (building.isPolivated) fullData.resources.strategy_points.motivated += finalAmount;
                            else fullData.resources.strategy_points.unmotivated += amount;
                            fullData.resources.strategy_points.buildings.push({ name: building.name, amount: finalAmount, motivated: building.isPolivated });
                        }
                        if (resType === 'money') {
                            fullData.resources.money.total += finalAmount;
                            if (building.isPolivated) fullData.resources.money.motivated += finalAmount;
                            else fullData.resources.money.unmotivated += amount;
                            fullData.resources.money.buildings.push({ name: building.name, amount: finalAmount });
                        }
                        if (resType === 'supplies') {
                            fullData.resources.supplies.total += finalAmount;
                            if (building.isPolivated) fullData.resources.supplies.motivated += finalAmount;
                            else fullData.resources.supplies.unmotivated += amount;
                            fullData.resources.supplies.buildings.push({ name: building.name, amount: finalAmount });
                        }
                        if (resType === 'medals') {
                            fullData.resources.medals.total += amount;
                            fullData.resources.medals.buildings.push({ name: building.name, amount: amount });
                        }
                        if (resType === 'premium') {
                            fullData.resources.premium.total += amount;
                            fullData.resources.premium.buildings.push({ name: building.name, amount: amount });
                        }
                        if (resType.includes('good')) {
                            fullData.resources.goods.total += amount;
                            fullData.resources.goods.buildings.push({ name: building.name, good: resType, amount: amount });
                            const era = building.eraName || 'unknown';
                            if (!fullData.resources.goods.byEra[era]) fullData.resources.goods.byEra[era] = 0;
                            fullData.resources.goods.byEra[era] += amount;
                        }
                    }
                }
            }

            if (prod.type === 'guildResources' && prod.resources) {
                const amount = prod.resources.all_goods_of_age || Object.values(prod.resources)[0] || 0;
                buildingDetail.productions.push({
                    type: 'guildResources',
                    resource: 'clan_goods',
                    amount: amount
                });
                fullData.resources.clan_goods.total += amount;
                fullData.resources.clan_goods.buildings.push({ name: building.name, amount: amount });
                const era = building.eraName || 'unknown';
                if (!fullData.resources.clan_goods.byEra[era]) fullData.resources.clan_goods.byEra[era] = 0;
                fullData.resources.clan_goods.byEra[era] += amount;
            }

            if (prod.type === 'special_goods' && prod.resources) {
                let total = 0;
                for (const val of Object.values(prod.resources)) {
                    if (typeof val === 'number') total += val;
                }
                buildingDetail.productions.push({
                    type: 'special_goods',
                    resource: 'special_goods',
                    amount: total
                });
                fullData.resources.special_goods.total += total;
                fullData.resources.special_goods.buildings.push({ name: building.name, amount: total });
            }

            if (prod.type === 'unit' && prod.resources) {
                for (const [unitType, amount] of Object.entries(prod.resources)) {
                    if (amount > 0) {
                        buildingDetail.productions.push({
                            type: 'unit',
                            resource: unitType,
                            amount: amount
                        });
                        fullData.resources.units.total += amount;
                        if (!fullData.resources.units.byType[unitType]) fullData.resources.units.byType[unitType] = 0;
                        fullData.resources.units.byType[unitType] += amount;
                        fullData.resources.units.buildings.push({ name: building.name, unit: unitType, amount: amount });
                    }
                }
            }

            if (prod.type === 'random' && prod.resources && Array.isArray(prod.resources)) {
                for (const res of prod.resources) {
                    if (res && res.type) {
                        const expectedValue = (res.amount || 0) * (res.dropChance || 0);
                        if (expectedValue > 0) {
                            buildingDetail.productions.push({
                                type: 'random',
                                resource: res.name || res.type,
                                amount: res.amount,
                                dropChance: res.dropChance,
                                expectedValue: expectedValue
                            });
                            if (res.type === 'unit') {
                                fullData.resources.units.total += expectedValue;
                                if (!fullData.resources.units.byType[res.name]) fullData.resources.units.byType[res.name] = 0;
                                fullData.resources.units.byType[res.name] += expectedValue;
                            }
                            if (res.type === 'consumable') {
                                fullData.resources.items.total += expectedValue;
                                if (!fullData.resources.items.byType[res.name]) fullData.resources.items.byType[res.name] = 0;
                                fullData.resources.items.byType[res.name] += expectedValue;
                            }
                        }
                    }
                }
            }

            if (prod.type === 'genericReward' && prod.resources) {
                const isFragment = prod.resources.subType === 'fragment';
                buildingDetail.productions.push({
                    type: 'genericReward',
                    resource: prod.resources.name,
                    amount: prod.resources.amount,
                    isFragment: isFragment
                });
                if (isFragment) {
                    fragmentsSet.add(prod.resources.name);
                    fullData.fragments.list.push({
                        name: prod.resources.name,
                        building: building.name,
                        amount: prod.resources.amount
                    });
                }
            }
        }

        if (typeof CityBuildings !== 'undefined') {
            try {
                const goodsByEra = CityBuildings.getBuildingGoodsByEra(false, building, true);
                if (goodsByEra && goodsByEra.eras) {
                    buildingDetail.goodsProduction = goodsByEra.eras;
                    for (const [era, amount] of Object.entries(goodsByEra.eras)) {
                        const eraNum = parseInt(era);
                        const currentEraNum = typeof CurrentEra !== 'undefined' ? CurrentEra : 0;
                        if (eraNum === currentEraNum - 1) fullData.goodsByEra.previous[building.name] = (fullData.goodsByEra.previous[building.name] || 0) + amount;
                        if (eraNum === currentEraNum) fullData.goodsByEra.current[building.name] = (fullData.goodsByEra.current[building.name] || 0) + amount;
                        if (eraNum === currentEraNum + 1) fullData.goodsByEra.next[building.name] = (fullData.goodsByEra.next[building.name] || 0) + amount;
                    }
                }
                const guildGoodsByEra = CityBuildings.getBuildingGuildGoodsByEra(false, building, true);
                if (guildGoodsByEra && guildGoodsByEra.eras) {
                    buildingDetail.guildGoodsProduction = guildGoodsByEra.eras;
                }
            } catch(e) {}
        }

        if (!fullData.buildingsByType[building.type]) fullData.buildingsByType[building.type] = [];
        fullData.buildingsByType[building.type].push(building.name);

        fullData.buildingsDetailed.push(buildingDetail);

        if (buildingDetail.battleStats.attackerAttack > 0 ||
            buildingDetail.battleStats.attackerDefense > 0 ||
            buildingDetail.battleStats.defenderAttack > 0 ||
            buildingDetail.battleStats.defenderDefense > 0) {
            fullData.battleBoosts.byBuilding.push(buildingDetail);
        }
    }

    fullData.fragments.set = Array.from(fragmentsSet);

    try {
        const filename = `foe_complete_data_${Date.now()}.json`;
        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
        return { ok: true, filename };
    } catch(e) {
        return { error: e.message };
    }
}

// ======================
// ОСТАЛЬНЫЕ ФУНКЦИИ
// ======================
function exportCityEntitiesFromGame() {
    if (typeof MainParser === 'undefined' || !MainParser.CityEntities) {
        return { error: "MainParser.CityEntities not found" };
    }

    const fullDB = {};
    for (const [id, b] of Object.entries(MainParser.CityEntities)) {
        fullDB[id] = b;
    }

    try {
        const jsonStr = JSON.stringify(fullDB, null, 2);
        const total = Object.keys(fullDB).length;
        const sizeMB = (jsonStr.length / 1024 / 1024).toFixed(2);
        const filename = `foe_city_entities_${Date.now()}.json`;
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
        return { ok: true, filename, total, sizeMB };
    } catch(e) {
        return { error: e.message };
    }
}

