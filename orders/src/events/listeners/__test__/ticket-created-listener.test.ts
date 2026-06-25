import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedListener } from '../ticket-created-listener';
import {TicketCreatedEvent} from '@tikticket/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

it('creates and saves a ticket', async () => {
   // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

   // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

   // create a fake message object
   // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

   // call the onMessage function with the data and message objects
    await listener.onMessage(data, msg);

   // write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
}
);


it('acks the message', async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    // call the onMessage function with the data and message objects
    await listener.onMessage(data, msg);

    // write assertions to make sure the message was acked
    expect(msg.ack).toHaveBeenCalled();
});