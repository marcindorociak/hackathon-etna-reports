import * as path from 'path';

export const  invoiceTemplate = (doc, invoice) => {
  const shipping = invoice.billToCustomer.defaultAddress;
  const lines = invoice.lines.edges;
  let i, invoiceTableTop = 330;
  let staticFolderPath = (__dirname + path.normalize('/') + path.normalize('../../public/'));
  let totalAmount = 0;
  for (i = 0; i < lines.length; i++) {
    const item = lines[i].node;
    totalAmount += Math.round(item.grossPrice * 100) / 100;
  }
  totalAmount = Math.round(totalAmount * 100) / 100;
  doc.font(staticFolderPath + 'times.ttf')
  doc.image(staticFolderPath + 'lgo_sage.png', 480, 30, {width: 50})
  .text('', 0, 0);

  doc
    .text(`Invoice Number: ${invoice.id}`, 50, 130)
    .text(`Invoice Date: ${invoice.invoiceDate}`, 50, 200)
    .text(`Balance Due: ${totalAmount} ${invoice.currency.code }`, 50, 215)

    .text(invoice.billToCustomer.companyName, 300, 130)
    .text(shipping.address, 300, 215)
    .text(
      `${shipping.city}, ${shipping.countryName}`,
      300,
      200
    )
    .moveDown();
    for (i = 0; i < lines.length; i++) {
      const item = lines[i].node;
      const position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        item.product.code,
        item.product.description1,
        `${Math.round(item.grossPrice / item.invoicedQuantityInSalesUnit * 100) / 100} ${invoice.currency.code}`,
        item.invoicedQuantityInSalesUnit,
        `${item.grossPrice} ${invoice.currency.code}`
      );
    }

}

function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}
