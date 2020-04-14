import { Uri } from "vscode";
import { UI, MESSAGES } from "../user_interface/messages";
import Player from "../player/Player";
import Recorder from "../recorder/Recorder";
import FSManager from "../filesystem/FSManager";
import { isWindows, checkForFfmpeg } from "../utils";

export default async function playCodio(
  fsManager: FSManager,
  player: Player,
  recorder: Recorder,
  codioUri?: Uri,
  workspaceUri?: Uri
) {
  try {
    if (isWindows) {
      UI.showMessage(MESSAGES.windowsNotSupported);
    } else {
      const hasFfmpeg = await checkForFfmpeg();
      if (!hasFfmpeg) {
        UI.showMessage(MESSAGES.ffmpegNotAvailable);
      } else {
        const workspacePath = workspaceUri?.fsPath;
        if (recorder && recorder.isRecording) {
          UI.showMessage(MESSAGES.cantPlayWhileRecording);
          return;
        }
        if (player && player.isPlaying) {
          UI.showMessage(MESSAGES.stopCodio);
          player.pause();
          player.closeCodio();
        }
        if (codioUri) {
          const codioUnzippedFolder = await fsManager.getCodioUnzipped(
            codioUri
          );
          await loadAndPlay(player, codioUnzippedFolder, workspacePath);
        } else {
          const codioId = await fsManager.chooseCodio();
          if (codioId) {
            const codioPath = fsManager.codioPath(codioId);
            //@TODO: add an if to check that the folder contains audio.mp3 and actions.json
            await loadAndPlay(player, codioPath, workspacePath);
          }
        }
      }
    }
  } catch (e) {
    console.log("Play codio failed", e);
  }
}

async function loadAndPlay(player: Player, path, workspacePath) {
  UI.showMessage(MESSAGES.codioStart);
  await player.loadCodio(path, workspacePath);
  await player.startCodio();
  UI.showPlayerProgressBar(player);
}
