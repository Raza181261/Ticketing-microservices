import {Subjects,Publisher,ExpirationCompleteEvent} from '@tikticket/common';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}