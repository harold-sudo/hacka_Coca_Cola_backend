export interface DomainEvent {
    readonly eventName: string;
    readonly occurredOn: Date;
}
export declare abstract class AggregateRoot {
    private _domainEvents;
    protected addEvent(event: DomainEvent): void;
    pullEvents(): DomainEvent[];
}
