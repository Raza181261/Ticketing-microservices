import { Publisher, Subjects, TicketCreatedEvent } from '@tikticket/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}