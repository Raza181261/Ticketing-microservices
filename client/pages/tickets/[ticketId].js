import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket }) => {
  if (!ticket) return null;

  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
    //   console.log(order),
  });
  return (
    <div className="fifa-page">
      <div className="fifa-ticket-card mx-auto" style={{ maxWidth: "720px" }}>
      <h1 className="fifa-ticket-title fifa-gradient-text display-4">{ticket.title}</h1>
      <p className="fifa-ticket-meta mb-2">Official FIFA World Cup 2026 resale listing</p>
      <h4 className="fifa-ticket-price mb-4">${ticket.price.toFixed(2)}</h4>
      <button className="btn fifa-ticket-button px-4 py-3" onClick={() => doRequest()}>
        🎫 Purchase
      </button>
      {errors}
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
