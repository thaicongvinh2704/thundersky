# Sky Thunder - Bao Cao Ky Thuat Va Thiet Ke Game

Tai lieu nay tong hop toan bo nhung gi dang co trong game Sky Thunder de ban co the nam ro codebase va phat trien tiep. Game hien la game ban may bay 2D doc, chay bang HTML5 Canvas, viet bang JavaScript ES Modules, co ban standalone HTML de double-click mo la choi.

## Cap Nhat Moi Ban 2.0 - Hangar, Ship Build Va Combat Depth

Ban 2.0 nang gameplay theo huong shoot 'em up co build ro hon:

- Them `src/data/ships.js` voi 5 ship: Falcon, Viper, Titan, Specter, Stormwing.
- Them Hangar trong menu chinh, co stat bar, passive, unlock/selected state va credits.
- `SaveSystem.js` luu `selectedShipId`, `unlockedShips`, `credits`, `lastCreditsEarned`.
- `Player.js` nhan stat tu ship: HP, speed, damage/fire rate scale, Thunder charge, shield start, graze scale va magnet radius.
- Player draw doi mau va dung 3 silhouette: balanced, sharp/agile, heavy.
- Them weapon level `Lv.1-4`; nhat cung weapon se tang level, doi weapon giu level hop ly.
- HUD hien `Ship` va `Gun Lv.N`.
- Upgrade co `tags`; du 3 tag lien quan se kich hoat synergy mot lan.
- Synergy moi: Bullet Storm, Thunder Mastery, Guardian Core, Missile Network.
- Them graze system: dan dich bay sat player se cong diem nho, combo timer nho va Thunder energy; moi bullet chi graze mot lan.
- Them item magnet cho power-up, radius scale theo ship va mobile.
- Them danger indicator canvas cho danger wave, Thunder Hunter dash va boss laser.
- Them enemy role moi: `sniper`, `carrier`, `shieldGuard`.
- Stage 2-4 co wave moi de gioi thieu sniper/carrier/shieldGuard theo identity rieng.
- Stage clear screen hien rank S/A/B/C, kills, damage taken, max combo va credits stage.
- Finish run tinh earned credits tu score, kill, endless time va stage rank bonus.
- Build standalone da include `ships.js` va tao lai `index.html`, `Sky-Thunder-Play.html`.

Test local da chay:

- `node --check` cho cac file JS chinh da sua.
- `node --check sky-thunder/tools/build-standalone.js`.
- `node sky-thunder/tools/build-standalone.js`: pass.

## Cap Nhat Moi - Control & Item Clarity

Ban update nay tap trung vao dieu khien PC, pause va do ro cua item:

- Chuot phai tren desktop kich hoat Thunder Skill.
- Chuot trai van dung de drag/fire; chuot phai khong mo context menu browser tren canvas.
- Them ESC de pause/resume, giu P nhu cu.
- Ho tro middle mouse / mouse button 4 de pause neu trinh duyet gui pointer event.
- Them Q lam phim phu kich hoat Thunder; E va Shift van giu.
- Khi Thunder chua san sang, game hien `Thunder Not Ready` hoac `Cooldown: Ns`.
- Nut Pause UI doi sang text `Pause`, de nhin hon tren desktop/mobile.
- Pause menu co Resume, Restart, Sound On/Off, Controls, Main Menu.
- Controls trong pause hien ngan: Move, Fire, Thunder, Pause.
- Power-up weapon drop hien label ro `LASER`, `FLAK`, `VOLT`.
- Neu weapon drop trung weapon dang dung thi hien `LV UP`; neu khac thi hien `SWITCH`.
- Power-up co mau rieng, shape/icon rieng, glow/pulse nhe va text nho hon tren mobile.
- Them pickup feedback: weapon level/switch, repair, energy, shield, bomb, rapid, magnet.
- Them item moi:
  - `shield`: them 1 shield.
  - `bomb`: gay damage dien rong nho, xoa phan lon enemy bullets, effect nhe hon Thunder.
  - `rapid`: tang fire rate tam thoi 6 giay.
  - `magnet`: tang manh ban kinh hut power-up trong 5 giay.
- HUD hien timer nho cho Rapid/Magnet khi dang active.
- Drop table moi giu item vua phai: enemy thuong khoang 20%, tank/carrier/shieldGuard/mini boss khoang 40%.
- Build standalone da tao lai `index.html` va `Sky-Thunder-Play.html`.

## Cap Nhat Moi Sau Ban Nang Cap Arcade

Nhung tinh nang moi da them de dua game gan hon chat luong submit Y8/CrazyGames:

- High Score bang `localStorage`, luu best score, stage cao nhat va so enemy destroy cao nhat.
- Man hinh Game Over/Win hien `score`, `best score`, `stage reached`, `enemies destroyed`.
- `SaveSystem.js` quan ly luu diem va thong ke best run.
- `AudioSystem.js` tao am thanh procedural bang WebAudio: shoot, explosion, pickup, hit, upgrade, boss warning, thunder va music loop nhe.
- Them nut `Sound On/Off` de mute/unmute.
- Sua rui ro start nhieu game loop cung luc bang `running`, `loopId`, `cancelAnimationFrame`.
- Menu co tutorial ngan: auto-fire, drag move, Thunder Skill, pause.
- Mobile/drag control duoc toi uu: auto-fire mac dinh, drag-to-move, nut `Thunder`, canvas `touch-action: none`.
- Sua loi keo chuot sat vien man hinh bi mat dieu khien bang `setPointerCapture`, `releasePointerCapture` va clamp toa do pointer vao viewport.
- Energy da thanh Thunder Skill that su.
- Thunder Storm can energy 100, co cooldown, xoa dan dich, gay damage dien rong, gay damage boss, tao set, screen shake va am thanh.
- Them 8 upgrade moi: `Engine Boost`, `Missile Rack`, `Armor Plating`, `Repair Drone`, `Storm Core`, `Wide Storm`, `Static Field`, `Capacitor`.
- Upgrade duoc chia group `attack`, `defense`, `special`; mot so upgrade anh huong truc tiep Thunder Skill.
- Stage 1-4 co wave pattern dac trung: `line`, `vee`, `sides`.
- Stage 2 co mini boss `Storm Warden`.
- Build standalone da duoc cap nhat de nhung HUD moi, nut mute, nut Thunder, SaveSystem va AudioSystem.

## Cap Nhat Moi Ban 1.1 - Endless, Combo Va Bonus

Ban 1.1 tap trung vao replay value va scoring loop de game hop hon voi arcade portal.

File da sua trong ban 1.1:

- `src/core/StateManager.js`: co state `ENDLESS`.
- `src/core/Game.js`: them Endless Mode, combo multiplier, score multiplier, bonus diem, max combo, endless time, victory continue flow.
- `src/systems/SpawnSystem.js`: them endless spawn, difficulty scaling, endless wave, endless mini boss va warning wave.
- `src/systems/StageSystem.js`: them stage clear bonus va no-hit stage bonus.
- `src/systems/SaveSystem.js`: luu them best endless time va best max combo.
- `src/systems/EffectsSystem.js`: them warning text va gioi han particle toi da.
- `src/core/Renderer.js`: ve warning text tren canvas.
- `src/entities/Enemy.js`: them scale HP/speed/fire rate/score cho endless va flash khi bi hit.
- `src/entities/Boss.js`: boss flash khi bi hit.
- `src/entities/Player.js`: ghi nhan hit de reset combo va tinh no-hit bonus.
- `src/ui/Hud.js`: hien combo multiplier, combo timer bar, endless/best endless, va lam nut Thunder sang khi ready.
- `src/ui/Menu.js`: ho tro nut phu.
- `src/ui/GameOverScreen.js`: Victory co `Continue Endless` va `Restart`, summary co max combo/endless.
- `src/ui/UpgradeScreen.js`: an nut phu khi chon upgrade.
- `src/main.js`: bind them HUD/menu element moi.
- `styles/hud.css`: style combo bar va Thunder ready glow.
- `styles/menu.css`: style nut phu.
- `tools/build-standalone.js`: them markup combo HUD, endless text va secondary button trong standalone.
- `index.html`, `Sky-Thunder-Play.html`: da duoc tao lai bang build script.

### Endless Mode

Sau khi ha boss Stage 5, man hinh Victory co 2 lua chon:

- `Continue Endless`: tiep tuc run hien tai, giu score/nang cap/player state va vao che do endless.
- `Restart`: reset run moi.

Trong Endless:

- Enemy spawn vo han bang random spawn + wave pattern.
- Mini boss `warden` xuat hien dinh ky.
- Do kho tang theo thoi gian song sot va co gioi han:
  - HP enemy tang toi da khoang 2.6x.
  - Speed tang toi da khoang 1.55x.
  - Fire rate scale tang toi da khoang 1.9x.
  - Spawn interval giam nhung khong thap hon 0.26s.
  - Score scale tang toi da khoang 2.4x.
- Endless score multiplier tang theo thoi gian song sot, toi da 3.5x.
- Moi 15 giay co survival bonus.

### Combo Multiplier

Combo moi:

- Moi kill enemy se tang combo count.
- Combo timer mac dinh 3.2 giay.
- Kill tiep trong thoi gian nay se giu combo va tang multiplier.
- Cong thuc hien tai: moi 3 kill tang 0.25x, toi da 6x.
- Bị trung dan/va cham hoac het combo timer se reset ve x1.
- Diem kill enemy duoc nhan voi combo multiplier va endless multiplier.
- HUD hien `Combo xN.NN` va thanh thoi gian combo.
- Game Over/Win hien max combo cua run.

### Bonus Diem

Bonus moi:

- Stage clear bonus: `450 + stageId * 180`.
- No-hit stage bonus: `850 + stageId * 220` neu stage khong bi hit.
- Boss clear time bonus: toi da 1800 diem, giam theo thoi gian ha boss.
- Endless survival bonus: moi 15 giay, dua tren thoi gian song sot va multiplier.

### Feedback Gameplay Moi

- Thunder button co class `ready`, glow va scale nhe khi energy du 100 va het cooldown.
- Enemy va boss flash trang khi bi hit.
- Wave nguy hiem va mini boss co warning text tren canvas.
- Particle co gioi han `maxParticles = 280` de tranh qua nang khi Thunder/endless nhieu enemy.

### SaveSystem 1.1

Key van la:

```text
skyThunderSaveV1
```

Du lieu best run hien co:

- `score`
- `stage`
- `enemiesDestroyed`
- `endlessTime`
- `maxCombo`

Neu save cu chua co field moi, game merge default nen khong loi.

### Cach Test Ban 1.1

1. Chay build:

```bash
node sky-thunder/tools/build-standalone.js
```

2. Mo `sky-thunder/index.html` hoac `sky-thunder/Sky-Thunder-Play.html`.
3. Test combo:
   - Kill lien tiep nhieu enemy, HUD phai tang `Combo`.
   - Dung qua lau hoac bi hit, combo ve x1.
4. Test bonus stage:
   - Qua stage, phai hien warning/bonus text.
   - Qua stage khong bi hit, phai co `No-hit Bonus`.
5. Test boss:
   - Boss flash khi bi hit.
   - Ha boss, Victory co `Continue Endless` va `Restart`.
