import { Publisher, Subjects, TicketUpdatedEvent } from '@tikticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

