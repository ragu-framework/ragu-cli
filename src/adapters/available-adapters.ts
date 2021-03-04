export enum AvailableAdapters {
  react = 'react',
  vue = 'vue',
  simple = 'simple',
  custom = 'custom'
}

export type NonCustomAdapters = Exclude<AvailableAdapters, AvailableAdapters.custom>;