6. Test Endless:
   - Bam `Continue Endless`, game tiep tuc khong reset score/nang cap.
   - HUD hien Endless time va multiplier.
   - Wave/mini boss tiep tuc spawn, do kho tang dan.
7. Test save:
   - Ket thuc run, Game Over/Win hien max combo va endless time.
   - Reload file, best score/best endless van con neu browser cho phep `localStorage`.

### Rui Ro Can Balance Tiep

- Combo x6 va Endless multiplier x3.5 co the lam diem tang rat nhanh neu player manh.
- No-hit bonus co the hoi cao voi player dung shield, vi shield hit van duoc tinh la bi hit.
- Endless mini boss interval va spawn cap can playtest tren mobile de dam bao khong qua day.
- Boss clear time bonus can playtest lai neu boss HP/weapon upgrade duoc thay doi.
- Warning text dung chung audio `warning`, co the hoi nhieu neu wave day lien tuc.

## Cap Nhat Moi Ban 1.2 - Debug, Thunder Hunter Va Wave Nang Cao

Ban 1.2 tap trung vao gameplay depth, kiem tra hieu nang va can bang diem so nhe hon cho Endless.

File da sua trong ban 1.2:

- `src/core/Input.js`: them phim `F3` de bat/tat debug overlay.
- `src/core/Game.js`: them debug FPS/stat overlay, cap mem bullet/powerup, giam max combo/endless multiplier.
- `src/data/enemies.js`: them mini boss `hunter` ten `Thunder Hunter`.
- `src/entities/Enemy.js`: them behavior rieng cho Thunder Hunter, attack pattern va hit flash tiep tuc hoat dong.
- `src/data/stages.js`: them wave moi cho Stage 3/4 va Thunder Hunter gan cuoi Stage 4.
- `src/systems/SpawnSystem.js`: them pattern `wall`, `rain`, `ambush`, `elite`, them pool wave moi cho Endless, giam random spawn khi man qua dong.
- `src/main.js`: bind DOM debug overlay.
- `styles/hud.css`: style debug overlay.
- `tools/build-standalone.js`: them markup debug overlay vao standalone.
- `index.html`, `Sky-Thunder-Play.html`: da build lai bang script.

### Performance Debug Overlay

Debug overlay mac dinh tat.

Bat/tat bang:

```text
F3
```

Thong tin hien thi:

- FPS.
- Current state.
- So enemy.
- So player bullet.
- So enemy bullet.
- So particle.
- So power-up.
- Endless time.

Overlay chi la DOM text nhe, khong thay doi gameplay. Khi tat, game chi cap nhat FPS counter noi bo rat nhe.

### Thunder Hunter - Mini Boss Stage 4

Thunder Hunter la mini boss moi o Stage 4:

- Type: `hunter`.
- Label: `Thunder Hunter`.
- HP co ban: 72.
- Radius: 48.
- Score: 680.
- La `miniBoss`, nen Stage 4 se doi giet xong neu timer da het.
- Xuat hien o moc 42s cua Stage 4 bang wave `miniBoss`.
- Co warning text `Mini Boss Incoming`.

Attack pattern:

1. Spread shot ngang:
   - Ban 7 vien, khi HP duoi 40% ban 9 vien.
   - Goc fan rong, di tu tren xuong va lech ngang.
2. Dash warning:
   - Hien warning `Thunder Hunter Dash`.
   - Tao burst xanh.
   - Sau warning ngan, lao ngang theo huong player va roi xuong nhe.
3. Summon shooter:
   - Moi khoang 8.5s goi 2 enemy `shooter` phu.

Enrage:

- Khi HP duoi 40%, fire interval giam tu khoang 1.15s xuong 0.72s.
- Damage bullet la 14, thap hon final boss.

### Wave Pattern Moi

Them 4 pattern:

- `wall`: tao hang enemy ngang co 1 khe trong de player luon co duong ne.
- `rain`: enemy roi theo tung dot doc tu tren xuong, vi tri random.
- `ambush`: enemy vao tu hai canh trai/phai o vi tri cao khac nhau.
- `elite`: spawn it enemy manh hon, co HP/fire/score scale nhe.

Stage update:

- Stage 3:
  - `rain` kamikaze o moc 20s.
  - `wall` tank o moc 31s.
- Stage 4:
  - `ambush` kamikaze o moc 18s.
  - `elite` tank/shooter o moc 29s.
  - `Thunder Hunter` o moc 42s.

Endless:

- Endless wave pool co them `rain`, `wall`, `ambush`, `elite`.
- Early Endless uu tien pattern nhe hon.
- Sau khoang 2 phut them `wall`/`ambush`.
- Sau khoang 4 phut them `elite`.
- Neu enemies dang qua dong, Endless se hoan random spawn/wave de tranh bat cong.

### Balance Diem 1.2

Cong thuc diem kill hien tai:

```text
finalKillScore = floor(enemyBaseScore * enemyScoreScale * comboMultiplier * endlessMultiplier)
```

Trong do:

- `enemyBaseScore`: score trong `src/data/enemies.js`.
- `enemyScoreScale`: 1 trong stage thuong, tang dan trong Endless toi da 2.4x.
- `comboMultiplier`: bat dau x1, moi 3 kill lien tiep tang 0.25x, toi da x4.5.
- `endlessMultiplier`: chi ap dung trong Endless, tang theo thoi gian song sot, toi da x2.5.

So voi ban 1.1:

- Max combo giam tu x6 xuong x4.5.
- Max Endless multiplier giam tu x3.5 xuong x2.5.
- Endless multiplier tang cham hon: `1 + endlessTime / 120`, cap x2.5.

Bonus diem van giu:

- Stage clear bonus: `450 + stageId * 180`.
- No-hit stage bonus: `850 + stageId * 220`.
- Boss clear time bonus: toi da 1800.
- Endless survival bonus moi 15 giay.

### Gioi Han Hieu Nang

Particle cap van giu:

```text
maxParticles = 280
```

Cap mem moi:

- Player bullets toi da 180.
- Enemy bullets toi da 260.
- Power-ups toi da 24.

Khi vuot cap, game xoa cac object cu nhat. Cach nay nhe, khong can object pool va giu FPS on dinh hon khi Endless lau.

### Cach Test Ban 1.2

1. Chay build:

```bash
node sky-thunder/tools/build-standalone.js
```

2. Mo `sky-thunder/index.html` hoac `sky-thunder/Sky-Thunder-Play.html`.
3. Bam `F3`:
   - Overlay debug hien FPS/state/object counts.
   - Bam `F3` lan nua overlay tat.
4. Test Stage 3:
   - Phai thay wave `rain` va `wall`.
5. Test Stage 4:
   - Phai thay `ambush`, `elite`.
   - Gan cuoi stage co warning va Thunder Hunter.
   - Thunder Hunter ban spread, dash warning, summon shooter.
6. Test Endless:
   - Sau Victory bam `Continue Endless`.
   - Wave moi xuat hien dan theo thoi gian.
   - Khi man qua dong, spawn random cham lai.
7. Test score:
   - Combo cap toi da x4.5.
   - Endless multiplier cap toi da x2.5.

### Rui Ro Con Lai Ban 1.2

- Thunder Hunter dash can playtest them tren mobile de dam bao khong qua kho.
- `elite` wave trong Endless co the tang do kho nhanh neu player gap unlucky weapon.
- Debug FPS la uoc tinh theo game loop, khong phai profiler chinh xac nhu browser devtools.
- Cap mem bullet xoa object cu nhat, co the lam mot so dan bien mat trong tinh huong cuc doan, nhung uu tien giu game nhe.

## Cap Nhat Moi Ban 1.3 - Mobile-First UX Va Performance

Ban 1.3 toi uu lai trai nghiem dien thoai doc, uu tien dieu khien muot, HUD gon, nut bam lon va ngan browser scroll/zoom/gesture can thiep.

File da sua trong ban 1.3:

- `src/data/balance.js`: them `mobile` config cho DPR cap, safe area, touch offset, particle cap va difficulty scale.
- `src/core/Game.js`: them mobile detection bang viewport + coarse pointer, body class `is-mobile`, resize/orientation debounce, DPR mobile cap, pause button, `?debug=1`, safe-area runtime.
- `src/core/Input.js`: reset pointer khi cancel/blur, track pointer id de bam Thunder khong lam mat drag, tap 5 lan goc tren trai de bat/tat debug mobile.
- `src/entities/Player.js`: mobile drag target nam tren ngon tay, follow smoothing/dead zone rieng, clamp player theo top/bottom safe area.
- `src/entities/Enemy.js`: giam toc do dan tren mobile, Thunder Hunter warning lau hon, dash cham hon, it dan hon.
- `src/systems/SpawnSystem.js`: giam density/wave count tren mobile, Endless tang do kho cham hon khoang 16%.
- `src/systems/EffectsSystem.js`: giam stars/clouds/particles/lightning/screen shake tren mobile.
- `src/core/Renderer.js`: giam composite/glow/streak/message cost tren mobile.
- `src/ui/GameOverScreen.js`: pause menu co Resume va Restart.
- `src/main.js`: bind `pauseBtn`.
- `styles/base.css`: dung `100dvh`, khoa overflow/overscroll/touch action/user select/callout.
- `styles/hud.css`: mobile compact HUD, nut Thunder 78px goc duoi phai, Pause goc tren phai, Sound nho goc duoi trai, orientation hint, debug overlay nho.
- `styles/menu.css`: overlay scroll noi bo, upgrade card responsive, button mobile lon hon.
- `tools/build-standalone.js`: viewport meta mobile an toan, markup pause button va orientation hint.
- `index.html`, `Sky-Thunder-Play.html`: build lai tu source.

### Mobile Detection

Game khong dua vao user agent. Mobile duoc bat khi:

- Pointer coarse va viewport nho (`min(width, height) <= 760`), hoac
- Man hinh dang phone portrait (`width <= 520` va `height >= 560`).

Khi mobile, `body` co class:

```text
is-mobile
```

Neu mobile landscape, them:

```text
is-landscape
```

Class nay kich hoat HUD compact, nut bam mobile va orientation hint.

### Thong So Mobile Moi

Config trong `BALANCE.mobile`:

- DPR cap: `1.5`.
- Low FPS DPR cap khi resize lai: `1.25` neu FPS da do duoi `44`.
- `topSafeArea`: `96`.
- `bottomSafeArea`: `112`.
- Player touch offset: `-76px`.
- Follow smoothing: `13`.
- Dead zone: `4px`.
- Particle cap: `210`.
- Star scale: `0.62`.
- Cloud scale/timer nhe hon: cloud spawn cham hon.
- Screen shake scale: `0.62`.
- Enemy bullet speed mobile: khoang `0.9x`.
- Endless difficulty scale mobile: `0.84x`.

### Mobile Layout

HUD mobile chi giu nhung thong tin chinh:

- Score.
- Best score.
- Combo va combo bar.
- HP.
- Thunder energy/status.
- Stage/time.

Upgrade list va mot so stat phu duoc an khi dang choi de canvas chiem uu tien. Boss HP duoc day xuong duoi HUD compact.

