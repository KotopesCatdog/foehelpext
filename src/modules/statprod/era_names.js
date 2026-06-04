const ERA_NAMES_RU = {
    "NoEra":                 "—",
    "BronzeAge":             "БВ",
    "IronAge":               "ЖВ",
    "EarlyMiddleAge":        "РС",
    "HighMiddleAge":         "ВС",
    "LateMiddleAge":         "ПС",
    "ColonialAge":           "Кол",
    "IndustrialAge":         "Инд",
    "ProgressiveEra":        "Прог",
    "ModernEra":             "Мод",
    "PostModernEra":         "ПМод",
    "ContemporaryEra":       "Нов",
    "TomorrowEra":           "Завт",
    "FutureEra":             "Буд",
    "ArcticFuture":          "Аркт",
    "OceanicFuture":         "Океан",
    "VirtualFuture":         "Вирт",
    "SpaceAgeMars":          "Mars",
    "SpaceAgeAsteroidBelt":  "Belt",
    "SpaceAgeVenus":         "Venus",
    "SpaceAgeJupiterMoon":   "Jupi",
    "SpaceAgeTitan":         "Titan",
    "SpaceAgeSpaceHub":      "Hub",
};

const ERA_NAMES_EN = {
    "NoEra":                 "—",
    "BronzeAge":             "BA",
    "IronAge":               "IA",
    "EarlyMiddleAge":        "EMA",
    "HighMiddleAge":         "HMA",
    "LateMiddleAge":         "LMA",
    "ColonialAge":           "CA",
    "IndustrialAge":         "InA",
    "ProgressiveEra":        "PE",
    "ModernEra":             "ME",
    "PostModernEra":         "PME",
    "ContemporaryEra":       "CE",
    "TomorrowEra":           "TE",
    "FutureEra":             "FE",
    "ArcticFuture":          "AF",
    "OceanicFuture":         "OF",
    "VirtualFuture":         "VF",
    "SpaceAgeMars":          "Mars",
    "SpaceAgeAsteroidBelt":  "Belt",
    "SpaceAgeVenus":         "Venus",
    "SpaceAgeJupiterMoon":   "Jupi",
    "SpaceAgeTitan":         "Titan",
    "SpaceAgeSpaceHub":      "Hub",
};

function eraName(b) {
    const dict = (typeof currentLang !== 'undefined' && currentLang === 'en')
        ? ERA_NAMES_EN
        : ERA_NAMES_RU;
    return dict[b.eraName] || b.eraName || "";
}