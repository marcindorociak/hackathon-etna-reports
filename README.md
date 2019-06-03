# Hackathon => ETNA reports &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE)

A simple alternative for Crystal Reports written in TypeScript.

## Installation

Steps to print pdf report:

```bash
git clone https://github.com/marcindorociak/hackathon-etna-reports.git
cd hackathon-etna-reports
npm install
npm run dev
```
Now dev server with express, webpack and typescript is ready to work with.

To see how it works, please open in the web browser address [http://localhost:3000](http://localhost:3000)

## How to print sample report?

Open address [http://localhost:3000](http://localhost:3000) and choose one thing from the left menu. Now you can click the print button and report should generate.

## What existing code do?

### Frontend

* On the frontend side, we are using React JS combined with pure HTML, CSS and javascript.
* For hackathon purpose we getting GraphQL data from [X3EtnaApi](https://apidemo.sagex3.com/demo/service/X3CLOUDV2_SEED/graphql/)
* To get GraphQL data we are using React-Apollo + Redux

### Backend

* On the backend side, we are generating a PDF report using typescript.
* Code for generating PDF report is extracted from the beta version of ETNA look like typescript code. At this point, I would like to thank Laky Bence for sending me this ETNA sample code.
* To generate a PDF report, we are using a pdfkit library.

## What is the aim of the hackathon?

Every team that will participate in the hackathon will take part in searching for the best PDF generating javascript library.
A pdfkit library is only a sample proposed by Laky Bence. So feel free to choose the best library in your opinion.

## Useful pieces of information

* Etna folder includes all code related with pdf report generation.
* Since the express server is started by using command `npm run dev` your every change in code will be automatically compiled to javascript code.
* If you want to change GraphQL query to add some new query fields, you will need to make changes in the index folder. Query used by pdf generation library is in folder `index\components\GetSalesInvoiceDetails.jsx`. Changes in the index folder will also be automatically compiled.