Nut mobile:

- Thunder: nut tron `78px`, goc duoi phai, co state ready/cooldown/percent.
- Pause: nut `50px`, goc tren phai.
- Sound: nut nho goc duoi trai.

### Mobile Drag Control

Tren mobile, auto-fire luon bat. Nguoi choi chi can keo de di chuyen.

Pointer target duoc xu ly nhu sau:

- Cho phep cham/keo bat ky diem tren canvas.
- Player di theo target bang smoothing, khong teleport tuc thi.
- Target y = `pointerY - 76px`, giup may bay nam tren ngon tay.
- Dead zone `4px` de giam rung khi ngon tay dung yen.
- Player bi clamp trong safe area, khong chui vao HUD tren hoac vung nut duoi.
- Pointer cancel/blur se reset de tranh ket dieu khien.
- Bam Thunder bang ngon tay khac khong reset drag vi input track pointer id rieng.

### Mobile Performance

Khi mobile:

- DPR cap giam tu 2 xuong 1.5.
- `maxParticles` giam tu 280 xuong 210.
- Star count giam.
- Cloud spawn cham hon.
- Thunder lightning it tia hon.
- Particle burst giam so luong va speed.
- Screen shake nhe hon.
- Renderer giam composite/glow/streak trang tri.
- Enemy bullet cap giam tu 260 xuong 220.
- Power-up cap giam tu 24 xuong 18.

Debug mobile:

- Them `?debug=1`.
- Hoac cham 5 lan trong 1.6s vao goc tren trai.
- Overlay debug mobile nho va nam ben trai, duoi HUD.

### Mobile Balance

- Random spawn stage thuong cham hon nhe va crowded threshold thap hon.
- Wave count mobile giam khoang 22%.
- Endless crowded threshold giam tu 30 xuong 22 enemy.
- Endless wave cap giam tu 24 xuong 18 enemy.
- Endless mini boss interval toi thieu mobile tang len 30s.
- Endless difficulty scale mobile = `0.84`, tuc tang kho cham hon desktop khoang 16%.
- Thunder Hunter:
  - Dash warning tang tu `0.72s` len `0.95s`.
  - Dash speed giam tu `640` xuong `520`.
  - Dash vertical speed giam tu `160` xuong `126`.
  - Spread shot mobile giam so dan va toc dan.
  - Body hit radius mobile giam de cong bang hon.

### Viewport Va Browser Gesture

CSS mobile/desktop hien khoa:

- `overflow: hidden`.
- `overscroll-behavior: none`.
- `touch-action: none`.
- `user-select: none`.
- `-webkit-user-select: none`.
- `-webkit-touch-callout: none`.
- Canvas dung `100dvh` de tranh loi `100vh` voi thanh dia chi mobile.
- Viewport meta trong standalone co `viewport-fit=cover`, `maximum-scale=1.0`, `user-scalable=no`.

### Test Checklist Ban 1.3

Da test bang build/syntax local:

- `node sky-thunder/tools/build-standalone.js`: pass.
- `node --check sky-thunder/tools/build-standalone.js`: pass.

Can playtest tren thiet bi/browser that:

- Android Chrome portrait.
- iPhone Safari portrait hoac mo phong Safari mobile.
- 360x640.
- 390x844.
- 430x932.
- Start, Pause, Resume, Restart.
- Keo may bay lien tuc 2 phut.
- Bam Thunder trong luc dang drag.
- Stage 4 Thunder Hunter tren mobile.
- Endless 3 phut tren mobile.
- Upgrade overlay khong tran.
- Game Over/Win khong tran.
- Body khong scroll, khong zoom, khong bounce.
- Debug overlay kiem tra object count khong vuot cap.

### Rui Ro Con Lai Ban 1.3

- Can playtest tren iOS Safari that vi hanh vi address bar/iframe co the khac browser mo phong.
- Pointer multi-touch da track pointer id cho drag, nhung mot so iframe portal co the chuyen pointer event khac nhau.
- Low FPS DPR cap chi ap dung khi resize lai sau khi FPS thap duoc do; neu can adaptive that su co the can them resize canvas chu dong.
- Mobile wave density da giam, can playtest Endless lau hon 3 phut de can bang diem va do kho.

## Cap Nhat Moi Ban 1.4 - Mobile-First Polish Lan 2

Ban 1.4 tiep tuc sua cac diem mobile con te: viewport that tren browser mobile/iframe, nut UI khong lam nhay player, drag follow it giat hon, pause menu co action rieng, va cap hieu nang mobile ro rang hon.

File da sua trong ban 1.4:

- `src/data/balance.js`: cap nhat `BALANCE.mobile` voi DPR cap, safe area, touch offset, initial follow, object caps, density scale va Thunder Hunter mobile.
- `src/core/Game.js`: dung `visualViewport`, set CSS var `--app-height`, clamp player khi resize/orientation, them pause actions Resume/Restart/Sound/Debug/Main Menu.
- `src/core/Input.js`: khoa gesture/scroll nhung van cho menu scroll noi bo, reset pointer khi blur/hidden/cancel, them `justActivated` de chong teleport khi cham dau.
- `src/entities/Player.js`: drag follow co smoothing rieng cho lan cham dau, gioi han buoc di dau tien, dead zone va safe-area clamp.
- `src/entities/Enemy.js`: enemy bullet speed/fire cadence mobile lay tu balance, Thunder Hunter dash warning/speed/y-speed lay tu config mobile.
- `src/systems/SpawnSystem.js`: giam density, wave count, crowded cap va endless wave/mini boss cadence tren mobile.
- `src/systems/EffectsSystem.js`: giam sao, may, particle burst va lightning tren mobile.
- `src/systems/AudioSystem.js`: chan pointer cua nut Sound de khong anh huong drag.
- `src/ui/Menu.js`: tao pause action buttons rieng.
- `src/ui/GameOverScreen.js`: pause menu moi co Resume/Restart/Sound/Debug/Main Menu.
- `styles/base.css`: body fixed, `--app-height`, overflow/overscroll/touch lock manh hon.
- `styles/hud.css`: HUD mobile nho hon, small-phone mode, Thunder/Pause/debug sizing moi.
- `styles/menu.css`: pause actions responsive, upgrade/menu scroll noi bo tot hon.
- `index.html`, `Sky-Thunder-Play.html`: da build lai bang `node sky-thunder/tools/build-standalone.js`.

Thong so mobile hien tai:

- DPR cap: `1.4`; low-FPS DPR cap: `1.25` khi FPS da do duoi `44`.
- Safe area: `topSafeArea` mac dinh `104px`, runtime clamp khoang `88-130px`; `bottomSafeArea` mac dinh `126px`, runtime clamp khoang `108-150px`.
- Player touch offset: `-84px`, rieng man nho la `-72px`.
- Follow smoothing: `16`; initial follow smoothing: `7`; max initial step: `132px`, rieng man nho `110px`.
- Dead zone: `5px`.
- Particle cap mobile: `200`.
- Enemy bullet cap mobile: `205`; power-up cap mobile: `16`.
- Star scale: `0.54`; cloud scale: `0.56`; cloud cap: `9`.
- Enemy bullet speed mobile: `0.88x`.
- Mobile density scale: `0.76`; spawn interval scale: `1.2`.
- Endless difficulty scale mobile: `0.82`, khoang cham hon desktop 18%.
- Thunder Hunter mobile: dash warning `1.05s`, dash speed `500`, dash y-speed `116`, fire cadence scale `1.12`.

Test da chay local:

- `node --check` cho cac file JS da sua: pass.
- `node --check sky-thunder/tools/build-standalone.js`: pass.
- `node sky-thunder/tools/build-standalone.js`: pass, da tao lai `index.html` va `Sky-Thunder-Play.html`.
- Static check bang `rg`: standalone output co `visualViewport`, `--app-height`, `pause-actions`, `maxInitialStep`, `enemyBulletCap`, `hunterDashWarn`, `is-small-phone`.

Playtest can chay tren thiet bi/browser that:

- Android Chrome portrait.
- iPhone Safari portrait hoac iOS Safari simulator.
- 360x640, 390x844, 430x932.
- Start, Pause, Resume, Restart, Sound, Main Menu.
- Keo may bay lien tuc 2 phut.
- Bam Thunder trong luc dang drag.
- Stage 4 Thunder Hunter tren mobile.
- Endless 3 phut tren mobile.
- Upgrade overlay khong tran.
- Game Over/Win/Pause khong tran; neu dai thi scroll noi bo trong overlay.
- Body khong scroll, khong zoom, khong bounce.
- Debug overlay qua `?debug=1`, tap 5 lan goc tren trai, hoac nut Debug trong pause.
- FPS/object count: particles <= 200, enemy bullets <= 205, power-ups <= 16 tren mobile.

Rui ro con lai:

- Chua chay Playwright/mobile browser automation vi project hien khong co `playwright` trong dependency local.
- iOS Safari that van can playtest vi address bar va iframe portal co the xu ly `visualViewport`/gesture khac nhau.
- DPR low-FPS cap van chi ap dung khi co resize sau luc FPS thap duoc do; neu muon adaptive lien tuc can them co che resize canvas chu dong.
- Balance mobile da giam density, nhung Stage 4 Hunter va Endless sau 3 phut van can playtest bang tay de chot do kho.

## 1. Tong Quan Game

Sky Thunder la game shoot 'em up 2D nhin tu tren xuong. Nguoi choi dieu khien chien co, ban ha may bay dich, song sot qua cac stage theo thoi gian, chon nang cap sau moi stage, va chien dau voi boss cuoi o Stage 5.

Vong choi chinh:

1. Vao menu.
2. Bam `Bat dau`.
3. Chien dau Stage 1 den Stage 4.
4. Moi khi het thoi gian stage, man hinh nang cap hien ra.
5. Chon 1 trong 3 nang cap ngau nhien.
6. Qua Stage 5 gap boss.
7. Ha boss thi thang, het mau thi thua.

## 2. Cach Chay Va Build

File choi truc tiep:

- `index.html`
- `Sky-Thunder-Play.html`

Hai file nay da duoc build thanh HTML standalone: CSS va JavaScript deu nam trong file, khong can Apache, Live Server hay local server.

Source de phat trien nam trong:

- `src/`
- `styles/`

Sau khi sua source, build lai bang:

```bash
node sky-thunder/tools/build-standalone.js
```

Script build se tao lai:

- `sky-thunder/index.html`
- `sky-thunder/Sky-Thunder-Play.html`

## 3. Cau Truc Thu Muc

```text
sky-thunder/
  index.html
  Sky-Thunder-Play.html
  README.md
  GAME_DESIGN_REPORT.md
  tools/
    build-standalone.js
  styles/
    base.css
    hud.css
    menu.css
  src/
    main.js
    core/
      Game.js
      Renderer.js
      Input.js
      Collision.js
      StateManager.js
    entities/
      Player.js
      Enemy.js
      Boss.js
      Bullet.js
      PowerUp.js
      Particle.js
    systems/
      SpawnSystem.js
      StageSystem.js
      UpgradeSystem.js
      EffectsSystem.js
      SaveSystem.js
      AudioSystem.js
    data/
      balance.js
      weapons.js
      enemies.js
      stages.js
      upgrades.js
    ui/
      Hud.js
      Menu.js
      UpgradeScreen.js
      GameOverScreen.js
```

