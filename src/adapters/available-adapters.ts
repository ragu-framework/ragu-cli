export enum AvailableAdapters {
  react = 'react',
  vue = 'vue',
  custom = 'custom'
}

export type NonCustomAdapters = Exclude<AvailableAdapters, AvailableAdapters.custom>;
