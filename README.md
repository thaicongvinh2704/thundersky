# Sky Thunder

Sky Thunder la game ban may bay 2D doc bang HTML5 Canvas, duoc tach thanh project ES Modules de de bao tri va mo rong.

## Cach chay

Mo truc tiep `index.html` hoac `Sky-Thunder-Play.html` trong trinh duyet la choi duoc ngay, khong can Apache hay local server.

### Sau khi sua source

Project van giu source ES Modules trong `src/` de de sua code. Sau khi sua source hoac CSS, chay:

```bash
node sky-thunder/tools/build-standalone.js
```

Lenh nay se build lai `index.html` va `Sky-Thunder-Play.html`.

## Controls

- WASD hoac mui ten: di chuyen
- Space hoac giu chuot trai: ban
- P: tam dung
- Enter: bat dau khi dang o menu

## Cau truc

- `styles/`: CSS tach rieng cho base, HUD va menu.
- `src/core/`: game loop, input, renderer, collision va state.
- `src/entities/`: player, enemy, boss, bullet, power-up, particle.
- `src/systems/`: spawn, stage, upgrade va effects.
- `src/data/`: config stage, enemy, upgrade va balance.
- `src/ui/`: HUD, menu, upgrade screen va game over/win screen.

## Gameplay

- Stage 1-4 la cac dot song sot theo thoi gian.
- Sau moi stage, nguoi choi chon 1 trong 3 nang cap ngau nhien.
- Stage 5 la boss cuoi voi 3 phase.
- Boss chet se hien man hinh Victory.
