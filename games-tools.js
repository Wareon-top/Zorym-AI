(function () {
  'use strict';

  const c = function (state, title, detail, proof) { return { state: state, title: title, detail: detail, proof: proof }; };
  const catalog = {
    'player-journey': {
      kicker: 'Игровой сценарий', title: 'Player Journey', icon: '◇', metric: '3/5',
      summary: 'Проверяет путь игрока как последовательность наблюдаемых действий, а не как список созданных файлов.',
      status: 'Демо · 3 шага подтверждены', scope: 'Снимок структуры · 14:31',
      objects: ['Workspace/TeleportPads', 'StarterGui/TeleportMenu', 'ReplicatedStorage/TeleportRequest', 'ServerScriptService/TeleportService'],
      limit: 'Сейчас показан интерфейсный сценарий на сохранённом снимке проекта. Движение реального игрока и многопользовательская сессия не запускались.',
      action: 'Пройти демо-путь', result: 'Демо-путь завершён. Для статуса «Проверено в Studio» потребуется подключённая тестовая сессия.',
      variants: [
        { label: 'Основной путь', checks: [c('pass','Игрок появился','SpawnLocation найден в Workspace','структура'),c('pass','Меню площадок открылось','TeleportMenu доступен после касания','UI'),c('pass','Камера показала назначение','Переход камеры описан в сценарии','событие'),c('pending','Телепорт подтверждён сервером','Ожидает реального Play Test','не запускался')] },
        { label: 'Повторный клик', checks: [c('pass','Запрос блокируется','Debounce найден в TeleportService','код'),c('warn','Интервал не измерен','Нужен реальный ввод пользователя','ограничение'),c('pending','Повторная награда не выдана','Ожидает серверного теста','не запускался')] },
        { label: 'Обрыв связи', checks: [c('pass','Тайм-аут предусмотрен','Клиент возвращает управление интерфейсу','код'),c('warn','Потеря пакетов не эмулировалась','Нет подключённой Studio-сессии','ограничение'),c('pending','Повторное подключение','Требуется сетевой Play Test','не запускался')] }
      ]
    },
    'economy-guard': {
      kicker: 'Защита экономики', title: 'Economy Guard', icon: '⌾', metric: '2/3',
      summary: 'Показывает, где валюта, покупки и награды могут быть повторены или приняты без серверной проверки.',
      status: 'Демо · 1 предупреждение', scope: 'PlayerData и RemoteEvents · 14:31',
      objects: ['ServerScriptService/PlayerData', 'ReplicatedStorage/TeleportRequest', 'Players/leaderstats/Coins'],
      limit: 'Статический анализ видит только доступные скрипты и связи. Он не доказывает безопасность реальных покупок, DataStore или Developer Products без серверного теста.',
      action: 'Проверить демо-экономику', result: 'Демо-проверка завершена: предупреждение сохранено, пока серверный сценарий не будет воспроизведён.',
      variants: [
        { label: 'Награда', checks: [c('pass','Начисление выполняется на сервере','Клиент не записывает Coins напрямую','код'),c('pass','Повторный ID хранится','ReceiptId участвует в проверке','код'),c('warn','Сбой DataStore не воспроизведён','Нужен тест отказа записи','ограничение')] },
        { label: 'Покупка', checks: [c('pass','Цена читается на сервере','Клиент передаёт только идентификатор','код'),c('warn','Двойное подтверждение не проверено','Нет реального Marketplace callback','ограничение'),c('pending','Возврат после ошибки','Ожидает Play Test','не запускался')] },
        { label: 'RemoteEvent', checks: [c('pass','Тип аргумента проверяется','Неизвестные площадки отклоняются','код'),c('pass','Есть ограничение частоты','Запросы игрока охлаждаются','код'),c('warn','Нагрузка не измерена','Нет многопользовательского теста','ограничение')] }
      ]
    },
    'ui-vision': {
      kicker: 'Проверка интерфейса', title: 'UI Vision', icon: '▣', metric: '2/3',
      summary: 'Собирает проверки читаемости, безопасных зон и способов управления для конкретного Roblox-интерфейса.',
      status: 'Демо · мобильное предупреждение', scope: 'TeleportMenu · снимок 14:31',
      objects: ['StarterGui/TeleportMenu', 'TeleportMenu/DestinationList', 'TeleportMenu/TeleportButton', 'TeleportMenu/CameraPreview'],
      limit: 'Без Device Emulator доступны только свойства и заданные размеры. Скриншоты реального рендера, перекрытия системным UI и ввод касанием пока не подтверждены.',
      action: 'Проверить демо-макеты', result: 'Демо-макеты сопоставлены. Предупреждение о нижней безопасной зоне оставлено до реального Device Emulator.',
      variants: [
        { label: 'Телефон', checks: [c('pass','Текст остаётся читаемым','Минимальный размер соответствует макету','свойства'),c('warn','Кнопка близко к safe area','Нужно 12 px дополнительного отступа','расчёт'),c('pending','Касание не воспроизводилось','Требуется Device Emulator','не запускался')] },
        { label: 'Планшет', checks: [c('pass','Список помещается без обрезки','Видимы четыре площадки','макет'),c('pass','Превью сохраняет пропорции','AspectRatioConstraint найден','свойства'),c('pending','Поворот экрана','Ожидает эмуляцию','не запускался')] },
        { label: 'Desktop', checks: [c('pass','Мышь и клавиатура доступны','Кнопка имеет Selectable и shortcut','свойства'),c('pass','Контраст текста достаточен','Проверена текущая палитра','расчёт'),c('pending','Геймпад не воспроизводился','Требуется ввод в Studio','не запускался')] }
      ]
    },
    'game-memory': {
      kicker: 'Память проекта', title: 'Game Memory', icon: '◫', metric: '37',
      summary: 'Показывает, какие решения и зависимости текущего Roblox-проекта использованы агентом при составлении плана.',
      status: 'Демо · 37 решений в контексте', scope: 'Только Vault Raiders · версия 08',
      objects: ['GameMemory/DataStorePolicy', 'GameMemory/NamingRules', 'GameMemory/UIStyle', 'GameMemory/RemoteEventMap'],
      limit: 'Память ограничена этим проектом и демонстрационным снимком. Она не переносит данные в другие игры и не содержит скрытой истории аккаунта.',
      action: 'Показать использованный контекст', result: 'Показан контекст, который повлиял на демо-план. Новых данных из Studio не получено.',
      variants: [
        { label: 'Решения', checks: [c('info','DataStore меняется через PlayerData','Решение принято в версии 05','память'),c('info','Сервер авторитетен для валюты','Решение принято в версии 06','память'),c('info','UI использует нейтральные панели','Решение принято в версии 07','память')] },
        { label: 'Зависимости', checks: [c('pass','TeleportService связан с PlayerData','Используется профиль игрока','граф'),c('pass','TeleportMenu вызывает TeleportRequest','RemoteEvent найден в хранилище','граф'),c('warn','Внешние модули не загружены','Проверен только доступный проект','ограничение')] },
        { label: 'Источники', checks: [c('info','Версия 08','Основной снимок перед задачей','версия'),c('info','3 изменённых скрипта','Контекст текущего плана','план'),c('info','7 объектов Roblox','Область демонстрационного изменения','структура')] }
      ]
    },
    'time-machine': {
      kicker: 'Версии проекта', title: 'Time Machine', icon: '↶', metric: '08',
      summary: 'Показывает точный состав версии, различия скриптов и границы восстановления до применения изменений.',
      status: 'Демо · версия 08 сохранена', scope: 'Контрольная точка до задачи',
      objects: ['Version 09/TeleportMenu', 'Version 09/TeleportService', 'Version 09/TeleportRequest', 'Version 08/PlayerData'],
      limit: 'Кнопка выполняет только демонстрационный переход интерфейса. Реальное восстановление Instances возможно после подключения Studio Link и создания контрольной точки.',
      action: 'Показать демо восстановления', result: 'Демо вернуло представление к версии 08. Файлы реального Roblox-проекта не изменялись.',
      variants: [
        { label: 'Версия 09', checks: [c('info','7 объектов изменено','4 созданы и 3 обновлены','diff'),c('pass','PlayerData не удалён','Сохранена существующая структура','diff'),c('pending','Версия не записана в Studio','Демонстрационный результат','не создана')] },
        { label: 'Версия 08', checks: [c('pass','Контрольная точка описана','Состояние до текущего плана','снимок'),c('pass','3 скрипта доступны для сравнения','Показаны затронутые участки','diff'),c('warn','Восстановление не запускалось','Studio Link не применял изменения','ограничение')] },
        { label: 'Сравнение', checks: [c('info','TeleportMenu добавлен','Новый ScreenGui','+ instance'),c('info','TeleportService обновлён','Добавлена серверная проверка','± script'),c('info','TeleportRequest добавлен','Новый RemoteEvent','+ instance')] }
      ]
    },
    'studio-proof': {
      kicker: 'Доказательство результата', title: 'Studio Proof', icon: '✓', metric: '4/6',
      summary: 'Отделяет созданный код от результата, который действительно прошёл воспроизводимый сценарий в Roblox Studio.',
      status: 'Демо · проверка выполняется', scope: 'Teleport pads · тестовый сценарий',
      objects: ['TestSession/Player-1', 'Workspace/TeleportPads', 'StarterGui/TeleportMenu', 'ServerScriptService/TeleportService'],
      limit: 'В UI-демо статус «Проверено в Studio» появляется только после всех 6 шагов. В реальном продукте для него потребуются активная сессия, журнал выполнения и сохранённые доказательства.',
      action: 'Завершить демо-проверку', result: 'Шесть демо-шагов завершены. Показанный статус — пример интерфейса, а не запись реального Studio Link.',
      variants: [
        { label: 'Проверки', checks: [c('pass','Изменения применены в сценарии','4 объекта и 3 скрипта','демо'),c('pass','Интерфейс открывается','Список площадок доступен','демо'),c('pending','Телепорт реального игрока','Play Test не запускался','не подтверждено')] },
        { label: 'Ошибки', checks: [c('pass','Runtime errors в демо: 0','По сохранённому сценарию','демо'),c('warn','Сетевой сбой не проверен','Нет живого Studio Link','ограничение'),c('pending','Многопользовательская гонка','Требуется Server & Clients','не запускался')] },
        { label: 'Отчёт', checks: [c('info','Версия до задачи: 08','Точка возврата описана','версия'),c('info','Версия результата: демо 09','Не записана в Studio','демо'),c('info','Непроверенные области: 2','Сеть и несколько клиентов','границы')] }
      ]
    }
  };

  const layer = document.querySelector('#game-tool-layer');
  const drawer = document.querySelector('#game-tool-drawer');
  const variants = document.querySelector('#game-tool-variants');
  const planButton = document.querySelector('#game-tool-plan');
  const runButton = document.querySelector('#game-tool-run');
  let activeTool = '';
  let lastTrigger = null;
  let closeTimer = 0;

  function renderVariant(index) {
    const tool = catalog[activeTool];
    const variant = tool.variants[index];
    const icons = { pass: '✓', warn: '!', pending: '…', info: 'i' };
    variants.querySelectorAll('[role="tab"]').forEach(function (button, buttonIndex) {
      const selected = buttonIndex === index;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    document.querySelector('#game-tool-checks').innerHTML = variant.checks.map(function (check) {
      return '<li class="' + check.state + '"><i class="game-tool-check-state">' + icons[check.state] + '</i><div><b>' + check.title + '</b><small>' + check.detail + '</small></div><em>' + check.proof + '</em></li>';
    }).join('');
    const captured = variant.checks.filter(function (check) { return check.state === 'pass' || check.state === 'info'; }).length;
    document.querySelector('#game-tool-evidence-count').textContent = captured + ' из ' + variant.checks.length + ' зафиксировано';
    document.querySelector('#game-tool-evidence-title').textContent = variant.label;
    document.querySelector('#game-tool-live-result').textContent = '';
    runButton.disabled = false;
    runButton.textContent = tool.action;
  }

  function renderTool(key) {
    const tool = catalog[key];
    activeTool = key;
    document.querySelector('#game-tool-kicker').textContent = tool.kicker;
    document.querySelector('#game-tool-title').textContent = tool.title;
    document.querySelector('#game-tool-icon').textContent = tool.icon;
    document.querySelector('#game-tool-summary').textContent = tool.summary;
    document.querySelector('#game-tool-status').textContent = tool.status;
    document.querySelector('#game-tool-metric').textContent = tool.metric;
    document.querySelector('#game-tool-scope').textContent = tool.scope;
    document.querySelector('#game-tool-limit').textContent = tool.limit;
    document.querySelector('#game-tool-objects').innerHTML = tool.objects.map(function (item) { return '<span>' + item + '</span>'; }).join('');
    variants.innerHTML = tool.variants.map(function (variant, index) { return '<button type="button" role="tab" aria-selected="' + String(index === 0) + '" tabindex="' + (index === 0 ? '0' : '-1') + '">' + variant.label + '</button>'; }).join('');
    variants.querySelectorAll('[role="tab"]').forEach(function (button, index) {
      button.addEventListener('click', function () { renderVariant(index); });
      button.addEventListener('keydown', function (event) {
        const buttons = Array.from(variants.querySelectorAll('[role="tab"]'));
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else return;
        event.preventDefault();
        renderVariant(next);
        buttons[next].focus();
      });
    });
    planButton.setAttribute('aria-pressed', 'false');
    planButton.textContent = 'Добавить в план';
    renderVariant(0);
  }

  function openTool(key, trigger) {
    if (!catalog[key]) return;
    window.clearTimeout(closeTimer);
    lastTrigger = trigger;
    renderTool(key);
    layer.hidden = false;
    document.body.classList.add('game-tool-open');
    window.requestAnimationFrame(function () { layer.classList.add('open'); drawer.focus(); });
  }

  function closeTool() {
    if (layer.hidden) return;
    layer.classList.remove('open');
    document.body.classList.remove('game-tool-open');
    closeTimer = window.setTimeout(function () {
      layer.hidden = true;
      if (lastTrigger) lastTrigger.focus();
    }, 220);
  }

  document.querySelectorAll('[data-game-tool]').forEach(function (button) {
    button.addEventListener('click', function () { openTool(button.dataset.gameTool, button); });
  });
  document.querySelector('#close-game-tool').addEventListener('click', closeTool);
  document.querySelector('#game-tool-scrim').addEventListener('click', closeTool);

  planButton.addEventListener('click', function () {
    const added = planButton.getAttribute('aria-pressed') !== 'true';
    planButton.setAttribute('aria-pressed', String(added));
    planButton.textContent = added ? 'Добавлено в план' : 'Добавить в план';
    document.querySelector('#game-tool-live-result').textContent = added ? 'Демо: ' + catalog[activeTool].title + ' добавлен в текущий план.' : 'Демо: инструмент удалён из текущего плана.';
  });

  runButton.addEventListener('click', function () {
    const tool = catalog[activeTool];
    const visibleChecks = Array.from(document.querySelectorAll('#game-tool-checks li'));
    const capturedChecks = visibleChecks.filter(function (item) { return item.classList.contains('pass') || item.classList.contains('info'); }).length;
    document.querySelector('#game-tool-evidence-count').textContent = capturedChecks + ' из ' + visibleChecks.length + ' зафиксировано';
    document.querySelector('#game-tool-status').textContent = activeTool === 'studio-proof' ? 'UI-демо завершено · реальный тест не запущен' : 'Демо завершено · ограничения сохранены';
    document.querySelector('#game-tool-live-result').textContent = tool.result;
    runButton.textContent = 'Демо выполнено';
    runButton.disabled = true;
    if (activeTool === 'studio-proof') {
      const proofButton = document.querySelector('#simulate-proof');
      if (proofButton && !proofButton.disabled) proofButton.click();
    }
    if (activeTool === 'time-machine') {
      document.querySelector('#game-version-label').textContent = 'Версия 08';
      document.querySelector('#game-version-copy').textContent = 'выбрана в демо';
    }
    notify(tool.title + ': демо-сценарий завершён');
  });

  drawer.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(drawer.querySelectorAll('button:not([disabled]), [tabindex="0"]')).filter(function (item) { return !item.hidden; });
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (document.activeElement === drawer) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !layer.hidden) { event.preventDefault(); closeTool(); }
  });
}());