Vai tro tong quat:

- `core/`: dieu phoi game loop, input, render, state, collision.
- `entities/`: cac doi tuong trong game co toa do, update va draw.
- `systems/`: cac he thong quan ly spawn, stage, upgrade, hieu ung.
- `SaveSystem.js`: luu high score va thong ke best run bang `localStorage`.
- `AudioSystem.js`: tao am thanh WebAudio nhe va quan ly mute.
- `data/`: cau hinh balance, vu khi, dich, stage, nang cap.
- `ui/`: HUD, menu, upgrade screen, game over/win.
- `styles/`: style giao dien HTML overlay.
- `tools/`: cong cu build standalone.

## 4. Kien Truc Cap Cao

Lop trung tam la `Game` trong `src/core/Game.js`.

`Game` giu tat ca trang thai runtime:

- `canvas`, `ctx`: noi ve hinh bang Canvas 2D.
- `width`, `height`, `dpr`: kich thuoc man hinh va ti le pixel.
- `score`: diem hien tai.
- `shake`: muc rung man hinh.
- `playerBullets`: mang dan cua nguoi choi.
- `enemyBullets`: mang dan cua dich.
- `enemies`: mang dich thuong.
- `powerUps`: mang vat pham roi ra.
- `boss`: boss hien tai, hoac `null`.
- `state`: quan ly trang thai game.
- `input`: doc phim/chuot.
- `player`: may bay nguoi choi.
- `effects`: sao, may, particle, no.
- `save`: high score, best stage va best enemy destroyed.
- `audio`: SFX, music loop va mute.
- `spawnSystem`: sinh dich.
- `stageSystem`: tien trinh stage.
- `upgradeSystem`: chon va ap dung nang cap.
- `renderer`: ve toan bo game.
- `hud`, `menu`, `upgradeScreen`, `gameOverScreen`: UI.

Luon co 2 lop y tuong:

- Game world: player, bullet, enemy, boss, particle.
- HTML UI overlay: HUD, menu, upgrade, pause, game over.

## 5. Entry Point

`src/main.js` khoi tao `Game` bang cach lay cac DOM element:

- Canvas: `#game`
- HUD: `#score`, `#health`, `#stageLabel`, `#timeLabel`, `#upgradeList`, `#bossHud`, `#bossHealth`
- Menu: `#overlay`, `#menuTitle`, `#menuText`, `#menuControls`, `#startBtn`, `#upgradeOptions`

Sau do goi:

```js
game.init();
```

Trong ban standalone, noi dung `main.js` duoc nhung thang vao HTML sau tat ca class va config.

## 6. State Machine

Trang thai game nam trong `src/core/StateManager.js`.

Danh sach state:

- `MENU`: dang o menu.
- `PLAYING`: dang choi stage thuong.
- `STAGE_CLEAR`: vua clear stage.
- `UPGRADE`: dang chon nang cap.
- `BOSS`: dang danh boss.
- `GAME_OVER`: thua.
- `WIN`: thang.
- `PAUSED`: tam dung.

`StateManager` rat gon:

- `set(state)`: doi state, luu `previousState`.
- `is(state)`: kiem tra state hien tai.

Luon chu y khi them logic moi:

- Logic gameplay chi update khi state la `PLAYING` hoac `BOSS`.
- Khi `PAUSED` hoac `UPGRADE`, game van render va update HUD nhung khong update gameplay.
- Khi `MENU`, `GAME_OVER`, `WIN`, loop dung lai sau khi vao state do.

## 7. Game Loop

Game loop nam trong `Game.loop(time)`.

Thuat toan:

1. Neu state la `MENU`, `GAME_OVER`, `WIN` thi return.
2. Tinh `dt = (time - lastTime) / 1000`.
3. Gioi han `dt` toi da `0.033` giay de tranh nhay vat ly khi tab bi lag.
4. Neu khong pause va khong o man hinh upgrade thi goi `update(dt)`.
5. Goi `renderer.render(time)`.
6. Goi `hud.update(this)`.
7. Goi `requestAnimationFrame` cho frame tiep theo.

Y nghia `dt`:

- Moi chuyen dong deu nhan voi `dt`, giup toc do on dinh theo thoi gian that.
- Neu may cham, frame rate giam nhung toc do vat the van gan dung.

## 8. Resize Va DPR

Trong `Game.resize()`:

- `dpr = Math.min(window.devicePixelRatio || 1, 2)`.
- Canvas internal size = kich thuoc viewport x dpr.
- Context transform duoc set theo dpr.
- Neu khong dang choi, player duoc dua ve giua man hinh.
- Goi `effects.makeStars()` de tao lai sao theo kich thuoc moi.

Muc dich:

- Hinh anh net hon tren man hinh retina.
- Gioi han dpr toi da 2 de khong qua nang.

## 9. Input

`src/core/Input.js` quan ly phim va chuot.

Phim:

- `WASD` hoac mui ten: di chuyen.
- `Space`: ban.
- `Enter`: start khi dang menu/game over/win.
- `P`: pause/resume.
- `E` hoac `Shift`: kich hoat Thunder Storm khi energy du 100.

Chuot/touch:

- `pointermove`: cap nhat vi tri con tro.
- `pointerdown`: bat dau ban va co the start game.
- `pointerup`: tat ban.
- Khi pointerdown, game dung `setPointerCapture()` de van nhan toa do ke ca khi keo chuot ra sat vien man hinh.
- Toa do pointer duoc clamp vao kich thuoc viewport, tranh mat dieu khien neu chuot vuot bien.
- Canvas dung `touch-action: none` de mobile khong bi cuon/gesture cua browser chen vao.

Thuat toan vector di chuyen:

```js
x = right - left
y = down - up
len = Math.hypot(x, y) || 1
axis = { x: x / len, y: y / len }
```

Viec normalize vector giup di cheo khong nhanh hon di ngang/doc.

## 10. Player

`src/entities/Player.js` la may bay nguoi choi.

Thuoc tinh chinh:

- `r`: ban kinh collision, mac dinh 19.
- `speed`: toc do, mac dinh 450.
- `maxHealth`: mau toi da, mac dinh 100.
- `health`: mau hien tai.
- `x`, `y`: toa do.
- `cooldown`: thoi gian cho den lan ban tiep theo.
- `invincible`: thoi gian bat tu sau khi bi danh/tran moi.
- `energy`: nang luong Thunder Skill, toi da 100.
- `thunderCooldown`: cooldown sau khi kich hoat Thunder Storm.
- `shields`: so lan chan sat thuong.
- `missileTimer`: dem nguoc ten lua tu dong.
- `weapon`: vu khi hien tai.
- `stats`: chi so nang cap.
- `upgrades`: danh sach ten nang cap da lay de hien HUD.

Chi so ban dau:

- `speed = 450`
- `radius = 19`
- `maxHealth = 100`
- `baseCooldown = 0.13`
- `bulletSpeed = 820`
- `missileInterval = 3.4`

### Di chuyen

Trong `update(dt, input, game)`:

- Giam cooldown va invincible theo dt.
- Lay axis tu input.
- Cong toa do theo `axis * speed * dt`.
- Neu pointer active, player di chuyen mem ve vi tri chuot:

```js
this.x += (pointer.x - this.x) * Math.min(1, dt * 9)
this.y += (pointer.y - this.y) * Math.min(1, dt * 9)
```

- Clamp vi tri trong man hinh:

```js
x: 28 -> game.width - 28
y: 70 -> game.height - 34
```

### Ban

Neu `input.wantsFire()` thi goi `shoot(game)`.

Cooldown:

```js
cooldown = max(0.052, (baseCooldown - fireRate * 0.018) * weapon.cooldownScale)
```

Y nghia:

- Nang cap `Fire Rate` giam cooldown.
- Vu khi co `cooldownScale` rieng.
- Cooldown toi thieu la 0.052 giay de tranh qua nhanh.

Toc do dan:

```js
speed = (bulletSpeed + damage * 18) * weapon.speedScale
```

Sat thuong:

```js
damage = max(1, player.stats.damage * weapon.damageScale)
```

Spread:

- 1 tia: `[0]`
- 2 tia: `[-0.08, 0.08]`
- 3 tia: `[-0.16, 0, 0.16]`
- 4 tia: `[-0.22, -0.08, 0.08, 0.22]`
- 5 tia: `[-0.28, -0.14, 0, 0.14, 0.28]`

Moi angle tao 1 `Bullet` bay len:

```js
vx = Math.sin(angle) * speed
vy = -Math.cos(angle) * speed
```

### Missile

Neu `stats.missile > 0`, player tu dong phong missile:

- Toc do y: `-520`
- Radius: `7`
- Damage: `3 + missile level`
- Homing: `true`
- Cooldown missile: `max(1.25, 3.4 - missileLevel * 0.45)`

### Thunder Skill

Energy hien da duoc dung lam Thunder Skill.

Dieu kien kich hoat:

- Energy du 100.
- Thunder cooldown da ve 0.
- Nguoi choi bam `E`, `Shift`, hoac nut `Thunder` tren UI.

Khi kich hoat Thunder Storm:

- Energy ve 0.
- Dat cooldown mac dinh 5.8 giay, co the giam bang upgrade.
- Xoa toan bo dan dich tren man hinh.
- Gay damage dien rong cho enemy trong ban kinh Thunder.
- Gay damage rieng cho boss neu boss nam trong tam anh huong.
- Tao hieu ung set bang `EffectsSystem.thunderStorm()`.
- Tang screen shake.
- Phat am thanh thunder.
- Neu co upgrade `Static Field`, player duoc dam bao co it nhat 2 shield.

Thong so mac dinh trong `BALANCE.thunder`:

- `maxEnergy`: 100
- `cost`: 100
- `cooldown`: 5.8
- `radius`: 620
- `enemyDamage`: 18
- `bossDamage`: 120
- `chargePerKill`: 7
- `chargePerPickup`: 28

### Nhan sat thuong

`takeDamage(amount, game)`:

1. Neu `invincible > 0`: bo qua.
2. Neu co shield:
   - Giam `shields`.
   - Dat `invincible = 0.55`.
   - Tao particle mau xanh.
3. Neu khong co shield:
   - Tru health.
   - Dat `invincible = 0.85`.
   - Tang screen shake.
   - Tao particle hit.
   - Neu health <= 0 thi game over.

### Do hoa player

Player duoc ve hoan toan bang Canvas path:

- Lua duoi may bay dung gradient va `Math.sin(performance.now() / 45)` de nhap nhay.
- Than may bay dung path doi xung, stroke sang.
- Body gradient tu sang den xam.
- Buong lai ve bang ellipse.
- Shield ve bang vong tron neu `shields > 0`.
- Khi invincible thi flicker bang globalAlpha.

## 11. Bullet

`src/entities/Bullet.js` dai dien cho ca dan player va dan dich.

Thuoc tinh:

