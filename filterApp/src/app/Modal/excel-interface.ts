export interface IExcelData {
  reduce(arg0: (seen: any, obj: any) => any, arg1: {}): unknown;
  filter(arg0: (obj: any) => boolean): unknown;
  fullName: string;
  jobTitle: string;
  companyName: string;
  email: string;
  industry: string;
  employeeSize: number;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  contactLink: string;
  companyLink: string;
  prospectLocation: string;
}
