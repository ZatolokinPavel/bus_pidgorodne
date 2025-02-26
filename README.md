# Маршрутки Подгородного

Расписание маршруток Подгородного  
https://bus-pidgorodne.dp.ua/

## Сборка и запуск
### Скачивание
На релизе скачиваем приложение в директорию `/srv/`. И сборка будет через `sudo make`.  
Для разработки скачиваем в домашнюю директорию пользователя, сборка и запуск без `sudo`.

### Ручной запуск
_Для разработки:_  
Команда `make` выполнит всё. Скачает зависимости, соберёт релиз и запустит приложение в консоли.

_На проде:_  
`make release` - скачать зависимости и собрать релиз;  
`make start` - запустить приложение;  
`make stop` - остановить приложение;  
`make attach` - подключиться к консоли работающего приложения (выйти Ctrl+D).

### Автозапуск
Для автозапуска приложения на старте linux нужно добавить скрипт запуска в папку `/etc/init.d`.  
Для этого нужно установить файлу `init_app.sh` права на запуск (755), если они ещё не установлены,
и создать символьную ссылку такой командой:  
`sudo ln -s /srv/bus_pidgorodne/init_app.sh /etc/init.d/bus_pidgorodne`.  
Потом выполнить команду `sudo systemctl daemon-reload` и раскидать скрипт по папкам автозапуска `sudo update-rc.d bus_pidgorodne defaults`

Теперь скачать зависимости и собрать релиз командой `make release`, и дальше приложение будет автоматически стартовать при запуске системы.  
А также доступны такие команды:  
`/etc/init.d/bus_pidgorodne start`  
`/etc/init.d/bus_pidgorodne stop`  
`/etc/init.d/bus_pidgorodne attach`

### Удаление автозапуска
Если автозапуск больше не нужен, или поменялось имя скрипта для запуска. На примере скрипта запуска bus_pidgorodne.  
Сначала удаляем файл `/etc/init.d/bus_pidgorodne`  
Затем выполняем команду `sudo update-rc.d bus_pidgorodne remove`
