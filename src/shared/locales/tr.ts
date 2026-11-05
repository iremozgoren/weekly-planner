import type { Translations } from './en'

/** Turkish translations. Typed against `Translations` so a missing key is a compile error. */
const tr: Translations = {
  'common.appName': 'Haftalık Planlayıcı',
  'common.today': 'Bugün',
  'common.loading': 'Yükleniyor…',
  'common.close': 'Kapat',
  'common.cancel': 'İptal',
  'common.save': 'Kaydet',
  'common.delete': 'Sil',
  'common.none': 'Yok',

  'week.previousWeek': 'Önceki hafta',
  'week.nextWeek': 'Sonraki hafta',
  'week.addTask': 'Görev ekle',

  'view.week': 'Hafta',
  'view.day': 'Gün',

  'day.previousDay': 'Önceki gün',
  'day.nextDay': 'Sonraki gün',
  'day.unscheduled': 'Zamanlanmamış',

  'task.newTask': 'Yeni görev',
  'task.editTask': 'Görevi düzenle',
  'task.titleLabel': 'Başlık',
  'task.titlePlaceholder': 'Ne yapman gerekiyor?',
  'task.notesLabel': 'Notlar',
  'task.notesPlaceholder': 'Notlar (isteğe bağlı)',
  'task.dayLabel': 'Gün',
  'task.colorLabel': 'Renk',
  'task.markDone': 'Tamamlandı olarak işaretle',
  'task.startTimeLabel': 'Başlangıç saati',
  'task.durationLabel': 'Süre (dakika)',
  'task.happeningNow': 'Şu an gerçekleşiyor',
  'task.upNext': 'Sırada',

  'widget.title': 'Bugün',
  'widget.empty': 'Bugün için planlanan bir şey yok.',
  'widget.collapse': 'Daralt',
  'widget.expand': "Widget'ı genişlet",

  'tray.showWidget': "Widget'ı Göster",
  'tray.hideWidget': "Widget'ı Gizle",
  'tray.expandWidget': "Widget'ı Genişlet",
  'tray.collapseWidget': "Widget'ı Daralt",
  'tray.openMainWindow': 'Ana Pencereyi Aç',
  'tray.quit': 'Çıkış',

  'settings.title': 'Ayarlar',
  'settings.language': 'Dil',
  'settings.launchAtLogin': 'Girişte başlat',
  'settings.launchAtLoginDescription':
    'Oturum açtığınızda Haftalık Planlayıcı’yı otomatik olarak başlatır.',
}

export default tr
