export interface BillData {
  client: {
    name: string;
  };
  billType: {
    billName: string;
  };
  status: number;
  remarks: string;
  suggestions: string;
  accRemark: string;
  manRemark: string;
  link: string;
}
