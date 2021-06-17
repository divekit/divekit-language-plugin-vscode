# Divekit VSCode Plugin

## Beschreibung

Dieses Repository enthält den Sourcecode für das Divekit VSCode Plugin. Zusammen mit den Repositorys [divekit-language-plugin-intellij](https://github.com/divekit/divekit-language-plugin-intellij) 
und [divekit-language-server](https://github.com/divekit/divekit-language-server) bildet es die Codebasis für das Praxisprojekt "Entwicklung eines IDE Plugins zur Unterstützung bei der Erstellung individualisierter Praktika-und Klausuraufgaben".

Eine ausführliche Dokumentation der verschiedenen Projektbestandteile befindet sich im [Wiki](https://github.com/divekit/divekit-language-server/wiki).

## Nutzung

Das Plugin ist für die Nutzung im Projekt [automated-repo-setup](https://github.com/divekit/divekit-automated-repo-setup) entwickelt worden.

Nach der Installation sind noch folgende Schritte erforderlich:

* Divekit Language Server JAR muss auf dem lokalen Dateisystem vorhanden sein.

* Der absolute Pfad zur JAR muss in den Einstellungen unter Settings -> Extensions -> Divekit eingetragen werden.

* Der absolute Pfad zu den Dateien `variationsConfig.json` und `variableExtensionsConfig.json` muss in den Einstellungen
  eingetragen werden.
  Achtung: Das Plugin startet den Language Server nur, wenn die beiden Config-Dateien gefunden werden.

* Anschließend kann das Projekt `automated-repo-setup` gestartet werden. Wenn es vorher schon geöffnet war, muss es einmal geschlossen
  und wieder geöffnet werden. Wenn unten rechts die Meldung erscheint, dass der Language Server in diesem Projekt genutzt werden kann, hat
  alles funktioniert.
  
* Wenn man in einem Markdown- oder Java-File zwischen der Code-Completion für das Platzhaltervariablen System und der Code-Completion
für dementsprechend Java oder Markdown wechseln möchte, kann man dies über die Symbolleister unterhalb des Editorfensters von VSCode. Nach einem Klick kann
  hier eine Sprache ausgewählt werden.

## Weiterentwicklung & Anpassungen

* Probleme & Fehler können auf GitHub zuerst unter der [Issues](https://github.com/divekit/divekit-language-plugin-vscode/issues) eingetragen werden
  und anschließend von da abgearbeitet werden.

* Vor dem Mergen empfiehlt sich in der Regel ein Pull-Request, da so die Code-Qualität hoch gehalten werden kann.

* Im Reiter Run & Debug (CTRL + SHIFT + D) lässt sich über "Run Extension" (F5) eine neue
  VSCode Instanz mit installierter Extension zum schnellen Testen der Funktionalität öffnen.

## Testen