- `x`, `y`: toa do.
- `vx`, `vy`: van toc.
- `r`: ban kinh.
- `damage`: sat thuong.
- `life`: thoi gian ton tai.
- `owner`: `player` hoac `enemy`.
- `color`: mau dan.
- `homing`: co tim muc tieu khong.
- `pierce`: so lan xuyen.
- `splash`: ban kinh no lan.
- `shape`: `orb` hoac `beam`.

Update:

1. Neu homing thi goi `seekTarget`.
2. Cong vi tri theo van toc.
3. Tru `life`.

### Homing algorithm

`seekTarget(dt, game)`:

1. Tim target gan nhat bang `game.findNearestTarget(x, y)`.
2. Lay vector tu dan den target.
3. Normalize vector.
4. Lay speed hien tai cua dan.
5. Keo `vx`, `vy` ve huong target:

```js
vx += (targetVx - vx) * dt * 3.5
vy += (targetVy - vy) * dt * 3.5
```

Day la steering don gian, khong quay ngoat tuc thi nen duong bay mem.

### Do hoa bullet

Co 2 dang:

- `orb`: ve radial gradient phat sang, loi trang.
- `beam`: xoay canvas theo huong bay, ve line dai co glow va loi trang.

Dung `globalCompositeOperation = "lighter"` de tao cam giac phat sang.

## 12. Enemy

`src/entities/Enemy.js` doc cau hinh tu `src/data/enemies.js`.

Loai dich hien co:

| Type | HP | Radius | Speed | Score | Fire Rate | Bullet | Ghi chu |
|---|---:|---:|---:|---:|---:|---|---|
| `scout` | 2 | 16 | 180 | 25 | 3.4 | single | nhanh, yeu |
| `fighter` | 3 | 21 | 120 | 40 | 2.4 | single | can bang |
| `tank` | 9 | 29 | 76 | 90 | 2.8 | single | trau, roi do cao hon |
| `shooter` | 5 | 23 | 105 | 70 | 2.0 | spread | ban 3 tia |
| `kamikaze` | 3 | 18 | 145 | 55 | 99 | none | duoi theo player |

Khi tao enemy:

- HP tang theo stage: `config.hp + floor(stageId * 0.7)`.
- `vx` random theo stage.
- `vy = config.speed + stageId * 7`.
- `fireTimer` random trong khoang `fireRate * (0.6 -> 1.15)`.

### Di chuyen enemy

Enemy thuong:

- `x += vx * dt + sin(performance.now()/360 + y) * 20 * dt`
- `y += vy * dt`
- Neu cham bien ngang thi dao `vx`.

Kamikaze:

- Tinh vector huong den player.
- Tang `vx`, `vy` theo huong player.
- Do do se truy duoi ngay cang gat.

### Ban cua enemy

Neu `bulletMode = none`: khong ban.

Neu `single`: ban 1 vien ve phia player.

Neu `spread`: ban 3 vien voi offset `[-0.22, 0, 0.22]`.

Dan dich:

- Speed single: 185.
- Speed spread: 205.
- Damage tank: 16.
- Damage loai khac: 12.
- Life: 4 giay.

### Do hoa enemy

Enemy duoc ve bang Canvas path:

- Scale theo radius.
- Than may bay doi xung.
- Body gradient.
- Buong lai ellipse.
- Thanh HP nho phia tren.
- Mau lay tu config enemy.

## 13. Boss

`src/entities/Boss.js` la boss Stage 5.

Thong so:

- `x = width / 2`
- `y = -110`, sau do bay vao `y = 105`.
- `r = 82`
- `hp = 900`
- `maxHp = 900`
- `fireTimer = 1.2`
- `summonTimer = 7`
- `laserTimer = 4.5`
- `phase = 1`

### Phase

Boss co 3 phase dua theo HP:

- Phase 1: HP >= 66%.
- Phase 2: HP < 66%.
- Phase 3: HP < 33%.

```js
phase = hp < maxHp * 0.33 ? 3 : hp < maxHp * 0.66 ? 2 : 1
```

### Chuyen dong boss

- Bay mem vao vi tri y = 105:

```js
y += (105 - y) * min(1, dt * 1.2)
```

- Lac ngang theo sin:

```js
x += sin(performance.now() / 680) * 45 * dt
```

### Dan boss

Boss ban theo huong player.

So dan:

- Phase 1: 3 vien.
- Phase 2: 7 vien.
- Phase 3: 9 vien.

Spread:

- Phase 1: 0.34.
- Phase 2: 0.72.
- Phase 3: 0.95.

Fire interval:

- Phase 1: 1.35 giay.
- Phase 2: 1.0 giay.
- Phase 3: 0.7 giay.

Dan boss:

- Speed phase 1/2: 220.
- Speed phase 3: 260.
- Radius: 6.
- Damage: 15.
- Life: 5.

### Summon

Tu Phase 2 tro di, boss goi them dich:

- 1 `scout`
- 1 `fighter`

Vi tri spawn gan boss:

- `x - 90`, `x + 90`
- `y + 25`

Moi 8 giay summon lai.

### Laser phase 3

Phase 3 kich hoat laser:

1. Moi 4.2 giay tao laser tai `game.player.x`.
2. Laser co `warn = 0.9` giay.
3. Sau warn, laser active `0.35` giay.
4. Neu player cach truc laser < 24 px trong luc active thi bi 24 damage.

Ve laser:

- Khi warning: line vang, alpha 0.45, width 3.
- Khi active: line do, alpha 0.9, width 22.

### Do hoa boss

Boss la path may bay lon doi xung:

- Mau thay doi theo phase:
  - Phase 1: xam.
  - Phase 2: vang.
  - Phase 3: do.
- Co glow do.
- Body ellipse o giua.
- Laser ve sau than boss.

## 14. PowerUp

`src/entities/PowerUp.js` dai dien cho vat pham roi ra khi giet dich.

Loai:

- `repair`: hoi mau 18.
- `energy`: cong Thunder energy, toi da 100, co nhan bonus tu cac upgrade Thunder charge.
- `weapon:<id>`: doi vu khi sang `laser`, `flak`, hoac `volt`.

Khi tao:

- `vx` random tu -35 den 35.
- `vy` tu 90 den 125.
- `r = 16`.
- `life = 8`.
- `spin` random.

Update:

- Roi xuong theo `vy`.
- Co gia toc nhe `vy += 18 * dt`.
- Xoay `spin += dt * 5`.
- Giam life.

Ti le roi item trong `Game.killEnemy()`:

- Tank: 42%.
- Dich khac: 22%.

Neu da roi item:

- Co hoi roi weapon:
  - Tank: 45%.
  - Dich khac: 28%.
- Neu khong roi weapon:
  - 42% la repair.
  - Con lai la energy.

Do hoa:

- Hinh luc giac/ngoi sao xoay.
- Glow theo mau item.
- Label:
  - repair: `+`
  - energy: `E`
  - weapon: symbol cua vu khi (`L`, `F`, `V`)

## 15. Particle Va Effects

`src/entities/Particle.js` la hat hieu ung nho.

Khi tao particle:

- Chon angle random 0 -> 2PI.
- Van toc = `speed * (0.25 + Math.random())`.
- `vx = cos(angle) * velocity`.
- `vy = sin(angle) * velocity`.
- Radius random 1.5 -> 5.5.
- Co `life` va `maxLife`.

Update:

- Cong vi tri theo van toc.
- Giam van toc voi he so 0.985.
- Giam life.

Draw:

- `globalCompositeOperation = lighter`.
- Alpha = `life / maxLife`.
- Ve circle mau.

`src/systems/EffectsSystem.js` quan ly:

- `particles`: hat no/hit.
- `clouds`: may roi xuong.
- `stars`: sao nen.
- `cloudTimer`: timer sinh may.

### Stars

So sao:

```js
count = floor(width * height / 9000)
```

Moi sao co:

- `x`, `y`
- `z`: do sau/toc do, 0.35 -> 1.65
- `twinkle`: pha lap lanh

Update sao:

```js
y += (55 * z + stageId * 5) * dt
twinkle += dt * 4
```

Neu sao ra khoi man hinh thi dua len dau man hinh.

### Clouds

Moi 0.7 -> 1.4 giay sinh 1 may:

- x random tu -120 den width + 120.
- y = -80.
- scale 0.6 -> 2.2.
- vy 22 -> 60.
- alpha 0.08 -> 0.21.

May duoc ve trong `Renderer.drawCloud()`.

### Explode

`explode(x, y, big)` tao 3 dot particle:

- Vang trang: nhieu va song lau.
- Cam do: trung binh.
- Xanh: it hon.

Neu `big = true` thi so hat, speed va shake lon hon.

## 16. Spawn System

`src/systems/SpawnSystem.js` sinh dich trong stage thuong.

Update:

1. Lay stage hien tai.
2. Neu khong co stage hoac la boss stage thi return.
3. Kiem tra wave pattern trong stage va spawn wave neu den moc thoi gian.
4. Giam timer random spawn.
5. Neu timer <= 0 thi spawn enemy random.
6. Dat lai timer:

```js
timer = max(0.34, stage.spawnEvery - stageId * 0.025)
```

Y nghia:

- Stage cao spawn nhanh hon.
- Spawn interval khong nho hon 0.34 giay.

Spawn:

- Chon type random trong `stage.enemies`.
- x random trong man hinh, chua margin 32.
- y = -44.
- Tao `new Enemy(type, x, -44, stage.id)`.

Wave pattern moi:

- `line`: enemy vao theo hang ngang.
- `vee`: enemy vao theo doi hinh chu V.
- `sides`: enemy vao tu hai canh trai/phai.
- `miniBoss`: spawn mini boss `Storm Warden`.

Moi wave chi trigger mot lan nho `triggeredWaves`.

## 17. Stage System

`src/systems/StageSystem.js` quan ly tien trinh stage.

Danh sach stage trong `src/data/stages.js`:

| Stage | Duration | Spawn Every | Enemies | Ghi chu |
|---|---:|---:|---|---|
| 1 | 38s | 0.95s | scout, fighter | line scout, vee fighter |
| 2 | 42s | 0.78s | scout, fighter, kamikaze | sides kamikaze, mini boss warden |
| 3 | 46s | 0.74s | fighter, tank, kamikaze | vee fighter, line tank |
| 4 | 50s | 0.66s | scout, fighter, tank, shooter, kamikaze | sides shooter, vee kamikaze, line tank |
| 5 | 0 | 0 | none | boss |

Update:

- Neu stage la boss thi khong dem timer.
- Stage thuong giam `timer -= dt`.
- Het timer thi `clearStage()`.

Clear stage:

- State -> `STAGE_CLEAR`.
- Xoa enemies va enemyBullets.
- Tao explosion giua man.
- Mo upgrade screen.

Advance:

- Tang index stage.
- Neu het stage thi win.
- Reset spawnSystem.
- Neu stage moi la boss:
  - Tao `new Boss(width)`.
  - State -> `BOSS`.
- Neu stage thuong:
  - State -> `PLAYING`.

## 18. Upgrade System

`src/systems/UpgradeSystem.js` lay nang cap tu `src/data/upgrades.js`.

Chon nang cap:

```js
choices = [...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3)
```

Day la shuffle don gian bang random sort. Du de dung cho game nho, nhung neu muon chuan hon co the doi sang Fisher-Yates.

