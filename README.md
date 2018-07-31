# Race Manager Frontend

## Überblick
Dieses Repository enthält den Sourecode der [Racemanager-App](https://github.com/benni1371/mobileProjectDHBW). Diese wurde mit dem Ionic Framework entwickelt.

## App Startup
Im Falle des App Starts gibt es eine große Bandbreite an verschiedenen Konstellationen die behandelt werden:

| Ausgangssituation                                                                                                                                             | Erwartetes Verhalten                                                                                          |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| Der Nutzer ist in keinem Team                                                                                                                                 | Beim Start wird die Seite zur Team Erstellung angezeigt                                                       |
| Lokal ist bereits eine TeamId gespeichert, aber noch kein Nutzer zugewiesen                                                                                   | Beim Start wird eine Seite zur Erstellung eines Nutzers angezeigt                                             |
| Lokal ist eine Team und eine NutzerId gespeichert                                                                                                             | Beim Start wird die Event Übersicht angezeigt                                                                 |
| Der Nutzer klickt auf einen Einladungs Link                                                                                                                   | Beim Start wird die Join team Seite angezeigt                                                                 |
| Lokal ist eine Team und eine NutzerId gespeichert und der Nutzer klickt auf einen Einladungslinks der ihn zu dem gleichen Team einlädt, in dem er bereits ist | Beim Start wird die Event Übersicht und ein kurzer Hinweis angezeigt, dass der Nutzer bereits in dem Team ist |
| Lokal ist eine Team und eine NutzerId gespeichert und der Nutzer klickt auf einen Einladungslinks der ihn zu einem anderen Team einlädt                       | Beim Start wird der Nutzer gefragt ob er das Team wechseln möchte                                             |
| Lokal ist eine Team und NutzerId gespeichert. Zwischenzeitlich wurde jedoch das Team oder der Nutzer gelöscht                                                 | Beim Start wird der Nutzer automatisch zur Team erstellen Seite umgeleitet                                    |
| Lokal ist eine Team und NutzerId gespeichert. Der Nutzer erhält eine Benachrichtigung und klickt auf diese                                                    | Beim Start wird die Planungsseite von dem Event geöffnet, für das die Benachrichtigung bestimmt war           |

## Events

## Stint Planung

## Team Verwaltung

## Notifications

## Plugins
Install Deeplinks

```ionic cordova plugin add ionic-plugin-deeplinks --variable URL_SCHEME=gtcneedracing --variable DEEPLINK_SCHEME=https --variable DEEPLINK_HOST=racemanager-mobile-project.herokuapp.com --variable ANDROID_PATH_PREFIX=/```

```npm install --save @ionic-native/deeplinks```

Install Social Sharing

```ionic cordova plugin add cordova-plugin-x-socialsharing```

```npm install --save @ionic-native/social-sharing```

Install Navigation Plugin

```ionic cordova plugin add uk.co.workingedge.phonegap.plugin.launchnavigator```

```npm install --save @ionic-native/launch-navigator```

## Lizenz

Copyright 2018 by Philipp Drayß, Benjamin Hilprecht, Henrik Müller, Leon Steiner

Der Sourcecode ist Lizensiert unter [Apache License 2.0](./LICENSE)
