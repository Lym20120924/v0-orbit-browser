export interface FocusMode {
  enabled: boolean
  hideToolbar: boolean
  hideSidebar: boolean
  hideBookmarksBar: boolean
  dimBackground: boolean
}

export class FocusModeManager {
  private mode: FocusMode = {
    enabled: false,
    hideToolbar: false,
    hideSidebar: false,
    hideBookmarksBar: false,
    dimBackground: false,
  }

  enable(config?: Partial<FocusMode>) {
    this.mode = {
      enabled: true,
      hideToolbar: config?.hideToolbar ?? true,
      hideSidebar: config?.hideSidebar ?? true,
      hideBookmarksBar: config?.hideBookmarksBar ?? true,
      dimBackground: config?.dimBackground ?? true,
    }
  }

  disable() {
    this.mode.enabled = false
  }

  getMode(): FocusMode {
    return { ...this.mode }
  }

  toggle() {
    if (this.mode.enabled) {
      this.disable()
    } else {
      this.enable()
    }
  }
}
