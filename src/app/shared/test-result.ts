export interface TestResultViewModel {
  id?: number;
  partida: string;
  pedido: number;
  linea: number;
  clientTest: string;
  result: number | boolean;
  date: Date;
  isAllDay: boolean;
  backgroundColor?: string;
  textColor?: string;
}
