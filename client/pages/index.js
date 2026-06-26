import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>${ticket.price.toFixed(2)}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`} className="fifa-table-link">
            View
          </Link>

        </td>
      </tr>
    );
  });

  return(
    <div className="fifa-page">
      <h1 className="fifa-title fifa-gradient-text display-3">AVAILABLE TICKETS ⚽</h1>
      <div className="fifa-table-wrap rounded-4 overflow-hidden">
      <table className="table fifa-table align-middle mb-0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
      </div>
    </div>
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const {data} = await client.get("/api/tickets");
  return {tickets: data};
};
export default LandingPage;