Khi apply:

1. Goi `upgrade.apply(player)`.
2. Push ten upgrade vao `player.upgrades`.
3. Goi `stageSystem.advance()`.

Danh sach nang cap:

| ID | Ten | Tac dung |
|---|---|---|
| `fireRate` | Fire Rate | `player.stats.fireRate += 1` |
| `spread` | Spread Shot | tang so tia toi da 5 |
| `damage` | Bullet Damage | `player.stats.damage += 1` |
| `maxHp` | Max HP | tang maxHealth 22, hoi toi da 38 |
| `shield` | Shield | them 1 shield |
| `missile` | Missile | them missile auto |
| `engineBoost` | Engine Boost | tang toc do di chuyen |
| `rapidMissiles` | Missile Rack | tang missile va them damage |
| `armorPlating` | Armor Plating | giam damage nhan vao |
| `repairDrone` | Repair Drone | hoi mau nhe khi mau thap |
| `stormCore` | Storm Core | tang damage Thunder va toc do nap energy |
| `wideStorm` | Wide Storm | tang ban kinh Thunder va bonus damage boss |
| `staticField` | Static Field | sau Thunder co them shield neu dang thieu |
| `capacitor` | Capacitor | giam cooldown Thunder va tang energy tu pickup |

Upgrade co them truong `group`:

- `attack`: tang sat thuong, toc ban, dan.
- `defense`: mau, shield, toc do, giam damage, hoi mau.
- `special`: missile va Thunder Skill.

## 19. Weapon System

Vu khi nam trong `src/data/weapons.js`.

| ID | Ten | Mau | Cooldown | Damage | Speed | Radius | Life | Dac biet |
|---|---|---|---:|---:|---:|---:|---:|---|
| `plasma` | Plasma | xanh la | 1.00 | 1.00 | 1.00 | 4.6 | 1.35 | mac dinh |
| `laser` | Laser | xanh duong | 0.78 | 0.82 | 1.35 | 3.3 | 1.1 | pierce 2, beam |
| `flak` | Flak | cam | 1.22 | 0.74 | 0.88 | 5.6 | 1.25 | extraAngles, splash 34 |
| `volt` | Volt | tim | 1.05 | 0.90 | 1.02 | 4.8 | 1.65 | homing |

Weapon drop IDs:

```js
["laser", "flak", "volt"]
```

Plasma la vu khi mac dinh, khong nam trong drop list.

## 20. Collision

`src/core/Collision.js` co 2 helper:

```js
circleHit(a, b, ar = a.r, br = b.r)
clamp(value, min, max)
```

Collision dung circle hit:

```js
dx = a.x - b.x
dy = a.y - b.y
rr = ar + br
hit = dx * dx + dy * dy < rr * rr
```

So sanh binh phuong giup tranh `Math.sqrt`, nhe hon.

Nhung va cham hien co trong `Game.checkCollisions()`:

- Player bullet vs boss.
- Player bullet vs enemy.
- Enemy bullet vs player.
- Enemy body vs player.
- PowerUp vs player.

Tinh chat:

- Bullet boss hit: xoa bullet, tru boss HP, boss chet thi win.
- Bullet enemy hit: xu ly pierce, splash, particle, kill enemy.
- Enemy bullet hit player: xoa bullet, player takeDamage.
- Enemy body hit player: xoa enemy, explosion, player takeDamage 18 hoac 28 neu tank.
- PowerUp hit player: apply item, cong 15 diem, particle.

### Pierce

Neu bullet co `pierce > 0`:

- Giam pierce di 1.
- Bullet khong bi xoa.

Neu `pierce = 0`:

- Bullet bi xoa.

### Splash

Neu bullet co `splash > 0`:

- Quet tat ca enemies khac.
- Tinh distance den vi tri bullet.
- Neu `distance <= bullet.splash + enemy.r` thi gay damage phu:

```js
enemy.takeDamage(bullet.damage * 0.55)
```

## 21. Renderer Va Do Hoa Canvas

`src/core/Renderer.js` ve game moi frame.

Thu tu ve:

1. Save context.
2. Neu co shake thi translate random.
3. Background.
4. Player bullets.
5. PowerUps.
6. Enemies.
7. Boss.
8. Enemy bullets.
9. Player.
10. Particles.
11. Restore context.

Thu tu nay quan trong:

- Background nam duoi cung.
- Player nam tren bullet/dich de de nhin.
- Particles nam tren cung de explosion noi bat.

### Background

Background Canvas gom:

- Linear gradient doc:
  - tren: `#071426`
  - giua: `#0b3150`
  - duoi: `#15536a`
- Stars ve bang arc nho, alpha lap lanh:

```js
alpha = 0.32 + sin(star.twinkle) * 0.18
```

- Clouds ve bang 3 ellipse.
- Duong cong nang luong/bao troi bang quadratic curve, alpha 0.22.

### Screen shake

Trong renderer:

```js
ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake)
```

Trong update:

```js
shake = max(0, shake - dt * 35)
```

Shake tang khi no hoac player bi danh.

## 22. UI Va CSS

HTML UI gom:

- `.hud`: panel diem, mau, stage/time, nang cap.
- `.boss-hud`: thanh mau boss.
- `#overlay`: menu, pause, game over, upgrade.

### HUD

`src/ui/Hud.js` update:

- Diem.
- Health bar width theo `health / maxHealth`.
- Stage name.
- Timer hoac chu `Boss`.
- Danh sach nang cap va vu khi.
- Boss HP neu co boss.

Responsive:

- Khi man hinh <= 760px:
  - Padding HUD giam.
  - Panel nho lai.
  - Upgrades panel an di.
  - Health bar ngan hon.

### Menu

`src/ui/Menu.js`:

- `showMenu()`: hien menu dau game.
- `show(title, text, buttonText, showControls)`: hien overlay bat ky.
- `hide()`: an overlay.
- `bindStart(handler)`: gan su kien nut start.

### Upgrade Screen

`src/ui/UpgradeScreen.js`:

- Hien overlay `Stage Clear`.
- An controls va start button.
- Tao 3 button `.upgrade-card`.
- Moi card co name va description.
- Click card thi goi callback `onPick(upgrade)`.

### Game Over / Win / Pause

`src/ui/GameOverScreen.js` dung chung `Menu.show()`:

- Thua: title `Het Tran`, button `Choi lai`, hien score, best score, stage reached, enemies destroyed.
- Thang: title `Victory`, button `Choi lai`, hien score, best score, stage reached, enemies destroyed.
- Pause: title `Tam dung`, button `Tiep tuc`.

### HUD Moi

HUD hien co them:

- Best score.
- Kill count trong run hien tai.
- Thanh Thunder energy.
- Text trang thai Thunder: percent, ready, hoac cooldown.
- Nut `Thunder` cho desktop/mobile.
- Nut `Sound On/Off`.

## 22.1 Save System

`src/systems/SaveSystem.js` quan ly high score bang `localStorage`.

Key luu:

```text
skyThunderSaveV1
```

Du lieu best run:

- `score`: diem cao nhat.
- `stage`: stage cao nhat da cham toi.
- `enemiesDestroyed`: so enemy destroy cao nhat trong mot run.

Neu `localStorage` bi khoa trong iframe/portal, game se bo qua loi va van chay binh thuong.

## 22.2 Audio System

`src/systems/AudioSystem.js` tao audio bang WebAudio, khong dung asset ban quyen.

SFX hien co:

- `shoot`
- `explosion`
- `pickup`
- `hit`
- `upgrade`
- `warning`
- `thunder`

Music loop:

- Menu music nhe.
- Gameplay music nhe.

Co nut mute, trang thai mute luu bang:

```text
skyThunderMuted
```

## 23. Build Standalone

`tools/build-standalone.js` dung Node.js de dong goi game.

Cong viec:

1. Doc cac CSS file:
   - `styles/base.css`
   - `styles/hud.css`
   - `styles/menu.css`
2. Doc cac JS source theo dung thu tu dependency.
3. Xoa dong `import ...`.
4. Xoa tu khoa `export` truoc `const`, `class`, `function`.
5. Kiem tra syntax bang:

```js
new Function(scripts)
```

6. Tao HTML co:
   - `<style>` chua CSS.
   - markup canvas/HUD/menu, nut mute, nut Thunder.
   - `<script>` chua JS.
7. Ghi ra `index.html` va `Sky-Thunder-Play.html`.

Thu tu JS trong build rat quan trong. Cac config/data phai dung truoc class dung chung, roi entity, systems, UI, Game, cuoi cung main. Build script hien da nhung them `SaveSystem.js` va `AudioSystem.js`.

## 24. Cac Thuat Toan Dang Co

### 24.1 Delta-time game loop

Dung `requestAnimationFrame` va `dt` de update theo thoi gian that.

Loi ich:

- Toc do nhat quan hon giua may nhanh/cham.
- Frame drop khong lam game vuot qua qua xa vi `dt` bi cap o 0.033.

### 24.2 Circle collision

Tat ca va cham chinh dung circle hit.

Loi ich:

- Don gian.
- Nhanh.
- Phu hop game arcade co nhieu vat the.

Han che:

- May bay co hinh dai nhung collision la tron, co the hitbox chua that su chinh xac.

### 24.3 Homing steering

Dan homing khong doi huong tuc thi, ma keo van toc ve vector target theo he so `dt * 3.5`.

Loi ich:

- Duong bay mem.
- De can bang bang cach doi he so 3.5.

### 24.4 Random spawn

Enemy type va vi tri spawn duoc random trong stage config.

Loi ich:

- Game moi lan choi co nhip khac nhau.

Han che:

- Chua co spawn pattern thiet ke thu cong.
- Co the random qua de/kho o mot so luc.

### 24.5 Stage timer

Stage 1-4 dua tren thoi gian song sot, khong dua tren so dich giet.

Loi ich:

- Nhip game de kiem soat.
- Player yeu van co the qua stage neu ne tot.

### 24.6 Weighted-ish drop

Drop co ti le khac nhau giua tank va dich thuong.

Loi ich:

- Tank co gia tri cao hon.
- Weapon drop khong qua day.

### 24.7 Particle random burst

Explosion tao nhieu particle co huong random, speed random, life random theo preset.

Loi ich:

- Nhieu hieu ung nhung code don gian.

## 25. Balance Hien Tai

Player:

- Speed cao: 450, game nhanh.
- Mau: 100.
- Ban mac dinh cooldown 0.13s, kha nhanh.
- Damage ban dau la 1.
- Invincible dau tran 1.2s.

Enemy:

- HP tang nhe theo stage.
- Speed tang nhe theo stage.
- Spawn interval giam theo stage.

Boss:

- HP 900.
- Co 3 phase.
- Phase 3 rat nguy hiem do vua ban nhanh vua co laser.

Upgrade:

- Tang damage va spread anh huong lon nhat den DPS.
- Shield huu ich de song sot.
- Missile tang damage tu dong theo thoi gian.
- Max HP vua tang mau toi da vua hoi mau.

## 26. Nhung Diem Can Luu Y Khi Phat Trien

