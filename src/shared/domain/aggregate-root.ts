export interface DomainEvent {
  readonly eventName: string;
  readonly occurredOn: Date;
}

export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];

  protected addEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public pullEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
