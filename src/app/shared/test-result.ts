export interface TestResultViewModel {
  id?: number;
  partida: string;
  pedido: number;
  linea: number;
  cliente: string;
  test: string;
  result: number;
  date: Date;
  isAllDay: boolean;
  backgroundColor?: string;
  textColor?: string;
}
