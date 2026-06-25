import {Ticket} from "../ticket";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket
  const newTicket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // Save the ticket to the database
  await newTicket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(newTicket.id);
  const secondInstance = await Ticket.findById(newTicket.id);

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({price: 10});
  secondInstance!.set({price: 15});

  // Save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});


it("increments the version number on multiple saves", async () => {
  const newTicket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  await newTicket.save();
  expect(newTicket.version).toEqual(0);

  await newTicket.save();
  expect(newTicket.version).toEqual(1);

  await newTicket.save();
  expect(newTicket.version).toEqual(2);
});