import { IExcelData } from './excel-interface';

export function mapToProspect(raw: any): any {
  return {
    fullName: raw['Full Name'] || '',
    jobTitle: raw['Job Title'] || '',
    companyName: raw['company Name'] || '',
    email: raw['Email'] || '',
    industry: raw['Industry'] || '',
    employeeSize: raw['Employee Size'] || '',
    phoneNumber: raw['Phone number'] || '',
    address: raw['Address'] || '',
    city: raw['city'] || '',
    state: raw['state'] || '',
    zipCode: raw['zip code']?.toString() || '',
    country: raw['country'] || '',
    website: raw['Website'] || '',
    contactLink: raw['Contact link'] || '',
    companyLink: raw['Company link'] || '',
    prospectLocation: raw['Prospect Location'] || '',
  };
}

export function mapFieldNames(data: IExcelData[]) {
  return data.map((item: IExcelData) => ({
    'Full Name': item.fullName,
    'Job Title': item.jobTitle,
    'company Name': item.companyName,
    Email: item.email,
    Industry: item.industry,
    'Employee Size': item.employeeSize,
    'Phone number': item.phoneNumber,
    Address: item.address,
    city: item.city,
    state: item.state,
    'zip code': item.zipCode,
    country: item.country,
    Website: item.website,
    'Contact link': item.contactLink,
    'Company link': item.companyLink,
    'Prospect Location': item.prospectLocation,
  }));
}

export function removeDuplicateEmailsData(excelData: IExcelData[]) {
  const seenEmails = new Set();
  const uniqueObjects = excelData.filter((obj: any) => {
    if (!seenEmails.has(obj.email)) {
      seenEmails.add(obj.email);
      return true; // Keep this object
    }
    return false; // Discard this object (duplicate email)
  });
  return uniqueObjects;
}

export function getCountries(data: any) {
  const countries = data.map((el: any) => el.country.toLowerCase());
  return [...new Set(countries)];
}
export function getJobTitles(data: any) {
  const josTitles = data.map((el: any) => el.jobTitle.toLowerCase());
  return [...new Set(josTitles)];
}

export function getCompanies(data: any) {
  const companyNames = data.map((el: any) => el.companyName.toLowerCase());
  return [...new Set(companyNames)];
}

export function getIndustries(data: any) {
  const industryNames = data.map((el: any) => el.industry.toLowerCase());
  return [...new Set(industryNames)];
}
