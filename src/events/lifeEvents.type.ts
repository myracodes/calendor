export interface LifeEvent {
  name: string
  day: number // 1-31
  month: number // 1-12
  year?: number // année de naissance ou de décès (optionnelle : sans elle, seul le nom est affiché)
}
