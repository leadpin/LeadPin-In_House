import { IExcelData } from './excel-interface';

export function mapToProspect(raw: any): any {
  return {
    fullName: raw['full name'] || '',
    jobTitle: raw['job title'] || '',
    companyName: raw['company name'] || '',
    email: raw['email'] || '',
    industry: raw['industry'] || '',
    employeeSize: raw['employee size'] || '',
    phoneNumber: raw['phone number'] || '',
    address: raw['address'] || '',
    city: raw['city'] || '',
    state: raw['state'] || '',
    zipCode: raw['zip code']?.toString() || '',
    country: raw['country'] || '',
    website: raw['website'] || '',
    contactLink: raw['contact link'] || '',
    companyLink: raw['company link'] || '',
    prospectLocation: raw['prospect location'] || '',
  };
}

export function mapFieldNames(data: IExcelData[]) {
  return data.map((item: IExcelData) => ({
    'full name': item.fullName,
    'job title': item.jobTitle,
    'company name': item.companyName,
    email: item.email,
    industry: item.industry,
    'employee size': item.employeeSize,
    'phone number': item.phoneNumber,
    address: item.address,
    city: item.city,
    state: item.state,
    'zip code': item.zipCode,
    country: item.country,
    website: item.website,
    'contact link': item.contactLink,
    'company link': item.companyLink,
    'prospect location': item.prospectLocation,
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

export function convertFieldNames(data: any) {
  const excelFieldNames = Object.keys(data[0]);
  return excelFieldNames.map((item: any) => item.split(/(?=[A-Z])/).join(' '));
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

export function getStates(data: any) {
  const stateNames = data.map((el: any) => el.state.toLowerCase());
  return [...new Set(stateNames)];
}

export function getCities(data: any) {
  const cityNames = data.map((el: any) => el.city.toLowerCase());
  return [...new Set(cityNames)];
}

export function getZipCodes(data: any) {
  const zipCodes = data.map((el: any) => el.zipCode);
  return [...new Set(zipCodes)];
}

export function getEmpSizes(data: any) {
  const empSize = data.map((el: any) => el.employeeSize);
  return [...new Set(empSize)];
}

export function getComapanyDomains(data: any) {
  const domain = data.map((el: any) => el.email.split('@')[1].toString());
  return [...new Set(domain)];
}

export function dataClean(val: any) {
  const formatted = val
    .split('\n')
    .map((line: any) => {
      let clean = line.replace(/,/g, '').trim();
      return clean ? `${clean}` : '';
    })
    .filter((line: any) => line !== '');
  return formatted;
}
