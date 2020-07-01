import { StatusBarItem, window, StatusBarAlignment, workspace } from 'vscode';
import * as COMMAND_NAMES from '../consts/command_names';

export class StatusbarUi {

  private static _statusBarItem: StatusBarItem;

  private static get statusbar() {
    if (!StatusbarUi._statusBarItem) {
      StatusbarUi._statusBarItem = window
        .createStatusBarItem(StatusBarAlignment.Right, 100);

      if (workspace.getConfiguration('codio').get<boolean>('showOnStatusbar')) {
        this.statusbar.show();
      }
    }

    return StatusbarUi._statusBarItem;
  }

  static Init() {
    StatusbarUi.SetStateLoading('Loading...');
    setTimeout(() => {
      StatusbarUi.SetStateResting();
    }, 1000);
  }

  static SetStateLoading(workingMsg: string = 'Starting recording...') {
    StatusbarUi.statusbar.text = `$(ellipsis) ${workingMsg}`;
    StatusbarUi.statusbar.tooltip = 'In case it takes long time, try to close all browser window.';
    StatusbarUi.statusbar.command = null;
  }

  public static SetStateResting() {
    StatusbarUi.statusbar.text = `$(device-camera-video) Record`;
    StatusbarUi.statusbar.command = COMMAND_NAMES.RECORD_CODIO;
    StatusbarUi.statusbar.tooltip = 'Start recording a Codio';
  }

  public static SetStateRecording() {
    StatusbarUi.statusbar.text = `$(stopwatch) Recording in progress...`;
    StatusbarUi.statusbar.command = COMMAND_NAMES.FINISH_RECORDING;
    StatusbarUi.statusbar.tooltip = 'Stop current Codio recording';
  }

  public static dispose() {
    StatusbarUi.statusbar.dispose();
  }
}
