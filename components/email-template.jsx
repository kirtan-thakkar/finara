const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export function ReportEmailTemplate({
  username,
  period,
  totalIncome,
  totalExpense,
  availableBalance,
  savingsRate,
  topSpendingCategories,
  insights,
  frequency = "Monthly",
}) {
  const currentYear = new Date().getFullYear();
  const reportTitle = `${capitalizeFirstLetter(frequency)} Report`;

  const categoryList = topSpendingCategories
    ?.map(
      (cat) => `<li>
      ${cat._id || cat.name} - ${formatCurrency(cat.total || cat.amount)} ${cat.percent ? `(${cat.percent}%)` : ""}
      </li>`
    )
    .join("") || "";

  const insightsList =
    typeof insights === "string"
      ? `<li>${insights}</li>`
      : insights?.map((insight) => `<li>${insight}</li>`).join("") || "";

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>{reportTitle}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "'Roboto', Arial, sans-serif",
          backgroundColor: "#f7f7f7",
          fontSize: "16px",
        }}
      >
        <table
          cellPadding="0"
          cellSpacing="0"
          width="100%"
          style={{ backgroundColor: "#f7f7f7", padding: "20px" }}
        >
          <tr>
            <td>
              <table
                cellPadding="0"
                cellSpacing="0"
                width="100%"
                style={{
                  maxWidth: "600px",
                  margin: "auto",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                }}
              >
                <tr>
                  <td
                    style={{
                      backgroundColor: "#00bc7d",
                      padding: "20px 30px",
                      color: "#ffffff",
                      textAlign: "center",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "24px",
                        textTransform: "capitalize",
                      }}
                    >
                      {reportTitle}
                    </h2>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "20px 30px" }}>
                    <p style={{ margin: "0 0 10px", fontSize: "16px" }}>
                      Hi <strong>{username}</strong>,
                    </p>
                    <p style={{ margin: "0 0 20px", fontSize: "16px" }}>
                      Here's your financial summary for{" "}
                      <strong>{period}</strong>.
                    </p>

                    <table width="100%" style={{ borderCollapse: "collapse" }}>
                      <tr>
                        <td style={{ padding: "8px 0", fontSize: "16px" }}>
                          <strong>Total Income:</strong>
                        </td>
                        <td style={{ textAlign: "right", fontSize: "16px" }}>
                          {formatCurrency(totalIncome)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 0", fontSize: "16px" }}>
                          <strong>Total Expenses:</strong>
                        </td>
                        <td style={{ textAlign: "right", fontSize: "16px" }}>
                          {formatCurrency(totalExpense)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 0", fontSize: "16px" }}>
                          <strong>Available Balance:</strong>
                        </td>
                        <td style={{ textAlign: "right", fontSize: "16px" }}>
                          {formatCurrency(availableBalance)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 0", fontSize: "16px" }}>
                          <strong>Savings Rate:</strong>
                        </td>
                        <td style={{ textAlign: "right", fontSize: "16px" }}>
                          {savingsRate.toFixed(2)}%
                        </td>
                      </tr>
                    </table>

                    <hr
                      style={{
                        margin: "20px 0",
                        border: "none",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    />

                    <h4 style={{ margin: "0 0 10px", fontSize: "16px" }}>
                      Top Spending Categories
                    </h4>
                    <ul
                      style={{
                        paddingLeft: "20px",
                        margin: "0",
                        fontSize: "16px",
                      }}
                      dangerouslySetInnerHTML={{ __html: categoryList }}
                    />

                    <hr
                      style={{
                        margin: "20px 0",
                        border: "none",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    />

                    <h4 style={{ margin: "0 0 10px", fontSize: "16px" }}>
                      Insights
                    </h4>
                    <ul
                      style={{
                        paddingLeft: "20px",
                        margin: "0",
                        fontSize: "16px",
                      }}
                      dangerouslySetInnerHTML={{ __html: insightsList }}
                    />

                    <p
                      style={{
                        marginTop: "30px",
                        fontSize: "13px",
                        color: "#888",
                      }}
                    >
                      This report was generated automatically based on your
                      recent activity.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      backgroundColor: "#f0f0f0",
                      textAlign: "center",
                      padding: "15px",
                      fontSize: "12px",
                      color: "#999",
                    }}
                  >
                    &copy; {currentYear} Finora. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