1. Sau khi sua file trong `src/` hoac `styles/`, phai build lai standalone.
2. `index.html` va `Sky-Thunder-Play.html` la output build, khong nen sua tay lau dai.
3. Them enemy moi thi sua `data/enemies.js`, sau do them vao `data/stages.js`.
4. Them weapon moi thi sua `data/weapons.js`, co the them vao `WEAPON_DROP_IDS`.
5. Them upgrade moi thi sua `data/upgrades.js`.
6. Them state moi thi sua `StateManager.js` va logic trong `Game.loop/update`.
7. Neu doi thu tu file JS, can cap nhat `tools/build-standalone.js`.

## 27. Huong Dan Them Noi Dung Moi

### Them enemy moi

1. Mo `src/data/enemies.js`.
2. Them config moi:

```js
sniper: {
  label: "Sniper",
  hp: 4,
  radius: 20,
  speed: 90,
  score: 80,
  fireRate: 3.2,
  color: "#ffffff",
  bulletMode: "single"
}
```

3. Them `"sniper"` vao `enemies` cua stage trong `src/data/stages.js`.
4. Neu can behavior rieng, sua `Enemy.update()` hoac `Enemy.fire()`.
5. Build lai standalone.

### Them weapon moi

1. Mo `src/data/weapons.js`.
2. Them config:

```js
rail: {
  id: "rail",
  name: "Rail",
  color: "#ffffff",
  symbol: "R",
  cooldownScale: 1.4,
  damageScale: 2.2,
  speedScale: 1.8,
  radius: 4,
  life: 0.9,
  pierce: 4,
  shape: "beam"
}
```

3. Them `"rail"` vao `WEAPON_DROP_IDS` neu muon roi ra.
4. Build lai standalone.

### Them upgrade moi

1. Mo `src/data/upgrades.js`.
2. Them object moi:

```js
{
  id: "speed",
  name: "Engine Boost",
  description: "Tang toc do di chuyen.",
  apply(player) {
    player.speed += 45;
  }
}
```

3. Build lai standalone.

### Them stage moi

1. Mo `src/data/stages.js`.
2. Them stage truoc boss hoac sau boss.
3. Neu them truoc boss, doi id cua boss thanh stage tiep theo.
4. Stage thuong can `duration`, `spawnEvery`, `enemies`.
5. Stage boss can `boss: true`.

## 28. Cac Y Tuong Phat Trien Tiep

Tinh nang gameplay:

- Mo rong Thunder Skill thanh nhieu bien the nhu chain lightning, slow field, overcharge.
- Bomb/ultimate phu ngoai Thunder Storm.
- Nhieu boss hon.
- Mini boss cuoi moi stage.
- Wave pattern co thiet ke san thay vi spawn random.
- Item magnet hut power-up.
- Combo multiplier.
- Leaderboard portal API neu submit len CrazyGames/Y8 va duoc ho tro.

Do hoa:

- Them sprite bitmap cho player/enemy.
- Them trail cho bullet.
- Them background parallax nhieu lop.
- Them flash khi hit boss.
- Them indicator canh bao khi dich sap vao tu tren.

Am thanh:

- Thay audio procedural bang audio asset rieng neu co asset hop phap.
- Them theme rieng cho boss.

Ky thuat:

- Object pooling cho bullet/particle de toi uu.
- Spatial partitioning neu so luong object tang lon.
- Fisher-Yates shuffle cho upgrade choices.
- Tach boss attack pattern thanh data.
- Them unit test cho collision, stage advance, upgrade apply.

UI:

- Menu settings.
- Man hinh chon do kho.
- Pause menu co nut restart.
- Man hinh guide ngan gon.

## 29. Rui Ro Va Han Che Hien Tai

- Thunder Skill da dung energy, nhung can playtest them de can bang energy gain/cooldown.
- Collision tron nen hitbox chua khop hoan toan voi hinh may bay.
- Spawn random co the tao nhip kho/de that thuong.
- Upgrade shuffle bang `sort(() => Math.random() - 0.5)` khong phai thuat toan shuffle tot nhat.
- Game loop da co `running` va `loopId` de chan start chong loop, nhung can giu can than neu sau nay them state moi.
- `STAGE_CLEAR` state gan nhu trung gian rat ngan vi `openUpgrade()` duoc goi ngay.
- Standalone build la script custom, khong phai bundler chuyen nghiep.

## 30. Ban Do File Theo Chuc Nang

Neu muon sua dieu khien:

- `src/core/Input.js`
- `src/entities/Player.js`

Neu muon sua gameplay chinh:

- `src/core/Game.js`

Neu muon sua do hoa world:

- `src/core/Renderer.js`
- `src/entities/*.js`
- `src/systems/EffectsSystem.js`

Neu muon sua UI:

- `src/ui/*.js`
- `styles/*.css`

Neu muon sua level:

- `src/data/stages.js`
- `src/data/enemies.js`

Neu muon sua vu khi/nang cap:

- `src/data/weapons.js`
- `src/data/upgrades.js`
- `src/entities/Player.js`
- `src/entities/Bullet.js`

Neu muon sua boss:

- `src/entities/Boss.js`
- `src/systems/StageSystem.js`

Neu muon sua build:

- `tools/build-standalone.js`

## 31. Ket Luan

Sky Thunder hien co nen tang kha gon va da co nhieu tinh nang arcade can thiet: high score, audio, mute, mobile drag control, Thunder Skill, wave pattern, mini boss, upgrade group va build standalone. Huong phat trien tot nhat la tiep tuc giu logic gameplay trong `src/`, dung `data/` de can bang nhanh, va chi build ra `index.html`/`Sky-Thunder-Play.html` sau khi da sua xong.

Neu muon mo rong manh, nen uu tien:

1. Playtest va can bang Thunder Skill.
2. Them boss/weapon/upgrade moi.
3. Them leaderboard portal API neu can submit.
4. Cai thien audio bang asset rieng hop phap.
5. Them settings/do kho va polish UI.

## 32. Tinh Trang Game Hien Tai

Cap nhat ngay 07/06/2026:

### Trang Thai Source Va Gameplay

- Source phat trien nam trong `src/` va `styles/`.
- Ban phat hanh standalone hien co la `index.html` va `Sky-Thunder-Play.html`.
- Hai file standalone co cung noi dung build va co the chay truc tiep tren trinh duyet.
- Game da co day du flow chinh: menu, Hangar, Stage 1-5, boss, upgrade, pause, game over, victory va Endless Mode.
- Cac he thong chinh da co: 5 ship, nhieu weapon, weapon level, Thunder Skill, combo, synergy, power-up, mini boss, credits, save local, audio va mobile control.
- Mobile da co HUD rieng, drag control, safe area, gioi han DPR/object va cac tuy chinh hieu nang.
- Build standalone gan nhat da duoc tao thanh cong bang `tools/build-standalone.js`.

### Trang Thai GitHub

- Repository: `https://github.com/thaicongvinh2704/thundersky.git`
- Branch chinh: `main`.
- Source da duoc commit va push len GitHub.
- Commit khoi tao source: `cda8dbd`.
- Commit them cau hinh deploy cPanel: `bf89a82`.
- File `.cpanel.yml` da co trong repository.

### Trang Thai Deploy cPanel

- Repository tren cPanel duoc clone tai:

```text
/home/mgffglfc/repositories/thundersky-game
```

- Thu muc website dich:

```text
/home/mgffglfc/public_html/
```

- `.cpanel.yml` hien deploy file `index.html` vao `public_html`.
- cPanel can checkout commit moi nhat co `.cpanel.yml` truoc khi nut `Deploy HEAD Commit` hoat dong.
- Quy trinh deploy:
  1. Vao cPanel `Git Version Control`.
  2. Mo repository `thundersky-game`.
  3. Chon `Pull or Deploy`.
  4. Bam `Update from Remote`.
  5. Kiem tra HEAD da la commit moi nhat.
  6. Bam `Deploy HEAD Commit`.
- Neu cPanel van bao `uncommitted changes`, can kiem tra file bi thay doi trong repository tren server hoac clone lai repository vao mot thu muc rong moi.
- Tai thoi diem cap nhat bao cao, cau hinh deploy da san sang trong GitHub; viec deploy thanh cong tren hosting van can duoc xac nhan tren cPanel.

### Kiem Thu Con Can Lam

- Xac nhan domain mo dung game sau khi deploy.
- Kiem tra `index.html` khong bi cache ban cu.
- Playtest day du Stage 1-5 va Endless tren desktop.
- Playtest Android Chrome va iPhone Safari that.
- Kiem tra pause, sound, save, Hangar va Thunder khi chay tren domain.
- Theo doi FPS va object count trong Endless tren mobile.
- Can bang tiep Thunder Hunter, boss, combo, credits va ti le drop sau playtest.

### Quy Uoc Cap Nhat Bao Cao

Sau moi dot hoan thanh tinh nang, sua loi, build hoac deploy, can cap nhat file nay voi:

- Ngay cap nhat.
- Cac file va he thong da thay doi.
- Lenh build/test da chay va ket qua.
- Trang thai commit/push/deploy.
- Cac loi, rui ro hoac viec con lai can kiem tra.

## 33. Cap Nhat Performance, PC Control Va Song Ngu

Cap nhat ngay 07/06/2026 theo yeu cau trong `pasted-text.txt`.

### Noi Dung Da Hoan Thanh

- Them performance tier `normal`, `low`, `critical`, do FPS trung binh moi 1.2 giay va co hysteresis de tranh doi tier lien tuc.
- DPR desktop theo tier: `1.75`, `1.35`, `1.15`; mobile: `1.35`, `1.15`, `1.0`.
- Object cap theo tier cho player bullet, enemy bullet, particle, power-up va enemy; mobile giam them 20%.
- Particle, star, cloud, streak, lightning, glow va composite effect tu dong giam theo tier.
- Spawn thuong va Endless dung cap enemy hien tai; enemy fire cham nhe khi enemy bullet gan day cap.
- Debug F3 hien them performance tier va DPR.
- Input co `pointermove` fallback tren `window`, pointer capture, clamp theo kich thuoc game va giu target cuoi khi cua so mat focus.
- UI button Pause, Thunder va Language chan pointer propagation de khong lam player teleport.
- Them Control Dock desktop o goc duoi phai:
  - `ESC / P`: Pause.
  - `RMB / Q / E`: Thunder.
  - `LMB`: Move + Fire.
- Nut Pause desktop chinh nam trong Control Dock; mobile van giu nut Pause rieng.
- Them `src/data/i18n.js`, mac dinh Tieng Viet, co English va luu lua chon bang `skyThunderLang`.
- Nut `VI | EN` doi ngon ngu ngay, khong reload.
- Da localization cac text chinh cua menu, pause, control guide, HUD dynamic, game over, victory, Hangar, upgrade screen va power-up feedback.
- `tools/build-standalone.js` da include `i18n.js` va markup Control Dock/Language.
- Da build lai `index.html` va `Sky-Thunder-Play.html`.

### Kiem Thu Da Chay

- `node --check` tat ca file JS da sua: pass.
- `node --check tools/build-standalone.js`: pass.
- `node tools/build-standalone.js`: pass.
- `git diff --check`: pass, chi co canh bao LF/CRLF cua Windows.
- Static check xac nhan standalone co performance tier, DPR debug, Control Dock, language storage va window pointer fallback.

