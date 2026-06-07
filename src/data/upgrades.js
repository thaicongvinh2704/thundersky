export const UPGRADES = [
  {
    id: "fireRate",
    group: "attack",
    tags: ["attack", "bullet"],
    name: "Fire Rate",
    description: "Giam cooldown ban, giup xa dan lien tuc hon.",
    apply(player) {
      player.stats.fireRate += 1;
    }
  },
  {
    id: "spread",
    group: "attack",
    tags: ["attack", "bullet"],
    name: "Spread Shot",
    description: "Tang so tia dan toi da 5 tia.",
    apply(player) {
      player.stats.spread = Math.min(5, player.stats.spread + 1);
    }
  },
  {
    id: "damage",
    group: "attack",
    tags: ["attack", "bullet"],
    name: "Bullet Damage",
    description: "Tang sat thuong cua dan chinh.",
    apply(player) {
      player.stats.damage += 1;
    }
  },
  {
    id: "maxHp",
    group: "defense",
    tags: ["defense", "armor"],
    name: "Max HP",
    description: "Tang mau toi da va hoi mot phan mau.",
    apply(player) {
      player.maxHealth += 22;
      player.health = Math.min(player.maxHealth, player.health + 38);
    }
  },
  {
    id: "shield",
    group: "defense",
    tags: ["defense", "shield"],
    name: "Shield",
    description: "Chan 1 lan sat thuong tiep theo.",
    apply(player) {
      player.shields += 1;
    }
  },
  {
    id: "missile",
    group: "special",
    tags: ["special", "missile"],
    name: "Missile",
    description: "Tu dong phong ten lua tim muc tieu moi vai giay.",
    apply(player) {
      player.stats.missile += 1;
    }
  },
  {
    id: "engineBoost",
    group: "defense",
    tags: ["defense", "mobility"],
    name: "Engine Boost",
    description: "Tang toc do di chuyen, giup ne dan va gom power-up tot hon.",
    apply(player) {
      player.speed += 38;
    }
  },
  {
    id: "rapidMissiles",
    group: "special",
    tags: ["special", "missile", "attack"],
    name: "Missile Rack",
    description: "Ten lua tu dong phong nhanh hon va gay them sat thuong.",
    apply(player) {
      player.stats.missile += 1;
      player.stats.damage += 0.35;
    }
  },
  {
    id: "armorPlating",
    group: "defense",
    tags: ["defense", "armor", "shield"],
    name: "Armor Plating",
    description: "Giam 15% sat thuong nhan vao trong phan con lai cua tran.",
    apply(player) {
      player.stats.damageReduction = Math.min(0.45, player.stats.damageReduction + 0.15);
    }
  },
  {
    id: "repairDrone",
    group: "defense",
    tags: ["defense", "drone", "armor"],
    name: "Repair Drone",
    description: "Hoi mau nhe moi giay khi mau duoi 70%.",
    apply(player) {
      player.stats.regen += 2.1;
    }
  },
  {
    id: "stormCore",
    group: "special",
    tags: ["special", "thunder"],
    name: "Storm Core",
    description: "Thunder Storm gay them sat thuong va nap energy nhanh hon.",
    apply(player) {
      player.stats.thunderDamage += 1;
      player.stats.thunderCharge += 0.25;
    }
  },
  {
    id: "wideStorm",
    group: "special",
    tags: ["special", "thunder"],
    name: "Wide Storm",
    description: "Tang ban kinh Thunder Storm va lam boss mat them mau.",
    apply(player) {
      player.stats.thunderRadius += 120;
      player.stats.thunderBossBonus += 35;
    }
  },
  {
    id: "staticField",
    group: "special",
    tags: ["special", "thunder", "shield"],
    name: "Static Field",
    description: "Sau Thunder Storm, may bay co them 2 shield neu dang thieu.",
    apply(player) {
      player.stats.thunderShield += 1;
    }
  },
  {
    id: "capacitor",
    group: "special",
    tags: ["special", "thunder"],
    name: "Capacitor",
    description: "Giam cooldown Thunder Skill va tang energy nhan tu power-up.",
    apply(player) {
      player.stats.thunderCooldown = Math.max(2.8, player.stats.thunderCooldown - 1.1);
      player.stats.thunderCharge += 0.2;
    }
  }
];
