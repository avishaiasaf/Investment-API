import fetch from 'node-fetch';
import $ from 'cheerio'

// company params
const baseUrl = "https://www.sec.gov/cgi-bin/browse-edgar";
const company_CIKs = ['1018724']
const filing_types = ['10-k']

// URL parameters
let filingParameters = {
    'action':'getcompany',
    'CIK':company_CIKs[0],
    'type':filing_types[0],
    'dateb':'',
    'owner':'exclude',
    'start':'',
    'output':'',
    'count':'100'}

// function to get the raw data
const getRawData = (URL) => {
    return fetch(URL)
        .then((response) => response.text())
        .then((data) => {
            return data;
        });
};

// function to build params
const buildParams = (params) =>{
    let path = '?';
    Object.entries(params).forEach((param, i)=>{
        path += `${Object.keys(params)[i]}=${Object.values(params)[i]}&`;
    })
    return path
}

const url = baseUrl + buildParams(filingParameters)
// console.log(url)


// get all the interactive reports url of the company
const getCompanyReportsURL = async () => {
    const links = []
    const reportsRawData = await getRawData(url);
    let baseUrl = 'https://www.sec.gov';
    $.load(reportsRawData)('.tableFile2 > tbody > tr > td > #interactiveDataBtn').toArray().map(item => {
        console.log(baseUrl + $(item).attr('href'));
        links.push(baseUrl + $(item).attr('href'))
        getReportData(baseUrl + $(item).attr('href'))
    });
    return links
};

const getReportData = async (url) =>{
    const reportRawData = await getRawData(url);
    console.log(reportRawData)
}

// invoking the main function
getCompanyReportsURL();