### Kiem Thu Thu Cong Con Lai

- Keo chuot ra ngoai canvas, xuong taskbar va quay lai tren Chrome/Edge that.
- Quan sat tier tu dong doi khi FPS thap trong man dong va phuc hoi khi tai giam.
- Kiem tra Control Dock o desktop nho va desktop rong.
- Doi VI/EN tai menu, luc dang choi, pause, game over va victory.
- Playtest Endless sau 3 phut de danh gia cap enemy/bullet va do kho.
- Kiem tra Android Chrome va iPhone Safari de dam bao Control Dock an, nut mobile khong bi che.

## 34. Bugfix Runtime Sau Playtest

Cap nhat ngay 07/06/2026 theo yeu cau trong file TXT bugfix moi.

### Nguyen Nhan Thuc Te

- Lag van con vi tier cu chi giam mot phan effect, trong khi bullet, particle va power-up van tao bang `new` lien tuc.
- `Game.updateEntities()` va `EffectsSystem.update()` dung `.filter()` de tao mang moi moi frame, gay them garbage collection khi man hinh dong.
- `Bullet.draw()` van tao radial gradient va dung `lighter` cho moi bullet ke ca khi tier thap.
- Wave, carrier va boss summon van co duong spawn co the vuot cap tam thoi.
- Tieng Viet mat dau vi chinh cac chuoi trong `src/data/i18n.js` duoc viet khong dau, khong phai do loi charset.
- Pointer mat dieu khien vi `blur` xoa pointer id/fire state, khong co `mousemove` fallback va khong luu day du trang thai drag/target cuoi.

### Sua Hieu Nang

- Them pool tai su dung cho `Bullet`, `Particle` va `PowerUp`.
- Tat ca duong tao player/enemy bullet di qua `Game.addPlayerBullet()` va `Game.addEnemyBullet()` de chan truoc khi vuot cap.
- Power-up di qua `Game.addPowerUp()` va duoc tra ve pool khi het life hoac duoc nhat.
- Thay `.filter()` moi frame bang compact array in-place trong `Game` va `EffectsSystem`.
- Hard cap desktop:
  - Normal: 140 player bullet, 180 enemy bullet, 180 particle, 32 enemy, 14 power-up.
  - Low: 100, 130, 110, 24, 10.
  - Critical: 70, 90, 60, 18, 8.
- Mobile dung 75% cap desktop.
- Enemy bo/giam luot ban khi enemy bullet vuot 80% cap; khong tao bullet khi da dat cap.
- Random spawn, wave, carrier, Hunter va boss summon deu kiem tra cap enemy truoc khi tao.
- Low/critical giam hoac tat bullet glow, particle `lighter`, power-up glow, boss/player shadow, cloud va background streak.
- FPS debug co ca FPS tuc thoi va average FPS.
- Average FPS duoi 45 trong 2 giay chuyen Low; duoi 32 trong 1.5 giay chuyen Critical; tren 56 trong 5 giay moi phuc hoi tier.
- Khi doi tier, game cap object ngay va resize canvas mot lan de ap dung DPR moi.

### Sua Tieng Viet

- Toan bo chuoi giao dien tieng Viet trong `i18n.js` da doi sang Unicode co dau.
- Menu, HUD, Pause, Game Over, Victory, Hangar, power-up va thong bao Thunder dung chuoi co dau.
- HTML build co `<meta charset="UTF-8">`.
- Build script ghi `index.html` va `Sky-Thunder-Play.html` voi encoding `utf8`.
- Font DOM va Canvas dung stack co `Segoe UI` va `Noto Sans`.

### Sua Pointer Desktop

- Input luu them `pointerActive`, `pointerDown`, `dragging`, `lastPointerX`, `lastPointerY`, `lastKnownInsideViewport` va pointer id.
- Co ca `window.pointermove` va `window.mousemove` fallback.
- Toa do luon clamp theo kich thuoc game; khi mat focus giu target cuoi thay vi reset/dua player ve giua.
- Khi con tro quay lai, mouse/pointer event tiep tuc cap nhat target.
- Pause, Thunder, Language va Sound dung `preventDefault()` + `stopPropagation()` de khong doi target player.
- CSS van khoa overflow, overscroll, touch action va user select.

### Test Da Chay

- Tat ca lenh `node --check` bat buoc: pass.
- `node tools/build-standalone.js`: pass.
- Static check output xac nhan co UTF-8, tieng Viet co dau, pool/cap/tier, pointermove/mousemove, Control Dock va language switch.
- Chrome headless mo `index.html` thanh cong, JavaScript khoi tao HUD/menu va localization.
- Screenshot desktop 1280x800 xac nhan text co dau, Control Dock va nut Sound/Language khong chong nhau.

### Chua The Tu Dong Playtest

- Headless browser khong mo phong duoc con tro roi khoi cua so Windows xuong taskbar.
- Can test tay Chrome/Edge: giu chuot trai, keo xuong taskbar, quay lai canvas va keo qua hai canh.
- Can test 3 phut stage dong/Endless bang F3 tren may that de danh gia FPS sau pooling.
- Can test Android Chrome va iPhone Safari tren thiet bi that.

## 35. Bugfix Mobile Safari Zoom Va Viewport

Cap nhat ngay 07/06/2026 theo yeu cau trong file TXT ve loi double tap/pinch zoom tren mobile.

### Nguyen Nhan

- iPhone Safari van co the zoom page khi double tap hoac pinch neu chi dung `touch-action` CSS va viewport meta chua day du.
- Code cu moi chan `gesturestart`, chua chan `gesturechange`, `gestureend`, double-tap `touchend` va multi-touch `touchstart`.
- Canvas da dung `visualViewport` mot phan, nhung CSS chua set `--app-width` va canvas fixed theo viewport that nen khi Safari address bar co/dan co the bi lech/khoang den.
- UI button co the nhan touch rieng lam browser sinh zoom/click tong hop neu khong chan propagation o tang document.

### Noi Dung Da Sua

- `tools/build-standalone.js`: viewport meta doi thanh `width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover`; giu `<meta charset="UTF-8">`.
- `styles/base.css`: `html/body` fixed full viewport, khoa overflow/overscroll/touch action, canvas `#game` fixed `inset: 0`, width theo `--app-width`, height theo `--app-height`.
- `styles/menu.css`: menu scroll noi bo dung `--app-height` thay vi chi dua vao `100dvh`, them `touch-action: pan-y` cho menu.
- `src/core/Game.js`: them `getViewportSize()`, `updateAppViewport()`, cap nhat `--app-height`, `--app-width`, viewport offset, resize debounce 120ms.
- `src/core/Game.js`: lang nghe `resize`, `orientationchange`, `visualViewport.resize`, `visualViewport.scroll`, `focus`, `visibilitychange` de resize lai canvas.
- `src/core/Game.js`: them guard `touchstart` multi-touch, `touchmove`, double-tap `touchend`, va `gesturestart/gesturechange/gestureend` voi `{ passive: false }`.
- `src/core/Game.js`: them guard cho button UI quan trong: Thunder, Pause, Sound, Language, Start, Upgrade card, Hangar, Pause actions, ship card; touch button goi click chu dong de UI van hoat dong sau khi chan touch zoom.

### Test Da Chay

- `node --check src/core/Game.js`: pass.
- `node --check src/core/Input.js`: pass.
- `node --check tools/build-standalone.js`: pass.
- `node tools/build-standalone.js`: pass, da tao lai `index.html` va `Sky-Thunder-Play.html`.
- Static check xac nhan ca hai standalone co viewport meta moi, `gesturestart/gesturechange/gestureend`, double-tap `touchend`, `visualViewport`, `--app-height`, `--app-width`, canvas fixed full viewport.
- `git diff --check`: pass, chi co canh bao LF/CRLF cua Windows.

### Can Playtest Tren Thiet Bi That

- iPhone Safari: double tap canvas, double tap Thunder/Pause/Sound/Language, pinch 2 ngon, keo may bay lien tuc, xoay ngang/doc, cho address bar co/dan.
- Android Chrome: test cac case tuong tu.
- Xac nhan canvas luon full man hinh, khong bi thu nho/lẹch trai, khong co khoang den ben phai, nut Thunder khong phong to bat thuong.

## 36. Hotfix Nut Thunder Mobile Sau Khi Khoa Zoom

Cap nhat ngay 07/06/2026 sau khi phat hien mobile khong bam duoc nut Bao Sam.

### Nguyen Nhan

- Lop guard chong zoom moi bat su kien `pointerdown/touchstart` o capture phase cho tat ca button, nen tren mot so browser mobile click cua nut Thunder co the khong den handler rieng.
- HUD set `disabled` that cho nut Thunder khi chua ready, lam mobile Safari de bo qua touch/click va khong hien feedback khi nguoi choi bam.

### Da Sua

- `src/ui/Hud.js`: nut Thunder khong con bi `disabled` that; dung `aria-disabled` de bao trang thai nhung van nhan touch.
- `src/core/Game.js`: neu touch/pointer vao `#skillBtn`, guard se goi `activateThunder()` truc tiep khi dang choi, hoac request skill neu chua vao gameplay.
- Them debounce ngan cho nut Thunder de tranh pointer/touch kich hoat lap hai lan.
- Build lai `index.html` va `Sky-Thunder-Play.html`.

### Test Da Chay

- `node --check src/core/Game.js`: pass.
- `node --check src/ui/Hud.js`: pass.
- `node --check tools/build-standalone.js`: pass.
- `node tools/build-standalone.js`: pass.

## 37. Hotfix Do Ro Thanh Mau Va Canh Bao Sap Chet

Cap nhat ngay 07/06/2026 sau khi playtest thay thanh mau qua mo, khi gan chet nguoi choi kho nhan ra.

### Nguyen Nhan

- Thanh mau mobile chi cao khoang 7px, mau gradient cu khong tao du khac biet khi HP thap.
- HUD chi hien bar, khong co so HP cu the.
- Khi bi danh hoac mau xuong thap, game chua co canh bao toan man hinh nen nguoi choi dang tap trung ne dan de bo sot.

### Da Sua

- `tools/build-standalone.js`: them `healthText` hien so HP hien tai/toi da trong HUD.
- `src/main.js`: bind DOM `#healthText`.
- `src/ui/Hud.js`: cap nhat so HP, them class warning/danger/critical theo ti le mau.
- `src/core/Game.js`: them `damageFlash` ngan khi nhan damage.
- `styles/hud.css`: thanh mau day va sang hon; HP thap doi sang vang/cam, nguy hiem doi do, critical nhap nhay.
- `styles/hud.css`: them vien/overlay do nhe khi mau thap hoac vua bi danh de nguoi choi nhan ra ngay.
- Build lai `index.html` va `Sky-Thunder-Play.html`.

### Test Da Chay

- `node --check src/core/Game.js`: pass.
- `node --check src/ui/Hud.js`: pass.
- `node --check src/main.js`: pass.
- `node --check tools/build-standalone.js`: pass.
- `node tools/build-standalone.js`: pass.
