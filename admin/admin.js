(() => {
  const panelTitles = {
    overview: "Обзор",
    users: "Пользователи",
    projects: "Проекты",
    queue: "Очередь задач",
    billing: "Тарифы и лимиты",
    infrastructure: "Инфраструктура",
    audit: "Журнал аудита"
  };
  const root = document.documentElement;
  const sidebar = document.querySelector("#sidebar");
  const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
  const drawer = document.querySelector("[data-user-drawer]");
  const drawerBackdrop = document.querySelector(".drawer-backdrop");
  const toast = document.querySelector("[data-toast-box]");
  let toastTimer;
  let queuePaused = false;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function closeMenu() {
    sidebar?.classList.remove("open");
    sidebarBackdrop?.classList.remove("open");
  }

  function selectPanel(name, updateHash = true) {
    const selectedName = panelTitles[name] ? name : "overview";
    document.querySelectorAll("[data-panel]").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === selectedName);
    });
    document.querySelectorAll(".sidebar-nav [data-panel-target]").forEach((button) => {
      button.classList.toggle("active", button.dataset.panelTarget === selectedName);
    });
    const title = document.querySelector("[data-page-title]");
    if (title) title.textContent = panelTitles[selectedName];
    document.title = `${panelTitles[selectedName]} — Astrylo Control`;
    if (updateHash) history.replaceState(null, "", `#${selectedName}`);
    closeMenu();
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.addEventListener("click", () => selectPanel(button.dataset.panelTarget));
  });
  document.querySelector("[data-open-menu]")?.addEventListener("click", () => {
    sidebar?.classList.add("open");
    sidebarBackdrop?.classList.add("open");
  });
  document.querySelectorAll("[data-close-menu]").forEach((button) => button.addEventListener("click", closeMenu));

  const profileButton = document.querySelector("[data-profile]");
  const profileMenu = document.querySelector("[data-profile-menu]");
  profileButton?.addEventListener("click", () => {
    if (profileMenu) profileMenu.hidden = !profileMenu.hidden;
  });

  const storedTheme = localStorage.getItem("astrylo-admin-theme");
  if (storedTheme === "dark") root.dataset.theme = "dark";
  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("astrylo-admin-theme", next);
    showToast(next === "dark" ? "Тёмная тема включена" : "Светлая тема включена");
  });

  document.querySelector("[data-refresh]")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    button.classList.add("loading");
    button.disabled = true;
    await new Promise((resolve) => setTimeout(resolve, 720));
    button.classList.remove("loading");
    button.disabled = false;
    const updated = document.querySelector("[data-updated]");
    if (updated) updated.textContent = `Обновлено ${new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
    showToast("Данные обновлены");
  });

  document.querySelectorAll("[data-range]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-range]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const values = { "7": "18 429", "30": "74 208", "90": "211 906" };
      const total = document.querySelector("[data-chart-total]");
      if (total) total.textContent = values[button.dataset.range] || values["7"];
    });
  });

  document.querySelectorAll("[data-queue-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      queuePaused = !queuePaused;
      document.querySelectorAll("[data-queue-toggle]").forEach((control) => {
        control.textContent = queuePaused ? "Возобновить очередь" : control.classList.contains("pause-main") ? "Приостановить очередь" : "Приостановить";
      });
      document.querySelectorAll(".live-badge").forEach((badge) => {
        badge.innerHTML = queuePaused ? "Пауза" : "<i></i>Live";
      });
      showToast(queuePaused ? "Новые задачи поставлены на паузу" : "Очередь снова принимает задачи");
    });
  });

  const searchInput = document.querySelector("[data-table-search]");
  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim().toLocaleLowerCase("ru");
    let visible = 0;
    document.querySelectorAll("[data-user-row]").forEach((row) => {
      const match = !query || row.dataset.search.toLocaleLowerCase("ru").includes(query);
      row.hidden = !match;
      if (match) visible += 1;
    });
    const count = document.querySelector("[data-result-count]");
    if (count) count.textContent = query ? `Найдено: ${visible}` : "Показано 5 из 2 847";
  });

  document.querySelector("[data-focus-search]")?.addEventListener("click", () => {
    selectPanel("users");
    setTimeout(() => searchInput?.focus(), 40);
  });

  function openDrawer(row) {
    const name = row.dataset.name || "Пользователь";
    const email = row.dataset.email || "—";
    const initials = name.split(/\s+/u).map((part) => part[0]).join("").slice(0, 2);
    const nameNode = document.querySelector("[data-drawer-name]");
    const emailNode = document.querySelector("[data-drawer-email]");
    const avatarNode = document.querySelector("[data-drawer-avatar]");
    if (nameNode) nameNode.textContent = name;
    if (emailNode) emailNode.textContent = email;
    if (avatarNode) avatarNode.textContent = initials;
    drawer?.classList.add("open");
    drawer?.setAttribute("aria-hidden", "false");
    drawerBackdrop?.classList.add("open");
  }

  function closeDrawer() {
    drawer?.classList.remove("open");
    drawer?.setAttribute("aria-hidden", "true");
    drawerBackdrop?.classList.remove("open");
  }

  document.querySelectorAll("[data-user-row]").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (!event.target.closest("button")) openDrawer(row);
    });
    row.tabIndex = 0;
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter") openDrawer(row);
    });
  });
  document.querySelector("[data-close-drawer]")?.addEventListener("click", closeDrawer);
  drawerBackdrop?.addEventListener("click", closeDrawer);

  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });

  document.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => {
      const csv = "section,metric,value\noverview,active_users,2847\noverview,task_success,98.4%\noverview,queue,23\n";
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "astrylo-control-export.csv";
      link.click();
      URL.revokeObjectURL(url);
      showToast("CSV-отчёт скачан");
    });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
      event.preventDefault();
      selectPanel("users");
      setTimeout(() => searchInput?.focus(), 40);
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "d") {
      event.preventDefault();
      document.querySelector("[data-theme-toggle]")?.click();
    }
    if (event.key === "Escape") {
      closeDrawer();
      closeMenu();
      if (profileMenu) profileMenu.hidden = true;
    }
    if (!event.metaKey && !event.ctrlKey && /^[1-7]$/u.test(event.key) && !/input|textarea/i.test(document.activeElement?.tagName || "")) {
      selectPanel(Object.keys(panelTitles)[Number(event.key) - 1]);
    }
  });

  const today = document.querySelector("[data-today]");
  if (today) today.textContent = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date()).toLocaleUpperCase("ru");
  selectPanel(location.hash.slice(1) || "overview", false);
})();
