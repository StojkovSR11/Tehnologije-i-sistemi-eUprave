export interface Grupa {
  id?: string;           
  naziv: string;
  vrticID: string;
  kapacitet: number;
  listaDece?: string[];  // lista ID-eva dece, može biti prazna ili null
}