export const locales = ["en", "uk"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uk";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "uk";
}

type TranslationValues = Record<string, string | number>;

const messages: Record<Locale, Record<string, string>> = {
  en: {
    "app.description": "Mobile-first parcel management for branch staff.",
    "app.name": "Parcel Flow",
    "branch.change": "Change branch",
    "branch.loadingWorkspace": "Loading branch workspace...",
    "branch.number": "Branch #{branchNumber}",
    "dashboard.activeBranch": "Active branch",
    "dashboard.quickAction": "Quick action",
    "dashboard.records": "Branch records",
    "dashboard.scanDescription":
      "Open the camera, detect the barcode, and register or update parcel status in seconds.",
    "dashboard.scanParcel": "Scan Parcel",
    "dashboard.title": "Dashboard",
    "dashboard.viewDescription":
      "Search by TTN, filter by status, sort by date, and update parcel results from one list.",
    "dashboard.viewParcels": "View Parcels",
    "filters.allStatuses": "All statuses",
    "filters.newestFirst": "Newest first",
    "filters.oldestFirst": "Oldest first",
    "filters.reset": "Reset filters",
    "filters.searchPlaceholder": "Search by TTN",
    "filters.sortPlaceholder": "Sort by date",
    "filters.statusPlaceholder": "Filter by status",
    "filters.title": "Filters",
    "form.branchHint":
      "Use digits only. We will remember this branch on this device.",
    "form.branchPlaceholder": "e.g. 123",
    "form.continue": "Continue",
    "form.enterBranch": "Enter branch number",
    "form.openingDashboard": "Opening dashboard...",
    "home.description":
      "Enter the branch number to unlock scanning, parcel history, and status updates designed for field teams on mobile devices.",
    "home.openDashboard": "Open dashboard",
    "home.returningWorker": "Returning worker?",
    "home.returningWorkerDescription":
      "Your branch stays saved on this device.",
    "home.title": "Scan and manage branch parcels faster.",
    "lang.english": "English",
    "lang.switcherLabel": "Language",
    "lang.ukrainian": "Українська",
    "network.unexpected": "Unexpected network error.",
    "pagination.next": "Next",
    "pagination.pageOf": "Page {page} of {totalPages}",
    "pagination.previous": "Previous",
    "parcels.description":
      "Search by TTN, filter by parcel status, and update the record when a parcel is delivered, returned, rejected, or absent.",
    "parcels.refresh": "Refresh",
    "parcels.title": "Parcel list",
    "scan.back": "Back",
    "scan.barcodeDetected": "Barcode detected: {ttn}",
    "scan.description":
      "Use the back camera, keep the barcode inside the guide, and let the scanner create or update the parcel automatically.",
    "scan.flow": "Scan flow",
    "scan.loadingScanner": "Loading camera scanner...",
    "scan.parcelExists":
      "Parcel {ttn} already exists. Choose a new status.",
    "scan.parcelSaved": "Parcel {ttn} saved successfully.",
    "scan.retry": "Try again",
    "scan.title": "Scan parcel barcode",
    "scanner.align": "Align the barcode inside the frame",
    "scanner.guidance":
      "Keep the barcode steady for a moment. If nothing is detected, move a bit closer or improve lighting.",
    "scanner.live": "Live scanner",
    "scanner.noCamera": "No camera is available on this device.",
    "scanner.permissionDenied":
      "Camera permission denied. Please allow camera access and try again.",
    "scanner.starting": "Starting",
    "scanner.unableToStart": "Unable to start barcode scanner on this device.",
    "status.absent": "Absent",
    "status.delivered": "Delivered",
    "status.new": "New",
    "status.rejected": "Rejected",
    "status.returned": "Returned",
    "statusDialog.descriptionExisting":
      "Parcel {ttn} was already scanned. Choose the latest delivery result.",
    "statusDialog.descriptionGeneric":
      "Choose the latest status for this parcel.",
    "statusDialog.save": "Save status",
    "statusDialog.saving": "Saving...",
    "statusDialog.select": "Select status",
    "statusDialog.status": "Status",
    "statusDialog.title": "Update parcel status",
    "table.action": "Action",
    "table.date": "Date",
    "table.empty": "No parcels found for this filter set.",
    "table.loading": "Loading parcels...",
    "table.status": "Status",
    "table.ttn": "TTN",
    "table.updateStatus": "Update status",
    "validation.branch.digits": "Branch number must contain digits only.",
    "validation.branch.max": "Branch number is too long.",
    "validation.branch.required": "Branch number is required.",
    "validation.parcelId.integer": "Parcel id must be a whole number.",
    "validation.parcelId.positive": "Parcel id must be positive.",
    "validation.ttn.long": "TTN is too long.",
    "validation.ttn.short": "TTN is too short.",
    "api.database.invalid":
      "DATABASE_URL is invalid. Add a valid Neon connection string to .env.local.",
    "api.database.missing":
      "DATABASE_URL is not configured. Add your Neon connection string to .env.local.",
    "api.invalidPayload": "Invalid payload.",
    "api.invalidQuery": "Invalid query parameters.",
    "api.invalidRequest": "Invalid request.",
    "api.parcelCreated": "Parcel created.",
    "api.parcelNotFound": "Parcel not found.",
    "api.duplicateTTN": "Duplicate TTN detected.",
    "api.unableLoadParcels": "Unable to load parcels.",
    "api.unableSaveParcel": "Unable to save parcel.",
    "api.unableUpdateParcel": "Unable to update parcel status.",
  },
  uk: {
    "app.description": "Мобільне керування посилками для працівників відділення.",
    "app.name": "Parcel Flow",
    "branch.change": "Змінити відділення",
    "branch.loadingWorkspace": "Завантажуємо робочий простір відділення...",
    "branch.number": "Відділення #{branchNumber}",
    "dashboard.activeBranch": "Активне відділення",
    "dashboard.quickAction": "Швидка дія",
    "dashboard.records": "Посилки відділення",
    "dashboard.scanDescription":
      "Відкрийте камеру, зчитайте штрихкод і зареєструйте або оновіть статус посилки за кілька секунд.",
    "dashboard.scanParcel": "Сканувати посилку",
    "dashboard.title": "Панель",
    "dashboard.viewDescription":
      "Шукайте за ТТН, фільтруйте за статусом, сортуйте за датою та оновлюйте результат в одному списку.",
    "dashboard.viewParcels": "Переглянути посилки",
    "filters.allStatuses": "Усі статуси",
    "filters.newestFirst": "Спочатку новіші",
    "filters.oldestFirst": "Спочатку старіші",
    "filters.reset": "Скинути фільтри",
    "filters.searchPlaceholder": "Пошук за ТТН",
    "filters.sortPlaceholder": "Сортувати за датою",
    "filters.statusPlaceholder": "Фільтр за статусом",
    "filters.title": "Фільтри",
    "form.branchHint":
      "Використовуйте лише цифри. Ми запам'ятаємо це відділення на цьому пристрої.",
    "form.branchPlaceholder": "наприклад, 123",
    "form.continue": "Продовжити",
    "form.enterBranch": "Введіть номер відділення",
    "form.openingDashboard": "Відкриваємо панель...",
    "home.description":
      "Введіть номер відділення, щоб відкрити сканування, історію посилок і оновлення статусів для польових працівників на мобільних пристроях.",
    "home.openDashboard": "Відкрити панель",
    "home.returningWorker": "Повернулися до роботи?",
    "home.returningWorkerDescription":
      "Ваше відділення збережеться на цьому пристрої.",
    "home.title": "Скануйте й керуйте посилками відділення швидше.",
    "lang.english": "English",
    "lang.switcherLabel": "Мова",
    "lang.ukrainian": "Українська",
    "network.unexpected": "Неочікувана мережева помилка.",
    "pagination.next": "Далі",
    "pagination.pageOf": "Сторінка {page} з {totalPages}",
    "pagination.previous": "Назад",
    "parcels.description":
      "Шукайте за ТТН, фільтруйте посилки за статусом і оновлюйте запис, коли посилку доставлено, повернуто, відхилено або не отримано.",
    "parcels.refresh": "Оновити",
    "parcels.title": "Список посилок",
    "scan.back": "Назад",
    "scan.barcodeDetected": "Штрихкод знайдено: {ttn}",
    "scan.description":
      "Використовуйте задню камеру, тримайте штрихкод у рамці та дозвольте сканеру автоматично створити або оновити посилку.",
    "scan.flow": "Сканування",
    "scan.loadingScanner": "Завантажуємо сканер камери...",
    "scan.parcelExists":
      "Посилка {ttn} уже існує. Оберіть новий статус.",
    "scan.parcelSaved": "Посилку {ttn} успішно збережено.",
    "scan.retry": "Спробувати ще раз",
    "scan.title": "Сканування штрихкоду посилки",
    "scanner.align": "Розмістіть штрихкод у межах рамки",
    "scanner.guidance":
      "Тримайте штрихкод нерухомо кілька секунд. Якщо нічого не зчитується, підійдіть ближче або покращте освітлення.",
    "scanner.live": "Сканер онлайн",
    "scanner.noCamera": "На цьому пристрої немає доступної камери.",
    "scanner.permissionDenied":
      "Доступ до камери заборонено. Дозвольте доступ і спробуйте ще раз.",
    "scanner.starting": "Запуск",
    "scanner.unableToStart":
      "Не вдалося запустити сканер штрихкодів на цьому пристрої.",
    "status.absent": "Відсутня",
    "status.delivered": "Доставлено",
    "status.new": "Нова",
    "status.rejected": "Відхилено",
    "status.returned": "Повернено",
    "statusDialog.descriptionExisting":
      "Посилку {ttn} вже було відскановано. Оберіть актуальний результат доставки.",
    "statusDialog.descriptionGeneric":
      "Оберіть актуальний статус для цієї посилки.",
    "statusDialog.save": "Зберегти статус",
    "statusDialog.saving": "Зберігаємо...",
    "statusDialog.select": "Оберіть статус",
    "statusDialog.status": "Статус",
    "statusDialog.title": "Оновити статус посилки",
    "table.action": "Дія",
    "table.date": "Дата",
    "table.empty": "Для цього набору фільтрів посилок не знайдено.",
    "table.loading": "Завантажуємо посилки...",
    "table.status": "Статус",
    "table.ttn": "ТТН",
    "table.updateStatus": "Оновити статус",
    "validation.branch.digits": "Номер відділення має містити лише цифри.",
    "validation.branch.max": "Номер відділення занадто довгий.",
    "validation.branch.required": "Номер відділення є обов'язковим.",
    "validation.parcelId.integer": "Ідентифікатор посилки має бути цілим числом.",
    "validation.parcelId.positive": "Ідентифікатор посилки має бути додатним.",
    "validation.ttn.long": "ТТН занадто довга.",
    "validation.ttn.short": "ТТН занадто коротка.",
    "api.database.invalid":
      "DATABASE_URL має неправильний формат. Додайте коректний рядок підключення Neon у .env.local.",
    "api.database.missing":
      "DATABASE_URL не налаштовано. Додайте рядок підключення Neon у .env.local.",
    "api.invalidPayload": "Неправильні дані запиту.",
    "api.invalidQuery": "Неправильні параметри запиту.",
    "api.invalidRequest": "Неправильний запит.",
    "api.parcelCreated": "Посилку створено.",
    "api.parcelNotFound": "Посилку не знайдено.",
    "api.duplicateTTN": "Таку ТТН уже зареєстровано.",
    "api.unableLoadParcels": "Не вдалося завантажити посилки.",
    "api.unableSaveParcel": "Не вдалося зберегти посилку.",
    "api.unableUpdateParcel": "Не вдалося оновити статус посилки.",
  },
};

export function translate(
  locale: Locale,
  key: string,
  values?: TranslationValues,
) {
  const template = messages[locale][key] ?? messages.en[key] ?? key;

  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = values[token];
    return value === undefined ? `{${token}}` : String(value);
  });
}
