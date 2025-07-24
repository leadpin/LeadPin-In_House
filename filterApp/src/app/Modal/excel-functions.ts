import { IExcelData } from './excel-interface';

export function mapToProspect(raw: any): any {
  return {
    fullName: raw['Full Name'] || '',
    jobTitle: raw['Job Title'] || '',
    companyName: raw['Company Name'] || '',
    email: raw['Email'] || '',
    mobileNumber: raw['Mobile Number'] || '',
    industry: raw['Industry'] || '',
    employeeSize: raw['Employee Size'] || '',
    phoneNumber: raw['Phone Number'] || '',
    address: raw['Address'] || '',
    city: raw['City'] || '',
    state: raw['State'] || '',
    zipCode: raw['Zip Code']?.toString() || '',
    country: raw['Country'] || '',
    website: raw['Website'] || '',
    contactLink: raw['Contact Link'] || '',
    companyLink: raw['Company Link'] || '',
    prospectLocation: raw['Prospect Location'] || '',
  };
}

export function mapFieldNames(data: IExcelData[]) {
  return data.map((item: IExcelData) => ({
    'Full Name': item.fullName,
    'Job Title': item.jobTitle,
    'Company Name': item.companyName,
    Email: item.email,
    'Mobile Number': item.mobileNumber,
    Industry: item.industry,
    'Employee Size': item.employeeSize,
    'Phone Number': item.phoneNumber,
    Address: item.address,
    City: item.city,
    State: item.state,
    'Zip Code': item.zipCode,
    Country: item.country,
    Website: item.website,
    'Contact Link': item.contactLink,
    'Company Link': item.companyLink,
    'Prospect Location': item.prospectLocation,
  }));
}

export function removeDuplicateEmptyEmailsData(excelData: IExcelData[]) {
  const seenEmails = new Set();
  const uniqueObjects = excelData.filter((obj: any) => {
    if (!seenEmails.has(obj.email) && obj.email !== '') {
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
  const empSize = data.map((el: any) => el.employeeSize.toString());
  return [...new Set(empSize)];
}

export function getComapanyDomains(data: any) {
  const domain = data
    .map((el: any) => {
      if (el.email && el.email.includes('@')) {
        const parts = el.email.split('@');
        return parts[1]?.trim().toLowerCase(); // safely extract domain
      }
      return null;
    })
    .filter((d: string | null | undefined) => d); // remove null/undefined/empty
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
