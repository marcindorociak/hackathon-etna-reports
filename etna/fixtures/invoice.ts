const invoiceTemplate = `<html>
    <head>
        <meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\">
        <style>
            .invoice-box {
    max-width: 800px;
    margin: auto;
    padding: 30px;
    border: 1px solid #eee;
    box-shadow: 0 0 10px rgba(0, 0, 0, .15);
    font-size: 16px;
    line-height: 24px;
    font-family: \'Helvetica Neue\', \'Helvetica\', Helvetica, Arial, sans-serif;
    color: #555;
}
.invoice-box table {
    width: 100%;
    line-height: inherit;
    text-align: left;
}
.invoice-box table td {
    padding: 5px;
    vertical-align: top;
}
.invoice-box table tr td:nth-child(2) {
    text-align: right;
}
.invoice-box table tr.top table td {
    padding-bottom: 20px;
}
.invoice-box table tr.top table td.title {
    font-size: 45px;
    line-height: 45px;
    color: #333;
}
.invoice-box table tr.information table td {
    padding-bottom: 40px;
}
.invoice-box table tr.heading td {
    background: #eee;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
}
.invoice-box table tr.details td {
    padding-bottom: 20px;
}
.invoice-box table tr.item td {
    border-bottom: 1px solid #eee;
}
.invoice-box table tr.item.last td {
    border-bottom: none;
}
.invoice-box table tr.total td:nth-child(2) {
    border-top: 2px solid #eee;
    font-weight: bold;
}
@media only screen and (max-width: 600px) {
    .invoice-box table tr.top table td {
        width: 100%;
        display: block;
        text-align: center;
    }
    .invoice-box table tr.information table td {
        width: 100%;
        display: block;
        text-align: center;
    }
}
        </style>
    </head>
    <body>
        <div class=\"invoice-box\">
            <table cellpadding=\"0\" cellspacing=\"0\">
                <tr class=\"top\">
                    <td colspan=\"2\">
                        <table>
                            <tr>
                                <td class=\"title\">
                                    <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALUAAABMCAYAAAArzvZ4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODIyQUNEMERENjdEM0NENyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowQTA0OTU3QTNFNzAxMUU1QUMxRjkwMTU4MDJEMEYyOSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowQTA0OTU3OTNFNzAxMUU1QUMxRjkwMTU4MDJEMEYyOSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMTgyMkFDRDBERDY3RDNDRDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTgyMkFDRDBERDY3RDNDRDciLz4gPC9yZGY6RGVzY3Jp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\" style=\"width:100%; max-width:100px;\" />
                                </td>
                                <td>
                                    Invoice #: {{id}}
                                    <br> Created: {{invoiceDate}}
                                    <br> Due: {{invoiceDate}}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class=\"information \">
                    <td colspan=\"2 \">
                        <table>
                            <tr>
                                <td>
                                    {{salesSite.description}}<br>
                                    {{salesSite.addresses.edges.0.node.city}}<br>
                                    {{salesSite.addresses.edges.0.node.country.country}}
                                </td>
                                <td>
                                    {{billToCustomer.companyName}}<br>
                                    {{billToCustomer.defaultAddress.city}}<br>
                                    {{billToCustomer.defaultAddress.countryName}}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class=\"heading \">
                    <td>
                        Item
                    </td>
                    <td>
                        Price
                    </td>
                </tr>
                {{#each lines.edges}}
                <tr class=\"item\">
                    <td>
                        {{node.product.description1}}
                    </td>
                    <td>
                        {{node.grossPrice}} {{../currency.code}}
                    </td>
                </tr>
                {{/each}}
            </table>
        </div>
    </body>
</html>`;
export default invoiceTemplate;
